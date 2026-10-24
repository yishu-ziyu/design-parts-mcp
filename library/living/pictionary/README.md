# pictionary — 你画一个词，7 个小模型在右边一排卡片里抢着猜

来源：https://x.com/nutlope/status/2110799107031724124 （Hassan @nutlope，2026-10-16，推文只有一句 "Pictionary, but with open source LLMs"，附一段约 31 s 的录屏）。录屏结尾给出仓库 github.com/Nutlope/doodle-derby，产品叫 Open Pictionary（openpictionary.com，Together AI 出品）。仓库是公开的，下面的颜色、圆角、阴影、字号、动画时长都是从它的 `app/globals.css`、`lib/racers.ts`、`lib/creatures.ts`、`components/game/*` 里直接读的，属于事实。没有读到的：真实模型的出题和判题节奏（服务端流式返回，每次新笔迹就给每个模型发一张小截图）；本页用 CONFIG 里写死的「墨量到某个比例就出某个猜测」代替，这是推断出的近似，不是原作逻辑。品牌名、logo、模型名、出题词都换成了自己的。

调性一句话：整页底色每回合换一次，上面只放白色「贴纸」卡片和一张浮起来的白纸，7 个彩色几何小生物各占一种颜色，谁猜中整页就换成谁的浅色。

## 量到的数

| 项 | 值（来源） |
|----|----|
| 底色过渡 | `background-color 0.7s cubic-bezier(0.22,1,0.36,1)`（globals.css） |
| 模型 | 7 个，各有主色 + 浅「房间色」：`#F2442E/#FF8A7A`、`#6B4EFF/#BBA8FF`、`#00A870/#6FE3B0`、`#F2338C/#FF9BC8`、`#1F6BFF/#86C3FF`、`#00B2D6/#8FE6F5`、`#FF7A1A/#FFBE85`（racers.ts） |
| 纸 | 圆角 28 px；阴影 `0 2px 0 /5%, 0 30px 70px -28px /45%, 0 12px 24px -16px /20%`；7% 透明度 feTurbulence 纸纹 |
| 纸宽 | `min(100%, max(400px, 100dvh − 300px))`（≥1024 px）；本页为了对上录屏比例用 −230px |
| 卡片 | 白底圆角 20 px，阴影 `0 1px 0 /4%, 0 1px 2px /6%, 0 8px 24px -12px /22%` |
| 字 | 一种字体 Bricolage Grotesque。题目词 `clamp(2.4rem, 1.6rem+2.6vw, 3.4rem)` 800；猜测 1.375rem 700；名字 0.9375rem 650；标签 0.8125rem 650 |
| 思考气泡 | 三个 5 px 圆点，0.9 s 循环，依次延迟 130 ms；底色 = 模型色 14% 混白 |
| 小生物 | 64×64 盒子里的几何身体，眼睛按 `eyeY` 和 `gap` 摆（creatures.ts） |
| 笔迹 | 原作用 perfect-freehand（thinning 0.55）填充轮廓；本页用 3.4 px 圆头线代替 |

## 怎么做的

- 页面两栏：左边题目词 + 倒计时胶囊 + 白纸 + 工具条（Undo / Clear / Give up），右边「The field」7 张卡。窄于 900 px 时变一栏，纸在上，卡片在下。
- 每回合开始：`body` 换成该回合的房间色，题目词逐字弹起。
- 演示模式里脚本按 `drawSpeed` 沿 CONFIG 的折线把每一笔画出来，铅笔图标跟着笔尖走。画出的墨量 / 本回合总墨量 = 进度。
- 每个模型在 CONFIG 里有一串 `[进度, 猜测, 是否正确]`。进度一到，先出 0.5–1.4 s 的三点思考气泡，再落下猜测：新猜测小生物跳一下，0.65 s 后没猜中就划线、摇头，旧猜测挤进右侧渐隐的划线小胶囊里。
- 第一个猜中的：卡片加一圈模型色描边、右上角打勾、显示用时，小生物蹦起来，碎片炸开，其余卡片变淡，纸底出现黑色胶囊「X got it in 3.2s」，整页换成它的浅色。3.2 s 后进下一回合。
- 自己在纸上画也行：真实墨量同样推进进度，所以猜测仍按顺序到；画超过脚本总墨量后随机冒出一些错误猜测。
- 60 s 倒计时是一个 SVG 圆环（`pathLength=100` 改 `dashoffset`），剩 10 s 变红；到时没人猜中就显示 Time's up。

## 关键判断

1. **问题**：第一版纸只有视口高度的 64%，和录屏并排时纸明显偏小，右栏卡片反而显得高。**改**：原作公式是 `100dvh − 300px`，录屏窗口比我的测试视口矮，等比换算后用 `100dvh − 230px`，舞台宽 1060 px。**验证**：并排图 `1-mid-round` 里两边纸都占画面高约 72%。
2. **问题**：模型「什么时候猜」如果用定时器，用户自己画时就和笔迹无关。**改**：统一用「已画墨量 / 本回合总墨量」作进度，脚本画和人画走同一个 `feed()`。**验证**：在纸上手画，猜测按 CONFIG 顺序出现；Undo 会把墨量减回去。
3. **问题**：猜错要让人一眼看出，又不能抢正在猜的那一个。**改**：照原作，当前猜测 22 px 粗体，猜错后变浅并从左往右划线，旧猜测缩成 12 px 划线小胶囊，右端渐隐。**验证**：并排图里两边卡片的信息层级一致。

## 差距

- 原作的赢家动画、分享视频、排行榜、每日一题都没做；导航上的 Daily / Leaderboard 只是外观。
- 笔迹不是 perfect-freehand 的变宽轮廓，是等宽线，粗细感比原作稍硬。
- 小生物的情绪（sleepy、sad、thinking 眼神）只做了跳、摇头、蹦和眨眼。
- 录屏只有 480×270 的清晰度，卡片里的小字和间距是按源码数值，不是按画面量的。

## API 和 CONFIG

```js
const game = createPictionary(container, { autoplay: true, roundMs: 60000 });
game.next();    // 跳到下一回合
game.demo();    // 本回合重新播放演示
game.destroy(); // 停掉所有定时器和 rAF，清空容器
```

CONFIG 在 `index.html` 顶部：

- `models[]`：`key / name / lab / color / room / shape`，shape 取 `circle square triangle pill drop flower star`。
- `rounds[]`：`word`、`room`（开局底色）、`strokes`（0–1 坐标的折线数组）、`guesses`（每个模型一串 `[进度, 文本, 1=正确]`）。
- `roundMs`、`drawSpeed`（脚本笔速，px/ms）、`stroke`（线宽）、`pauseAfterWin`、`fallbackGuesses`。
- 系统设置减少动态效果时：脚本一帧画完一笔，弹跳、碎片、过渡全部关掉。
- 无网络请求，字体在 `fonts/`（@fontsource/bricolage-grotesque，latin，500–800）。
