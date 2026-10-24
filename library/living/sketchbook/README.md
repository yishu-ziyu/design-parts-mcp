# sketchbook — 一本能拖着翻页的速写本：WebGL 页面按圆柱弯曲，弹簧松手，左侧刻度跳页

来源：https://x.com/jeanxcrj/status/2111508243096969596 （Jean Chen @jeanxcrj，2026-10-18，"This is an invitation for you to flip through my sketchbooks"）。推文里的链接是 live 站 https://jeanxcrj.com/play.html ，在首屏点任意一本歪放的速写本，会打开一个全白的查看器，就是视频里那一段。作者在回复里只说了一句做法来源："Sketchbook carousel inspired by @elissafied"，没有讲实现，没有 repo 或 CodePen。

下面分事实和推断：
- 事实（读 live 站 `sketchbook.js` 打包文件，1.23 MB）：里面有 three.js（`PlaneGeometry`、`WebGLRenderer`）和一个配置对象，原文数字是 `pageWidth 1, pageHeight 1.01, segments 28, curlPeak 1.15, flipWeight 1.6, camera fov 48 / distance 3.7, spring stiffness 55 / damping 18 / mass 1.2, drag completeThreshold 0.5 / flickVelocity 1.4, maxWidth 920, aspectRatio 2.05, shadowIntensity 0.35`（本页投影最后用 0.22，见关键判断）。翻页的顶点着色器原文：`transformed.x = sin(x·k)/k; transformed.z = z + curlDir·(1 − cos(x·k))/k`，正反面用弯曲后的法线算，注释写明不用 `gl_FrontFacing` 是因为在部分 GPU（Metal/ANGLE）上弯曲网格会把白色背面透出来。每帧：`rotation.y = −π·r`，`uCurl = curlPeak·sin(πt)`，`position.z = 0.004 + 0.02·sin(πt)`。
- 事实（在 Chrome 里 1650×936 视口量 DOM 和截图）：版式、字号、颜色见下表。
- 推断：`r` 由 `t` 和 `flipWeight` 算出，那一行在打包里被截断没读全，我用 `tᵂ/(tᵂ+(1−t)ᵂ)`（两头慢中间快，W=1.6）。整站是 React + react-three-fiber + 一个 spring 动画库，从打包里的 `react.portal`、`<mesh>` JSX、`stiffness/damping/restSpeed` 这些键推出来，没有确认版本。
- 事实（推文视频 1920×1144、32.1 s，逐帧画进 canvas 截图）：18.2–18.6 s 是一次翻页，翻起的页外缘先朝镜头抬起、上下沿都超出书本；页面本身几乎不变暗。打包里页面材质是 `new X({ map, alphaTest: .5 })`，没有光照参数，推断是不受光的 basic 材质。
- 没拿到：live 站翻到正中（t≈0.5）的那一帧。点击翻页约 1 秒停稳，截图赶不上；放慢 `requestAnimationFrame` 的办法让画面冻住了。视频里能对上的只有起翻阶段。

## 量到的数

| 项 | 原站 | 本页 |
|----|------|------|
| 跨页尺寸 | 1650 宽视口下 793×396，水平垂直都居中 | `min(920, 48vw)`，手机 `100vw − 32`；单页 1 : 1.01 |
| 页面网格 | 28 列，曲率峰值 1.15，权重 1.6 | 同 |
| 相机 | fov 48°，距离 3.7 | fov 48°，距离按画布高反算，让书高等于 CSS 里的书高 |
| 松手 | 过半或甩速 > 1.4 → 翻过去；弹簧 55 / 18 / 1.2 | 同（甩速单位：书宽/秒） |
| 圆角 | 只有外侧两角，约页宽 5% | 同，书脊一侧直角 |
| 说明文字 | 书下 49px；地点 14px 大写 字距 0.56px `#0e0e0e`；日期 14px `#62625f`；备注 15px | 书下 48px，同字号颜色；字体换成系统 Helvetica Neue |
| 左侧刻度 | x = 106px，13×2，间距 11px，`#d2cfda`；当前约 19px 深色 | 同；每个跨页一根 |
| 橡皮筋 | 紫灰 rgb(80,66,89)–rgb(133,111,149)，书高 27%–73% | `#75688f` 主色 + 暗边 + 亮边，同位置 |
| 底色 | `#ffffff` | 同 |

