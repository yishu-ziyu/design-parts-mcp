# gamespace — 18.9 万个点的游戏 embedding 地图：一个点和它的近邻，拉远看全景，坍成小球再炸开，钻进去，最后标出类型

来源：X 书签 https://x.com/re_skob/status/2113043120128483349 （RE:Skob @re_skob，2026-10-22，视频 6:35，1280×720）。帖子引用的是 @SyntheticBeef 10 月 21 日的一条：把 Steam 上十万多款游戏的描述做 embedding、放进向量空间，找没有游戏的位置，再把那个位置转回文字描述（那条的直接链接没拿到，X 的引用卡片不带链接）。作者在回复里说了三件事：工具就是 Opus 5.5，提示词基本就是 SyntheticBeef 那条帖子的内容（https://x.com/re_skob/status/2113135020902654019 ）；现在只在本地跑，之后会托管（https://x.com/re_skob/status/2113122703049621611 ）；之后会开源（https://x.com/re_skob/status/2113288065225458103 ），后来又回复说正在准备发布（https://x.com/re_skob/status/2113640576885146103 ）。代码仓库和在线站点都没找到（查过 X 回复、网页搜索、GitHub）。本页只复刻视频第 02 章，52.4–92.4 s。下面的尺寸、颜色、时刻是把视频逐帧截下来、按 1280×720 量的，不是从源码读的。

推断（作者没说）：视频像是代码渲染的动态图形再录屏，依据是统一的章节标签、等宽数据面板、逐字出现的字幕，和网页动效的做法一致；点云应该是 embedding 降到 3 维（UMAP / t-SNE 一类）的结果，降维方法和 embedding 模型都没写。

调性一句话：先给一个认识的点和它的几个近邻，让人看懂「离得近 = 像」，再拉远给全景，最后在全景上标出类型；镜头负责空间关系，字只在该读的那一刻出现。

打开 [index.html](index.html)。打开就自动播放，40 s 循环。

## 这一页是什么

- 一条 40 s 的自动循环，时钟沿用原视频的秒数（52.4–92.4 s），可以和原视频同一秒逐帧对比。
- 点云是 189,495 个点的**合成数据**，形状照 UMAP 那种空心、海绵状、边缘带须的样子造，不是真的 Steam 数据。换成真 embedding 见下面「数据格式」。
- 剧情：Stardew Valley 一个点 → 四个近邻和相似度 → 拉远，Doom Eternal 做对照（虚线 + 0.30）→ 整团点云亮起 → 硬切，坍成一个小球再炸开 → 九个游戏名标签 → 钻进点云 → 退出来，标出八个类型。
- 底部播放条：播放 / 暂停、拖时间轴、时间读数；空格播放暂停，← → 前后 1 s；拖画面转视角，双击复位。`index.html?t=61.5` 直接停在那一帧（截图对比用，播放条隐藏）。「可拆 ↓」跳到页尾。
- 章节名和三句字幕是自己写的。游戏名、类型名是真实 Steam 游戏的事实数据，「similarity 0.75」这类数字是示意格式。

## 时间线（秒，视频时钟）

