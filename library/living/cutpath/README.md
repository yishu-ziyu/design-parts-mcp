# cutpath — 透明 PNG 进去，亚克力挂件的切割线、白版和 3D 尺寸确认出来

来源：

- 原帖 https://x.com/retoruto_carry/status/2113242618662728136 （@retoruto_carry，れとるときゃりー，个人开发者，还做过按钮生成器、TwiCall、ピクページ）。
- 工具 https://cutpass.pages.dev/cut/ （カットパスメーカー）。免费、不用注册，图片在浏览器本地处理、不上传。没有公开仓库。
- 3D 部分的数值从原作网页的打包代码里读出：3D 弹窗在 `single-preview-FETqk_P1.js`，three.js 打包在 `design-switcher-C9PjLrzL.js`（`REVISION` 是 `"186"`，打开弹窗时才加载）。

调性一句话：从交付物倒推。先把交给印刷厂的文件做对，再用一枚硬币回答「做出来多大、孔在哪」。

打开 [index.html](index.html)。打开就载入示例图；点「3D 确认形状」可以拖着转。

## 这一页是什么

编辑器壳：顶栏、左边画布、右边设置栏、画布下一条读数，3D 确认是弹窗。

- **输入**：「选择图片」或把 PNG / JPEG 拖进画布；「用示例图」是页面用 canvas 画的一只端咖啡的猫，旁边一颗星、一个蓝球；星星和猫是分开的两块。图片不出浏览器。
- **设置**：长边尺寸、白边、分开的小块连成一整块、加挂链孔、孔的位置。滑块停 80ms 才重算。
- **三种显示**：图案和切割线 / 切割线 / 白版。
- **读数**：切割线外尺寸（mm）、面积（cm²）、分辨率（dpi）、切割线条数（+ 孔）。
- **导出**：一个 SVG，三层 White / Art / CutContour。
- **3D 确认形状**：亚克力按真实毫米挤出，四个视角，厚度 2 / 3 / 5 mm，比较物 500 日元硬币 / 1 元硬币 / 银行卡 / 50 mm 尺子 / 不放。

## 参数

| 项 | 值 | 说明 |
|----|-----|------|
| 工作分辨率 | 长边 ≤ 560px | 原图先缩到这里再算；`ppm` = 长边像素 ÷ 长边 mm |
| 长边尺寸 | 25–150 mm，默认 60 | |
| 白边 | 0.5–6.0 mm，默认 2.0 | 滑块 5–60，÷10 |
| 图案阈值 | `alpha > 40` | 之上算图案 |
| 距离变换 | 两遍倒角扫描，直 1、斜 1.4142 | 距离 ≤ 白边 × `ppm` 的像素进白版 |
| 连块 | 外扩 6 mm 再收回 6 mm | 闭运算，把分开的小块桥接成一块 |
| 填洞 | 从画布四边泛洪 | 摸不到的内洞全部填实 |
| 连通块下限 | 40 px | 更小的块不出切割线 |
| 描边 | 8 邻域沿边走、隔点取样、3 遍 Chaikin（0.75 / 0.25） | 每块一条闭合路径 |
| 挂链孔 | 孔半径 2.2 mm，外环再宽 1.8 mm | 孔心在白版最高点上方 0.7 个环半径；颈宽 ±0.7、长 1.6 个环半径 |
| 孔的位置 | −100…+100%，默认居中 | 横向 = 中线 + 百分比 × 图宽 × 0.45 |
| 3D 轮廓 | 按 0.45 mm 抽点 + 2 遍 Chaikin 后挤出 | 不重新平滑，侧壁会出现一条条竖纹 |
| 3D 贴图 | 长边上限 2048px | |

## 3D：相机、灯光、材质（照原作代码）

