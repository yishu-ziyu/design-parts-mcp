# orbitshelf — 一圈抠图物品绕着标题慢慢转，远处变小、变淡、变糊

来源：https://x.com/Tanjim38/status/2112964568616169890 （Tanjim @Tanjim38，Gr8r Studio 创始人，2026-10-22，视频 21.7 s）。推文正文给了 demo 链接 https://knowspace.si ，这是公开站点，下面的数字都是在 Chrome 里打开它、读计算后样式和每帧写进元素的 inline transform 量出来的（视口 1650×992）。作者没有讲做法，只说是 Claude 加一个资深产品设计工程师做的；仓库没有找到（作者另一个开源项目是任务管理，不是这个）。椭圆半径、转速、深度映射公式是从 14 个元素同一时刻的 transform 和隔 1.1 s 两次采样拟合出来的，拟合误差小于 0.001 px，算事实；窄屏下怎么缩放没量到，是推断。推文视频主要演示进入后的无限画布（散落的知识卡片），这一页只复刻落地页首屏的转盘。

调性一句话：浅暖白底上一圈博物馆式的小物件，靠缩放、透明度、模糊三件事做出景深，没有一行 3D 变换。

## 实测数字（1650×992）

| 项 | 值 |
|----|----|
| 物品数 | 14，等分 2π/14 |
| 椭圆 | rx 600 px，ry 322 px；圆心在视口 50% / 50% − 14px |
| 转速 | 4.33°/s，约 83 s 一圈；顺序：前排往左走 |
| 深度 | `d = cos θ`（前 = 1，后 = −1） |
| 缩放 | `0.85 + 0.23d`（前 1.08，后 0.62） |
| 不透明度 | `0.75 + 0.25d`（后排 0.5） |
| 层级 | `round(50 + 50d)` |
| 模糊 | 约 `2.48 × (−d − 0.295)` px，后排最多 1.74 px |
| 旋转 | 横坐标 / 100 度（最外侧约 ±5.9°） |
| 物品盒 | 168 px × `--sw` / `--sh`（每件按自身长宽比 0.67–1.27），图 `object-fit: contain`，`drop-shadow(0 18px 24px rgba(30,28,22,.1))` |
| 边缘雾 | 一层 `backdrop-filter: blur(14px) saturate(1.05)`，径向遮罩 64% 透明 → 80% 0.55 → 100% 全遮 |
| 底色 | `#f8f8f6` 上叠 `radial-gradient(700px 420px at 50% 50%, #fff, #fff0 70%)` 和 `radial-gradient(1400px 900px at 50% -20%, #ffffffe6, #fff0 70%)` |
| 标题 | Newsreader Variable 360，73.6 px，行高 0.98，字距 −0.035em，`#141413` |
| 副标题 | Geist Variable 400，20/29 px，字距 −0.2 px，`#5f5e59` |
| 品牌字 | Geist 660，26 px，字距 −0.035em，logo 和字间距 12 px |
| 按钮 | 高 48，左右 22，15 px / 560，全圆角，`#141413`，阴影 `0 1px 2px rgba(20,20,19,.18), 0 6px 16px -6px rgba(20,20,19,.4)`，按下 `scale(.97)` |
| 入场 | 品牌字 0.6 s、延迟 0.85 s；标题 / 副标题 / 按钮 0.8 s、延迟 1 s；都是上浮 10 px 淡入，`cubic-bezier(.22,1,.36,1)` |

## 怎么做的

- 转盘容器是一个 0×0 的点，放在视口中心；每件物品 `position:absolute`，每帧写 `translate(x, y) translate(-50%,-50%) scale(s) rotate(r)`。
- 一个相位 `phase` 随时间减小，第 i 件的角度是 `phase − i·2π/14`；`x = rx·sin`，`y = ry·cos`，`d = cos` 同时决定大小、透明度、层级和模糊。前排（d≈1）在下方、最大最清楚，后排在上方、小而淡。
- 边缘那层模糊不是给每件物品单独加的，而是一整层 backdrop-filter 盖在转盘上，中间挖空。所以靠边的物品无论转到哪都发虚，字始终清楚（字的层级 200，高于雾的 150）。
- 只有后半圈（d < −0.3）才加逐件 `filter: blur`，前半圈不加，省掉大半合成开销。
- 滚出视口或切走标签页就停；`prefers-reduced-motion` 时停在初始相位，入场动画缩到 10 ms。
- 物品是代码画的 SVG（球、蛋、骰子、罐子、碗、石头、书、柠檬），配色压成博物馆藏品的土色调；换成真抠图只在 CONFIG 里写 `{ src, sw, sh }`。

