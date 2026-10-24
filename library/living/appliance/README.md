# appliance — 一台可以玩的手绘等轴小电器：SVG 线稿 + 一层“手绘”滤镜 + 一排药丸按钮驱动的状态机

来源：https://x.com/Aprilzz423/status/2111474111541284890 （April Zhu @Aprilzz423）。她说做了一个 Claude skill，用来生成手绘感、可交互的日常物件，示例是 https://colorfigures.vercel.app/ （页面标题 “Colorfigures · April Zhu”，左栏列了 26 个图，Fig. 01 是洗衣机）。读到的是线上页面本身：主区是一个同源 iframe，里面一张内联 SVG（`svg#fig`，viewBox `0 0 229.5 172.2`），整张图放在 `g#art` 里、套一个 `filter#hand`；滤镜的每个原语和参数都是从 DOM 里直接读出来的（下表）。没读到的：skill 本身的 prompt / 源文件、生成过程、Turntable 和 See-through 的具体实现代码（只看了界面和按钮）。推断：每个物件的 SVG 是 skill 让模型一次画出来的，滤镜和外壳 UI 是共用的模板——依据是 26 个图共用同一个外壳、同一个 `#hand` 滤镜结构。

本页画的是自己的物件：一台双槽弹出式烤面包机，品牌、文案、侧栏条目都是自己写的，没有用原作的 logo、洗衣机或其他图。

## 实测数字（原作 DOM，1400×842 截图）

| 项 | 值 |
|----|----|
| 画板 | viewBox 229.5 × 172.2；1400 宽窗口下约 645 px 宽（≈ 2.8 px / 单位） |
| 图元 | `g#art` 下 560 个元素，整组一个 `filter="url(#hand)"` |
| 位移抖动 | `feDisplacementMap` scale **0.94**，R/G 通道，位移图是一张预烘 PNG（`feImage`，铺到 -80,-60 起 390×293） |
| 纸纹 | `feTurbulence` fractalNoise baseFrequency **2.2937**、numOctaves 3、seed 11 → 色阶矩阵 `.3 … .84`（亮度压到 0.84 以上） |
| 斑驳 | 第二张预烘 PNG → 色阶矩阵 `.3 … .85` |
| 合成 | wob × grain（multiply）× blot（multiply），最后 `feComposite operator="in"` 裁回原形状 |
| 线宽 | 0.27 最多（323 个元素），其次 0.39 / 0.47 / 0.31 / 0.35，最粗 0.86 左右（viewBox 单位） |
| 页面 | 底色 `rgb(242,239,231)` = `#f2efe7`；全页等宽字 `ui-monospace, SFMono-Regular, Menlo, monospace` |
| 布局 | 顶栏约 76 px；左栏约 186 px（当前项深底白字圆角）；主区图题 → 左上一列药丸动作按钮、右上 See-through / Labels、右下缩放、底栏 HAND-DRAWN WOBBLE / COLOUR（5 色点）/ VIEW |

## 怎么做的

1. **等轴投影 + 面内坐标**：`P(x,y,z) = (ox + (x−y)·cos30°, oy + (x+y)/2 − z)`。三个可见面各有一个 `matrix()`：顶面 `(c, .5, −c, .5)`、亮侧面 `(c, −.5, 0, 1)`、暗侧面 `(c, .5, 0, 1)`。旋钮、刻度、铭牌文字都在面内用普通 2D 坐标画，贴上去就自动斜了。
2. **配色**：一个主色决定三面——顶面提亮 22%、亮侧面原色、暗侧面混墨 62%；投影是一块固定的蓝 `#3c4c93`，沿 +y 拖向左下。
3. **手绘滤镜 `#hand`**：结构和参数照抄原作；两张预烘 PNG 换成 `feTurbulence` 现算（位移图 baseFrequency 0.06、斑驳 0.35）。
4. **状态机**：放面包 → 压杆（杆下移、面包沉入槽、槽里橙色加热丝闪、热气线上飘）→ 按焦度 1–6 计时 → 弹起（带上抛）→ 取出。面包切片立在槽的平面里，用 clipPath 只露出顶面以上的部分，所以“下沉”就是平移，不用算遮挡。
5. **外壳**：WOBBLE 滑杆直接写位移 scale；色点换主色；See-through 把三面 fill-opacity 降到 0.35 并取消面包裁切；Labels 用虚线引线 + 等宽小字；Turntable 用 `scaleX(cos t)` 假装转台。

## 关键判断

- **问题**：一开始只想用 CSS `filter: url()` 套一层噪声。**改**：读了原作 DOM 才发现它是“位移 + 两层乘法纹理 + in 合成”四步，最后一步 `in` 让纹理不溢出线稿外。**验证**：同比例裁图对比（cmp-3），边缘的毛刺和面上的颗粒都对上，背景纸面没有被染脏。
- **问题**：等轴图里每个小部件都要算 3D 点，很容易歪。**改**：只算三个面的仿射矩阵，部件全在面内 2D 画。**验证**：铭牌文字、刻度和杆槽都跟着亮侧面同角度斜，和原作洗衣机面板的斜法一致。
- **问题**：箱体用三块直角多边形拼，轮廓发虚、比原作“软”。**改**：外轮廓单独再描一圈 1.25 粗线。**验证**：并排图里外轮廓粗细接近原作（原作最粗约 0.86 + 圆角叠线）。

## 没做到的

- 原作箱体是圆角（顶边、竖边都有半径），这里还是直角。
- 原作每个图的细节密度更高（铰链、门玻璃、篮子、贴纸），这里 92 个元素，原作 560。
- Turntable 只是水平翻转的假转台，不是真的换视角重画；Front view 只是复位。
- 位移图用实时噪声代替预烘 PNG，抖动的“笔触方向感”比原作弱一点。
- 没有声音。

## API 和 CONFIG

```js
const fig = createToaster(container, { colorIndex: 2, wobble: 1.4 });
fig.insert(); fig.lever(); fig.popUp(); fig.takeOut(); fig.crumbs();
fig.setColor(0); fig.setWobble(0);
fig.destroy();
```

`CONFIG`（页面顶部）：`title`、`viewBox`、`ink`、`shadow`、`colors`（5 个色点）、`colorIndex`、`wobble` / `wobbleMax`、`grain`（纸纹和斑驳频率、色阶抬升）、`body`（W/L/H 箱体尺寸）、`brand`、`browning`（档位和每档秒数）、`bread`（生 / 熟 / 面包皮三色）、`text`（全部按钮文案）、`labels`（部件名）。`prefers-reduced-motion` 下所有补间直接跳到终点，转台不转，烤制仍按时间推进。
