// eval-search.mjs — 用固定的任务词检查搜索：前 3 条里有没有能直接用的。
// tune 用来调搜索，holdout 不参与调参，用来发现过拟合。gap 是库里确实没有的类型。
// 只对活资料有意义：DESIGN_NOTES_PATH=<活资料根目录> npm run eval
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveRoot, search } from "../server/library.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const { tune, holdout } = JSON.parse(fs.readFileSync(path.join(here, "search-eval.json"), "utf8"));
const FLOOR = JSON.parse(fs.readFileSync(path.join(here, "search-eval-floor.json"), "utf8"));
const root = resolveRoot();

function run(name, cases) {
  const scored = cases.filter((c) => !c.gap);
  const misses = [];
  let hits = 0;
  for (const c of scored) {
    const top = search(root, c.q).results.slice(0, 3).map((r) => r.note);
    if (top.some((n) => c.any.includes(n))) hits++;
    else misses.push(`  没命中「${c.q}」：${[...new Set(top)].join(", ") || "无结果"}`);
  }
  const gaps = cases.length - scored.length;
  console.log(`${name}: ${hits}/${scored.length}，另有 ${gaps} 个库里没有的类型`);
  if (misses.length) console.log(misses.join("\n"));
  return hits;
}

const t = run("tune", tune);
const h = run("holdout", holdout);
if (t < FLOOR.tune || h < FLOOR.holdout) {
  console.error(`低于基线：tune ${t}/${FLOOR.tune}，holdout ${h}/${FLOOR.holdout}`);
  process.exit(1);
}