| 项 | 原作（r186 打包代码） | 本页 |
|----|----------------------|------|
| 相机 | `OrthographicCamera(-50, 50, 50, -50, 0.1, 10000)`，正交不是透视 | 同 |
| 取景 | L = max(总宽 ÷ 宽高比, 高 + 8, 40) × 0.65，上下各 L、左右各 L × 宽高比；总宽把硬币算进去 | 同 |
| 四个视角 | 斜め (0.55r, 0.3r, r)、正面 (0, 0, r)、裏面 (0, 0, −r)、側面 (r, 0, 0)，r = 4L，都看 (q, −3, 1.5) | 同；名字是斜看 / 正面 / 背面 / 侧面 |
| 视角切换 | 直接跳 | 520ms 动画（三次缓动） |
| 操作 | OrbitControls，缩放 0.4–6，无阻尼，关平移，只在画面变化时渲染 | 缩放 0.4–6，无阻尼，按需渲染；Shift 或右键拖动可以平移 |
| 环境光 | RoomEnvironment 经 PMREM（模糊 0.04） | 同 |
| 灯 | `HemisphereLight(白, 0x707070, 2)` + `DirectionalLight(白, 2)` 在 (40, 70, 100) | 同 |
| 画面 | 背景 `#ececea`，不做色调映射，没有地面和阴影 | 同 |
| 亚克力 | `ExtrudeGeometry` 深 1，`scale.z` 拉到厚度，无倒角 | 同 |
| 材质 | `MeshPhysicalMaterial` 白、roughness 0.12、transmission 0.97、ior 1.49、thickness = 厚度、clearcoat 1、depthWrite false | 同；`envMapIntensity` 1.3（原作 1），让侧壁更接近视频里的白 |
| 边线 | `EdgesGeometry` 30°，`0x7d8c90`，不透明度 0.42 | 同 |
| 印刷 | 白版在正面 z = 厚 + 0.015，图案 z = 厚 + 0.035，不受光 | 同；从背面只看到白版 |
| 硬币 | 侧边开口圆柱，500 日元 `0xc7b47e`、metalness 0.65、roughness 0.5、厚 1.8 mm、直径 26.5 mm；两面贴财务省硬币照片，不受光；立在亚克力右边 10 mm | 侧边同值 + 凹凸贴图做斜纹齿边；两面用代码画（见差距），不受光 |
| 比较物 | 500 円玉、1 円玉（20 mm，厚 1.5 mm）、50 mm 定规、不放；没有银行卡 | 500 日元硬币、1 元硬币（25 mm）、银行卡（85.6 × 54 mm）、50 mm 尺子、不放 |

## 色板

| 角色 | 值 | 用在哪 |
|------|-----|--------|
| 墨 | `#17171a` | 字、主按钮、选中段 |
| 灰字 | `#6b6b72` | 读数标签、说明 |
| 线 | `#e6e6e9` | 分隔、按钮描边 |
| 浅底 | `#f4f4f5` | 显示切换的槽 |
| 切割线 | `#e6007e` | 画布上的线；导出写 `#E6007E` |
| 白版（显示） | `#3a3a40` | 白版模式的实填 |
| 棋盘 | `#f1f1f2` / `#e8e8ea` | 画布底，18px 一格 |
| 3D 背景 | `#ececea` | 场景背景 + 相机后的背景板 |

## 与原作的对应

| 原作 | 本页 |
|------|------|
| 画布上图案外围一圈红色切割线，离图案处处等距，凹处被填平 | 距离变换 + 填洞，同样的效果 |
| 絵柄とカット線 / カット線 / 白版 + 「3Dで見る」 | 图案和切割线 / 切割线 / 白版 + 「3D 确认形状」 |
| 右栏调尺寸、白边、挂链孔；底部外尺寸、面积、分辨率 | 同，另加切割线条数和「分开的小块连成一整块」 |
| 3D：亚克力立在浅灰背景上，白边透明、边缘一道反光、图案不透明（背后垫了白版），旁边一枚 500 日元硬币 | 同一套相机、灯光、材质数值复刻 |
| 导出带 Illustrator 分层脚本的 CMYK 包，或 SVG | 只做 SVG，三层 White / Art / CutContour，单位 mm |

## 实现要点

- **白边是距离变换，不是描边加粗**：在透明通道上做两遍倒角扫描，得到每个像素到图案的距离，一个阈值就是白边。挂孔、连块、填洞都在这张二值图上改，最后统一描边。
- **先连起来再描边**：示例里星星和猫是分开的，直接描边只包住猫。先多扩张 6 mm 再收回，把小缝连上，再对每一块单独描边；星星和猫就被同一条线包住。
- **挂孔贴着图案最高点**：在指定横向位置找白版最高点，往上接圆环和一段颈。拖「孔的位置」，孔沿图案上沿走，不会和图案之间留出一大段空。
- **3D 是真挤出**：切割线换成毫米坐标的 `THREE.Shape`，挂孔是轮廓里的圆洞；白版取图片透明通道画成白色剪影，图案叠在上面，所以图案不透明、外圈是透明亚克力。
- **r147 透射的坑**：r147 的透射通道把背景清成 sRGB 编码后的颜色，透过亚克力看会发白。相机后面挂一块不透明的背景板（z = −9000），透过去的颜色就对了。
- **按需渲染**：只有拖动、切视角、改厚度或比较物时才渲染一帧；`ResizeObserver` 跟弹窗尺寸重新取景。关掉再打开复用同一个 renderer，页面里只有一个 WebGL 画布。
- **降级**：three 没加载到或 WebGL 不可用，弹窗里显示一句提示，2D 照常能用；WebGL 上下文丢失也给提示。
- **导出**：宿主提供 `window.claude` 的 downloads 就直接存 `<原名>_cut.svg`；没有（file:// 直开就是这样）就弹出文本框 + 复制按钮，剪贴板不可用时选中全文提示手动复制。
- `.modal` 的 `display:grid` 会盖住 `hidden` 属性，加了 `.modal[hidden]{display:none}`；Esc 关弹窗。

