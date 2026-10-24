# diagrams — 打一行 Mermaid 风格文本，就重画一次 SVG：流程图、桑基图、柱状图共用一套暖白配色

来源：https://x.com/kepano/status/2111472054293913749 （kepano，Obsidian CEO，推文视频 23.4 s，竖屏）。推文介绍的是 Pele：一个把 Mermaid 文本渲染成 SVG 的库，同步、零依赖、颜色和字体全走 CSS 变量。源码公开在 github.com/obsidianmd/pele（MIT），文档和 playground 在 pele.run。下面的配色、内边距、层距、箭头、桑基参数都是直接从源码读的（`src/svg/theme.ts`、`src/svg/shapes.ts`、`src/svg/edges.ts`、`src/diagrams/flowchart/render.ts`、`src/diagrams/sankey/render.ts`、`website/src/lib/video-themes.ts`）。视频本身用的是 Flexoki 暖白主题（`website/video/render.mjs` 里写死的那组颜色），一边逐字打 Mermaid 文本，一边整张重画。推文里的视频和仓库 `video-story.ts` 里的场景不完全一样（推文是光合作用流程图和能源桑基图），所以视频里每一帧的打字节奏是我从截帧推的，不是读出来的。布局算法我没有照搬（Pele 的分层布局有上千行），这里是一个简化版。

## 量到的数

| 项 | 值 | 出处 |
|----|----|------|
| 背景 / 前景 / 灰字 | `#fffcf0` / `#100f0f` / `#6f6e69` | render.mjs、video-themes.ts |
| 节点底色 / 描边 | `#f2f0e5` / `#cecdc3`，1px | 同上；flowchart/render.ts `SHAPE_ATTRS` |
| 节点内边距 | 左右 18，上下 12；圆角 6（视频主题） | shapes.ts `PAD_X/PAD_Y`；render.mjs `--pele-radius` |
| 流程图层距 / 同层间距 | 48 / 40 | flowchart/render.ts `RANK_SEP/NODE_SEP` |
| 箭头 | 长 8，半宽 8×0.42，实心三角 | edges.ts `ARROW`、`marker()` |
| 字号 | 正文 16，桑基标签 16×0.875=14 | flowchart/sankey render.ts |
| 桑基 | 条宽 10、圆角 2、间距 12+15、连线透明度 0.4、源→目标线性渐变 | sankey/render.ts |
| 8 个系列色 | `#af3029 #bc5215 #ad8301 #66800b #24837b #205ea6 #5e409d #a02f6f` | video-themes.ts `paper` |
| 打字光标 | `#da702c`，宽 3（视频坐标） | render.mjs |

## 怎么做的

1. 每种图一个函数：`renderFlow`、`renderSankey`、`renderBars`，输入文本，输出 SVG 字符串。第一行的关键字决定用哪个。
2. 文字宽度用 canvas `measureText` 量，节点大小 = 文字宽 + 2×18，高 = 行数×行高 + 2×12。
3. 流程图分层：从第一个节点出发给每条边的终点排层，指向更早出现节点的边当回边，画在右侧绕回来。同层节点水平居中，层之间 48，有边标签的层多留一行。
4. 桑基：按深度分列，每列按总值缩放到同一高度，节点之间留 12+15。连线是两条三次贝塞尔围成的带子，中点做控制点，填充用 `userSpaceOnUse` 的线性渐变。
5. 打字动画：每过 38 ms 多显示一个字（换行停 260 ms），每次都把当前文本整张重画；解析不了的半截行直接跳过，所以图跟着字长出来。一个场景打完停 2.6 s 换下一个。
6. `prefers-reduced-motion: reduce` 时不打字，直接显示完整文本和图。

## 关键判断

- **问题**：第一版 SVG 按自身像素宽度显示，在 1100 宽的屏上图只有原视频一半大，节点字看着很小。**改**：SVG 改成 `width:100%; height:auto`，再用 `max-height` 和 `maxScale 2` 卡住（只有一个节点时不至于撑满整屏，视频导出脚本也有放大上限），让图按容器放大，和视频里“图撑满下半屏”一致。**验证**：Playwright 在 1100×700 和 400 宽各截一张，和原视频截帧并排看（cmp/flow-r2.png）。
- **问题**：Pele 的分层布局很重，整套照搬放不进一个单文件。**改**：只保留它的数（层距、间距、内边距、箭头），排层换成最简单的最长路径 + 回边绕右侧。**验证**：自带三个例子（含一条回边）都不重叠，400 宽下也不出横向滚动。
- **问题**：桑基标签压在连线上会糊。**改**：照 Pele 的做法给标签描一圈 3px 背景色（这里用 `paint-order: stroke` 一个 text 解决，Pele 是叠两个 text）。**验证**：截图里 Reservoir 100 在渐变带上能读清。

## 没做到的

- 只支持三种图和很小的语法子集：流程图只认 `A[..]`、`A{..}`、`-->`、`-->|..|`，标签只认 `<b>` 和 `<br>`，不支持 `<sub>`、子图、LR 方向。
- 流程图布局是简化版：同层多节点时不做交叉最小化，回边只会走右侧。
- 原视频里柱状图的柱子会长高（仓库有 `video-chart-motion.ts`），这里没做，柱子是跳变的；场景切换时的手机收起和 logo 动画也没做（那是品牌部分，本来就不该抄）。
- 视频里代码字体是 Paper Mono，这里用系统等宽字体；正文字体用系统无衬线（Pele 视频导出用的是 Arial）。

## API 和 CONFIG

```js
const d = createDiagrams(rootElement, { /* 覆盖 CONFIG 的任意字段 */ });
d.render('sankey\n  A,B,10')  // 只返回 SVG 字符串，不动页面
d.play(1)                      // 跳到第 2 个场景重新打字
d.destroy()                    // 停计时器，清空 #code 和 #view，移除按钮
```

`rootElement` 里要有 `#code`、`#view`、`#tabs` 三个元素。

CONFIG（在 index.html 顶部）：

- `theme`：背景、前景、灰字、节点底色、描边、8 个系列色。
- `maxScale`：图最多放大到自身尺寸的 2 倍，免得只有一个节点时撑满整屏。
- `font`：正文 16、小字 14、字体栈。
- `flow`：`padX 18`、`padY 12`、`radius 6`、`rankSep 48`、`nodeSep 40`、`arrow 8`。
- `sankey`：`nodeWidth 10`、`nodePadding 12`、`valueGap 15`、`linkOpacity 0.4`、画布宽高。
- `bars`：画布宽高、柱宽占格比例 0.7、纵轴刻度数 5。
- `typing`：每字 38 ms、换行停 260 ms、打完停 2600 ms。
- `scenes`：要轮播的文本，第一行写图的类型。
