# reliefkit — 正视超拟物图标用 SDF 高度场实时渲染：一个机身配方套全家，光从原作截图拟合，新增图标只写数据

来源：

- X 书签 https://x.com/abduzeedo/status/2113044699762290913 （abduzeedo，2026-10-22，帖内 3 张图：19 个图标的网格、相机大图、LCD 时钟大图）。
- 原作：鹿言（Lu Yan，https://www.behance.net/elliot9 ，自我介绍 “3D Art & illustrator”，厦门，超有趣工作室 / ODOWORKS）& Zhiyi Zhang（https://www.behance.net/dr27 ，厦门），《超拟物图标 | Rams System Icons》，Behance 2026-01-14，https://www.behance.net/gallery/242098083/-Rams-System-Icons 。作者说明的大意：一直喜欢迪特·拉姆斯的设计理念，想以拉姆斯塑造的产品风格为基础重新定义超拟物图标，这是一次实验。原作每个图标左下印的是 Braun 字标。
- 找到的：Behance 项目共 17 张图，Tools 栏写着 Photoshop、Blender 3D；第 2、3 张是同一批物件的透视渲染。abduzeedo 的文章（2026-07-22）和 Design Compass 的文章（2026-08-03）只描述风格，没写工具和流程。站酷同名作品被 WAF 拦截，没读到。
- 没找到的：过程稿、教程、源文件。鹿言的站酷、B 站、Instagram、小红书上都没看到这组图标的过程分享。

事实和推断分开说：

- 事实：Tools 栏列了 Blender 3D 和 Photoshop；同一个物件（比如 8.0 MHz 调谐器立方体）既有正面图，也有透视渲染图。
- 推断：图标是 Blender 里的 3D 模型用正交正视角渲染出来，再在 Photoshop 里排版。依据有三条：有透视图；背景是纯色（σ=0，像带透明通道的渲染图合成上去的）；边缘有面光阴影和环境遮蔽。用 Cycles 还是 Eevee、怎么布光，没找到资料。
- 下面表里的尺寸、亮度、颜色，是在 X 原图上量的：X 只给到 1200 px 宽（`name=4096x4096` 也是这么大），在 Chrome 里按 1:1 设备像素分块截图再拼回原尺寸，读像素。不是从源文件读的。

只复刻了手法和视觉语言。原作的 19 个图标一个都没搬，也没照任何具体产品做。本页 9 个图标（时钟、天气、日历、相机、计算器、笔记、设置、邮件、音乐）是自己设计的，品牌字 ORDO 是自拟的，页面上没有原作的字标。

调性一句话：一个暖灰塑料机身套全家，只在能操作的部件上用一种橙色；光是产品摄影棚里低位的大柔光，机身没有投影，凸起只留接触阴影。

打开 [index.html](index.html)。悬停主屏图标，光会跟着偏；在右边大图上拖动可以移动光源。

## 这一页是什么

- 左边 iOS 主屏：第一页 6 个图标、Dock 3 个，60 px。悬停倾斜，按下缩小。主屏样式有「实物」和「iOS 底板」两种。
- 右边检查器：放大的当前图标（默认相机），在图上拖动移光源；滑块调方位、高度角、阴影柔和度；4 种强调色、3 种外壳；导出 1024 PNG。
- 渲染器 `ReliefIcons` 和页面分开，挂在 `window.ReliefIcons` 上，可以单独拿走用（见「用法」）。
- 往下滚是「可拆」。

## 原作实测

### 机身