| 时刻 | 原作（逐帧读出） | 本页参数 |
|------|------|------|
| 52.1–53.2 | 第一句字幕逐字出现，约 0.033 s 一字，新字先放大约 1.3 倍、偏下、发虚，再落位 | `caption.stagger` 0.033、每字 0.32 s，从 1.32 倍、下沉 0.16em、模糊 0.14em 落位 |
| 52.45–52.95 | Stardew Valley 橙点（直径约 12 px）+ 折线 + 标签逐字出现 | 焦点点 `#ff6a3a`；标签 0.02 s 一字 |
| 57.0 | 字幕淡出 | `t1` 56.95，淡出 0.35 s |
| 57.85–58.9 | 四个近邻依次出现，相似度小字先出，名字后出 | 近邻标签 `t0` 57.85 / 58.1 / 58.4 / 58.45 |
| 64.72 | 近邻标签全部消失 | 同 |
| 64.75–65.3 | 镜头拉远，Doom Eternal 出现，粉色虚线连到 Stardew；先出相似度小字，65.33 起出名字 | 镜头 65.26 s 到 `dist` 1.30；对照标签 `mainAt` 65.33；虚线 5 / 4 |
| 65.3–65.42 | 整团点云在 0.12 s 内亮起 | 点云亮度 0 → 1 |
| 67.72 | 硬切：全黑，只剩一个彩色小球（68.5 s 直径约 105 px） | 镜头 `step` 到绕原点、距离 4.6；坍缩球半径 0.03 → 0.12 |
| 68.5–70.7 | 小球膨胀成整团（69.4 s 是右边缘清楚的半球，约 400×465 px） | 半径 0.5（69.4）→ 0.95（69.95）→ 2.6（70.75），之后放开 |
| 69.85–73.2 | 第二句字幕 | 同 |
| 73.95–78.6 | 九个游戏名小标签依次弹出 | 游戏名标签 14.5 px |
| 75.55–78.2 | 第三句字幕，暖白，比前两句小 | 52 px，y = 613 |
| 76–82.2 | 镜头钻进点云，景深变浅；78.3 起出现 HORROR | `dist` 0.85 → 0.50 → 0.40，光圈 0.024 |
| 83.15 | 回到全景：VISUAL NOVELS + HORROR（26.5 px） | 82.15–83.15 s 退到 `dist` 3.05 |
| 85.15–87.55 | 六个类型标签依次出现 | 类型标签 20.5 px |
| 83–92.4 | 镜头慢慢后退并绕转 | `dist` 3.05 → 4.55，`az` 6° → 26° |

## 标签和字（1280×720 参考像素）

| 类 | 字体 | 字号 | 颜色 | 折线 |
|----|------|------|------|------|
| 章节编号 | JetBrains Mono 500 | 12 | `#f8bd66` | 后接 30×1 px 的线，间距 10；中线在 (47, 51) |
| 章节名 | Barlow 600，字距 0.19em | 13 | `#e0e2e8` | |
| 字幕一、二 | Barlow Condensed 700，字距 −0.035em，行高 1.05 | 58 | `#f3fbff` + 两层蓝色外发光（7 / 20 px） | 居中，中线 y = 598 |
| 字幕三 | 同上 | 52 | `#fff9f4` + 暗投影 | y = 613 |
| 焦点 | Barlow Condensed 700，字距 −0.03em | 25.5 | `#f8bd66`，背后一团暗底 | 短线 22，空 7，不画圈 |
| 近邻 | Barlow 600 | 17.5 | `#a8f1d7`，线 `#78cfb2` | 短线 20，空 8，圈半径 3.8 |
| 相似度小字 | JetBrains Mono 400 | 9.6（下限 7.5） | `#7c808a` | 名字下方 7 |
| 游戏名 | Barlow 600 | 14.5 | `#f6f8fc` | 短线 23，空 7，圈 3.8 |
| 类型 | Barlow Condensed 700 | 20.5（HORROR、VISUAL NOVELS 26.5） | 各一色，见色板 | 短线 23，空 7，圈 4，线同字色 |
| 对照 | Barlow Condensed 700 | 40，小字 20 | `#f6759a` | 短线 22，空 8，5 / 4 虚线连回焦点 |

缩放：画面缩放 `k = (H / 720) / tanScale`；字另用 `kText = max(k, min(1, 0.62·H/720 + 0.25, 0.75·W/1280 + 0.45))`，窄屏上字缩得比画面少。宽高比小于 1.25 时加宽视野，让 1.25 的范围留在画面里。

## 色板

| 角色 | 值 | 用在哪 |
|------|----|--------|
| 背景 | `#05070c` | 原作四角实测 rgb(5, 7, 12) |
| 背景渐变 | 上 `#070b12`、下 `#040507` | 最后一个 pass 里用 screen 叠在点云下面 |
| 强调 | `#f8bd66` | 章节编号、焦点标签 |
| 字 | `#e0e2e8` | 章节名 |
| 近邻 | `#a8f1d7`，线 `#78cfb2` | |
| 灰 | `#7c808a` | 相似度小字 |
| 白 | `#f6f8fc` | 游戏名 |
| 对照 | `#f6759a` | Doom Eternal 标签和虚线 |
| 类型 | RACING `#a5edd1`、DECKBUILDERS `#86d7ef`、TACTICS `#7fd7f5`、SHOOTERS `#f6839d`、FARMING SIMS / HORROR `#f5c27a`、VISUAL NOVELS `#f6809f`、CATS `#f6f8fc` | 和所在区域的点同一色系 |
| 点云 11 色 | pink `#ff5fa8`、rose `#ff7c8c`、orange `#ff9a52`、amber `#ffcb52`、lime `#bdf25c`、green `#52f08c`、mint `#52f0c8`、cyan `#52d8ff`、blue `#6a8cff`、violet `#a070ff`、magenta `#e05cff` | 大多数点的亮度再乘 0.55–1.15 的随机数 |

