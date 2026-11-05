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
const SINGLE_TERM_LIMIT = 60;
const MULTI_TERM_LIMIT = 20;

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

const EN_STOPWORDS = new Set(
  "a an and are as at be by for from in into is it my of on or our that the this to with your".split(" ")
);
// 中文长句按二字片段拆开时，丢掉只起语法作用的片段（如「卡片做」里的「片做」）
const ZH_FUNCTION_CHARS = /^[的了给做要有把让请吗呢吧很和与或在]|[的了给做要有把让请吗呢吧很和与或在]$/;
const ZH_STOP_FRAGMENTS = new Set(["一个", "一种", "这个", "那个", "我要", "我想", "帮我", "需要"]);

// 同一个界面概念的中英文说法。库以中文为主，英文查询靠这张表找到内容。
const SYNONYMS = [
  ["modal", "dialog", "弹窗", "对话框"],
  ["table", "表格"],
  ["command palette", "cmd", "命令面板"],
  ["login", "signin", "登录"],
  ["pricing", "定价", "价格"],
  ["empty", "空状态"],
  ["skeleton", "骨架屏"],
  ["counter", "ticker", "计数", "数字滚动"],
  ["hover", "悬停"],
  ["press", "按下"],
  ["drag", "拖动", "拖拽"],
  ["reorder", "排序"],
  ["transition", "转场", "过渡"],
  ["scroll", "滚动"],
  ["flip", "翻转", "翻页"],
  ["fold", "折叠"],
  ["blur", "模糊"],
  ["font", "字体", "字重"],
  ["onboarding", "引导", "新手"],
  ["spinner", "loading", "加载"],
  ["dashboard", "仪表盘"],
  ["sheet", "drawer", "抽屉"],
  ["sticker", "贴纸"],
  ["timeline", "时间轴"],
  ["map", "地图"],
  ["peek", "preview", "预览"],
  ["tooltip", "气泡"],
  ["toast", "通知", "提示条"],
  ["sidebar", "侧栏", "侧边栏"],
  ["navigation", "导航"],
  ["gallery", "carousel", "画廊", "轮播"],
  ["typing", "打字", "逐字"],
  ["upload", "上传"],
  ["progress", "进度"],
  ["toolbar", "工具栏"],
  ["card", "卡片"],
  ["button", "按钮"],
  ["icon", "图标"],
  ["slider", "滑块"],
  ["lightbox", "灯箱"],
];
const SYNONYM_OF = new Map(SYNONYMS.flatMap((g) => g.map((w) => [w, g])));

