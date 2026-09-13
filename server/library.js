// library.js — 数据源解析（INDEX.md 表格 + 笔记页尾「可拆」dl + README.md）
// 两条数据路径共用：DESIGN_NOTES_PATH 指向本地真源，否则用仓库内置 library/ 快照。
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** 展开路径里的 ~ */
export function expandHome(p) {
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

/**
 * 解析数据根目录。
 * 返回 { root, livingDir, indexFile, baseDir, mode }
 * - mode "source"：DESIGN_NOTES_PATH 指向 design-notes 根（INDEX.md 在 living/INDEX.md）
 * - mode "snapshot"：仓库内置 library/（INDEX.md 在 library/INDEX.md）
 * 解析规则统一：INDEX.md 里的相对链接相对于 INDEX.md 所在目录（baseDir）解析。
 */
export function resolveRoot(explicit) {
  let root, mode;
  if (explicit) {
    root = path.resolve(expandHome(explicit));
    mode = "explicit";
  } else if (process.env.DESIGN_NOTES_PATH) {
    root = path.resolve(expandHome(process.env.DESIGN_NOTES_PATH));
    mode = "source";
  } else {
    root = path.join(REPO_ROOT, "library");
    mode = "snapshot";
  }
  const indexFile = fs.existsSync(path.join(root, "INDEX.md"))
    ? path.join(root, "INDEX.md")
    : path.join(root, "living", "INDEX.md");
  const livingDir = path.join(root, "living");
  if (!fs.existsSync(indexFile)) {
    throw new Error(
      `找不到索引 ${indexFile}。设 DESIGN_NOTES_PATH 指向 design-notes 根目录，或先运行 npm run sync 生成 library/ 快照。`
    );
  }
  if (!fs.existsSync(livingDir)) {
    throw new Error(`找不到笔记目录 ${livingDir}`);
  }
  return { root, livingDir, indexFile, baseDir: path.dirname(indexFile), mode };
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitRow(line) {
  return line
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => c.trim());
}

const LINK_RE = /\[([^\]]*)\]\(([^)\s]+)\)/;

/**
 * 把 INDEX.md 表格行里的链接解析成 { note, anchor, abs, external, valid }。
 * 相对 baseDir 解析；落在 livingDir 之外（如 ../halftone/）标 external。
 */
function resolveLink(url, baseDir, livingDir) {
  const [href, hash = ""] = url.split("#");
  const anchor = hash || null;
  const abs = path.resolve(baseDir, href);
  const rel = path.relative(livingDir, abs);
  const external = rel.startsWith("..");
  const note = external ? null : rel.split(path.sep)[0];
  const valid = fs.existsSync(abs);
  return { href, anchor, abs, external, note, valid };
}

/**
 * 条目 path：以数据根为基准的相对路径（两种模式统一，不靠字符串拼前缀）。
 */
function relFromRoot(resolved, link) {
  return path.relative(resolved.root, link.abs).split(path.sep).join("/");
}

/**
 * 解析 INDEX.md：发明表 + 零件表。
 * 返回 { inventions, parts, warnings }
 * 死链行（指向不存在文件或 living 之外）剔除并记 warning。
 */