## 关键判断

1. **景深靠拟合出来的公式，不靠肉眼调。** 问题：只看截图会以为是 3D 透视（perspective + rotateY）。改法：读 14 个元素的 inline transform，发现缩放、透明度、层级都是 cos θ 的线性函数，旋转角正好是 x/100。验证：用 rx 600 / ry 322 / 相位 0.0726 反算全部 14 个坐标，误差 < 0.001 px；重建里把同一相位喂进去，和原站位置一致。
2. **配色是第二大差距，往土色调压。** 问题：第一轮用了亮黄柠檬、亮绿、天蓝，和原作博物馆藏品（陶、骨、铁、青花）的气质不合，一眼像玩具。改法：柠檬改赭黄、绿改橄榄、蓝改青花蓝、红改陶土，SVG 内容先缩进视框 14%。验证：第二轮并排图里冷暖接近了，但左下角放大对比发现物件反而比原作小一圈（原作抠图 contain 后几乎顶满盒子，约占 85%），第三轮把缩进改回 4%，并给每件加接地阴影和高光，让它更像拍出来的物件。
3. **窄屏让圆变高、往两边推出去。** 问题：400 宽时按比例缩椭圆，两侧物品正好压在副标题上。改法：<640 px 时 rx = 0.56 × 视口宽（两侧物件部分出屏，由边缘雾接住）、ry = 0.42 × 视口高、物品盒缩到 0.45。验证：400×800 截图里物件只出现在文字上方和下方，没有横向滚动。

## 和原作的差距

- 最大的差距是物品本身：原作是统一打光的写实抠图（看起来是生成后去背的照片），有材质和细节；这里是简单的渐变 SVG，形体单调。换成真实抠图后这一条就不成立。
- 窄屏缩放规则是推断的（原站只量了 1650 宽）；标题 `clamp(40px, 4.46vw, 80px)` 也只在 1650 宽对上了 73.6 px。
- 转盘入场：原站 `.intro-ring` 有 0.95 s 的 transform 过渡，但没量到起始值；这里用 scale 0.88 + 透明度淡入，是推断。
- 点「Start exploring」后的离场（转盘散开、进入无限画布）没有复刻。
- 背景两层径向渐变在 8 位色深下有轻微同心圆色带，原站同样的写法，没有加噪点去掉。

## API / CONFIG

```js
const shelf = createOrbitShelf(container, {
  brand, title, sub, cta, credit: [lead, name],
  ring:  { rx: 600, ry: 322, refW: 1650, refH: 992, item: 168, period: 83 },
  depth: { scaleBase: .85, scaleAmp: .23, opacityBase: .75, opacityAmp: .25, blurStart: .3, blurPerUnit: 2.5, degPerPx: .01 },
  items: [{ kind: 'sphere' | 'egg' | 'die' | 'can' | 'bowl' | 'stone' | 'books' | 'lemon', hue, sw, sh } | { src, sw, sh }],
});
shelf.setPhase(0.0726);   // 固定到某个角度，截图对齐用
shelf.destroy();
```

所有文案、物品、半径、转速、深度系数都在页面顶部的 `CONFIG` 里。

## 接入（file:// 直开，运行时零网络）

- `fonts/newsreader-latin-opsz-normal.woff2` 取自 `@fontsource-variable/newsreader` 5.3.0，`fonts/geist-latin-wght-normal.woff2` 取自 `@fontsource-variable/geist` 5.3.0（latin 子集，OFL-1.1）。
- 没有外部脚本、没有构建。
- 验证：Playwright 拦掉所有非 `file:` 请求，在 1650×992、1100×700、400×800 打开：零外部请求、零控制台错误、两个字体都 `loaded`、`scrollWidth` 等于视口宽。`reducedMotion: reduce` 下相位不动、非 reduce 下在转；`destroy()` 后容器清空；四个锚点 `#hero` `#ring` `#haze` `#objects` 都在。

## 可拆

- `#hero` 底色两层径向光 + 标题 / 副标题 / 按钮尺寸 + 分段入场。
- `#ring` 椭圆转盘：cos θ 一个量驱动缩放、透明度、层级、模糊。
- `#haze` 中间挖空的整层 backdrop 模糊。
- `#objects` 168 px 盒子 + 长宽比 + contain + 统一投影。
