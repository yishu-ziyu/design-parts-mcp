# flycam — 可见相机穿行（真 three.js 版）

来源：https://x.com/KMkota0/status/2097648429727904197 （5s 屏录，逐帧拷贝在 `_source/km-tweet.mp4`）。溯源（2026-09-13 完成）：原片是 **mo1**（mo1.app，three.js **WebGPU** 栈，作者 @KMkota0）在首届 Three.js Conf Paris 的演示；完整链条见 [../../km-camera-rig.md](../../km-camera-rig.md)。

调性一句话：左窗格里那台黄视锥相机是主角，右窗格只是它的眼睛——相机沿虚线航线在合成上空走位，走位本身就是表演。

## v1 → v2（这次重做）

v1 是 CSS 3D 近似版（右窗格 CSS 透视 + 左窗格 SVG 斜投影），被用户否过两次：「用法不好」（抽象文字卡互飞）→「背景太丑」→ 修成求职版后仍被判「右边我不喜欢，左边逻辑更重要」。v2 换**真技术栈**：

| | v1（CSS 3D 近似） | v2（真 three.js） |
|---|---|---|
| 场景 | 6 个 `div` 卡片在 `perspective:900px` 里 translate3d | 一个 `THREE.Scene`：3 张 CanvasTexture 卡 + 环状 12 方块（+内圈 12）+ torus knot + 文字绕柱 + 渐变大面片 |
| 左窗格 | 手写 SVG 斜投影 + 手工拼的视锥多边形 | 第二个正交相机俯视同一 scene + **`THREE.CameraHelper(shotCam)`**（原生线框） |
| 航线 | SVG 虚线 polyline | `Line` + **`LineDashedMaterial` + `computeLineDistances()`** |
| 路径点 | SVG 六边形（空心→实心换 fill） | 八面体（线框材质 → 实心琥珀材质换 material） |
| 相机 | 位移反算（场景整体 translate3d） | 相机自己走：6 个体位 + 段内 smoothstep + lookAt 插值，**相机与内容都在真 3D 里** |
| 渲染 | 两套渲染器（CSS 3D + SVG），靠同一份世界坐标对齐 | **一个 WebGLRenderer**，`setScissorTest(true)` 两遍渲染 |
| 内容 | 求职物件（简历/明信片/信封），已被用户否 | 合成演示本身：排版卡 + UI 面板 + 真几何 + 绕柱文字 |

v1 的求职内容整体移除。CSS 3D 那一脉的标本留在 [nightflight](../nightflight/index.html) 与 [rig](../rig/index.html)。

## 接入（file:// 直开，运行时零网络）

- `vendor/three.min.js` = three.js **r147 的 UMD 构建**，构建期用 `npm pack three@0.147.0` 解包取 `build/three.min.js`（608 KB，sha256 `f34446bf875b5fb0dcd93819ffe1d9e182d46634ee855f5d904c6c4ac7cdbc95`）。
- 页面里就是一行普通 `<script src="vendor/three.min.js">`：**file:// 直开可用**。ES module 版（`three.module.js`）在 file:// 下会被 CORS 拦，不要用。
- 无 CDN、无构建步骤、无网络请求（`grep http index.html` 为空；vendor 里 three 自带的注释 URL 不产生请求）。

## 世界：五站内容（总 12s，段长 [0.20,0.16,0.24,0.20,0.20]）

| 站 | 到达 t | 物件 | 看点 |
|----|--------|------|------|
| 1 | 0.20 | 文字卡 A（深色） | 衬线大字「MOTION」+ 等宽角标 `CAM · CAST 05` / `24 FPS` / `KEYFRAME STUDY / 001` |
| 2 | 0.36 | 文字卡 B（暖纸） | 衬线大字「GRAPHICS」+ `02 / STUDIO EDITION` / `· 001 — COMPOSITION` |
| 3 | 0.60 | UI 面板卡 | 假界面：标题行 + 三条滑块（琥珀填充 + 圆钮）+ 折线图（底下一层渐变面）+ 底部 mono |
| 4 | 0.80 | cloner 环 | 12 枚真方块（30³）绕 r=150 排成环、各自翻滚；内圈 12 枚小的压在后面；每 4 枚一枚琥珀。相机从环中间穿过去 |
| 5 | 1.00 | 文字绕柱 | `CylinderGeometry` + CanvasTexture 横向平铺（绕一圈出现两次：「◆ TYPE CYLINDER」/「◆ MOTION」），画布自带柱面假明暗 |

外加：torus knot（真几何，暖琥珀）在 0.36–0.5 之间从画面左侧掠过；背景是一张 3400×1900 渐变大面片（深灰底 + 下方暖琥珀晕），配 `THREE.Fog(1500, 6500)` 做景深——远站自然退雾，末帧背景整片暖起来。

## 与 mo1 的对应（哪些是真同款，哪些是我们换的实现）