| 项 | 原作 | 本页 |
|----|------|------|
| 尺寸 | 相机大图机身 712 × 706 px（x 242–954，y 543–1249），高宽比 0.99；网格图每个约 200 px，4 列 | 100u 画布里 86 × 85.4u，中心 (50, 50.7) |
| 圆角 | 沿槽线追踪一个角再拟合：超椭圆 p=4，半径 140 px（槽线所围矩形宽 675 px，20.7%）。圆弧拟合误差大 85 倍。换算到外轮廓约 159/712 = 22.3% | p=4，角半径 = 0.2237 × 机身短边（iOS 图标的 22.37%） |
| 外圈 | 轮廓到槽中线 19.5 px，机身宽的 2.7% | 2.35u（86u 的 2.7%） |
| 槽 | 暗带 5–6 px（0.8%），槽芯亮度 77–126；朝光一侧有 1 px 亮线：左槽 251、右槽 240、底槽 222。V 形，一壁受光一壁背光 | V 形，宽 1.0u、深 0.9u，S 曲线截面，槽底烘焙遮蔽 0.55 |
| 机身投影 | 没有：底边往外第 1 个像素（y=1250）就回到背景 `#F3F1F2` | 「实物」模式背景透明，不投影 |

### 光

| 项 | 原作 | 本页 |
|----|------|------|
| 轮廓边亮度 | 左 164–174、下 155–177、上圆角 226–230、右圆角 232–240、正面 213 | 用这 5 个数反解光照方向 |
| 光源 | 亮度随法线线性变化，暗面不掉成全黑 → 拟合得方位约 47°、高度约 16°，接近半兰伯特（wrap=1） | `azimuth 47`、`elevation 16`；外壳材质 `wrap 1.0`；`key 0.80`、`ambient 0.40` |
| 正面渐变 | 右上 219.6、左下 202.5，差 17 级，方向约 35°。可以理解成光源离物体不远 | `falloff 0.12` |
| 凸起的阴影 | 只在左下有约 1u 宽的接触阴影，没有长影 | 投影用「高度角 + 40°」算（`shadowLift 40`，即 56°） |

### 颜色

| 角色 | 原作 | 本页 |
|------|------|------|
| 背景 | `#F3F1F2` | `#F3F1F2`（页面底色，也是 iOS 底板色） |
| 正面 | `#D4D4CD` 左上、`#DBDBD3` 右上、`#CAC9C3` 左下、`#D7D7D0` 右下；R 和 G 基本相等，B 低 6–7，偏黄绿的暖灰 | 外壳反照率 `#E1E0D9`，受光后右下面色落到原作的值（见「三个判断」1） |
| 颗粒 | σ≈2.6 | 外壳 `grain 0.10`，渲染后 σ 2.8 |
| 橙 | 旋钮 `#F6682C`，快门中心约 `#FF5410` | 默认 `#F2622A`；页面四个强调色：橙 `#F4602A`、黄 `#F2B33D`、绿 `#43A564`、蓝 `#3B6FD8` |
| LCD | 底色 `#C0C2BA`–`#C6C8C1`，段码 `#3A3735` | `lcd #CCCEC5`、`lcdInk #34332F` |
| 印字墨 | 约 `#33312D` | `ink #2F2D2A` |
| 玻璃 | 中心 `#45444D`，下半部反射 `#7D7B7F`，右上一道月牙高光 | `glass #2C2B33`，材质 `env 0.75` 出反射 |
| CRT 屏 | `#383F3C`，绿字 `#CAF2C0` | 本页没有 CRT 屏 |

外壳预设只覆盖色板键：石灰 `shell #C3C2BC`，石墨 `shell #454442`（印字跟着变浅 `#E6E4DE`）。浅色表盘和纸上的字用 `dialInk` / `dialInkSoft`，不随外壳变色。

### 排字

| 项 | 原作 | 本页 |
|----|------|------|
| 品牌字 | 左下，距机身左边 9.8% | ORDO，Jost 600，`labels.brand [15.4, 87.3, 'left']`（机身左边在 7u，换算约 9.8%） |
| 型号 | 小写，右对齐到 90% | Inter 400，`labels.model [84.6, 87.3, 'right']` |
| 字高 | 约为机身宽的 4.6%（33/712 px） | `brandSize 5.0`、`modelSize 4.9`（u，是字号不是字高） |

## 原作好在哪