export function parseIndex(resolved) {
  const { indexFile, baseDir, livingDir, root } = resolved;
  const text = fs.readFileSync(indexFile, "utf8");
  const warnings = [];
  const inventions = [];
  const parts = [];
  let section = null; // "invention" | "parts" | null
  let subsection = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const h2 = line.match(/^##\s+(?!#)(.+)/);
    if (h2) {
      const t = h2[1].trim();
      section = t.includes("发明") ? "invention" : t.includes("零件") ? "parts" : null;
      subsection = null;
      continue;
    }
    const h3 = line.match(/^###\s+(.+)/);
    if (h3) {
      subsection = h3[1].trim();
      continue;
    }
    if (!line.startsWith("|") || !section) continue;
    const cells = splitRow(line);
    if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === "")) continue; // 分隔行
    const linkCellIdx = cells.findIndex((c) => LINK_RE.test(c));
    if (linkCellIdx === -1) continue; // 无链接的行（如 skill 名）不进零件索引
    const m = LINK_RE.exec(cells[linkCellIdx]);
    const link = resolveLink(m[2], baseDir, livingDir);
    if (!link.valid || link.external || !link.note) {
      warnings.push(`INDEX.md 死链/库外链接已跳过: ${m[2]}`);
      continue;
    }
    if (section === "invention") {
      inventions.push({
        type: "invention",
        title: m[1] || link.note,
        note: link.note,
        anchor: link.anchor,
        path: relFromRoot(resolved, link) + (link.anchor ? `#${link.anchor}` : ""),
        description: cells[1] ?? "",
        when: cells[2] ?? "",
      });
    } else {
      parts.push({
        type: "part",
        section: subsection ?? "",
        task: cells[0] ?? "",
        title: cells[0] ?? "",
        note: link.note,
        anchor: link.anchor,
        path: relFromRoot(resolved, link) + (link.anchor ? `#${link.anchor}` : ""),
        description: cells[2] ?? "",
      });
    }
  }
  return { inventions, parts, warnings };
}

/**
 * 解析一篇笔记 index.html 页尾的「可拆」段：<h3>可拆</h3> 后的 <dl><dt><code>#anchor</code></dt><dd>说明</dd></dl>。
 * 没有「可拆」段返回 []（老笔记容错）。
 */
export function parseDetachable(html) {
  const tail = html.match(/<h3[^>]*>[^<]*可拆[^<]*<\/h3>([\s\S]*?)(?:<\/body>|<\/main>|$)/i);
  if (!tail) return [];
  const dl = tail[1].match(/<dl[^>]*>([\s\S]*?)<\/dl>/i);
  if (!dl) return [];
  const out = [];
  const itemRe = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi;
  let m;
  while ((m = itemRe.exec(dl[1]))) {
    const anchorMatch = stripTags(m[1]).match(/#([\w-]+)/);
    if (!anchorMatch) continue;
    out.push({ anchor: anchorMatch[1], text: stripTags(m[2]) });
  }
  return out;
}

/** 从说明文本里提取关键参数（时长/缓动/尺寸/频率/阈值） */
export function extractParams(text) {
  const re =
    /cubic-bezier\([^)]*\)|ease-(?:spring|in-out|in|out)|linear\(\)|\d+(?:\.\d+)?(?:ms|px|Hz|%|deg|s)\b/gi;
  const found = text.match(re) ?? [];
  return [...new Set(found)];
}

function loadReadme(livingDir, note) {
  const p = path.join(livingDir, note, "README.md");
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

const cache = new Map();

/** 载入并缓存整库数据；warnings 通过回调给出（server 打到 stderr）。 */
export function loadLibrary(resolved, onWarn = () => {}) {
  const key = resolved.root;
  if (cache.has(key)) return cache.get(key);
  const data = parseIndex(resolved);
  for (const w of data.warnings) onWarn(w);
  const notes = fs
    .readdirSync(resolved.livingDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(resolved.livingDir, d.name, "index.html")))
    .map((d) => d.name);
  const detachables = {};
  const readmes = {};
  for (const note of notes) {
    const html = fs.readFileSync(path.join(resolved.livingDir, note, "index.html"), "utf8");
    detachables[note] = parseDetachable(html);
    readmes[note] = loadReadme(resolved.livingDir, note);
  }
  const lib = { ...data, notes, detachables, readmes };
  cache.set(key, lib);
  return lib;
}