## 点云

| 项 | 值 |
|----|----|
| 点数 | 189,495，一个 `THREE.Points`，一次绘制 |
| 混合 | 加法，不写深度、不做深度测试、不排序 |
| 点大小 | 0.009 世界单位（云半径约 1）×（0.55 + 0.9 × 随机）× 透视，最小 1.15 px |
| 近处 | 超过 3.4 px 后只按 0.3 的斜率继续变大，多出来的部分 × 0.8 当柔化 |
| 景深 | 弥散圈 = 光圈 × \|z − 焦距\| / z × 像素焦距，和点大小按平方和开根；亮度 × min(1, s0·sRaw / s²)，变大的点同时变淡 |
| 点形 | exp(−3.2 r²)，亮度系数 0.19 |
| 远处 | 从云心往相机方向 0.35 处开始，更远的点按 exp(−1.1 × 超出的深度) 变暗，近层保住颜色 |
| 贴脸 | 离相机 0.015–0.09 的点渐隐 |
| 合成结构 | 22 个大块（68% 在外壳上）→ 200 个子团 → 520 条贴着外壳的弯带（占 50%）→ 340 个亮小结（12%）→ 64 条外缘短须（5%）、24 个离群小岛（0.8%）、1.2% 散点 |
| 剧情点 | 剧情里用到的名字（Stardew、Doom、HORROR……）按「某一秒出现在 1280×720 画面哪个像素」通过镜头反推出 3D 坐标，周围再放一团同色的点；HORROR 旁边加一条 14,000 点、颜色从粉渐到青绿的色带 |
| 生成时间 | 210 ms（测试环境） |

和原作逐帧量的对比（1280×720）：

| 量 | 原作 | 本页 |
|----|------|------|
| 91 s 云团包围盒 | 373×401（x 464–837，y 141–542） | 383×362 |
| 91 s 亮像素覆盖 | 51% | 47% |
| 91 s 纯白像素 | 0.44% | 1.0% |
| 91 s 平均亮度 | 109 | 104 |
| 平均饱和度 | 0.25 | 0.33 |
| 71.5 s 云团 | 484×534 | 477×553 |
| 75.2 s 云团 | 583×537 | 524×557 |
| 83.5 s 云团 | 622×504 | 478×522 |
| 79 s 亮区面积 | 779k px² | 700k px² |
| 68.5 s 小球中心 | (537, 401) | (542, 404) |
| 69.4 s 半球宽 | 398 | 348 |
| 标签位置（x） | Story of Leaves 711–828、STORY OF SEASONS 219–511、DECKBUILDERS 807–911、SHOOTERS 393–464 | 709–827、220–512、804–910、390–463 |

## 数据格式（换成真 embedding）

```js
space.setData({
  positions: Float32Array,   // x,y,z × N，原始坐标就行，比如 embedding 降到 3 维的 UMAP 结果
  colors?:   Float32Array,   // r,g,b 0..1 × N
  groups?:   Uint16Array,    // 每点一个分组号；没给 colors 时按 palette 上色
  palette?:  string[],       // 分组颜色，默认用上面 11 色
  names?:    { 'Stardew Valley': 17, '#HORROR': 400 },  // 剧情里引用的名字 → 点的下标
  normalized?: boolean       // 不给就按均值居中，95% 分位半径缩到 1
});
```

- 颜色优先级：`colors` → `groups` + `palette` → 都没有就按方向在 palette 里取色。
- 剧情按 `names` 找点，`names` 里没有的标签、焦点、连线直接跳过，镜头目标找不到就对准原点，不报错（用随机原始坐标和只给三个名字的数据测过）。
- 镜头关键帧的 `target` 可以是名字，也可以是坐标；合成数据里那几个坐标目标（坍缩球心 (−0.26, 0.03, −0.17)、钻进去的点 (0.06, 0.02, 0.12)）是照合成云摆的，换数据后要改成你的点。
- 标签偏移是屏幕上的参考像素，换数据不用改。

