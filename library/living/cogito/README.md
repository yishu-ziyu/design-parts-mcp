# cogito — 源码与预览同一窗口

来源：[cogito.md](https://cogito.md/)，2026-09-14 从计算样式测量。原站是 macOS 原生 Markdown 编辑器落地页。本页只收录第一屏：标题与正文同号，源码视图与预览视图叠在同一窗口。Writing、Navigation 等后续功能段不收录。

打开 [index.html](index.html)。

## 机制逐条

- **背景**：`#fdfcfb`。正文字体为 SF Pro Text / 系统 UI。
- **标题 `#copy`**：`.typo-heading` 为 **16px / 28px / 700 / `#0a0a0a`**，栏宽 **630px**。读音行同号；`Cogito (beta).` 字重 700，`koh-gee-toh` 斜体。正文同号、字重 400、颜色 `#5c5c5c`。
- **强调色**：标题中 `(and your agents’)` 使用不换行空格，颜色 `--accent-vivid #d9621a`。全屏唯一 accent。
- **图标**：桌面 `sm:size-22` = **88px**，窄屏 72px。`drop-shadow-2xl` = `0 25px 25px #00000026`。图像为 `app-icon-light.png`。
- **分段控件 `#swap`**：145 × 26，内边距 3px，12px Medium。白滑块 `200ms cubic-bezier(0, 0, .2, 1)`。选中 `#0a0a0a`，未选中 `#858585`。
- **叠层窗口**：`hero-source-light.png` / `hero-preview-light.png`，原文件 **2212 × 1746**。未选中层为 `absolute inset-0 opacity-0`，图片无淡入。
- **裁切**：显示框 `padding-bottom: 64.5%`。1495 视口下窗宽 872px（`48rem` + `sm:-mx-13`）。底边 1px `linear-gradient` 使用 `--rule-strong`。

## 可学 / 不学 / 启示

- **可学**：落地页标题可以与正文同号，层级靠字重和灰色。产品界面作为第一屏证据时，源码与预览叠在同一窗口。过渡只作用在状态控件上。
- **不学**：不要把后续六段功能说明一并搬入。不要把 §41 工具台 14px 封顶套到这一页——原站标题是 16px。不要给图片加淡入。
- **启示**：Source 与 Preview 是同一文件的两种视图，不是主题切换。窗口裁去下沿，表示产品内容比第一屏更深。