/** search_parts：无 query 返回全量发明表；有 query 真解析匹配。 */
export function search(resolved, query, onWarn = () => {}) {
  const lib = loadLibrary(resolved, onWarn);
  const q = (query ?? "").trim().toLowerCase();
  if (!q) {
    return { query: "", total: lib.inventions.length, results: lib.inventions };
  }
  const tokens = q.split(/\s+/);
  const hits = (text) => tokens.every((t) => text.toLowerCase().includes(t));
  const results = [];
  for (const inv of lib.inventions) {
    if (hits([inv.note, inv.title, inv.description, inv.when].join(" "))) results.push(inv);
  }
  for (const p of lib.parts) {
    if (hits([p.note, p.section, p.task, p.description, p.anchor ?? ""].join(" "))) results.push(p);
  }
  for (const [note, items] of Object.entries(lib.detachables)) {
    for (const it of items) {
      if (hits([note, it.anchor, it.text].join(" "))) {
        results.push({
          type: "detachable",
          title: `${note}#${it.anchor}`,
          note,
          anchor: it.anchor,
          path: `living/${note}/index.html#${it.anchor}`,
          description: it.text,
        });
      }
    }
  }
  for (const [note, readme] of Object.entries(lib.readmes)) {
    if (!readme) continue;
    const line = readme.split(/\r?\n/).find((l) => hits(l));
    if (line) {
      results.push({
        type: "readme",
        title: `${note} — README`,
        note,
        anchor: null,
        path: `living/${note}/README.md`,
        description: line.trim().slice(0, 240),
      });
    }
  }
  return { query, total: results.length, results: results.slice(0, 60) };
}

/** get_part：入参 "bento#chart" / "spine#dot" / "bento"。 */
export function getPart(resolved, id, onWarn = () => {}) {
  const lib = loadLibrary(resolved, onWarn);
  const raw = (id ?? "").trim().replace(/^living\//, "");
  const [noteName, anchor] = raw.split("#");
  const note = noteName;
  if (!note || !lib.notes.includes(note)) {
    return {
      error: `找不到笔记 "${note}"。可用笔记：${lib.notes.join(", ")}`,
    };
  }
  const indexHtmlPath = path.join(resolved.livingDir, note, "index.html");
  const detach = lib.detachables[note] ?? [];
  const invention = lib.inventions.find((i) => i.note === note) ?? null;
  const indexParts = lib.parts.filter((p) => p.note === note);

  if (anchor) {
    const entry = detach.find((d) => d.anchor === anchor);
    const related = indexParts.filter((p) => p.anchor === anchor);
    if (!entry && related.length === 0) {
      return {
        error: `笔记 "${note}" 没有锚点 #${anchor}。可用锚点：${[
          ...detach.map((d) => `#${d.anchor}`),
          ...indexParts.filter((p) => p.anchor).map((p) => `#${p.anchor}`),
        ].join(", ") || "（无）"}`,
      };
    }
    return {
      note,
      anchor,
      description: entry ? entry.text : related.map((r) => r.description).join("；"),
      params: entry ? extractParams(entry.text) : extractParams(related.map((r) => r.description).join("；")),
      relatedIndexEntries: related.map((r) => ({ task: r.task, section: r.section, detail: r.description })),
      indexHtmlPath,
      readme: lib.readmes[note],
    };
  }

  return {
    note,
    summary: invention ? invention.description : "",
    when: invention ? invention.when : "",
    detachables: detach.map((d) => ({ anchor: `#${d.anchor}`, text: d.text })),
    indexEntries: indexParts.map((p) => ({
      task: p.task,
      section: p.section,
      anchor: p.anchor,
      path: p.path,
      detail: p.description,
    })),
    indexHtmlPath,
    hasReadme: Boolean(lib.readmes[note]),
  };
}

/** get_source：返回某篇笔记的 README 全文 + 来源 URL + 机制记录。 */
export function getSource(resolved, name, onWarn = () => {}) {
  const lib = loadLibrary(resolved, onWarn);
  const note = (name ?? "").trim();
  if (!note || !lib.notes.includes(note)) {
    return { error: `找不到笔记 "${note}"。可用笔记：${lib.notes.join(", ")}` };
  }
  const readme = lib.readmes[note];
  const invention = lib.inventions.find((i) => i.note === note) ?? null;
  const urls = readme
    ? [...new Set((readme.match(/https?:\/\/[^\s)\]>"'，。；]+/g) ?? []).map((u) => u.replace(/[.,;]+$/, "")))]
    : [];
  return {
    name: note,
    sourceUrl: urls[0] ?? null,
    urls,
    readme,
    indexHtmlPath: path.join(resolved.livingDir, note, "index.html"),
    summary: invention ? invention.description : "",
    note: readme ? undefined : "本篇暂无 README，只有发明表描述。",
  };
}
