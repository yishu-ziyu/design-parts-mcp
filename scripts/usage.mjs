// usage.mjs — 看调用记录：谁在用、查了什么、查完有没有取详情、哪些词没结果。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const LOG = process.env.DESIGN_PARTS_LOG ?? path.join(os.homedir(), ".local", "state", "design-parts", "calls.jsonl");
if (!fs.existsSync(LOG)) {
  console.log(`还没有调用记录：${LOG}`);
  process.exit(0);
}
const rows = fs.readFileSync(LOG, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
const count = (items) => {
  const m = new Map();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1]);
};
const searches = rows.filter((r) => r.tool === "search_parts");
const parts = rows.filter((r) => r.tool === "get_part");
const sessions = new Set(rows.map((r) => r.session));
const sessionsWithSearch = new Set(searches.map((r) => r.session));
const followed = [...sessionsWithSearch].filter((s) => parts.some((p) => p.session === s));

console.log(`调用 ${rows.length} 次，${sessions.size} 个会话，${rows[0].ts} 到 ${rows.at(-1).ts}`);
console.log("客户端：", count(rows.map((r) => r.client)).map(([k, v]) => `${k} ${v}`).join("，"));
console.log("项目：", count(rows.map((r) => r.project)).slice(0, 10).map(([k, v]) => `${k} ${v}`).join("，"));
console.log(`搜索 ${searches.length} 次；搜过的 ${sessionsWithSearch.size} 个会话里，${followed.length} 个接着取了详情`);
const empty = searches.filter((r) => !r.total).map((r) => r.args?.query);
console.log(`没有结果的搜索 ${empty.length} 次：`, count(empty).slice(0, 15).map(([k, v]) => `${k}×${v}`).join("，") || "无");
console.log("最常查：", count(searches.map((r) => r.args?.query)).slice(0, 15).map(([k, v]) => `${k}×${v}`).join("，") || "无");
console.log("最常取：", count(parts.filter((r) => !r.error).map((r) => r.args?.id)).slice(0, 15).map(([k, v]) => `${k}×${v}`).join("，") || "无");
console.log("取失败：", count(parts.filter((r) => r.error).map((r) => r.args?.id)).slice(0, 10).map(([k, v]) => `${k}×${v}`).join("，") || "无");