1. 一个机身配方套全家。所有图标共用同一个机身：超椭圆角、外圈、V 槽、暖灰塑料，变的只是正面的功能件（屏、键、旋钮、格栅）。19 个图标放在一起像同一条产品线，拉姆斯的产品系列也是这样做的。
2. 光是产品摄影的光，不是 UI 的光。光源低、软、带一点距离衰减，没有投影，只有接触阴影和环境遮蔽，所以物件像放在摄影台上，不像贴在屏幕上。缩到 60 px 时体积感还在。
3. 克制。整组只有一种强调色（橙），只出现在能操作的部件上（按钮、旋钮、开关）。印字只有品牌和型号两层。材质变化都放在值得摸的地方。

## 渲染器怎么做

- **为什么是高度场**：原作是正交正视渲染，正视图里每个像素只看到一个高度，用高度场就能描述，不需要真正的 3D 网格。没用 CSS 渐变叠层，因为叠层没法让任意形状对同一个光源做一致的响应；也没用 three.js 建模，因为每个图标都要建网格，加一个图标的成本太高。
- **第一遍（几何）**：图标是一张 SDF 几何体列表（圆角矩形、圆、胶囊、圆环，配凸起、凹陷、V 槽、孔阵、上色）。着色器逐像素遍历列表，算出高度、覆盖率、反照率、材质号，用 MRT 写进 3 张 RGBA8 纹理，高度按 16 位打包（范围 −8 到 24u）。
- **第二遍（光照）**：Sobel 求法线。半兰伯特主光、天光、16 个采样的 AO、沿光线方向最多 64 步的软阴影（用抬高后的投影高度角）、Blinn 或各向异性高光（同心、唱片纹、横向拉丝、竖棱）、摄影棚环境反射（暗顶、亮地、柔光箱）、颗粒和微法线噪声。颗粒的每个八度在噪声单元小于约 1 px 时淡出，小尺寸下不会混叠成斑块。
- **印刷层**：字、七段 LCD、刻度、表盘数字、弧形字、字形在一张 2D canvas 上画好，作为反照率叠到表面上，所以印字也跟着表面受光；有墨的地方高光和反射乘 0.4。印刷层按图标、尺寸、配色、日期缓存，最多 60 张。
- **超采样**：小于 512 px 内部 2×，否则 1.5×，最后由 2D canvas 缩小输出。整页共享一个 WebGL2 上下文。
- **页面**：主屏悬停时图标在 ±7° 内倾斜，光源方位同步偏 ±14°、高度角偏 ±8°；按下缩到 0.93。「iOS 底板」把物件放进 n=5 超椭圆底板，缩放 0.84，物件往底板上投阴影 0.35。拖大图、拉滑块时只重画大图（rAF 节流），松手后主屏一起重画。

## 三个判断

**1. 光源靠拟合，不靠目测**

- 问题：一开始凭眼睛设的光（方位 35°、高度 30°、wrap 0.2），左边缘太亮，右边缘和顶边不对，正面色偏红（R>G）。
- 改法：在原图机身的上、下、左、右边缘和正面各取亮度，按「亮度对法线线性」解光照方向，得到方位 47°、高度 16°，外壳材质用 wrap=1。面色改成 R≈G 的 `#E1E0D9`，颗粒加到 σ≈2.7。
- 验证：同为 712 px 机身时，右下面色本页 216.2 / 215.3 / 208.5，原作 215.7 / 215.2 / 208.9。颗粒 σ 2.8 对 2.6。四条边上还没对齐的地方列在「和原作的差距」里。

**2. 槽从 U 形改成 V 形**

- 问题：U 形或直壁的槽，槽芯不是太浅（132–146），就是只有 3 px 宽，也没有原作那条 1 px 的受光边。
- 改法：S 曲线做 V 形截面，宽 1.0u、深 0.9u，槽底再叠一层烘焙遮蔽（cavity 0.55）。朝光那面槽壁自然出亮线。
- 验证：左槽芯 80–94，原作 77–126；右槽芯 89–93。左槽受光边 222，原作 251，还差一些。

**3. 投影的高度角和明暗的高度角分开**

