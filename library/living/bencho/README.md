# bencho — 四个会回应手的小组件：点阵立方体、纵深卡堆、会收起的签名板、黏球

来源：https://x.com/cabralorenzo/status/2111478858478465421 （Lorenzo Cabra，推文主题是「让 Claude 的 UI 品味更好」）；推文指向的站点 https://bencho.dev ，一个约 137 个可交互 React UI 组件的库，按 Hover / Press / Drag / Slide / Swipe / Type / Select / Loading 分类。下面的尺寸、圆角、阴影、过渡曲线、SVG 滤镜参数都是在 bencho.dev 的组件详情页（`/blocks/ascii-wake`、`/blocks/card-swap`、`/blocks/signature`、`/blocks/drag-ball`）用 `getComputedStyle` 和 DOM 读出来的，是事实。组件运行时的弹簧系数、签名停笔多久收起、立方体的转速和光照这些没有暴露在 CSS 里，是按录屏和控制面板上的数值推断的。原站组件在一个 `.dtl-scale` 容器里统一放大 1.25 倍显示，表里的尺寸已经除掉这 1.25。卡片图片、标签文字、页面文案都是自己写的，卡面用 CSS 渐变代替原站照片。

## 这一页是什么

- 顶部一句标题、一句说明，一排筛选胶囊（All / Hover / Press / Drag），下面 2×2 的灰底格子，窄屏变一列。
- 每格一个组件，按自己的「自然尺寸」写死，再整体缩放进格子（和原站 `.dtl-scale` 的做法一样）。
- 往下是「可拆」。

## 实测数字

| 组件 | 项 | 值 |
|------|----|----|
| 页面 | 字体 | Inter 系（本页用系统字体回退，没有内嵌） |
| 页面 | 格子底色 / 圆角 | `rgba(23, 24, 26, 0.06)` / 28px |
| 页面 | 墨色 | `#17181a`（rgb 23 24 26） |
| 页面 | 筛选胶囊 | 高 32px，圆角 999px，底 `rgba(23,24,26,.06)`，字 `#3c3b37`，`background-color 0.16s, color 0.16s` |
| ASCII wake | 画布 | 360×240，canvas 绘制 |
| ASCII wake | 面板参数 | Reach 60、Trail 1.2s、Pull 40、Size 10px，字形可选 `#` / 方格 / 点 / 混合 |
| Card swap | 卡 | 196×266，白底，圆角 20px，内边 3px，图圆角 17px，阴影 `0 0 0 1px rgba(23,24,26,.12)` |
| Card swap | 景深 | 舞台 `perspective: 1000px`；每往后一张 `translate3d(34px, -26px, -70px)`；所有卡 `skewY(6deg)`（矩阵里 0.105104 = tan 6°） |
| Card swap | 过渡 | `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)`；自动轮换默认关，间隔 4.0s |
| Card swap | 标签 | 白底胶囊，13px / 500，`padding 6px 12px`，左 14px 下 14px |
| Signature | 板 | 300×180，白底，圆角 20px，宽高 `0.6s cubic-bezier(0.22, 1, 0.36, 1)` |
| Signature | 签名线 / 提示 | 线 244×1，左 28px、顶 128px，墨色；提示 12px，居中，在线下方 |
| Signature | 墨 | `stroke-width: 3px`；签完后墨色 0.26s 变为 `rgb(185,186,186)` 左右 |
| Signature | 收起态 | 140×50 屏幕像素 ≈ 112×40，「✓ Signed」；`.sig-face` 的 `scale 0.6s` + `opacity 0.42s 0.16s` |
| Signature | Clear | 圆角 10px，`padding 0 12px`，12px 字，底 `rgba(23,24,26,.07)`，`opacity 0.16s` |
| Drag ball | 球 | 白色 `rect rx=半径`；面板 Size 58px（屏幕实测 70px ÷ 1.25 = 56） |
| Drag ball | goo 滤镜 | `feGaussianBlur 4.5` → `feColorMatrix` alpha 行 `0 0 0 16 -6.17` → `feComposite operator=atop` |
| Drag ball | 面板参数 | Stretch 36、Give 50、Grip 50 |

## 怎么做的

