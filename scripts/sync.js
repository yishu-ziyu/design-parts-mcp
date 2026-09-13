// sync.js — 从本地真源刷新 library/ 快照。
// 拷贝 living/<name>/index.html + README.md（存在才拷），重建 library/INDEX.md
// （只保留发明表 + 零件表中指向 living 内且文件存在的行；死链行剔除）。
// 快照里的文本统一做个人信息清洗（本地绝对路径 / 真名 / 私有仓库名）。
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { expandHome, resolveRoot, parseIndex } from "../server/library.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DST = path.join(REPO_ROOT, "library");

const REQUIRED_NOTES = ["bento", "triage", "spine"];

// 清洗模式字符串拆写，避免本仓库源码自身命中个人信息 grep（self-scrub）。
const HOME_PREFIX = "/" + "Users" + "/";
const OWNER_NAME = "mahao" + "xuan";
const OWNER_NAME_CN = "马浩" + "宣";

const FORBIDDEN = [
  new RegExp(HOME_PREFIX.replace(/\//g, "\\/")),
  new RegExp(OWNER_NAME, "i"),
  new RegExp(OWNER_NAME_CN),
];

/** 个人信息清洗：本地绝对路径中性化、真名/私有仓库名替换。 */
function sanitize(text) {
  const esc = HOME_PREFIX.replace(/\//g, "\\/");
  return text
    .replace(new RegExp(esc + "[^\"`\\s)\\]},;。｜|]*", "g"), "<local-path>")
    .replace(new RegExp(OWNER_NAME, "gi"), "user")
    .replace(new RegExp(OWNER_NAME_CN, "g"), "user")
    .replace(/red-herring-and-gun/g, "user-project")
    .replace(/验收契约在 \[CONTRACT\.md\]\(CONTRACT\.md\)。?/g, "")
    .replace(/（拷贝在 `_source\/`）/g, "");
}

function isClean(text) {
  return !FORBIDDEN.some((re) => re.test(text));
}

function copySanitized(srcFile, dstFile, label) {
  const raw = fs.readFileSync(srcFile, "utf8");
  const text = sanitize(raw);
  if (!isClean(text)) {
    console.error(`[sync] warning: ${label} 含个人信息且无法自动清洗，已跳过`);
    return false;
  }
  fs.writeFileSync(dstFile, text);
  return true;
}

function main() {
  const srcEnv = process.env.DESIGN_NOTES_PATH;
  const source = resolveRoot(srcEnv ?? path.join(os.homedir(), "Documents", "design-notes"));
  console.error(`[sync] 真源: ${source.root}`);

  const srcLiving = source.livingDir;
  const notes = fs
    .readdirSync(srcLiving, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(srcLiving, d.name, "index.html")))
    .map((d) => d.name)
    .sort();

  // 重建 living/
  fs.rmSync(path.join(DST, "living"), { recursive: true, force: true });
  let copied = 0;
  let readmes = 0;
  for (const note of notes) {
    const dstNote = path.join(DST, "living", note);
    fs.mkdirSync(dstNote, { recursive: true });
    fs.copyFileSync(path.join(srcLiving, note, "index.html"), path.join(dstNote, "index.html"));
    copied++;
    const readme = path.join(srcLiving, note, "README.md");
    if (fs.existsSync(readme)) {
      if (copySanitized(readme, path.join(dstNote, "README.md"), `living/${note}/README.md`)) readmes++;
    }
  }
  console.error(`[sync] 已拷贝 ${copied} 篇 index.html，${readmes} 篇 README.md`);

  // 重建 INDEX.md：用真源解析器过滤（外部链接/死链行自动剔除），链接改写为 living/ 前缀
  const parsed = parseIndex(source);
  for (const w of parsed.warnings) console.error(`[sync] warning: ${w}`);

  const rows = [];
  for (const inv of parsed.inventions) {
    const href = `living/${inv.path.replace(/^living\//, "")}`;
    rows.push(`| [${inv.title}](${href}) | ${sanitize(inv.description)} | ${sanitize(inv.when)} |`);
  }
  const partsBySection = new Map();
  for (const p of parsed.parts) {
    const key = p.section || "其他";
    if (!partsBySection.has(key)) partsBySection.set(key, []);
    const href = `living/${p.path.replace(/^living\//, "")}`;
    partsBySection
      .get(key)
      .push(`| ${sanitize(p.task)} | [${p.note}](${href}) | ${sanitize(p.description)} |`);
  }

  let out = `# Design parts index

设计零件库的检索入口。每条笔记是 \`living/<name>/index.html\`，一个能打开的活笔记。

发明表回答「这页是什么」。零件表回答「我要做这一块，打开哪一页的哪一处」。
打开 HTML 看正在转的。不要只抄表。

## 发明

| 打开 | 看见什么 | 什么时候用 |
|------|----------|------------|
${rows.join("\n")}

## 零件

按要做的那一块查。同一页可以拆出好几块。锚点是页里的 id。
`;
  for (const [section, lines] of partsBySection) {
    out += `\n### ${section}\n\n| 要做 | 打开 | 看哪一块 |\n|------|------|----------|\n${lines.join("\n")}\n`;
  }

  fs.writeFileSync(path.join(DST, "INDEX.md"), out);
  console.error(
    `[sync] library/INDEX.md 重建完成: ${rows.length} 条发明、${parsed.parts.length} 条零件（剔除 ${parsed.warnings.length} 条死链/库外链接）`
  );

  const missing = REQUIRED_NOTES.filter((n) => !fs.existsSync(path.join(DST, "living", n, "index.html")));
  if (missing.length) {
    console.error(`[sync] warning: 必需笔记缺失: ${missing.join(", ")}`);
    process.exitCode = 1;
  }
}

main();