## 用法

```js
const space = createGameSpace(container, options);
// → { play(), pause(), seek(t), setData(d), destroy(), onTime(fn), project(name), ready, time, playing, start, end, duration }
createGameSpace.defaults;            // CONFIG
createGameSpace.synthesize(opts);    // 只生成合成数据
```

- 搬走时拷 `index.html` 里 `.gs-*` 那几条 CSS、`vendor/` 七个文件（顺序同页里的 script 标签），和脚本里「Demo shell」分隔线以上的部分。全局只多 `THREE` 和 `createGameSpace`。
- `options` 深合并到 `CONFIG`（数组整体替换）。常改的键：
  - `data`：真数据，`null` 用合成数据。
  - `synthetic`：合成器参数（`count`、`seed`、`lobes`、`shell`、`strands`、`knots`、`pins`、`anchors`、`bands`）。
  - `palette`、`colors`、`fonts`。
  - `styles`：各类标签和字幕的字号、颜色、折线长度、字距、逐字间隔；单个标签可以用 `size` 覆盖字号。
  - `render`：`pointSize`、`pointGain`、`exposure`、`bloom`、`grain`、`fog`、`maxPixelRatio`（默认 2）、`minAspect`。
  - `story`：`start` / `end` / `poster`，`chapter`，`camera`（`t, target, dist, az, el, at, ease`）、`lens`、`cloud`、`expand`、`focusPoints`、`labels`、`links`、`captions`，时间都是秒。
  - `interactive: true` 拖动转视角、双击复位；`autoplay`、`loop`。
- `seek(t)` 同步渲染那一帧；`onTime(fn)` 每帧回调，返回取消函数；`project(name)` 给出那个点在容器里的屏幕坐标。
- `prefers-reduced-motion`：不自动播放，停在 `story.poster`（91 s，全景加类型标签），颗粒不动。
- `destroy()` 移除 DOM，释放几何体、材质、渲染目标，丢弃 WebGL 上下文；同页可以开第二个实例。
- 性能：一次绘制、不排序；bloom 在全分辨率上跑。点数到 50 万以上，把 `maxPixelRatio` 降到 1.5，或者把 bloom 分辨率减半。逐字出现的 CSS blur 只在字出现的 0.3 s 里更新。

## 与原作的对应

| 原作 | 本页 |
|------|------|
| 视频第 02 章，40 s 一条镜头讲完「embedding 地图」 | three.js r147 实时渲染，所有动作是故事时间 t 的纯函数，秒数沿用视频时钟 |
| 点云是真实 Steam 游戏的 embedding | 合成数据，同样的层级（大块 → 子团 → 弯带 → 小结 → 须和岛）；`setData` 换真数据 |
| 章节名和三句旁白字幕 | **不搬**：按同样的位置、字号、出现时刻，字数相近，重写成自己的话 |
| 游戏名、类型名、相似度数字 | 保留：前两者是真实 Steam 游戏的事实；数字当示意格式 |
| 类型标签的颜色取自所在区域，不用图例 | 同；颜色逐个写在 `story.labels` 里 |
| DIN 类窄体 | Barlow Condensed / Barlow / JetBrains Mono |

## 实现要点