- 问题：主光高度 16° 时，4u 高的旋钮会在左下拖出 14u 长的影子，原作只有约 1u 的接触阴影。旧的半影公式在低角度下还会把没有遮挡的平面压暗约 14%。
- 改法：加 `shadowLift`，投影按「高度角 + 40°」也就是 56° 算，模拟大柔光箱的短接触阴影。修好半影公式，让无遮挡的平面取 1，再把 key / ambient 重新校到 0.80 / 0.40。同时让颗粒在单元格小于约 1 px 时淡出。
- 验证：230 px 网格对比里，旋钮和按钮只剩左下的短阴影，外壳没有斑块。828 px 时右下面色仍是 216 / 215 / 209。

## 和原作的差距

- **没有全局光照**。原作有真实的反弹光和串色，比如橙色部件旁边的塑料微微泛暖，阴影是真实面光源的效果。这里是 AO 近似加一条阴影射线，接触阴影在小尺寸下偏硬、偏黑一点，镜头玻璃也没有内部镜片的层次。这是最大的差距。
- **高度场看不到侧面，也做不了倒扣**。原作相机顶上的快门能看到橙色圆柱的正面一条；这里侧边和顶边的按钮只能做成平的凸片。轮廓上一圈细节（比如顶部 1 px 的亮边）也比原作弱。
- **几处细差**：

| 项 | 原作 | 本页 |
|----|------|------|
| 顶部外圈亮度 | 205–230 | 218–236，亮约 10 级 |
| 左槽受光边 | 251 | 222 |
| 正面左下 | 202 | 210 |
| 底边暗带 | 155–177 | 148–189 |
| LCD 窗口顶部内阴影 | 约 25 px 渐变，最暗 142 | 更窄、更黑，最暗 110 |
| LCD 段码 | 带倒角的圆头 | 尖头六边形 |
| 品牌字 | 原产品的标准字 | Jost 600，刻意没有模仿 |

- **性能只在软件 GL 上测过**。headless Chromium 用 SwiftShader（CPU 模拟），单个图标 230 px 要 0.4–1.6 s，828 px 要 4–14 s，1024 px 要 5–27 s。真 GPU 上应该快很多，但没有在真机 GPU 上测。

## 用法

```js
await ReliefIcons.fontsReady();                         // 等 Inter / Jost 加载完，否则印字会用回退字体；最多等 2.5 s

// 单个图标 → HTMLCanvasElement（size × size 设备像素）
const cv = ReliefIcons.renderIcon(def, 1024, {
  accent: '#F2622A',            // 强调色
  shell: 'ivory',               // 'ivory' | 'stone' | 'graphite'（CONFIG.shells）
  palette: { shell: '#E1E0D9' },// 单独覆盖色板里的任意键
  light: { azimuth: 47, elevation: 16, softness: 0.5 },   // 覆盖 CONFIG.light 里的任意键
  tile: false,                  // true = iOS 超椭圆底板 + 物件缩放 0.84
  background: null,             // 不透明背景色；null 为透明
  wallShadow: 0,                // 物件投到背景上的阴影强度（tile 模式默认 0.35）
  supersample: 1.5,             // 默认：小于 512 px 用 2，否则用 1.5
  date: new Date(),             // 印字里 {dd} {MON} {DOW} {HH} {mm} 的取值来源
  target: existingCanvas,       // 可选：画到已有的 canvas 上
});

// 图标网格（主屏）
const grid = ReliefIcons.createIconGrid(container, defs, {
  size: 60, labels: true, tilt: true, columns: 4, onSelect(def) {}, ...renderOptions,
});
grid.update({ accent: '#43A564' }); grid.select('camera'); grid.destroy();

// 导出
const blob = await ReliefIcons.exportPNG('camera', 1024, renderOptions);   // Promise<Blob>
ReliefIcons.config      // 就是 CONFIG
```

适合用在：iOS / macOS 自定义 App 图标（`tile: true` 直接导出带 n=5 超椭圆底板的 1024 图）；产品官网和落地页的 hero，一排「设备」，悬停时光影跟着动；硬件感 UI 的静态素材（旋钮、滑块、LCD、格栅都能单独画）；占位插画、onboarding、空状态。深色页面用 `graphite` 外壳，换品牌色只改 `accent`。