| mo1（原片） | 我们（v2） |
|---|---|
| 左窗格黄视锥 = three.js `CameraHelper` 的原生视觉 | 真 `CameraHelper(shotCam)`。只做两件事：左窗格渲染时把 shotCam 的 `near/far` 收成 **8/620**（否则视锥是 1:9000 的长针，不成「一台相机」的形状），再用原生 `setColors()` 把红/蓝/白收成暖琥珀一套 |
| 编辑器视图 = 第二个机位渲染同一场景 + rig 覆盖层 | 同一 scene、正交相机俯视 + `overlay` 组（网格 / 虚线航线 / 路径点+站号 Sprite / CameraHelper）逐遍开合 |
| POV controls 铸镜头：机位摆进 3D、时间轴插值 | 参数区 6 个体位（起点 + 五站，位置 + lookAt 目标）；`render(t)` 里 position 走段内 smoothstep、lookAt 目标线性插值（前 62% 段长稳住看本站，62→82% 转头看下一站） |
| 「without the need of nulls and parenting」 | 一样：没有 parenting、没有 null、没有累积动画——相机位置与朝向都是 t 的纯函数，scrub 到哪一帧都对 |
| tween overlaps（段与段节奏不等长） | 段长 [0.20,0.16,0.24,0.20,0.20] 不等；每段的转头窗口又不占满全段，摇的呼吸就来自这两层 |
| three.js **WebGPU** 栈（three-effects 要求 three/webgpu + TSL） | `WebGLRenderer` + UMD r147。**这是最大的差别**：mo1 的实时性是 WebGPU 的，模块化（`manifest.json / module.ts / props.json`，可让 AI 改模块）我们都没有。我们只复刻「看得见的相机」这套观看体验 |
| 路径点带编号（03/05） | 5 枚八面体旁挂 `/01`–`/05` Sprite，点火后不透明度拉满 |

## 实现要点

- **一个 `render(t)` 驱动一切**：右窗格机位、左窗格 rig 覆盖层、路径点点火、时间轴（进度/时间码/菱形 passed）都是 t 的纯函数；环的旋转、knot 的翻滚、绕柱的自转也写成 `t` 的函数，不看上一帧。
- **一个 renderer + scissor**（选它不选两个 renderer）：一块 canvas 铺满两窗格，每帧 `setViewport/setScissor` 两次、`render(scene, cam)` 两次；一个 WebGL 上下文、几何/纹理只传一次，代价只是多一遍 draw call。左窗格渲染前把 `fog.near/far` 抬到 1e6（雾按相机深度算，正交俯视机位离场 5–6k，不摘雾整场会被烤成背景色），右窗格再设回 1500/6500。
- **路径点点火**：5 枚八面体 `t >= TI[i+1]` 时把 material 从线框换成实心亮琥珀；站号 Sprite 同步提亮。
- **定帧**：`?demo=progress=X`（沿用 v1 的解析：`demo` 的值再当一层 query 解），无头截图用；`?rm=1` 等价 `prefers-reduced-motion`（无头也能拍 reduced-motion 帧）。
- **reduced-motion**：无自动播放、直达 t=1 终帧、时间轴仍可拖（拖动即重渲染）。
- **循环**：播完停末帧，播放键变成重播键（点它从头再来）。
- **页尾「可拆」**：时间轴右端那颗芯片点开就是零件清单（接入方式也写在里面）。

## 可学之处

- 视锥要「像一台相机」得自己调：`CameraHelper` 画的是相机的真实近远面，`near/far` 差 1000 倍时就是一根长针；渲染前临时收窄 `near/far` + 原生 `setColors()` 是最省事的正解（不动 helper 一行几何）。
- 雾是按**相机**深度算的：双窗格里两个相机深度差 5 倍，雾必须逐遍改，否则编辑视图整场变背景色。
- 圆柱上的字用 `DoubleSide + alphaTest` 会从透明镂空里看见背面镜像字，糊成一团竖条；要干净就 FrontSide + 实底画布（顺手在画布上画一道横向明暗当柱面假光影）。
- 「相机看着本站内容、掠过之后才转头」比「一直看向飞行方向」好看：转头窗口放在段长的 62%–82%，前段稳住构图，后段把下一站带进画面。

## 不学之处

- 不搬原片的巴黎内容与任何原片词。
- 不用位图与字体文件：三张卡、柱面字、站号、背景晕全部 CanvasTexture 现画，零网络。
- 不做 mo1 的模块化 / WebGPU：这里只要「看得见的相机」这一块，不要一个编辑器。

## 启示

- 左窗格才是本体：v2 里右窗格的内容整块可换（换卡、换几何），左窗格的航线、点火次序、转头节奏一行不用动——「它是相机的仪表盘，不是相机的照片」。
- 真 3D 之后，「掠过出画」不用做了：相机与内容的相对运动自己产生扫过、遮挡与离轴，scrub 正确是白送的。
- 参数先算后写：先把 6 个体位与内容坐标丢进一个用同一套 three 数学的检查脚本里跑五帧投影（每张卡的四角屏幕坐标），确认每帧无人被裁、无空帧，再写页面——比截图试错快一个量级。

## 可拆

- `#panes` 双窗格单 renderer（scissor 两遍）：接 [../../km-camera-rig.md](../../km-camera-rig.md) 说的「左编辑视图 + 右成片 + 底时间轴」骨架，换任何 three 场景都能用。
- `#camrig` POV 铸镜头：`POSES + SEGS + panEase()` 三件是全部；换世界只改 `POSES` 与 `CONTENT` 两组坐标。
- `#rig` CameraHelper 视锥 + 虚线航线 + 八面体点火 + 站号 Sprite：左窗格覆盖层整组（`overlay.visible` 逐遍开关）可以直接搬走。
- `#timeline` 双向时间轴：播放/拖拽/菱形跳关键帧/`?demo=progress` 定帧/reduced-motion 分支，v1 起没改过骨架。
- `vendor/three.min.js`：r147 UMD 本地接入方式（`<script src>`，file:// 可用）见上。
- 左窗格还有 CSS 3D + SVG 的对照标本：[rig](../rig/index.html)（只剩左窗格）与 [nightflight](../nightflight/index.html)（同一台相机换世界）。