- **t 的纯函数**：镜头、景深、点云亮度、坍缩、标签、字幕都按关键帧采样，`seek(t)` 精确回到任意一帧。复刻时就是按原视频同一秒逐帧截图并排比的。
- **镜头**：绕目标的轨道。`dist` 按对数插值，推拉速度均匀；`at` 让目标落在参考帧的指定像素，镜头构图可以照着原视频的帧对。一段的缓动由终点关键帧定（三次 in / out / inOut、linear、step）。
- **点按像素反推**：「这个点某一秒在画面 (sx, sy)、离镜头多远」→ 经那一秒的镜头反投影成 3D 坐标。改了镜头参数，点的位置跟着对。
- **点云太白**：加法混合下十几万个点会叠成白球。每点亮度系数压低（现在是 0.19），点大小随机 0.55–1.45 倍，色调映射按最大通道压（保色相）再和普通映射 65 / 35 混，bloom 前先钳到 1.8。91 s 纯白像素从 19.2% 降到 1.0%。
- **钻进点云**：镜头离点只有 0.4–0.5 个单位时，点按 1/z 放大，不限制就是一屏白雾，限制亮度又一屏黑。点超过 3.4 px 后放慢变大并柔化、亮度按面积补偿；镜头目标从外缘的 HORROR 移到云团内部，再加一条从粉渐到青绿的色带穿过 HORROR。
- **坍缩**：顶点着色器里把每个点到球心的距离限制在 r × (0.82 + 0.36 × 随机) 以内，r 按关键帧变大；数据不动，关掉就恢复。
- **标签**：DOM + SVG，每帧把 3D 点投影到屏幕。标签量自己的宽度，出画就换到另一边，两边都不够就贴边（400 px 宽三帧 `scrollWidth` 都是 400）。
- **画面质感**：钳到 1.8 → `UnrealBloomPass`（0.62 / 0.32 / 0.2）→ 自写最终 pass（色调映射、背景渐变、暗角、颗粒），渲染目标半浮点。
- **打包时的改动**：原页是 `position:fixed` 铺满、不能滚；这里改成 `100svh` 高的舞台，页尾接「可拆」，播放条加「可拆 ↓」（交互模式下画面吃掉触屏滑动，靠它下去）。舞台露出不到 5% 时暂停、滚回来接着播，这时空格和左右键交还给页面。章节名和字幕重写；three 和字体落到本地。效果本身（`createGameSpace` 里的代码）没改。

## 和原作的差距

- **点云是假数据。** 原作轮廓更不规则（偏三角形），大色块更大、边界更清楚；这里是圆一些的团，颜色偏粉 / 青两色，中心比原作亮。饱和度量出来 0.33 对 0.25，但看起来颜色种类比原作少。75.2 s 以后的全景云团比原作小一圈（83.5 s 宽 478 对 622）。
- **69.4 s 的半球。** 原作右边缘清楚，像被球面切开；这里点是沿半径被拉回的，看得到放射状条纹，宽 348 对 398。
- **77–79 s 云里的色带。** 原作有大块柔和的粉 → 蓝 → 绿色带和一块暗的前景团；这里颗粒感更强，色带不明显，暗的前景团没做出来。
- **字体。** 原作看起来是 DIN 类窄体；这里用 Barlow Condensed / Barlow / JetBrains Mono 代替，R、G 等字形不同。Barlow Condensed 比原作宽约 10%，字幕和 Stardew 标签加了 −0.035em / −0.03em 字距，原文案下第一句字幕原作 x 319–959、本页 316–965。换成自己的字幕后宽度不同，字号、位置、节奏没变。
- **只做了第 02 章。** 视频其他章节（近邻表、类型柱状图、空白区域、点子卡片、维恩图等）没做。
- **性能没在真 GPU 上测。** 测试环境是软件渲染（swiftshader），只跑到约 0.4 倍速。

## 接入（file:// 直开，运行时零网络）

原页从 jsdelivr 加载 three、从 Google Fonts 加载字体；这里全部落到本地，HTML 里是普通 `<script src="vendor/…">`（同步加载，脚本一开头就要用 `THREE`）和相对路径的 `@font-face`。

- `vendor/`：three@0.147.0 的 UMD 文件，挂在全局 `THREE` 上（ES module 版在 file:// 下会被 CORS 拦）。`three.min.js` 和 [cutpath](../cutpath/index.html)、[flycam](../flycam/index.html) 的是同一个文件。
- `fonts/`：latin 子集 woff2（OFL-1.1），`@font-face` 相对路径 + `unicode-range`，中文落到系统字体。Barlow Condensed 600 声明了但页面默认样式没用到（留给 `styles` 里改字重），浏览器不会下载它。JetBrains Mono 和 scanline 用的是同一份 5.3.0；复刻时用的是 5.0.18，DPR 2 下等宽小字有亚像素差，位置不变。
- `grep -n http index.html` 只剩 SVG 命名空间字符串，不发请求。
- 验证：Playwright（swiftshader）拦掉所有非 `file:` 请求，在 1280×720 和 400×780（DPR 2）各开一次：零非 `file:` 请求、零失败请求、零控制台错误；Barlow Condensed 700、Barlow 500 / 600、JetBrains Mono 400 / 500 都是 `loaded`；自动播放时钟在走；点「可拆 ↓」滚到页尾后暂停，空格滚页面，回到顶部接着播；400 宽 `scrollWidth` 400。和打包前的页面在 54.5 / 61.5 / 66 / 72 / 75.6 / 77.5 / 91 s 逐像素比，只有章节名和字幕区域不同。