- **点阵立方体**：画布按 5.5px 一格铺点。每帧对每个格心沿视线做一次正交射线和立方体求交（slab 法），打中哪一面就用那一面的明暗定点的半径；没打中不画。指针 60px 内的格子记一个「热度」，热的格子画字符而不是点，热度按 1.2s 线性冷却，所以指针走过去会留一条字符尾巴。按下时放一圈向外扩的环，环经过的格子也被加热。Pull 让热格子朝指针挪一点。
- **纵深卡堆**：四张卡叠在一个 `preserve-3d` 舞台里，第 i 张的位置就是 `translate3d(34i, -26i, -70i) skewY(6deg)`。点一下前卡，数组轮转一位，其余卡靠 CSS 过渡往前走一格；前卡用 WAAPI 先甩到侧面再落到最后，避免直接穿过别的卡。拖动前卡超过 40px 也算一次甩出。
- **签名板**：SVG 里每段笔画是一条 `line`，线宽按指针速度在 1.6–3.4 之间插值，所以快写变细。松手后 1.1s 没再落笔，板子加 `.signed`：宽高过渡到 112×40 胶囊，签名面缩小淡出，墨色变灰，「✓ Signed」淡入。点胶囊回到板子，笔画按 110ms 一笔倒着删掉。
- **黏球**：SVG 里两个白椭圆（主球和一个小尾球）放进同一个 goo 滤镜组。主球是弹簧跟手，速度越大越沿运动方向拉长（上限 36%），抓住时弹簧把尺寸推到 1.12 倍；尾球用更软的弹簧追主球，两者距离近时被滤镜粘成一团，拉开时像拉丝。

## 两个关键判断

1. **按自然尺寸写死，再整体缩放进格子。** 原站每个组件都放在一个 `transform: scale(1.25)` 的容器里，组件内部数字（196×266 卡、300×180 板）是固定的。我照这个做：组件内部全部用原站数字，外面一个 `fitInto` 按格子大小缩放。这样 400px 窄屏下比例不变、不出现横向滚动，代价是窄屏上细节会变小。验证：Playwright 在 1100×700 和 400 宽下 `scrollWidth == innerWidth`。
2. **黏球的「黏」来自滤镜，不是形变动画。** 只拉长一个椭圆看起来像橡皮，不像软泥。原站的 goo 滤镜参数（模糊 4.5、alpha ×16 −6.17）意味着两个靠近的形状会被融成一块，所以我加了一个追尾的小球，让滤镜真的有东西可粘。验证：拖动中截图能看到主球和尾球之间的颈部（`cmp/4-dragball.png`）。

## 和原作的差距

- 点阵立方体只是按面明暗画点径，原站的点在面与面之间过渡更柔、轮廓更圆，像带透视的立方体；字符尾巴的字形切换节奏也是猜的。
- 签名板停笔多久收起、倒带速度、速度到线宽的映射都是推断值；原站每笔可能是一条变宽 path，不是多段 line。
- 卡片用渐变代替照片；原站甩卡的中间轨迹没有逐帧量过。
- 球的弹簧系数（Give / Grip 对应的物理量）是按手感调的，没有读到源码。
- 没有做原站的声音、主题切换（Light / Dark）和右侧参数面板。

## API

```js
createDotCube(container, { cell, half, reach, trail, pull, spin })  // → { el, destroy }
createCardSwap(container, { cards: [{ tag, art }], step, skew, ms, flick, auto })  // → { el, next, destroy }
createSignaturePad(container, { idle, rewindStep, minW, maxW, hint, clear, done })  // → { el, clear, destroy }
createDragBall(container, { size, stretch, give, grip, swell, blur })  // → { el, destroy }
```

所有默认值在页面顶部的 `CONFIG` 里。容器需要有确定的宽高（组件会缩放进去）。`prefers-reduced-motion` 下：立方体不自转、卡片和签名板的过渡缩到 0.01s、球不拉长。

## 可拆

| 锚点 | 是什么 |
|------|--------|
| [`#dotcube`](index.html#dotcube) | 点阵立方体 + 指针字符尾巴 + 按下放环 |
| [`#cardswap`](index.html#cardswap) | 纵深卡堆，点或甩前卡送到最后 |
| [`#signature`](index.html#signature) | 签名板，停笔后收成「Signed」胶囊，点回来倒带清除 |
| [`#dragball`](index.html#dragball) | goo 滤镜黏球，抓住鼓起、甩动拉长、尾球追上 |
