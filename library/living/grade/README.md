# grade — 悬停变深，邻居不动

来源：[x.com/gabriell_lab/status/2113978631127253395](https://x.com/gabriell_lab/status/2113978631127253395)，2026-10-24。原帖 8.1s，左右对比 Weight 和 Grade。不收原帖的品牌和油画背景。字体 Roboto Flex 可变版（SIL OFL），来自 @fontsource-variable/roboto-flex。

## 机制逐条

- **问题**：`font-weight` 变粗时字也变宽，右边的链接被推开。
- **解法**：用带 GRAD 轴的可变字体，悬停时写 `font-variation-settings:"GRAD" 150`，字变深但字宽不变。
- **可量**：页面实时显示最后一个链接的水平位移。

## 可学 / 不学

- **可学**：状态变化不要引起布局移动。
- **不学**：字体没有 GRAD 轴时这招无效，要先确认字体。