| 文件 | 来源 | 字节 | sha256 |
|------|------|------|--------|
| `vendor/three.min.js` | three@0.147.0 `build/three.min.js` | 607784 | `f34446bf875b5fb0dcd93819ffe1d9e182d46634ee855f5d904c6c4ac7cdbc95` |
| `vendor/CopyShader.js` | three@0.147.0 `examples/js/shaders/` | 597 | `249592106188290488cb9419fc6231b701983cdc23c25c7805536cf06800ff48` |
| `vendor/LuminosityHighPassShader.js` | three@0.147.0 `examples/js/shaders/` | 1218 | `3c8552bb514a01009c07eb17e576f14db43cff64ce8cfab01667ab8db2e85afe` |
| `vendor/EffectComposer.js` | three@0.147.0 `examples/js/postprocessing/` | 6241 | `6c8bf2f6b06778fdadf7cfd09ef4c17d881428d1cdee953e3348b3f54df4bc75` |
| `vendor/RenderPass.js` | three@0.147.0 `examples/js/postprocessing/` | 1741 | `3c1a07df004b36c1fac6af2a443953ef589f88fb024dd0f01d5f9f6252dfc371` |
| `vendor/ShaderPass.js` | three@0.147.0 `examples/js/postprocessing/` | 1485 | `f0d8d767e089c99ad04f6714cd4fac29363d6b0207543cd4335922ea143856a6` |
| `vendor/UnrealBloomPass.js` | three@0.147.0 `examples/js/postprocessing/` | 12675 | `1a5b8476addc578c179200bed5a0da54bb176c1b41ef89d2174ff76b0a4410e7` |
| `fonts/barlow-condensed-latin-600-normal.woff2` | @fontsource/barlow-condensed@5.0.13 | 21352 | `0b281bf2f4179c06ba68f0a427f2341287c41eacc2ce9d534c6f5c513ac633fb` |
| `fonts/barlow-condensed-latin-700-normal.woff2` | @fontsource/barlow-condensed@5.0.13 | 21440 | `8320299532b4b81498d5b3714d49c9d5938883b55f4c2a1efe6f105bf4a942bd` |
| `fonts/barlow-latin-500-normal.woff2` | @fontsource/barlow@5.0.13 | 20960 | `7c0597b1b0c771139c958982210f05b275993037f0f3ba20d7a9300a0741dc80` |
| `fonts/barlow-latin-600-normal.woff2` | @fontsource/barlow@5.0.13 | 21796 | `2b14e8397d552f351a4396dec25ec5da1348865683100e94c4ab0faea4a9a254` |
| `fonts/jetbrains-mono-latin-400-normal.woff2` | @fontsource/jetbrains-mono@5.3.0 | 21168 | `14425ba9c695763c1547f48a206b7aa60350a33ae23de09f0407877f3fcd89eb` |
| `fonts/jetbrains-mono-latin-500-normal.woff2` | @fontsource/jetbrains-mono@5.3.0 | 21832 | `cb182feeed4d798ff6961d3c79f7026279448fca0676438aaecb21f3fc39553a` |

## 能用在哪

- 任何「一堆东西做了 embedding」的集合：笔记库、论文库、商品目录、播客单集、用户反馈。先挑一个大家认识的点讲近邻，再展开全景。
- 产品里的「相似推荐」：选中一项，显示近邻和相似度，折线和小字照这里。
- 长文里的滚动叙事：把滚动位置映射到 `seek(t)`。

## 可拆

页尾「可拆」写了五块：`#stage`（故事时间轴 + 硬切坍缩）、`#cloud`（点云数据形状、`setData`、点精灵大小和景深）、`#labels`（点 → 折线 → 字的标签和相似度小字）、`#look`（钳值 → bloom → 保色相色调映射、渐变底、颗粒）、`#chapter`（章节标签和字幕字体）。

## 启示

- 讲一个抽象的空间，先给一个熟悉的点和它的几个近邻，再给一个远的对照，观众先懂「距离 = 相似」，再看十几万个点的全景就有了参照。
- 把动画写成时间 t 的纯函数，就能按参考视频的同一秒逐帧截图对比；要摆的点也可以反过来从「某一秒出现在画面哪个像素」求出来。
