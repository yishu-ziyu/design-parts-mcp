# design-parts-mcp

把一个「设计零件库」暴露成本地 stdio MCP server：AI 编码工具（Claude Desktop / Cursor / Codex / Trae 等）可以直接检索并取用可打开、可复刻的交互与动效零件。库里每篇笔记是一个自包含的 `index.html` 活笔记——零件能学能搬，先打开看它正在转的样子。

默认内置一份可分享快照（`library/`）；如果你本地有自己的 design-notes 库，用 `DESIGN_NOTES_PATH` 指过去即可，server 会直接读真源。

## 三个工具

| 工具 | 入参 | 返回 |
|------|------|------|
| `search_parts` | `query`（必填，空字符串 = 全量发明表） | 匹配条目：发明表（这页是什么、什么时候用）、零件表（要做哪一块打开哪一页哪一处）、页尾「可拆」锚点、README 命中行；每条含 `type` / `note` / `anchor` / `path` / `description` |
| `get_part` | `id`（必填，如 `"bento#chart"`、`"spine#dot"` 或笔记名 `"bento"`） | 所在笔记、锚点的「可拆」说明、提取出的关键参数（时长/缓动/尺寸/频率）、该笔记 `index.html` 的绝对路径（直接打开细读源码）；笔记名形式返回全部可拆锚点列表 |
| `get_source` | `name`（必填，如 `"bento"`） | 该笔记 README 全文（来源 URL、原版机制逐条记录、可学/不学/启示）+ 提取出的来源 URL 列表 |

## 接入

### Claude Desktop

`claude_desktop_config.json`（菜单 → Settings → Developer → Edit Config）：

```json
{
  "mcpServers": {
    "design-parts": {
      "command": "npx",
      "args": ["-y", "github:yishu-ziyu/design-parts-mcp"],
      "env": {
        "DESIGN_NOTES_PATH": "/path/to/your/design-notes"
      }
    }
  }
}
```

### Cursor / Codex / 其它 MCP 客户端

`mcp.json`：

```json
{
  "mcpServers": {
    "design-parts": {
      "command": "npx",
      "args": ["-y", "github:yishu-ziyu/design-parts-mcp"],
      "env": {
        "DESIGN_NOTES_PATH": "/path/to/your/design-notes"
      }
    }
  }
}
```

本地 clone 运行时把 `args` 换成：`["node", "/path/to/design-parts-mcp/server/index.js"]`。

### DESIGN_NOTES_PATH

- **未设置**：用仓库内置 `library/` 快照（开箱即用）。
- **设置后**：指向你的 design-notes 库根目录（其下有 `living/INDEX.md` 与 `living/<name>/index.html`），直接读真源，改动即时生效。

## 用自己的库

库结构约定：

```
design-notes/
  living/
    INDEX.md          # 检索入口：## 发明 表 + ## 零件 表
    <name>/
      index.html      # 自包含活笔记；页尾可有 <h3>可拆</h3> + <dl>（#anchor → 参数说明）
      README.md       # 可选：来源 URL、机制记录、可学/不学
```

INDEX.md 表格行里的链接指向 `living/<name>/index.html#anchor`；死链行会被自动剔除并打 stderr 警告，不会挡住其余检索。

## 贡献零件

欢迎把自己复刻的活笔记按上面的结构加进你的库；要合入本仓库内置快照，提 PR 前：

1. `npm run sync`（从 `DESIGN_NOTES_PATH` 刷新 `library/`，默认 `~/Documents/design-notes`）；
2. 新笔记要有 `index.html`（页尾写「可拆」锚点段）和 README（来源 URL + 机制记录）；
3. `npm test` 全绿（真实 stdio 协议测试，快照与真源两条路径各跑一遍）；
4. README/快照里不得含本地绝对路径、真名、私有仓库名（sync 会自动清洗，洗不净的会跳过并警告）。

## 使用纪律

零件可以学、可以搬进你自己的实现，但：

- **不要原样照抄他人 UI**。零件是「机制 + 参数」，不是成品皮：文案、品牌、配色、内容换成你自己的。
- **不要冒用来源作品**。每个零件的 README 记录了来源 URL 与机制考据，引用时注明出处；来源作者的风格签名（logo、签名图、专有插画）一律不抄。
- 产品落地时**先打开活笔记看它正在转的样子**，再决定要不要这一块——截图只看得到三分之一。