## 和原作的差距

| 项 | 差距 |
|----|------|
| 硬币 | 原作两面贴的是真硬币照片；这里是代码画的（金色外圈、带圆点的银圈、偏暗的抛光底面、凸起的 500，不画任何国家的图案），金属感和浮雕弱。这是最大的差距 |
| 侧壁 | 原作侧壁有一块块白色反光；这里轮廓更平滑，侧壁是连续的渐变，白斑少 |
| 版本 | 原作 r186，这里 r147（最后一个能直接用 script 标签加载的版本），透射和高光算法有细小差别 |
| 手感 | 没能亲手拖原作的 3D（它的「サンプルで試す」在测试用的 Chrome 里报错 `fetch is not defined`），拖动只按代码对齐；视角切换加了动画，原作是直接跳 |
| 导出 | 原作有带 Illustrator 脚本的 CMYK 分层包；这里只有 SVG |
| 其他工具 | 原作还有多个图案自动排到一张板上、贴纸排版；没做 |

## 接入（file:// 直开，运行时零网络）

原页面从 jsdelivr 加载 three、从 Google Fonts 加载字体；这里全部落到本地，HTML 里是普通 `<script defer src="vendor/…">` 和相对路径的 `@font-face`。

- `vendor/`：`npm pack three@0.147.0` 解包取三个 UMD 文件，挂在全局 `THREE` 上。ES module 版在 file:// 下会被 CORS 拦，不能用。`three.min.js` 与 [flycam](../flycam/index.html) 的是同一个文件。
- `fonts/`：
  - Noto Sans SC：`@fontsource-variable/noto-sans-sc@5.3.1`，可变字重（100–900）一份文件覆盖原页面要的 400 / 500 / 700。只拷了页面里实际出现的字所在的 unicode-range 分片：编号 90、100–102、104–119 + latin，共 21 片，`@font-face` 照包里的顺序声明（数字分片在前、latin 在后）。浏览器只下载渲染到的分片。用户上传的文件名里如果有别的汉字，那几个字会回退到系统字体；页面再加新汉字要重新挑分片。
  - JetBrains Mono：`@fontsource/jetbrains-mono@5.3.0`，latin 400 / 500。
- `grep -n http index.html` 只剩 SVG 导出字符串里的命名空间（`http://www.w3.org/2000/svg` 等），不发请求。

| 文件 | 来源 | 字节 | sha256 |
|------|------|------|--------|
| `vendor/three.min.js` | three@0.147.0 `build/three.min.js` | 607784 | `f34446bf875b5fb0dcd93819ffe1d9e182d46634ee855f5d904c6c4ac7cdbc95` |
| `vendor/OrbitControls.js` | three@0.147.0 `examples/js/controls/OrbitControls.js` | 26660 | `b4c6e53f98538535b11fd6655627d47fb5877b3ad972568bff0a7026c4b6d5c4` |
| `vendor/RoomEnvironment.js` | three@0.147.0 `examples/js/environments/RoomEnvironment.js` | 3718 | `251b4e779abb5b432f99a326878fe239747c1fe55f390933085fc3deb20d2cea` |
| `fonts/jetbrains-mono-latin-400-normal.woff2` | @fontsource/jetbrains-mono@5.3.0 | 21168 | `14425ba9c695763c1547f48a206b7aa60350a33ae23de09f0407877f3fcd89eb` |
| `fonts/jetbrains-mono-latin-500-normal.woff2` | @fontsource/jetbrains-mono@5.3.0 | 21832 | `cb182feeed4d798ff6961d3c79f7026279448fca0676438aaecb21f3fc39553a` |

Noto Sans SC 分片（@fontsource-variable/noto-sans-sc@5.3.1，`files/` 原样拷贝）：

