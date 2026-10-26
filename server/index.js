#!/usr/bin/env node
// design-parts-mcp — 本地 stdio MCP server，把设计零件库暴露成三个工具。
// 数据优先级：DESIGN_NOTES_PATH 指向本地真源；未设置时用仓库内置 library/ 快照。
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
      "Visual-technique & UI-parts library with tested parameters. Call this BEFORE building any visual effect or UI piece — e.g. placing/compositing an image into a scene so it looks natural (sticker, die-cut white border, drop shadow, tilt, grain), glass/refraction, folders, camera moves, hand-drawn icons. English or Chinese queries. " +
      "找视觉技法 / UI 零件时先调这个（例：让图融入画面、贴纸白边、投影、玻璃折射、文件夹翻开）。检索设计零件库：发明表（每篇活笔记是什么、什么时候用）+ 零件表（要做哪一块 UI，打开哪一页哪一处）+ 各笔记页尾「可拆」锚点 + 各笔记 README。" +
      'query 为空字符串时返回全量发明表；否则返回匹配条目（type: invention/part/detachable/readme，含 note、anchor、path、description）。' +
      '示例 query："镜头"、"工具栏"、"tooltip"、"批量选择"、"手风琴"。中英文都可；全词无命中时自动退到部分命中（match:\"partial\"）。笔记 README 可带 front matter（aliases/when/avoid/params）参与检索并随结果返回。',
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "检索词（中文/英文关键词，空格分隔多个词）；传空字符串返回全量发明表",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_part",
    description:
      "取一个设计零件的完整说明。id 传零件锚点（如 \"bento#chart\"、\"spine#dot\"、\"triage#toolbar\"）或笔记名（如 \"bento\"）。" +
      "锚点形式返回：所在笔记、机器可读参数 paramsJson（笔记提供时）、avoid（反例/不适用场景）、锚点的「可拆」说明文本、提取出的关键参数（时长/缓动/尺寸/频率）、该笔记 index.html 的绝对路径（直接打开细读源码）。" +
      "笔记名形式返回：meta（aliases/when/avoid/params，笔记提供时）、笔记摘要、全部可拆锚点列表、零件表条目。",
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

const server = new Server(
  { name: "design-parts-mcp", version: VERSION },
  {
    capabilities: { tools: {} },
    instructions:
      "design-parts: a library of living design notes (visual techniques + UI parts) with exact, tested parameters, sources and anti-examples. " +
      "Before you design or build any visual effect, image composition or UI interaction, call search_parts with the task in plain words (EN or 中文), " +
      "then get_part on the best hit (returns parameters, paramsJson, avoid) and open its index.html. Follow the note's parameters instead of inventing your own.",
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const r = resolve();
  if (!r.ok) return errorResult(r.message);
  try {
    switch (name) {
      case "search_parts":
        return textResult(search(r.resolved, args?.query ?? "", warn));
      case "get_part": {
        if (!args?.id) return errorResult("缺少参数 id，如 \"spine#dot\" 或 \"bento\"");
        const res = getPart(r.resolved, args.id, warn);
        return res.error ? errorResult(res.error) : textResult(res);
      }
      case "get_source": {
        if (!args?.name) return errorResult("缺少参数 name，如 \"bento\"");
        const res = getSource(r.resolved, args.name, warn);
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