/** 把 query 拆成检索词：英文按单词，中文连续段整段 + 二字片段（长句没有空格也能命中）。 */
function parseQuery(q) {
  const raw = q.match(/\p{Script=Han}+|[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?/gu) ?? [];
  const unique = [...new Set(raw)];
  const content = unique.filter((t) => !EN_STOPWORDS.has(t));
  return (content.length ? content : unique).map((text) => {
    const fragments = [];
    if (/^\p{Script=Han}{3,}$/u.test(text)) {
      for (let i = 0; i + 2 <= text.length; i++) {
        const f = text.slice(i, i + 2);
        if (!ZH_FUNCTION_CHARS.test(f) && !ZH_STOP_FRAGMENTS.has(f)) fragments.push(f);
      }
    }
    const variants = (SYNONYM_OF.get(text) ?? []).filter((w) => w !== text);
    return { text, fragments, variants };
  });
}

/** 文本命中多少：整词命中优先于片段命中。返回 { score, matched, hitTerms }。 */
function scoreText(text, terms) {
  const lower = text.toLowerCase();
  let score = 0;
  const matched = [];
  const hitTerms = [];
  const weights = {};
  for (const term of terms) {
    const whole = [term.text, ...term.variants].find((w) => hasWord(lower, w));
    if (whole) {
      score += Math.max(2, term.fragments.length + 1);
      matched.push(whole);
      hitTerms.push(term.text);
      weights[term.text] = 1;
      continue;
    }
    const partial = term.fragments.filter((f) => lower.includes(f));
    if (partial.length) {
      score += partial.length;
      matched.push(...partial);
      hitTerms.push(term.text);
      for (const f of partial) weights[f] = 0.5;
    }
  }
  return { score, matched, hitTerms, weights };
}

/** 中文直接包含；拉丁词要从词首开始，否则 flow 会命中 pageflow。 */
function hasWord(lower, word) {
  const i = lower.indexOf(word);
  if (i < 0) return false;
  if (!/^[a-z0-9]/.test(word)) return true;
  return new RegExp(`(^|[^a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(lower);
}

/** search_parts：无 query 返回全量发明表；有 query 命中任一词即返回，命中越多排越前。 */
export function search(resolved, query, onWarn = () => {}) {
  const lib = loadLibrary(resolved, onWarn);
  const q = (query ?? "").trim().toLowerCase();
  if (!q) {
    return { query: "", total: lib.inventions.length, results: lib.inventions };
  }
  const terms = parseQuery(q);
  const scored = [];
  const seenTerms = new Set();
  const add = (entry, s) => {
    if (!s.score) return;
    s.hitTerms.forEach((t) => seenTerms.add(t));
    scored.push({ entry: { ...entry, matched: s.matched }, weights: s.weights });
  };
  for (const inv of lib.inventions) {
    add(inv, scoreText([inv.note, inv.title, inv.description, inv.when].join(" "), terms));
  }
  for (const p of lib.parts) {
    add(p, scoreText([p.note, p.section, p.task, p.description, p.anchor ?? ""].join(" "), terms));
  }
  // 没登记进 INDEX 的笔记（失败或待定的复刻页）不进搜索结果
  const indexed = new Set([...lib.inventions, ...lib.parts].map((e) => e.note));
  for (const [note, items] of Object.entries(lib.detachables)) {
    if (!indexed.has(note)) continue;
    for (const it of items) {
      add(
        {
          type: "detachable",
          title: `${note}#${it.anchor}`,
          note,
          anchor: it.anchor,
          path: `living/${note}/index.html#${it.anchor}`,
          description: it.text,
        },
        scoreText([note, it.anchor, it.text].join(" "), terms)
      );
    }
  }
  for (const note of indexed) {
    for (const [anchor, p] of Object.entries(loadPartFile(resolved.livingDir, note) ?? {})) {
      add(
        {
          type: "part-detail",
          title: `${note}#${anchor}`,
          note,
          anchor,
          path: `living/${note}/${p.page ?? "index.html"}#${anchor}`,
          description: p.how,
        },
        scoreText([note, anchor, p.how, p.fit].join(" "), terms)
      );
    }
  }
  for (const [note, readme] of Object.entries(lib.readmes)) {
    if (!readme || !indexed.has(note)) continue;
    let best = null;
    let bestLine = "";
    for (const line of readme.split(/\r?\n/)) {
      const s = scoreText(line, terms);
      if (s.score && (!best || s.score > best.score)) {
        best = s;
        bestLine = line;
      }
    }
    if (best) {
      add(
        {
          type: "readme",
          title: `${note} — README`,
          note,
          anchor: null,
          path: `living/${note}/README.md`,
          description: bestLine.trim().slice(0, 240),
        },
        best
      );
    }
  }
  // 越少见的词越能说明这条相关；笔记名命中说明整篇就是讲这个；README 只是顺带提到
  const docFreq = {};
  for (const x of scored) for (const t of Object.keys(x.weights)) docFreq[t] = (docFreq[t] ?? 0) + 1;
  for (const x of scored) {
    const idf = (t) => Math.log(1 + scored.length / docFreq[t]);
    const sum = (w) => Object.entries(w).reduce((n, [t, v]) => n + v * idf(t), 0);
    x.score = sum(x.weights) * (x.entry.type === "readme" ? 0.5 : 1) + sum(scoreText(x.entry.note ?? "", terms).weights) * 1.5;
  }
  scored.sort((a, b) => b.score - a.score);
  // 同一篇最多连占两条，给其他笔记留位置
  const perNote = new Map();
  const diverse = [];
  const overflow = [];
  for (const x of scored) {
    const n = (perNote.get(x.entry.note) ?? 0) + 1;
    perNote.set(x.entry.note, n);
    (n <= 2 ? diverse : overflow).push(x);
  }
  const ranked = [...diverse, ...overflow];
  const limit = terms.length > 1 ? MULTI_TERM_LIMIT : SINGLE_TERM_LIMIT;
  return {
    query,
    total: scored.length,
    results: ranked.slice(0, limit).map((x) => x.entry),
    unmatched: terms.map((t) => t.text).filter((t) => !seenTerms.has(t)),
  };
}

/** 读笔记的 part.json：按锚点写好的机制、参数、代码和关键帧。没有这个文件的笔记走旧格式。 */
function loadPartFile(livingDir, note) {
  const p = path.join(livingDir, note, "part.json");
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
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
    const rich = loadPartFile(resolved.livingDir, note)?.[anchor];
    if (rich) {
      const { frames = [], how, params = {}, page, ...fields } = rich;
      return {
        note,
        anchor,
        description: how,
        params: Object.entries(params).map(([k, v]) => `${k}：${v}`),
        ...fields,
        indexHtmlPath: page ? path.join(resolved.livingDir, note, page) : indexHtmlPath,
        framePaths: frames.map((f) => path.join(resolved.livingDir, note, "assets", f)),
      };
    }
    const entry = detach.find((d) => d.anchor === anchor);
    const related = indexParts.filter((p) => p.anchor === anchor);
    if (!entry && related.length === 0) {
      return {
        error: `笔记 "${note}" 没有锚点 #${anchor}。可用锚点：${[...new Set([
          ...detach.map((d) => `#${d.anchor}`),
          ...Object.keys(loadPartFile(resolved.livingDir, note) ?? {}).map((a) => `#${a}`),
          ...indexParts.filter((p) => p.anchor).map((p) => `#${p.anchor}`),
        ])].join(", ") || "（无）"}`,
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
    // part.json 里写好的锚点，用 get_part("笔记#锚点") 取代码、参数和关键帧
    anchors: Object.entries(loadPartFile(resolved.livingDir, note) ?? {}).map(([a, p]) => ({
      anchor: `#${a}`,
      description: p.how,
      fit: p.fit,
    })),
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
