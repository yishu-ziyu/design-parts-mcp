---
title: die-cut-sticker — 模切贴纸
aliases: die-cut, die cut, diecut, sticker, sticker effect, cutout, cut-out, white border, white outline, image outline, outline stroke, blend image into scene, make image fit scene, integrate image, pasted screenshot, drop-shadow, shadow, tilt, rotate, grain, paper texture, feMorphology, 贴纸, 模切, 模切贴纸, 抠图, 白边, 描边, 外描边, 融入画面, 融进画面, 图片融入场景, 投影, 阴影, 倾斜, 颗粒, 纸感, 截图感
when: 一张角色/物件图要放进页面或场景，看起来要像场景里本来就有的实体，而不是后贴的截图；手账、个人站、落地页上的贴纸装饰
avoid: 场景里贴纸不成立（严肃数据页、写实照片场景）；原图是动漫图且只能靠 rembg 抠（边会烂）；需要相框/拍立得（两层背景）
params: edge.radius=7px(≈宽×0.03); edge.color=#fffdf8; shadow=drop-shadow(0 4px 10px rgba(0,0,0,.15)); tilt=-8deg; scale.width=240px(场景 25–30%); grain.baseFrequency=0.9 alpha=0.10
anchors: #edge, #shadow, #tilt, #scale, #grain
---

# die-cut-sticker — 模切贴纸：让一张图成为场景里的一个物件

来源：[fuyofulo.com](https://fuyofulo.com/) 首页上的蜘蛛侠贴纸——一张抠好的角色图，带一圈均匀的厚白边、轻微纸感、很淡的投影、歪着贴。它被选作 **yishuziyu.cn** 首页角色图的参照：同一个问题（「一张动漫图怎么放进我的页面才不像后贴的」）的已验证答案。

打开 [index.html](index.html)。左边是贴纸，右边是同一张图直接粘进去的反例；底部滑杆能当场改白边、倾斜、颗粒、开关投影。

## 原理

**先问「它在这个场景里是什么实体物件」，不要问「图放在哪」。**
放在哪是排版问题，答案永远是一块矩形；是什么物件是材料问题——答案是「贴纸」时，白边、纸感、投影、倾斜全部是这个物件的物理属性自然推出来的，不是装饰。物件答案换了（印章、胶带、拍立得、窗），参数也全换。

## 机制逐条

- **#edge 等宽白边**：模切贴纸的刀线沿人物外轮廓等距外扩。CSS/SVG 等价物是对 alpha 做形态学膨胀：`feMorphology operator="dilate" radius="7"` on `SourceAlpha`。方核膨胀转角发尖，接 `feGaussianBlur stdDeviation=1.5` + `feFuncA slope=6 intercept=-2.4` 阈值回硬边，转角磨圆。填暖白 `#fffdf8`，原图 `feMerge` 盖回。filter 区域开到 130%，否则白边被裁。离线烘焙等价做法：alpha 先 flood-fill 填内洞，再 Gaussian blur（ring×0.6）阈值膨胀。
- **#grain 轻颗粒**：`feTurbulence fractalNoise baseFrequency=.9 numOctaves=2`，只 composite 进白边 ring，可见度 0.06–0.14。贴纸是纸做的，纯平白边像矢量描边。
- **#shadow 投影**：`drop-shadow(0 4px 10px rgba(0,0,0,.15))`，必须写在 `url(#diecut)` 之后，影子才沿白边外轮廓。贴纸贴在纸上，影子短而软；y>6px 或 α>.2 就成了浮起的卡片。
- **#tilt 倾斜**：`rotate(-8deg)`。手贴的东西不会正；−12…−4° 都行，0° 像排版。
- **#scale 尺寸**：宽 240px ≈ 场景 25–30%，白边按宽 ×0.03 线性缩放（最小 4px）。

## 专家检查（交付前三项都要过）

1. **等倍三联对比**：同一缩放下并排 原参照（fuyofulo 蜘蛛侠）/ 我们的贴纸 / 粘贴截图反例。白边粗细比例、影子浓度、倾斜幅度要和原参照同一档，不能只和反例比。
2. **200% 边缘检查**：放大到 200% 看刀线一圈：白边是否等宽、转角是否圆、人物与白边之间有没有原背景残色（光晕/灰边/锯齿）、颗粒是否只在白边上。
3. **盲测「哪个是后加的」**：把整页给没看过过程的人（或另一个 agent），只问「这页上哪个东西是后加上去的？」。被一眼指出 = 失败；说不出来或说「贴纸本来就在本子上」= 通过。

## 坑

- **拍立得 / 相框 = 两层背景**：框里一层（照片原背景）、框外一层（页面），眼睛立刻读出「图中图」，正是我们要消掉的东西。贴纸只有一层：页面本身。
- **rembg 抠动漫图会失败**：rembg 等模型按照片训练，动漫平涂 + 黑描线 + 浅色头发会被吃掉边或留白底光晕。动漫图优先用原图透明版、按纯色背景连通域去底（flood fill 从四边起），再向内腐蚀 1–2px 去毛边。
- **重绘会丢失真**：让生图模型「画成贴纸」会改脸、改线、改字。只做后期（抠 + 膨胀 + 合成），不重画角色。

## 可学 / 不学 / 启示

- **可学**：白边 + 颗粒 + 短软影 + 歪角四件套；滤镜顺序（形态学 → 颗粒 → 盖原图 → drop-shadow）。
- **不学**：不照搬蜘蛛侠形象及 fuyofulo 的版式；本页用的是自己的演示图。
- **启示**：融入画面不是调色问题，是物件身份问题。
