#!/usr/bin/env node
// design-parts-mcp — 本地 stdio MCP server，把设计零件库暴露成三个工具。
// 数据优先级：DESIGN_NOTES_PATH 指向本地真源；未设置时用仓库内置 library/ 快照。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { resolveRoot, search, getPart, getSource } from "./library.js";

const VERSION = "0.1.0";

const warn = (msg) => console.error(`[design-parts-mcp] warning: ${msg}`);

const TOOLS = [
  {
    name: "search_parts",
    description:
      "Visual-technique & UI-parts library with tested parameters. Call before building visual effects or UI pieces. English or Chinese. " +
      "检索设计零件库：发明表（每篇活笔记是什么、什么时候用）+ 零件表（要做哪一块 UI，打开哪一页哪一处）+ 各笔记页尾「可拆」锚点 + 已整理零件的机制和适用场景 + 各笔记 README。" +
      'query 为空字符串时返回全量发明表；否则命中任一词即返回，少见的词和笔记名命中排得更前，同一篇最多连占两条（type: invention/part/part-detail/detachable/readme，含 note、anchor、path、description、matched）。unmatched 列出整库都没命中的词。' +
      '示例 query："镜头"、"工具栏"、"tooltip"、"批量选择"、"手风琴"、"die-cut"。中英文都可。',
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "检索词（关键词或一句话，中英文均可）；传空字符串返回全量发明表",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_part",
    description:
      "取一个设计零件的完整说明。id 传零件锚点（如 \"bento#chart\"、\"spine#dot\"、\"triage#toolbar\"）或笔记名（如 \"bento\"）。" +
      "锚点形式返回：所在笔记、机制说明、参数、该笔记 index.html 的绝对路径；已整理的零件还会返回可改的代码片段、适用和不适用的情况、需要替换的部分和关键帧图片。" +
      "笔记名形式返回：笔记摘要、全部可拆锚点列表、零件表条目。",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: '零件锚点（"note#anchor"，如 "spine#dot"）或笔记名（"bento"）',
        },
      },
      required: ["id"],
    },
  },
  {
    name: "get_source",
    description:
      "取某篇设计笔记的来源信息：README.md 全文（来源 URL、原版机制逐条记录、可学/不学/启示）、提取出的来源 URL 列表。用于查看零件学自哪个原版作品及其机制考据。",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: '笔记目录名，如 "bento"、"triage"、"spine"',
        },
      },
      required: ["name"],
    },
  },
];

function textResult(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function errorResult(message) {
  return { content: [{ type: "text", text: message }], isError: true };
}

function resolve() {
  try {
    return { ok: true, resolved: resolveRoot() };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

// 调用记录只写本机，用来判断 Agent 是否真的在用、用了什么（npm run usage）。
// DESIGN_PARTS_LOG 可改路径，设为 off 关闭。写失败不影响工具调用。
const LOG_PATH =
  process.env.DESIGN_PARTS_LOG ?? path.join(os.homedir(), ".local", "state", "design-parts", "calls.jsonl");
const SESSION = randomUUID();

function logCall(tool, args, ms, result) {
  if (LOG_PATH === "off") return;
  try {
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(
      LOG_PATH,
      JSON.stringify({
        ts: new Date().toISOString(),
        session: SESSION,
        client: server.getClientVersion()?.name ?? "unknown",
        project: path.basename(process.cwd()),
        tool,
        args,
        ms: Math.round(ms),
        ...result,
      }) + "\n"
    );
  } catch (e) {
    warn(`调用记录写入失败: ${e.message}`);
  }
}

const server = new Server(
  { name: "design-parts-mcp", version: VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const r = resolve();
  if (!r.ok) return errorResult(r.message);
  const t0 = performance.now();
  try {
    switch (name) {
      case "search_parts": {
        const res = search(r.resolved, args?.query ?? "", warn);
        logCall(name, args, performance.now() - t0, {
          total: res.total,
          unmatched: res.unmatched,
          top: res.results.slice(0, 5).map((e) => (e.anchor ? `${e.note}#${e.anchor}` : e.note)),
        });
        return textResult(res);
      }
      case "get_part": {
        if (!args?.id) return errorResult("缺少参数 id，如 \"spine#dot\" 或 \"bento\"");
        const res = getPart(r.resolved, args.id, warn);
        if (res.error) {
          logCall(name, args, performance.now() - t0, { error: true });
          return errorResult(res.error);
        }
        const { framePaths = [], ...fields } = res;
        const result = textResult(fields);
        for (const f of framePaths) {
          result.content.push({ type: "image", data: fs.readFileSync(f).toString("base64"), mimeType: "image/jpeg" });
        }
        logCall(name, args, performance.now() - t0, { frames: framePaths.length, hasCode: Boolean(fields.code) });
        return result;
      }
      case "get_source": {
        if (!args?.name) return errorResult("缺少参数 name，如 \"bento\"");
        const res = getSource(r.resolved, args.name, warn);
        logCall(name, args, performance.now() - t0, { error: Boolean(res.error) });
        return res.error ? errorResult(res.error) : textResult(res);
      }
      default:
        return errorResult(`未知工具 "${name}"。可用：search_parts, get_part, get_source`);
    }
  } catch (e) {
    return errorResult(`工具 ${name} 执行失败: ${e.message}`);
  }
});

const resolvedInfo = resolve();
console.error(
  `[design-parts-mcp] v${VERSION} 数据源: ${resolvedInfo.ok ? resolvedInfo.resolved.root : "未找到（工具调用时报错）"}`
);

await server.connect(new StdioServerTransport());
