# spine — 侧栏子导航：脊柱条 + 滑动光点 + 合成音（奕枢内容版）

来源：[lab01.dev](https://lab01.dev/#ui-experiment-2) 页面内标注的 **UI Experiment #09**（iframe 指向 `experiments/13`）。原版源码已逐行读出（`/tmp/labexp_13.html`、`/tmp/e13.css`、`/tmp/e13.js`），机制等价复刻，内容换成奕枢。

打开 [index.html](index.html)。`?demo=open=1`（展开任务组）、`?demo=dot=2`（光点在第 2 子项）、`?demo=hover=1`（脊柱条长到第 2 档）仅供截图核对，正常打开不受影响。

## 机制逐条

- **框**：540×540 bg `#1F1F1F`，overflow hidden；侧栏 256px；主面板 444px bg `#303030` 圆角 16、多层阴影（数值照原版抄）、内含搜索框与骨架条 `#3D3D3D`。
- **手风琴 #accordion**：点父项 toggle `aria-expanded`，子容器联动 `inert`。箭头收合态 `rotate:-90deg`，展开转正走 300ms `ease-spring`（`linear()` 弹簧曲线，数值照抄源），收起走 200ms `ease-in-out`——不对称时序。子导航高度 `0 → auto` 能过渡靠 `interpolate-size:allow-keywords`。
- **脊柱条 #spine**：子导航左缘 10px 宽条。`--bar-height` 是 `@property` 注册的 `<length>`，否则不能 transition。悬停第 i 个子项长到三档 `10px / 47px / 84px`；升高走 0.3s `ease-spring`、缩没走 0.1s `ease-in-out`。`pointerleave` 整条消失：先对进行中的过渡 `commitStyles()` 再 `cancel()`，把当前值钉进内联样式防跳变，然后 `data-instant` + 摘 `data-visible`。
- **滑动光点 #dot**：6px primary 圆 + `box-shadow:0 0 10px` 辉光。translate 三档 `0 / 37px / 74px` 对应当前子项。初次出现或无当前项 → instant（`data-instant` 属性 + `offsetHeight` 强制 reflow）；已显示中 → 0.2s `ease-in-out` 平滑滑动。点叶子项 `data-current` 迁移，光点滑到新位。
- **reduced-motion**：所有过渡时长归零，直达终态；声音保留（声音不是 motion）。
- **防跳变两手法**（源自源 JS）：`commitStyles()/cancel()` 把过渡当前值固化；`data-instant` + 读 `offsetHeight` 强制 reflow 让落位跳过过渡。

## 声音设计

源用的音色包叫 **「Minimal」**，作者 **Raphael Salaja**——正弦超短包络风格，为追求克制、透明 UI 反馈的产品做的。本页用自己的 ~50 行 Web Audio 复刻其中三个音色，参数与源 patch 一致（源 JS `Fe` 对象）：

| 音色 | 触发 | 频率 | attack | decay | release | gain |
|------|------|------|--------|-------|---------|------|
| pop | 父项展开/收起 | 400→200Hz 扫频 | 0 | 0.04 | 0.012 | 0.1 |
| tap | 叶子选中 | 1200Hz | 0 | 0.012 | 0.004 | 0.08 |
| swoosh | 「+」新建会话 | 600→1400Hz 扫频 | 0.005 | 0.04 | 0.015 | 0.05 |

实现链路：`OscillatorNode`（sine，frequency `setValueAtTime` + `exponentialRampToValueAtTime` 扫频）→ `GainNode` 包络（attack 0 直接落位；sustain 0 → `setTargetAtTime` 以 decay/3 时间常数指数衰减回 1e-4）。AudioContext 在**首次用户手势**时惰性创建（自动播放策略下不报错），右下角「声音 开/关」可关，默认开。

## 内容映射（奕枢）

| 原版 | 本页 |
|------|------|
| Home / Activities（Tasks·Meetings·Calls）/ Agents / Team / Settings | 主页 / 任务（进行中·已排队·已完成）/ 技能 / 记忆 / 设置 |
| 「+」Create new | 「+」新建会话（aria-label） |
| 结形 logo（Raphael Salaja 自绘） | 自绘印章框 + 回环结 40×40 currentColor SVG，未抄原版路径 |
| 搜索框 | 占位「搜会话或技能」 |
| 英文骨架主面板 | 保留骨架条尺寸，全部中文 |

## 可学 / 不学 / 启示

- **可学**：不对称时序（开 300ms 弹簧、收 200ms 直给）——「打开」比「收起」更值得给戏；`@property` 注册自定义属性让它们能 transition；`commitStyles/cancel` 与 `data-instant+offsetHeight` 两个防跳变手法；正弦超短包络的声音审美——gain 0.05–0.1、寿命 <100ms，是「摸得到」而不是「听得见」。
- **不学**：原版用 Tailwind 任意值类名堆多层阴影，可读性差；本页 CSS 自己写，阴影只在原版有值的地方保留（面板、「+」、搜索框、光点辉光），不新增。
- **启示**：状态指示可以拆成两层——脊柱条回应「手在哪」（悬停、即时、可逆），光点回应「状态在哪」（选中、持久、滑动迁移）。手和状态各有一条轨迹，比一根高亮条信息量大得多。