```
80d51f95afbebcbed0cc53985fbce43eec3a37c8ec88b08d316c56a32aa77843  noto-sans-sc-90-wght-normal.woff2
2c5ddf9cdfad73afb5235e06bc8ed3b5c627849200d673978148700c78f84160  noto-sans-sc-100-wght-normal.woff2
a33308bf652e64ac2884bfe830996e933322b939b915bb823fd47383580664ad  noto-sans-sc-101-wght-normal.woff2
4ea85e144cb385ce086b21b307730d3fdb70a587aaf350b12d0c4c2f13e66d27  noto-sans-sc-102-wght-normal.woff2
1e716b78655e396075808be52a9e749df1b6b5d17bd0ccedc6dcb89586903737  noto-sans-sc-104-wght-normal.woff2
ade910a27a4bd65baed59a8a86a3a6a80f6083daa7123bb9ff32da15e56fda9d  noto-sans-sc-105-wght-normal.woff2
d31c838eb0e43043109bd6ddc23c295c340fc50f9a2f2381076ae8c0fa7f980b  noto-sans-sc-106-wght-normal.woff2
d8d9b5fd2b266fdf3f6855444e7769e54f39806e48994e7fe5e0c4ace9553c81  noto-sans-sc-107-wght-normal.woff2
12fcc1175cb6370acb056743f4fea7fdde85b6376ada2f15dfbab59f02b45988  noto-sans-sc-108-wght-normal.woff2
85ebc9985c665dd55346ebc78b93f8d8ef6ff972d78afc288b75d697a242d780  noto-sans-sc-109-wght-normal.woff2
51785f4a4d2a011d877052cab1bc4c36cabcc4e186ed0176214061c174b7f024  noto-sans-sc-110-wght-normal.woff2
aaa67a70f5e8b351c558e32345093fdfd86f089726b3b86d84b58de6a2475104  noto-sans-sc-111-wght-normal.woff2
34e76675ceffd89824fb130d7649dc92df9e57843a73b9996d405baa2ff9ecff  noto-sans-sc-112-wght-normal.woff2
40290d98d5c121bdbb1909e39c9c0242eae3a5a88f1bbe302857e525b90056df  noto-sans-sc-113-wght-normal.woff2
c49b2eb658a0c2d76de9a279945de30bf32acd8fdd6d56cf84aea9c6b14aacae  noto-sans-sc-114-wght-normal.woff2
6c0cda055b31066fb60058ac30ede37f6f9ca02265c2e1a84aee81175f567fa8  noto-sans-sc-115-wght-normal.woff2
002e502515bee8b9efa1b17abf7e52b51d4cfa20538ae2b2bd82ac52e1153f5e  noto-sans-sc-116-wght-normal.woff2
3d7ced7101c03dfa9bf0e60460a1b91fc6f1166fb33f718506e8110bb12e74a7  noto-sans-sc-117-wght-normal.woff2
f26330ce4056382832c0f2a0d7f411e0b4140fc87937e8865d91664410cfb98c  noto-sans-sc-118-wght-normal.woff2
09b9fa5a9521fbeccb8267a5abe7443c83cbe25b32eb15b00de316d913235525  noto-sans-sc-119-wght-normal.woff2
cf5346b0747cd71123c8f74da0ad41fc0f63eda07b9d8e0382e00882ae743733  noto-sans-sc-latin-wght-normal.woff2
```

## 可学之处

- 从交付物倒推功能：印刷厂要的是「白版 + 图案 + 洋红切割线」三层文件，图层名 CutContour 是印刷厂的常用写法。这个文件先做对，编辑功能往前补。
- 下单前要回答两个问题：做出来多大、孔在哪里。3D 预览加一枚硬币就是答案；正交相机让亚克力和硬币的比例在任何角度都不被透视放大或缩小（这一条是推断，原作没说）。
- 零门槛：免费、不注册、图片不上传，打开就能用，所以能被转发起来。

## 启示

- 产品页放一个打开就能用的最小演示，不要求登录，先用上再看介绍。
- 和实物有关的作品给一个尺寸参照（硬币、手、屏幕），一眼知道真实大小。

## 可拆

页尾「可拆」写了六块：`#stage`（距离变换白边 + 填洞 + 描边平滑）、`#merge`（外扩再收回的连块）、`#hole`（贴着最高点的挂链孔）、`#modes`（三种显示 + 读数）、`#export`（三层 SVG + 宿主下载的可选降级）、`#acrylic`（three r147 真挤出亚克力 + 原作相机灯光材质数值）。
