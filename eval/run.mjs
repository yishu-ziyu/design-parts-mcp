// top-3 命中率：结果前 3 条里任一条的 note 或 note#anchor 落在 expect 里即命中。
// 用法：node eval/run.mjs [库根目录，可选]
import fs from "node:fs";
const lib = await import(process.env.LIB_JS ?? new URL("../server/library.js", import.meta.url));
const qs = JSON.parse(fs.readFileSync(new URL("./queries.json", import.meta.url)));
const r = lib.resolveRoot(process.argv[2]);
let hit = 0;
for (const { q, expect } of qs) {
  const top = lib.search(r, q).results.slice(0, 3);
  const ok = top.some((x) => expect.includes(x.note) || expect.includes(`${x.note}#${x.anchor}`));
  hit += ok;
  console.log(`${ok ? "✓" : "✗"} ${q}  →  ${top.map((x) => x.note + (x.anchor ? "#" + x.anchor : "")).join(", ") || "(无)"}`);
}
console.log(`\ntop-3 ${hit}/${qs.length} = ${((100 * hit) / qs.length).toFixed(1)}%`);
