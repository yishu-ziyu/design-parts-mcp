# design-parts-mcp · Agent 使用入口

## 何时读取

需要检索设计零件、交互动效、活笔记、机制参数或来源时使用。先读本文件，再读 [README.md](README.md)。按需读返回的 HTML 与来源记录，不批量注入整库。

## 位置与启动

当前项目：`/Users/mahaoxuan/Desktop/AI工作资料/AI组件工作流库/components/design-parts-mcp`。

需要 Node.js 22 或以上。此次整体迁移保留了源码、Git 历史和已安装的 `node_modules`，无需重新安装依赖。

本地 stdio 启动命令：

```sh
node "/Users/mahaoxuan/Desktop/AI工作资料/AI组件工作流库/components/design-parts-mcp/server/index.js"
```

MCP 客户端应使用 `command: "node"`，`args` 为上面的 `server/index.js` 绝对路径。登记入库不等于启用连接；只有明确接入任务时才修改客户端配置。

## 数据源

- 不设置 `DESIGN_NOTES_PATH`：读取项目内 `library/` 快照。
- 使用本机活资料：设置 `DESIGN_NOTES_PATH=/Users/mahaoxuan/Desktop/AI工作资料/Design note`。
- 环境变量必须指向包含 `living/` 的根目录，不能指向 `living/` 本身。索引为 `living/INDEX.md`，笔记为 `living/<name>/index.html`。
- 不为迁移运行 `npm run sync`；该命令会改写内置快照。

## 使用步骤

1. 调用 `search_parts({"query":"镜头"})` 搜索机制；空字符串返回发明表。
2. 调用 `get_part({"id":"spine#dot"})` 读取说明、参数和 HTML 绝对路径。传笔记名，例如 `bento`，可列出全部可拆锚点。
3. 调用 `get_source({"name":"bento"})` 读取 README 与来源 URL。
4. 打开返回的 HTML，检查真实交互，再决定复用哪些机制与参数。

## 边界与错误

这是本地文件读取服务，不提供模型或托管服务。索引死链会被跳过，并写入 stderr 警告。未知笔记、缺少参数和不可用数据目录会返回 `isError`。检索结果不代表原网页仍在线，也不代表目标产品已完成视觉验收。

只复用所需机制与参数。不要照搬来源品牌、文案、签名图或专有插画；保留来源说明。不自动安装依赖、启用 MCP、同步资料、提交或推送。

## 迁移验收 · 2026-10-07

整体同卷重命名后，5207 个原有目录、文件与符号链接的元数据保持一致；普通文件 SHA-256 一致，旧路径已不存在。源码与依赖未改写。

真实子进程 stdio JSON-RPC 验收：默认快照 **20/20**，本机活资料 **20/20**，共 **40/40**。覆盖初始化、三个工具的列表与 schema、搜索、零件参数、绝对路径、来源和未知笔记错误。

当时 `scripts/test.mjs` 的外部资料路径固定为 `~/Documents/design-notes`，验收用了临时测试副本；现在可用环境变量指定，见下方「接入现状」。

## 接入现状 · 2026-11-05

已接入 Claude Code 用户级配置，读本机活资料；配套使用规则在 `~/.claude/skills/design-parts/SKILL.md`。Codex 和 Cursor 未接入。回滚：`claude mcp remove design-parts -s user`，并删除该 skill 目录。

`search_parts` 命中任一词即返回，按命中多少排序，多词查询最多 20 条；`matched` 是该条命中的词，`unmatched` 是整库都没命中的词。没有同义词扩展，库以中文为主，英文长句命中少。

测试：`DESIGN_NOTES_PATH=<活资料根目录> npm test`，不传时第二条数据路径仍指向已不存在的 `~/Documents/design-notes`。
