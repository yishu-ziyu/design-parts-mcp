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

/**
 * 可选 README front matter（--- 包起的 key: value 行）。老笔记没有就返回 {}。
 * 认得的键：aliases（逗号分隔，中英同义词）、when、avoid、params、anchors、title。
 */
export function parseFrontMatter(readme) {
  if (!readme) return {};
  const m = readme.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  if (meta.aliases) meta.aliases = meta.aliases.split(/\s*[,，]\s*/).filter(Boolean);
  return meta;
}

const STOPWORDS = new Set(["a","an","the","to","into","in","on","of","for","and","or","with","make","how","do","i","my","is","it","this","that","an"]);

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
  const metas = {};
  const lib_params = {};
  for (const note of notes) {
    const html = fs.readFileSync(path.join(resolved.livingDir, note, "index.html"), "utf8");
    detachables[note] = parseDetachable(html);
    const pj = html.match(/<script[^>]*type=["']application\/json["'][^>]*id=["']params["'][^>]*>([\s\S]*?)<\/script>/i);
    if (pj) { try { (lib_params[note] = JSON.parse(pj[1])); } catch { onWarn(`${note}/index.html 的 #params JSON 解析失败`); } }
    readmes[note] = loadReadme(resolved.livingDir, note);
    metas[note] = parseFrontMatter(readmes[note]);
    // index.html 的 <meta name="keywords"> 也算别名（没有 README 的老笔记靠它）
    const kw = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']*)["']/i);
    if (kw) {
      const extra = kw[1].split(/\s*[,，]\s*/).filter(Boolean);
      metas[note] = { ...metas[note], aliases: [...new Set([...(metas[note].aliases ?? []), ...extra])] };
    }
  }
  const lib = { ...data, notes, detachables, readmes, metas, paramsJson: lib_params };
  cache.set(key, lib);
  return lib;
}

function metaText(meta) {
  if (!meta) return "";
  return [...(meta.aliases ?? []), meta.title ?? "", meta.when ?? "", meta.anchors ?? ""].join(" ");
}

function withMeta(entry, meta) {
  if (!meta || !Object.keys(meta).length) return entry;
  const extra = {};
  for (const k of ["aliases", "when", "avoid", "params"]) if (meta[k] && !entry[k]) extra[k] = meta[k];
  if (meta.when && entry.when !== undefined && entry.when !== meta.when) extra.whenToUse = meta.when;
  return { ...entry, ...extra };
}

function collect(lib, hits) {
  const results = [];
  for (const inv of lib.inventions) {
    const meta = lib.metas?.[inv.note];
    const text = [inv.note, inv.title, inv.description, inv.when, metaText(meta)].join(" ");
    const s = hits(text);
    if (s) results.push({ score: s, item: withMeta(inv, meta) });
  }
  for (const p of lib.parts) {
    const s = hits([p.note, p.section, p.task, p.description, p.anchor ?? ""].join(" "));
    if (s) results.push({ score: s, item: p });
  }
  for (const [note, items] of Object.entries(lib.detachables)) {
    for (const it of items) {
      const s = hits([note, it.anchor, it.text].join(" "));
      if (s) {
        results.push({ score: s, item: {
          type: "detachable",
          title: `${note}#${it.anchor}`,
          note,
          anchor: it.anchor,
          path: `living/${note}/index.html#${it.anchor}`,
          description: it.text,
        } });
      }
    }
  }
  for (const [note, readme] of Object.entries(lib.readmes)) {
    if (!readme) continue;
    let best = 0, bestLine = null;
    for (const l of readme.split(/\r?\n/)) {
      const s = hits(l);
      if (s > best) { best = s; bestLine = l; }
    }
    if (bestLine) {
      results.push({ score: best, item: {
        type: "readme",
        title: `${note} — README`,
        note,
        anchor: null,
        path: `living/${note}/README.md`,
        description: bestLine.trim().slice(0, 240),
      } });
    }
  }
  return results;
}

/** search_parts：无 query 返回全量发明表；有 query 先全词命中（AND），零命中时退到部分命中（按命中词数排序，标 match:"partial"）。 */
export function search(resolved, query, onWarn = () => {}) {
  const lib = loadLibrary(resolved, onWarn);
  const q = (query ?? "").trim().toLowerCase();
  if (!q) {
    return { query: "", total: lib.inventions.length, results: lib.inventions.map((i) => withMeta(i, lib.metas?.[i.note])) };
  }
  const tokens = q.split(/\s+/);
  const all = (text) => (tokens.every((t) => text.toLowerCase().includes(t)) ? 1 : 0);
  let scored = collect(lib, all);
  let match = "all";
  if (!scored.length) {
    // 中文不分词：含 CJK 的词再拆成二字片段（模切边 → 模切/切边），英文去停用词
    const sig = [];
    for (const t of tokens) {
      if (STOPWORDS.has(t) || t.length < 2) continue;
      sig.push(t);
      if (/[\u3400-\u9fff]/.test(t) && t.length > 2) for (let i = 0; i + 2 <= t.length; i++) sig.push(t.slice(i, i + 2));
    }
    if (sig.length) {
      const any = (text) => {
        const lt = text.toLowerCase();
        return sig.filter((t) => lt.includes(t)).length;
      };
      scored = collect(lib, any).sort((a, b) => b.score - a.score);
      match = "partial";
    }
  }
  const results = scored.map(({ score, item }) => (match === "partial" ? { ...item, match, matchedTerms: score } : item));
  return { query, total: results.length, match, results: results.slice(0, 60) };
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
      ...(lib.paramsJson?.[note]?.[anchor] ? { paramsJson: lib.paramsJson[note][anchor] } : {}),
      ...(lib.metas?.[note]?.avoid ? { avoid: lib.metas[note].avoid } : {}),
      relatedIndexEntries: related.map((r) => ({ task: r.task, section: r.section, detail: r.description })),
      indexHtmlPath,
      readme: lib.readmes[note],
    };
  }

  return {
    note,
    summary: invention ? invention.description : "",
    when: invention ? invention.when : "",
    ...(lib.metas?.[note] && Object.keys(lib.metas[note]).length ? { meta: lib.metas[note] } : {}),
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
