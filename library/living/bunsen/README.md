含原作素材，只留本机。

# 图坐在页里（Jensen，Robert Bunsen's Sweet Tooth）

来源：https://gwern.net/doc/science/chemistry/2013-jensen.pdf，本地副本 `原料/x-收藏/originals/bunsen/jensen-2013.pdf`。用户 2026-11-05 确认按这份复刻。

注意：旧 `index.html` 写的是「Letter、双栏」，但这份 PDF 是 ACS 书章，**6×9 英寸单栏**。复刻按 PDF，不按旧笔记。

## 机制（数值从 PDF 读出）
- 页面 432×648pt，版心左 54.3pt、宽 324pt。
- 正文 Times 10pt，行距约 11.96pt，两端对齐，段首缩进 17.9pt。
- 摘要左 90.3pt、宽 252pt；引文左 72.2pt、宽 288.1pt。
- 题名 15.9pt 粗体，副题 12pt 粗体，作者 11pt 粗体，单位 10pt 粗体，逐行居中。
- 整幅图放页面上部，下接斜体图注（10pt，居中）。
- 左边竖排出版方下载记录 8pt；页脚 8pt 两行。

## 可学
一种字体、四个字号、窄版心；图和图注占满需要的高度，不和文字绕排。

## 不学
旧笔记里的双栏规则不来自这份 PDF。

## 实现
只复刻前 6 页。每行按 PDF 的基线绝对定位，用脚本从 PDF 生成，所以不是可自动重排的正文模板。Times New Roman 是商业字体，用字宽相同的 Tinos。
