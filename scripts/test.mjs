// test.mjs — 真实验收：spawn 真实 server 子进程，走 stdio JSON-RPC。
// 两种数据路径各跑一遍：默认快照（library/）+ DESIGN_NOTES_PATH 指向本地真源。
// 输出断言计数（N/N passed），任何失败以非零码退出。
import { spawn } from "node:child_process";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_NOTES = path.join(os.homedir(), "Documents", "design-notes");
const TIMEOUT = 15000;

class RpcClient {
  constructor(env) {
    const childEnv = { ...process.env };
    if (env.DESIGN_NOTES_PATH) childEnv.DESIGN_NOTES_PATH = env.DESIGN_NOTES_PATH;
    else delete childEnv.DESIGN_NOTES_PATH;
    this.child = spawn(process.execPath, ["server/index.js"], { cwd: REPO_ROOT, env: childEnv });
    this.buf = "";
    this.pending = new Map();
    this.nextId = 1;
    this.stderr = [];
    this.child.stdout.setEncoding("utf8");
    this.child.stdout.on("data", (d) => this._onData(d));
    this.child.stderr.setEncoding("utf8");
    this.child.stderr.on("data", (d) => this.stderr.push(d));
    this.child.on("exit", (code) => this.exitCode = code);
  }

  _onData(d) {
    this.buf += d;
    let idx;
    while ((idx = this.buf.indexOf("\n")) !== -1) {
      const line = this.buf.slice(0, idx).trim();
      this.buf = this.buf.slice(idx + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        continue;
      }
      if (msg.id !== undefined && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(`${msg.error.code}: ${msg.error.message}`));
        else resolve(msg.result);
      }
    }
  }

  send(method, params) {
    const id = this.nextId++;
    const payload = { jsonrpc: "2.0", id, method, params };
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), TIMEOUT);
      this.pending.set(id, {
        resolve: (r) => {
          clearTimeout(timer);
          resolve(r);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      this.child.stdin.write(JSON.stringify(payload) + "\n");
    });
  }

  notify(method, params) {
    this.child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
  }

  async callTool(name, args) {
    const res = await this.send("tools/call", { name, arguments: args });
    const text = res.content?.find((c) => c.type === "text")?.text ?? "";
    return { res, text, isError: Boolean(res.isError) };
  }

  json(text) {
    return JSON.parse(text);
  }

  close() {
    this.child.stdin.end();
    this.child.kill("SIGTERM");
  }
}

function makeT(label) {
  let pass = 0;
  const failures = [];
  return {
    assert(cond, name, actual = "") {
      if (cond) pass++;
      else failures.push({ name, actual: String(actual).slice(0, 300) });
    },
    get pass() {
      return pass;
    },
    get failures() {
      return failures;
    },
    get total() {
      return pass + failures.length;
    },
    label,
  };
}