## 怎么做的

1. 每一页是一条 29×2 顶点的平面网格，x 从书脊 0 到外缘 1。顶点着色器先把 x 弯到半径 1/k 的圆柱上，再绕书脊（y 轴）转 `−π·r`，最后整体抬高一点避免和下面的页打架。
2. 翻页时画三张：左边静止页、右边静止页（下一跨页的右页）、正在翻的那张。翻的那张正面贴本跨页右页、背面贴下一跨页左页，背面采样时 u 取反。
3. 光照只有一项：`mix(0.8, 1, |法线.z|)`，页面立起来时自然变暗，弯曲处有明暗过渡。静止页上的投影随 `sin(πt)` 变深，从翻页边缘往外指数衰减。
4. 手势：右半页按下往左拖是向后翻，左半页往右拖是向前翻；进度 = 拖动距离 / 书宽。只点不拖就翻一页。方向键也能翻。点刻度时一页一页连续翻到目标，连续翻的那几页用 3 倍刚度的弹簧，不然跳 5 页要等好几秒。
5. 页面内容全部是 Canvas 2D 现画的：抖动的铅笔线（2 遍不同透明度）、排线、multiply 叠的水彩色块、手写体标注，外加纸纹噪点和书脊阴影。纹理按需生成并缓存。

## 关键判断

- **问题**：第一版按法线给翻起的页加了 0.8–1.0 的明暗，再叠 0.35 的投影，和视频 18.45 s 一帧并排，我的页明显发灰，原图翻起的页和平放时一样亮。**改**：明暗收到 0.94–1.0，投影峰值降到 0.22。**验证**：03-early-turn 并排图，两边翻起的页亮度一致，只在弯曲处有一点过渡。
- **问题**：一开始的铅笔线 1.6 单位粗、两遍都很实，和原站扫描进来的细铅笔比，整页发黑发硬。**改**：线宽乘 0.62，第二遍透明度降到 0.35；椭圆从逐点随机抖动改成低频正弦起伏。**验证**：01-rest-spread 并排图，线的灰度和原图接近，不再有锯齿。
- **问题**：画布要比书大，翻起的页会朝镜头抬起、透视放大约 1.4 倍，画布不够大就被切掉。**改**：画布 1.3 倍书宽、2.4 倍书高，居中叠在书上，`pointer-events: none`，手势挂在书本身的 div 上；相机距离用画布高和书高反算。**验证**：Playwright 在 t = 0.25 / 0.5 / 0.75 截图，翻起的页完整，1650 和 400 宽都没有横向滚动。

## 没做到的

- 原站首屏那一堆歪放的书 + 紫色纸片拼贴、点开时书从首屏飞到中间的过渡、封面合上/打开（`closedAspectRatio 1`、`backCover holdMs 750 / fadeMs 850`）、线圈装订版本（`coil` 配置），都没做。本页一打开就是摊开的跨页。
- 翻页中段没有和原站逐帧对过（见上）。
- 字体：原站是 Milling / Milling Simplex（商业字体），本页用系统 Helvetica Neue / Arial。
- 原站刻度比跨页数多（大约 22 根），本页一跨页一根。
- "All books" 和关闭按钮只是样子，没有接功能。

## API / CONFIG

页面顶部 `window.CONFIG`：`book` 里是上表的全部参数，`spreads` 是跨页列表，每项 `{ place, date, note, left: {draw, …}, right: {draw, …} }`。`draw` 可选 `title / plant / window / teapot / bike / hills / fruit / studies / notes`，`paper` 可单独改纸色。

```js
const book = createSketchbook(rootEl, { ...CONFIG.book, spreads: CONFIG.spreads });
book.next(); book.prev(); book.jump(3);
book.index;                 // 当前跨页
book.setProgress(0.5, 1);   // 把下一页停在翻到一半（截图、调参用）
book.destroy();
```

`rootEl` 里需要 `[data-sb-stage]`（内含 `canvas`、`[data-sb-shadow]`、`[data-sb-band]`）、`[data-sb-caption]`、`[data-sb-loc]`、`[data-sb-date]`、`[data-sb-note]`、`[data-sb-dial]`，结构照 `index.html` 抄。`prefers-reduced-motion: reduce` 时不播翻页动画、不响应拖动，点击和方向键直接换页。没有 WebGL 时显示一行提示。
