# lotus — 页面底部一整块 canvas 荷塘，鼠标划过水面起涟漪；正文里藏一个点开才出现的像素小岛

来源：https://x.com/nexvyn/status/2111089312674832603 （Nexvyn @nexvyn，2026-10-16，视频 30 s，推文原话 "Tiny Swords game and lotus pond on my portfolio"）。作者在回复里给出作品集 nexvyn.dev，另一条回复说「游戏部分花的时间最多」。

**找到的（事实）**：nexvyn.dev 是 Next.js 站。荷塘是页面最底部一个全宽 `<canvas>`，外层 `relative w-full overflow-hidden h-64 md:h-120`（手机 256 px，≥768 px 时 480 px），1650 宽视口下 canvas 位图 3300×960，即按 2 倍 DPR 画。打包后的 JS 里组件名是 `LotusPond`，接收 `weather`（rain / cloud / cold）和主题（dark 时切夜景），用 `L(42)` 做种子随机，另建 4 块离屏 canvas，读 `prefers-reduced-motion`。涟漪画法在源码里看到一段：`ellipse(x, y, r, r*squash)` 描边，颜色 `rgba(244,247,246,0.6*o)`，弱涟漪中心再点一个 1.2 px 的亮点 `rgba(250,252,251,…)`。

**没找到的**：游戏入口是 GitHub 那行旁边「psst, it's a game」的小图标，我在桌面视口点过但没看到游戏展开，可能需要别的触发方式，所以游戏只按推文标题和这个入口位置复刻。X 视频帧也没截到可用的图（播放器卡死）。荷塘源码只读到开头约 4 KB，后面的花、叶、石头画法是看截图推的。

**推断**：花和叶的形状、颜色、层次是照截图取色重画的；Tiny Swords 是第三方素材包，本页所有像素精灵都是代码里的字符串点阵，自己画的，没有用它的任何素材。人名、文案、项目都是虚构的。

## 量到的数

| 项 | 原作 | 本页 |
|----|------|------|
| 荷塘高度 | 256 px / ≥768 px 时 480 px | 同 |
| canvas 位图 | 3300×960（1650 视口，DPR 2） | `min(2, devicePixelRatio)` |
| 随机种子 | 42 | 42（mulberry32） |
| 水面渐变（截图取样，左侧） | 白 → `#DBE2EC` → `#ADC0CF` → `#7D9FB8` → `#5E839D` | 7 段渐变 `#fff` → `#6E92AB` |
| 粉花 | `#EFA3BD` 左右 | 花瓣尖 `#EAA2BA`，根部 `#F6C5D4` |
| 叶 | `#8BA790` 左右 | 4 个绿 `#7A9A80`–`#91AD94` 轮换 |
| 石头 | `#CCD6E0` | `#DBE3EB`，带白色竖纹 |
| 涟漪颜色 | `rgba(244,247,246,0.6·o)` | 同 |
| 正文列宽 | 480 px | 480 px |

## 怎么做的

1. **一块 canvas，分两层**。水面渐变、水面细光带、远处的小叶和石头只在尺寸变化时画进离屏 canvas；每帧先贴这张图，再画会动的：近处荷叶（上下浮 0.8 px）、浮花、立叶和立花（茎是二次曲线，顶端按 `sin(t·0.6)` 摆）。
2. **假透视**。每个元素有一个深度 d（0 是远处水平线，1 是池塘前沿），y 和大小都由 d 算；荷叶是压扁到 0.36 的圆，切掉一个 0.44 rad 的楔形缺口，再加 9 条叶脉。
3. **白雾收边**。画完所有东西，上沿 30% 再盖一层白到透明的渐变，荷塘没有边框，像从页面里长出来。
4. **涟漪**。指针移动超过 26 px 生成一个弱涟漪（0.55），按下生成强涟漪（1.0）；每个涟漪 3 圈，半径按 `√k` 增长到 46 px，压扁 0.32，1.6 s 消失。点在水平线以上不起涟漪。
5. **滚出视口就停**：IntersectionObserver 关掉 rAF。减少动态时只画一帧静止的，点击时涟漪播完就停。
6. **像素小岛**。逻辑 160×90，CSS 放大 + `image-rendering: pixelated`。骑士、羊、树、入口图标都是字符串点阵 + 调色板。点击让骑士走过去（34 px/s），方向键也能走；羊每 2–5 s 换一个目标；按脚底 y 排序画，前后遮挡是对的。

## 关键判断

1. **花太小太少，看起来像水面散点，不像荷塘。** 第一轮花半径 18–34 px、立花占 55%。对照截图，原作立花大约 60–70 px 宽，是画面主角。改成半径 30–46 px、立花 60%、立茎 15 根，花瓣从尖到根做渐变（饱和粉到浅粉）。验证：`cmp/sbs-pond-round1.png` 和 `sbs-pond-round3.png` 对比，花的面积和原作接近了。
2. **石头被远处小叶盖住、而且像半透明的拱门。** 原因是石头画在远叶之前，形状是对称拱形。改成先画远叶再画石头，轮廓改成左鼓右斜的圆石，裁剪内画白色竖纹；再把落在石头脚印后面的叶和花全部剔掉，否则动态层的叶子会浮在石头上。验证：`cmp/sbs-pond-final.png` 里石头是一整块实心。
3. **400 px 宽时太挤。** 元素数量原来不随宽度变，手机上叶子叠成一片。改成数量乘 `clamp(W/1400, 0.4, 1)`，大小仍按高度缩放。验证：`mine-pond-narrow.png` 里能分清单朵花。

## 诚实的差距

- 原作的花是多层杯状、有明暗体积，本页花瓣是平面渐变，近看偏扁。
- 原作在花下有深色倒影团块，本页只在立茎下画了一条浅竖影。
- 原作有天气（雨、云、冷）和夜间主题，本页没做。
- 游戏的真实样子没看到，小岛是按「Tiny Swords 风格的小场景」自己设计的，玩法只有走路。
- 原作左下角那颗莲蓬、半开的花苞没做。

## API 和 CONFIG

```js
const pond = createLotusPond(container, { seed: 42, sway: 0.9, ripple: { life: 1.6, maxR: 46, squash: 0.32, moveSpacing: 26 } });
pond.ripple(x, y, size);   // 手动起一个涟漪
pond.destroy();

const island = createPixelIsland(container, { knightSpeed: 34, sheep: 3 });
island.start(); island.stop(); island.moveTo(x, y); island.destroy();
```

`CONFIG.pond` 里可以改：水面渐变 `water`、荷叶颜色 `padColors`、三种花的颜色和权重 `flowerKinds`、各层数量 `farPads / nearPads / standing / floating`、石头 `rock`、摆动幅度 `sway`、涟漪 `ripple`。`CONFIG.island` 改小岛的尺寸、配色、骑士速度和羊的数量；精灵点阵在 `SPRITES`，颜色在 `PAL`。