### 图标定义

坐标约定：画布 100 × 100u，y 轴向下。角度从 12 点方向起算，顺时针为正。高度单位也是 u。

```js
{ id: 'camera', name: 'Camera', label: 'photo 3',     // label = 右下角型号；设为 false 时两行字都不画
  labels: { brand: [15.4, 87.3, 'left'], model: [...] },// 可选：改字的位置
  body: { w, h, color, mat } | false,                  // 机身用 CONFIG.body + CONFIG.shell 配方
  under: [part],                                       // 画在机身下层（从侧边或顶部伸出的按钮）
  parts: [part],                                       // 按顺序绘制，后画的压在先画的上面
  prints: [print] }
```

- **part 的形状**：`rrect {x,y,w,h,r,p}`（p 是角指数，2 为圆角，4 为超椭圆）、`circle {x,y,r}`、`capsule {x1,y1,x2,y2,r}`、`ring {x,y,r,width}`、`hand {x,y,angle,len,tail,w}`（指针）。
- **part 的操作 `op`**：
  - `raise`（默认）：`H` 高度、`e` 圆角宽、`ev` 圆角高（0 为正圆角）、`dome` 弧顶（负值为碟形凹面）、`ridges` / `ridgeDepth` 滚花、`stack:'max'`（按绝对高度叠，纸张或悬臂用）。
  - `recess`：`depth`、`e`（口沿圆角）、`floor`（底部内圆角）。
  - `groove`：`depth`、`width`、`inset`、`cavity`。
  - `paint`：只上色。
  - `holes`：`depth`、`e`、`pitch`（或 `pitchX` / `pitchY`）、`hole`、`holeB`、`holeShape: circle | square | slot`。
- **part 的公共参数**：`color` 填色板键或 hex，省略就沿用下层颜色；`mat` 是材质键；`rot` 旋转角度；`repeat:{nx,ny,dx,dy}` 和 `each:{序号:{覆盖}}` 做阵列。
- **print 的类型**：`text {text,x,y,size,weight,font,align,baseline,track,color}`、`lcd {text,x,y(底边),h,align,ghost}`、`glyph {name: play|pause|prev|next|plus|minus|power|sun|drop|bell}`、`ticks {x,y,r1,r2,n,from,to,width,skip}`、`dial {x,y,r,from,to,values,size}`、`arc`、`arcText {text,x,y,r,at,size,track}`、`rect`、`rects {items}`、`poly {points,width,fill}`。`text` 可以配 `texts` + `repeat` + `eachColor` 做阵列。
- **新增图标**：往 `CONFIG.icons` 里 push 一个对象，不改渲染器。

### CONFIG 键

- `brand`、`fonts {label, brand}`
- `palette`：所有颜色。`dialInk` / `dialInkSoft` 是印在浅色表盘和纸上的字色，不随外壳变色。
- `shells`：外壳预设（只覆盖色板键）。`accents`：页面的强调色。
- `materials.{名}`：`spec, gloss, wrap, metal, grain, bump, aniso (concentric | vinyl | brushX | ribs), env, emissive, sss`。最多 19 种。
- `light`：`azimuth, elevation, shadowLift, key, ambient, softness, shadow, falloff, ao, specular`
- `shell`：`cornerRatio 0.2237, cornerExp 4, thickness 5, edge 1.2, edgeDrop 0, rim 2.35, grooveWidth 1.0, grooveDepth 0.9, grooveCavity 0.55`
- `body {x, y, w, h}`、`labels`、`tile {scale 0.84, cornerRatio 0.5, cornerExp 5}`、`icons`

### 开销

- 第一遍每个像素遍历整张几何体列表，每个图标 6–19 个（`repeat` 展开后上限 2048）。
- 第二遍每像素约 40 次纹理读取，加最多 64 步阴影步进。
- 改光源时整张重算，印刷层走缓存。拖动光源用 rAF 节流。

