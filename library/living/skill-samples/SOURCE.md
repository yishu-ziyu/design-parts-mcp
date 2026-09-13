# 设计技能体验样本

收录：2026-09-08。来源：本次 Codex 配置整理任务中实际制作、打开并操作过的四个示例。
用户反馈：四个技能都有用，尤其认可 Apple 面板的交互效果。此记录仅适用于这组样本。

| 样本 | 调用方式 | 可拆的部分 |
|---|---|---|
| [跟手阅读面板](apple.html) | 用 apple-design 做一个能拖动、能中途打断的阅读面板 | 横条拖动、速度投影、弹簧回位、减少动态效果开关 |
| [阅读列表三方案](prototype.html) | 用 prototype 给阅读列表做三种布局，让我切换比较 | 列表／编辑精选／逐篇挑选；数字键和方向键切换 |
| [Kami 一页说明](kami.html) | 用 kami 把方案排成一页，保留所有事实 | 纸色、衬线字阶、数字摘要、段落与页脚 |
| [菜单动效评审](review.html) | 用 review-animations 检查菜单，给出问题和最小修改 | 修改前后对照及 Before / After / Why 评审 |

## 来源

- 实现依据：本机 `.agents/skills` 中的 apple-design、prototype、kami、review-animations。
- 原则参考：[Will's S Design Note / Apple Design / Motion](https://app.notion.com/p/217886bc60ff81ecb6cbc284969775dc)。
- Kami 使用技能自带 one-pager 模板，采用系统中文衬线字体；不依赖远程字体。
- 示例由 Codex 制作，文章为示例短文；不是 Apple 官方组件或官方演示。分钟数为界面示例数据。

## Apple 面板复用边界

`apple.html` 的 `.scene` 是演示场景，`.sheet` 与脚本是交互主体，基础样式在 `base.css`。
拖动使用 Pointer Events；松手后按位置与速度决定展开／收起，动画用 requestAnimationFrame 更新 transform。
本样本两个停靠位置是 0 与 230px，配合固定高度的演示场景。搬到产品时按实际面板高度与可视区域调整，不能直接当作通用弹层组件。
示例尚未实现生产级模态弹层的焦点约束、页面滚动锁定或外部数据保存；适合参考手势机制，不能据此认定完整产品弹层已验收。

## 验证

已在 Codex 应用内浏览器操作：面板展开／拖动收起／重新展开、收藏反馈、三种布局切换、文章内容切换、菜单展开与选择、Kami 页面阅读。
未做真实手机触摸验证或有无技能的效果对照实验。

## 本地打开

从 `living/index.html` 货架进入；所有脚本和样式在本目录，无远程依赖。
直接打开 HTML 即可；也可在设计笔记根目录启动本地静态服务器。