async function runSuite(envLabel, env) {
  const t = makeT(envLabel);
  const c = new RpcClient(env);
  try {
    // 1. initialize 握手
    const init = await c.send("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "design-parts-mcp-test", version: "0.0.0" },
    });
    t.assert(init.serverInfo?.name === "design-parts-mcp", "initialize 返回 serverInfo.name=design-parts-mcp", init.serverInfo);
    t.assert(Boolean(init.capabilities?.tools), "initialize 声明 tools 能力", init.capabilities);
    c.notify("notifications/initialized", {});

    // 2. tools/list：恰好 3 个，schema 完整
    const list = await c.send("tools/list", {});
    const tools = list.tools ?? [];
    const names = tools.map((x) => x.name).sort();
    t.assert(names.length === 3 && names.join(",") === "get_part,get_source,search_parts", "tools/list 恰好 3 个工具", names.join(","));
    const byName = Object.fromEntries(tools.map((x) => [x.name, x]));
    for (const [tool, param] of [["search_parts", "query"], ["get_part", "id"], ["get_source", "name"]]) {
      const schema = byName[tool]?.inputSchema;
      t.assert(
        schema?.properties?.[param]?.type === "string" && Array.isArray(schema?.required) && schema.required.includes(param),
        `${tool}.inputSchema.${param} 必填且为 string`,
        JSON.stringify(schema?.required)
      );
      t.assert(typeof byName[tool]?.description === "string" && byName[tool].description.length > 30, `${tool} description 非空`, byName[tool]?.description);
    }

    // 3. search_parts("镜头") 命中 bento
    const s = await c.callTool("search_parts", { query: "镜头" });
    t.assert(!s.isError && s.text.includes("bento") && s.text.includes("镜头"), "search_parts(镜头) 命中 bento", s.text.slice(0, 120));
    const sj = c.json(s.text);
    t.assert(sj.results?.some((r) => r.note === "bento" && (r.type === "invention" || r.type === "part")), "search_parts(镜头) 结果含 bento 条目", JSON.stringify(sj.results?.slice(0, 2)));

    // 4. search_parts("") 返回全量发明表
    const s0 = await c.callTool("search_parts", { query: "" });
    const s0j = c.json(s0.text);
    t.assert(s0j.results?.length >= 10 && s0j.results.every((r) => r.type === "invention"), "search_parts(空) 返回全量发明表(≥10)", s0j.results?.length);

    // 5. get_part("spine#dot") 光点机制参数
    const p = await c.callTool("get_part", { id: "spine#dot" });
    const pj = c.json(p.text);
    t.assert(pj.note === "spine" && pj.anchor === "dot", "get_part(spine#dot) note/anchor 正确", p.text.slice(0, 120));
    t.assert((pj.description ?? "").includes("光点"), "get_part(spine#dot) 返回光点说明", (pj.description ?? "").slice(0, 80));
    t.assert(Array.isArray(pj.params) && pj.params.length > 0, "get_part(spine#dot) 返回关键参数", JSON.stringify(pj.params));
    t.assert(path.isAbsolute(pj.indexHtmlPath ?? "") && pj.indexHtmlPath.endsWith(path.join("spine", "index.html")), "get_part 返回 index.html 绝对路径", pj.indexHtmlPath);

    // 6. get_source("bento") 含 x.com 来源
    const g = await c.callTool("get_source", { name: "bento" });
    const gj = c.json(g.text);
    t.assert(typeof gj.readme === "string" && gj.readme.includes("x.com/RomaTesla"), "get_source(bento) README 含 x.com 来源", (gj.sourceUrl ?? "").slice(0, 80));
    t.assert((gj.sourceUrl ?? "").startsWith("https://"), "get_source(bento) 提取来源 URL", gj.sourceUrl);

    // 7. 错误处理：未知笔记返回 isError
    const bad = await c.callTool("get_source", { name: "no-such-note" });
    t.assert(bad.isError && bad.text.includes("找不到笔记"), "get_source(未知笔记) 返回 isError", bad.text.slice(0, 80));

    // 8. bare 笔记名 get_part("bento")
    const bp = await c.callTool("get_part", { id: "bento" });
    const bpj = c.json(bp.text);
    t.assert(Array.isArray(bpj.detachables) && bpj.detachables.length === 4, "get_part(bento) 列出 4 个可拆锚点", bpj.detachables?.length);
  } catch (e) {
    t.assert(false, `套件异常: ${e.message}`, c.stderr.join(""));
  } finally {
    c.close();
  }
  return t;
}

const results = [];
results.push(await runSuite("snapshot(默认 library/)", {}));
results.push(await runSuite("source(DESIGN_NOTES_PATH)", { DESIGN_NOTES_PATH: SOURCE_NOTES }));

let totalPass = 0;
let total = 0;
for (const t of results) {
  console.log(`\n[${t.label}] ${t.pass}/${t.total} assertions passed`);
  for (const f of t.failures) console.log(`  FAIL: ${f.name}\n    actual: ${f.actual}`);
  totalPass += t.pass;
  total += t.total;
}
console.log(`\n${totalPass}/${total} assertions passed (${results.length} data paths)`);
process.exit(totalPass === total ? 0 : 1);