## 接入（file:// 直开，运行时零网络）

原页面从 Google Fonts 加载 Inter 400 / 500 / 600 / 700 和 Jost 500 / 600；这里换成 `fonts/` 里的 woff2，`@font-face` 相对路径 + `unicode-range`，中文落到系统字体。

- 取自 `@fontsource/inter` 5.3.0 和 `@fontsource/jost` 5.3.0（`npm pack` 解包，latin 子集，OFL-1.1）。页面实际用到 Inter 400 / 500 / 600 和 Jost 600；Inter 700、Jost 500 照原页面的字体请求保留，没用到时浏览器不下载。
- 没有外部脚本、没有构建，单个 HTML。`grep -n http index.html` 只剩署名里指向 Behance 原作的 `<a href>`，不发请求。
- 运行时只依赖 WebGL2（要 MRT 和 RGBA32F 数据纹理）。没有 WebGL2 时，主屏和检查器的位置显示一句提示。
- 验证：Playwright（SwiftShader）拦掉所有非 `file:` 请求后打开，1100×700 和 400 宽两种版式都是零请求尝试、零控制台错误；9 个主屏图标和大图都画出来了，Inter 400 / 500 / 600 和 Jost 600 状态 `loaded`；400 宽时 `scrollWidth` 等于 400。

| 文件 | 来源 | 字节 | sha256 |
|------|------|------|--------|
| `fonts/inter-latin-400-normal.woff2` | @fontsource/inter@5.3.0 | 23664 | `8909904ab6c872eb994093482a88a28eca2cd95912d7b6fecd72103b0dc07edc` |
| `fonts/inter-latin-500-normal.woff2` | @fontsource/inter@5.3.0 | 24272 | `f3779f1efccc4bdcdf9c0a02ab95bf6bd092ed09c48c08cedc725889edd1d19f` |
| `fonts/inter-latin-600-normal.woff2` | @fontsource/inter@5.3.0 | 24452 | `f9a06e79cd3a2a20951c0f0e28f66dd0e6d3fda73911d640a2125c8fcb78f21a` |
| `fonts/inter-latin-700-normal.woff2` | @fontsource/inter@5.3.0 | 24356 | `6f56409fd3d64bb85f7d070bce20749db2d66b6d63cec586cc22d1c761be2491` |
| `fonts/jost-latin-500-normal.woff2` | @fontsource/jost@5.3.0 | 10476 | `98dce4f076fe71a123a7cd44470e6f05e969cb6d7c9b2717766ad103e3597297` |
| `fonts/jost-latin-600-normal.woff2` | @fontsource/jost@5.3.0 | 10480 | `d0487d684596edca7f495d2495ee77a55448740930023c305e8a683b1daefda2` |

## 可拆

- `#shell` 机身配方：p=4 超椭圆角 22.37%、外圈 2.35u、V 槽 1.0u × 0.9u + 槽底遮蔽、暖灰面色和三种外壳。
- `#light` 拟合光：方位 47°、高度 16°、wrap 1，投影另抬 40°。
- `#stage` 两遍高度场渲染：SDF 列表 → MRT → Sobel 法线 + AO + 软阴影 + 各向异性高光 + 环境反射。
- `#print` 印刷层：2D canvas 当反照率叠进表面，印字跟着受光；日期占位、七段 LCD。
- `#schema` 图标即数据：形状 × 操作 × 色板键 × 材质键，`under` / `repeat` / `stack:'max'`。
- `#screen` 主屏网格和 iOS 底板模式：悬停倾斜带光源偏移，n=5 底板。
- `#inspector` 检查器：拖图移光、滑块、强调色、外壳、导出 1024 PNG。

## 启示

- 照着一张截图调光，先在同一材质朝上、下、左、右和正面的地方各取一个亮度，用这 5 个数反推光照模型，再去调材质，不凭眼睛调灯。
- 正面正交视角的「产品渲染」风格图标，可以用「SDF 几何体 → 高度场 → 一遍光照」来做。机身配方和光写一次，之后加图标只写数据。
