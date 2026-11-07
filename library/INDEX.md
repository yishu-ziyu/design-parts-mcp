# Design parts index

设计零件库的检索入口。每条笔记是 `living/<name>/index.html`，一个能打开的活笔记。

发明表回答「这页是什么」。零件表回答「我要做这一块，打开哪一页的哪一处」。
打开 HTML 看正在转的。不要只抄表。

## 发明

| 打开 | 看见什么 | 什么时候用 |
|------|----------|------------|
| [shenzhen-journal-prints/index.html](living/shenzhen-journal-prints/index.html) | 深圳日常的三枚版画藏品：叠放、抽出、拿近、轮廓与网点显影、局部动态；资料库内独立运行快照，含代码与素材，可整目录复用 | 纸质收藏、生活手账、图像形成过程。用户喜欢的候选方向，旧版均留，未接入原生 App |
| [skill-samples/index.html](living/skill-samples/index.html) | 四个技能样本：可拖动阅读面板、三种阅读列表、Kami 一页排版、菜单动效对照 | 复用交互与排版前先看实际效果。Apple 面板已经过确认 |
| [drag-panel/index.html](living/drag-panel/index.html) | 从阅读标本提炼的原生拖动面板：独立源码、两段停靠、键盘操作与销毁接口 | 需要可安装、可改用的嵌入式面板时。HTTP 运行；本地分发预览，不是完整模态弹层 |
| [press-feedback/index.html](living/press-feedback/index.html) | 从技能样本提炼的原生按钮按压反馈：缩放 0.97、100ms，纯 CSS | 需要保留原生按钮行为的轻微按压反馈时。键盘和减少动态效果模式不缩放；本地分发预览 |
| [chapter-one/index.html](living/chapter-one/index.html) | 斜体长句中，图片占据一个词的位置 | 宣言页、关于页、需要把物体嵌进句子时 |
| [shelf/index.html](living/shelf/index.html) | 奶油色首页。一排 PNG 书脊按负边距叠放，并沿横坐标倾斜循环 | 落地页作品集书架。不是 WebGL 三维 |
| [creed/index.html](living/creed/index.html) | 风景插画中嵌入正在工作的产品窗口，进场动画可重播 | 产品落地页、功能切片。不要使用通用模板 |
| [exposure/index.html](living/exposure/index.html) | 封面从 scale 1.08 落到 1，向下滚动后照片浮现 | 摄影故事、画册落地页、滚动揭示 |
| [type/index.html](living/type/index.html) | 栏宽、行高、破栏图片可当场调整 | 屏幕长文 |
| [bunsen/index.html](living/bunsen/index.html) | Letter 双栏，图片只占一栏 | 论文、小论文、需要印刷的文章 |
| [you-find/index.html](living/you-find/index.html) | 灰纸、花瓣下落、签名按路径揭开 | 干净的个人页、中英夹写 |
| [mosby/index.html](living/mosby/index.html) | 悬挂页签。点选后封面绕 Y 轴翻开，剪贴按坐标落点，可拖动；滚到底部进入下一案 | 案例库、卷宗、以文件夹为界面。内容在 `cases.js` |
| [idols/index.html](living/idols/index.html) | 与 mosby 同一套交互。点贝克勒页签后，桌上照片和便签可单独拖开。其余三格留空 | 偶像档案试版。壳用 mosby，只换内容。先看效果 |
| [pageflow/index.html](living/pageflow/index.html) | 阅读器窗口以纸为主，工具栏默认隐藏 | 阅读器落地页。工具栏悬停后再出现 |
| [thoughtful/index.html](living/thoughtful/index.html) | 深墙上的纸条网格，可添加一条 | 个人站或产品站需要留一句话时。不是评论区 |
| [minifolio/index.html](living/minifolio/index.html) | 三步说明对应三张正在工作的产品卡 | 功能说明、how-it-works。不要另画图标 |
| [almost/index.html](living/almost/index.html) | 将触未触的双手构图，关节上叠着词卡 | 照片作骨架、词卡锚定在关节、同一图再处理 |
| [tubik/index.html](living/tubik/index.html) | 左侧三行声明，右侧圆角视频块 | 工作室首页。先陈述，再给一段正在播放的证据 |
| [stranger/index.html](living/stranger/index.html) | 把陌生网址做成标本的方法：四个定位问题 | 收到网址或截图、需要做成活笔记时 |
| [liquid-glass/index.html](living/liquid-glass/index.html) | 可拖动的折射玻璃。文字弯曲，球体穿过时仍弯曲 | 液态玻璃、折射透镜。不要用 `backdrop-filter` 代替 |
| [gsap/index.html](living/gsap/index.html) | 可重播的时间轴：拆字滑入、Flip 换位、同一路径两种缓动 | 需要时间轴、Flip 或倒放时。文件夹翻开仍走 mosby。不走 CDN |
| [paper-echo/index.html](living/paper-echo/index.html) | 六格纸面动效：弹出、吞入、折角、撕开、同槽交接、弹弓 | 手势不换物件、过阈值才提交。拆字横滑走 gsap。文件夹翻开走 mosby |
| [oasis/index.html](living/oasis/index.html) | 左侧雾与白洞，右侧纸门。白洞边缘缓慢变形 | 登录或进场。不要把表单铺在风景上 |
| [laper/index.html](living/laper/index.html) | 点阵网格按时间画出。Courier 标题。中央是输入卡，底边探出编辑器 | 落地页入口用输入卡，不用 Get started。描线可慢放、可停在一帧。风景窗走 creed |
| [inline/index.html](living/inline/index.html) | 一段话完成导航：事实为黑、从句为灰、可点名词带色块 | 个人介绍不要做成按钮行。窗口变窄后仍是一段话。灰纸走 you-find。图嵌进句子走 chapter-one |
| [../halftone/index.html](living/halftone/index.html) | Bayer 网点在实时运算 | 游戏标题雾、关卡卡 |
| [doodle/index.html](living/doodle/index.html) | 图标按路径逐笔绘制，绘制完成后持续轻微抖动 | 手绘风图标、未干墨水感、涂鸦产品 |
| [handword/index.html](living/handword/index.html) | 印刷体中嵌入三个荧光手写词；关闭蒙版可见绿色矩形 | 正文手写重音、个人站批注、马克笔语义高亮 |
| [orbit/index.html](living/orbit/index.html) | 滚动驱动环形表盘。33 个标签随环倾斜，吸附段停稳后换页 | 作品集、产品线、章节导航 |
| [bento/index.html](living/bento/index.html) | 镜头在 bento 画布上巡游；焦点卡片才播放内部动效 | 一屏展示多项能力、每张卡有独立时间轴。多卡分焦点仍按 creed 摆放风景窗 |
| [triage/index.html](living/triage/index.html) | 黑舞台上 540 方框。勾选行后批量操作条浮现。行含三态复选、来源头像、命题与读数。支持 j/k/x/esc | 批量列表、先选后操作、核查队列。Geist Mono + 18px 双层图标。内容为 user-project 待核查命题 |
| [spine/index.html](living/spine/index.html) | 深色侧栏。父项弹簧展开，子项悬停时脊柱条分档升高，选中项光点滑动，并伴随短合成音 | 树状子导航、当前项指示、需要声音反馈的微交互。内容为奕枢。复刻 lab01.dev UI Experiment #09 |
| [flycam/index.html](living/flycam/index.html) | 左侧 CameraHelper 视锥沿虚线航线移动，右侧为该相机画面。three.js 真栈：MOTION / GRAPHICS / UI / cloner / 文字绕柱 | 需要可见相机：视锥、航线、路径点、POV、一个 renderer 两个窗格。v2 为 WebGL；v1 CSS 3D 已废。CSS 3D 标本走 [nightflight](nightflight/index.html) / [rig](rig/index.html) |
| [nightflight/index.html](living/nightflight/index.html) | 同一套可见相机飞过深夜观测台：手记逐字、月相、猎户座星图、星轨偏光片 | 机制同 flycam v1（CSS 3D）。零件沿用 [#rig](nightflight/index.html#rig) / [#flight](nightflight/index.html#flight) / [#timeline](nightflight/index.html#timeline)，不新增零件。差异在世界、色板与星点 |
| [rig/index.html](living/rig/index.html) | 仅保留相机编辑视图：视锥沿航线移动，路径点依次点亮，底部时间轴横贯，无右窗格 | 只要运镜这一块。右窗格内容可替换或删除 |
| [cogito/index.html](living/cogito/index.html) | 浅色落地页。标题与正文同为 16px。Source / Preview 切换同一份 Markdown 的源码视图与渲染视图 | 产品落地页需要用编辑器界面作为第一屏时使用。源码与预览叠在同一窗口，不要并排两张产品图；标题不必另开字号 |
| [applecut/index.html](living/applecut/index.html) | 黑底 2×2。四段 Apple 产品片同时播放。每格一件产品，其余留空。点一格放大到满框 | 产品片、发布会镜头、需要「一镜一事」和安静背景时。颜色只给产品或 UI。原件是视频，不是网页组件 |
| [bencho/index.html](living/bencho/index.html) | 白底。标题最后一个词按 6 秒换色。三列圆角卡片里是 29 个可点组件 | 组件库首页、需要立刻上手的活样本。Bench 无限画布是另一发明 |
| [cubes/index.html](living/cubes/index.html) | 三枚正方形先画线框再填面，变成立方体。标签贴在正面。站稳后按 2.4 / 3 / 3.8 秒上下漂，相邻反向。悬停抬起 | 品牌能力切成三块、需要看见体积时。CSS 3D。相机飞走 nightflight |
| [querypath/index.html](living/querypath/index.html) | 黑底等轴机房。当前步骤发黄。Follow Maja 后只剩她和散落的订单。Replay 让黄点走完 Application → Parser → shards | 要把一次看不见的计算画成可跟随的旅程时。跟一个人，不要跟流量。Join 热力图是另一发明 |
| [hai/index.html](living/hai/index.html) | 左栏一个珊瑚色 39。右栏九块，A 在正中发橙。点一块列出该簇原则 | 查阅人机原则时按簇打开。同时只开一簇 |
| [flood/index.html](living/flood/index.html) | 淡紫色从左边灌进文件卡。暂停时灌色退去，细条变深。完成后绿勾，底下长出 Change / Download | 文件上传要让进度占满这一行时。投放区走 minifolio |
| [lasso/index.html](living/lasso/index.html) | 圆角框圈住产品上的一块，其余变淡。镜头平移过去。左边按步讲解 | 产品展示页、宣传页、要把一屏里的一块讲清楚时。整卡巡游走 bento |
| [regrid/index.html](living/regrid/index.html) | 五张图三种排法。拖一张会缩小、微转。虚线框是落点，其余滑过去 | 相册、画廊、要把同一组图换成拼贴或横排时 |
| [cite/index.html](living/cite/index.html) | 两段字。一句蓝双下划线。停在上面，片子在段上方淡入，四周渗光 | 正文里要播一段片子时。工作室视频块走 tubik。阅读器工具栏走 pageflow |
| [flagring/index.html](living/flagring/index.html) | 七枚旗帜徽章绕扁椭圆匀速转，前大而清楚，后小而模糊 | 多国家、多币种、多集成的小插图 |
| [grade/index.html](living/grade/index.html) | 两条导航左右对比：字重变粗时邻居被推开，Grade 变深时纹丝不动，实时显示位移 | 导航、标签等悬停加重且不能引起布局移动时 |
| [paperwave/index.html](living/paperwave/index.html) | 一条纸带在五个数值下起伏。每点投影到三维再逐帧重写 SVG，没有 3D 库 | 轻量三维示意、可调参数的小插图。大面积或多实例不适合 |
| [someday/index.html](living/someday/index.html) | 暖米色纸底（`#F1EADD`）、32pt 圆角白卡、58pt 白圆底座承托 Fluent Emoji 3D 图标、底部悬浮三态胶囊栏 | 个人清单、轻量原生工具界面。含 4 枚 3D 图标、iPad 真机截图与 SwiftUI 源码 |
| [album-spine-coverflow/index.html](living/album-spine-coverflow/index.html) | 唱片书脊在透视里排成一面墙，中间只露书脊，两边露封面；点开转到同色专辑页，曲目面板像折页一样翻。 | 收藏型内容想让浏览本身有实体感时。 |
| [pen-sketch-controls/index.html](living/pen-sketch-controls/index.html) | 所有控件都像钢笔画的，线条一直轻微颤动，悬停时重新画一遍。 | 想让界面有手作气质，同时保留原生输入框的可用性时用。 |
| [rag-flow/index.html](living/rag-flow/index.html) | 一张竖向流程卡，五步依次点亮，答案流出来时引用和来源同色互亮。 | 想让人看懂多步 AI 任务走到哪一步、答案引用了什么时用。 |
| [pixel-status-notch/index.html](living/pixel-status-notch/index.html) | 页面顶上垂下黑色刘海，两行状态文字加发光的像素方块，宽度随文字伸缩。 | 给 Agent 或长任务显示当前进度。 |
| [textbox-morph/index.html](living/textbox-morph/index.html) | 一个文本框，打什么就变成什么控件：日程、清单、计时器、拆账、取色。 | 想用一个入口接多种任务，又不想让人先选类型时用。 |
| [progressive-blur/index.html](living/progressive-blur/index.html) | 手机列表滚到屏幕顶和底时，内容一层层糊进去，页头和悬浮按钮保持清楚。 | 固定页头加长列表，或底部有悬浮操作的页面。 |
| [topology-canvas/index.html](living/topology-canvas/index.html) | 一张能拖、能缩放的服务架构图，点节点可以查看、重启、停止。 | 要把项目的服务依赖和运行状态放在一屏里，并能直接操作时用。 |
| [answer-length-drag/index.html](living/answer-length-drag/index.html) | 抓住回答卡片底边的小把手往上拖，多余的词就地缩小消失，回答变短。 | AI 回答太长，想直接调详略，又不想再追问一次时。 |
| [margin-answer-reader/index.html](living/margin-answer-reader/index.html) | 选中一个词，答案就写在它旁边的页边，并用细线连回原文。 | 读长文时想就地问 AI，又不想离开原文、切到聊天窗时。 |
| [thinking-process/index.html](living/thinking-process/index.html) | 灰底上一条竖线串起 AI 的每一步，走不通的路变灰打叉，并行的步骤分叉后再并回。 | 要让用户看懂 AI 怎么得到结果，又不想展示大段原始日志时。 |
| [qr-concept/index.html](living/qr-concept/index.html) | 订单抽屉滑走后，镜头从店面拉远，店面落进二维码的中心，二维码一路缩成取餐页。 | 要把一个有场景感的等待页，连续地切到一个功能性很强的出示页时。 |
| [branching-catalog-tree/index.html](living/branching-catalog-tree/index.html) | 左侧节点一点，细曲线向右展开成树，作品飞到分支末端；点开作品时整棵树模糊，卡片放大到中央。 | 作品或条目多、又想让人一眼看到结构和全貌时。 |
| [food-diary-timeline/index.html](living/food-diary-timeline/index.html) | 拍一桌菜，抽屉里逐个确认，确认后抠图飞进时间线，还能把这桌菜丢进场景里翻滚。 | 记录类应用想让枯燥的录入变成有趣时。 |
| [ai-trace-view/index.html](living/ai-trace-view/index.html) | AI 边查来源边展开结果卡片，结束后整段过程收进一行总结，下面只留答案。 | AI 要跨多个工具取数据，用户既想看过程又主要要结论时。 |
| [folder-open/index.html](living/folder-open/index.html) | 深绿文件夹悬停时像双开门打开，邮票从口袋升起；点击后飞出来落到合上的文件夹前面，第二张可以滑出。 | 做收藏夹、作品集封面这类打开看里面物件的入口。 |
| [list-peek/index.html](living/list-peek/index.html) | 命令面板最底下只露出半行，方向键走到边时下一项已经提前露出来。 | 做命令面板、下拉菜单等定高且能用方向键选择的列表。 |
| [telemetry-dash/index.html](living/telemetry-dash/index.html) | 黑底点阵风的仪表盘，鼠标移动会画出地震波，时钟和字形屏持续跳动。 | 想让监控或状态页有生气，并如实区分真实和模拟数据时。 |
| [sketch-to-onboarding/index.html](living/sketch-to-onboarding/index.html) | 箭头不动，图标从它下面一个个穿过，三步说明跟着换高亮。 | 说明「把数据从别的 App 迁过来」这种有方向的引导页。 |
| [icon-toggles/index.html](living/icon-toggles/index.html) | 一列设置项，每个选项是一枚自定义图标，选中时粉色短线滑过去。 | 设置项选项少、差别能画出来，想让面板比文字下拉更好扫时。 |
| [wiggle-icons/index.html](living/wiggle-icons/index.html) | 一页手绘图标，线条一直在抖，还能一笔一笔画出来，拖一个进标题就能上色。 | 想让品牌或界面带手绘感，或要给图标集做展示页时。 |
| [companion-onboarding/index.html](living/companion-onboarding/index.html) | 桌面压暗后只留一句逐词出现的话，助手问你名字、再用名字回你。 | 想让工具型产品第一次打开时像在认识一个伙伴。 |
| [collage-letters/index.html](living/collage-letters/index.html) | 一个 XP 风格的小程序，打一行字，变成一张张剪报字母，还能抖动和导出。 | 想做手工拼贴风标题，或要一个带复古外壳的小生成器时。 |
| [agent-diagrams/index.html](living/agent-diagrams/index.html) | 智能体的笔记里直接放流程图、顺序图、分组图，还能一步步走。 | 智能体要讲架构或流程，不想回一大段文字时。 |
| [voice-onboarding/index.html](living/voice-onboarding/index.html) | 用说话回答问卷：每题一张换色卡片，转写逐词出现，提到的关键词上色，下方要求项自动填值打勾。 | 问卷问题开放、用户说一段话比点选更自然时。 |
| [highlight-ask-landing/index.html](living/highlight-ask-landing/index.html) | 深色阅读页，选中一个词，工具条浮起，回答落在同高的页边，引线连回原文。 | 做读长文、论文时要边读边问，并且回答要和原文对照的产品。 |
| [genui-map/index.html](living/genui-map/index.html) | 回答说到一半，地图分步长出来，标签、路线和底部卡片互相联动，右上角能换主题，新主题圆形展开。 | 回答里有多个地点要比较，文字说不清楚位置和距离时。 |
| [cross-stitch/index.html](living/cross-stitch/index.html) | 拖动一个小工厂，它实时变成十字绣图样，右栏的针数和用线量跟着跳。 | 想把线稿转成低分辨率针法或点阵，并让人边调边看成品和用量时。 |
| [doodle-appliance/index.html](living/doodle-appliance/index.html) | 一台手绘等距洗衣机，能装衣服、开门、转动和改光线方向。 | 想让人动手理解一个物件怎么工作时用。 |
| [sticker-peel-board/index.html](living/sticker-peel-board/index.html) | 贴纸板上的贴纸能被拉起卷角，整张撕下后贴到便签上，格子里留下灰底。 | 想让收集、标记这类操作有实物手感时用。 |
| [hardware-icons/index.html](living/hardware-icons/index.html) | 一组浅灰外壳加橙色按键的小家电，每个都是一个应用图标。 | 想给图标或空状态加实物感时。 |
| [thought-preview/index.html](living/thought-preview/index.html) | 输入框边打字边给含糊词和数值标色，再从框里长出抽屉，问你说的是不是这一块，并用斜线标出会改到的区域。 | 用户要描述界面改动但说不准名字，发送前想先确认智能体理解对了时。 |
| [dataflow-overlay/index.html](living/dataflow-overlay/index.html) | 深色组件树，悬停一行时左侧长出蓝、紫、绿三种曲线，把数据和回调的来去连起来。 | 要解释值在层级之间怎么流动，或做开发者工具时。 |
| [marble-relief-invite/index.html](living/marble-relief-invite/index.html) | 米灰色页面上一行巨大的蓝字，中间的陶瓶一碰就倒、淌出蓝色液体；鼠标划过石膏浮雕，人物变成深灰。 | 活动邀请页、个人小站这类可以放开玩的页面，想让人动手碰一下时。 |
| [curriculum-graph/index.html](living/curriculum-graph/index.html) | 黑底上一团向上张开的彩色点云在慢慢转，转到某个角度会缩成一条竖线；点一个点，整条前置关系亮起来，其余变暗。 | 要展示几百上千个节点之间的依赖关系，并让人先看到整体形状、再查单条路径时。 |
| [desk-objects/index.html](living/desk-objects/index.html) | 绿色方格桌面上摆着小票、履历卡、两本书和贴纸，能拖、能放大、能翻页、能撕 | 个人主页或作品集，想让用户动手翻看 |
| [stray-cat-catcher/index.html](living/stray-cat-catcher/index.html) | 蓝底上飘着带白边的猫贴纸，拍一张就多一只自己命名的贴纸。 | 做收集类产品，想把拍照到入库做成一条连续动作时用。 |
| [sticker-collage-homepage/index.html](living/sticker-collage-homepage/index.html) | 个人主页四角堆满贴纸，一键飞成整齐的两排。 | 做个人主页，想让人先看到性格，又要能切换到好找的布局时用。 |
| [open-carousel/index.html](living/open-carousel/index.html) | 一圈作品卡转过屏幕，相邻卡片像蜂蜜一样融化拉丝，顶底边缘像厚玻璃。 | 作品集首屏，想让人记住一个材质，而不是一个网格时。 |
| [logo-motions/index.html](living/logo-motions/index.html) | 四个标志同时播放，线条和小图标一步步接力变成最后的标志。 | 做品牌开屏或发布片，想让标志有一段小故事时用。 |
| [question-canvas/index.html](living/question-canvas/index.html) | 米色点阵画布上一张张白色回答卡片，用细线连着；底部一个磨砂提问框；可以飞进一张卡片细读，也能退出来看全部。 | 想让用户围绕一个问题同时追多条线索时。 |
| [avatar-editor/index.html](living/avatar-editor/index.html) | 一只方块里的小狗占满屏幕中央，两侧半透明的形象排开，底部一条小头像；点开始创造进入带资源栏和三环控件的编辑器。 | 想让用户从一堆角色模板里挑一个，再进编辑器修改时。 |
| [js-generative-art/index.html](living/js-generative-art/index.html) | 一张黑白手绘感的仪器工程图，四排面板和管线；红色的信号珠沿管道走，面板上不时亮起红色读数。 | 想把系统图或工艺流程做得有手作和机械感，并让流动看得见时。 |
| [archive-spec-poster/index.html](living/archive-spec-poster/index.html) | 古希腊图像压在终端窗口和构造线上，配等宽小字。 | 想让技术产品看起来有历史感和严谨感时用。 |
| [doodle-walk/index.html](living/doodle-walk/index.html) | 一个黑白手绘小世界，方向键走动，走近建筑才出提示。 | 想把作品集做成可以逛的地方时用。 |
| [camera-frustum-split/index.html](living/camera-frustum-split/index.html) | 左边是相机在场景里的侧视图，右边是这台相机拍到的画面，拖时间轴两边一起走。 | 解释镜头、长画布或三维场景的导航。 |
| [column-deck/index.html](living/column-deck/index.html) | 个人站像 TweetDeck：左边固定侧栏，右边几列各自滚动，点导航列就滑过来并闪一下。 | 个人站或作品集内容分几类，想让它们同时露面而不是分页时。 |
| [cursor-mascot/index.html](living/cursor-mascot/index.html) | 页面顶部的小角色转头看你的鼠标，戳它会压扁并眨眼。 | 想给工具落地页或个人主页加一点活气，又不想上骨骼动画时。 |
| [ornament-drop-caps/index.html](living/ornament-drop-caps/index.html) | 左边写字，右边是书页，首字母变成带卷草的古籍花体，可换样式和颜色。 | 做写作或排版工具，要给内容加一点书卷气，或要可调的首字下沉。 |
| [card-fold/index.html](living/card-fold/index.html) | 一张竖卡，拖一下像真纸一样翻开成横卡，上下露出黑色楔形。 | 想让两态切换有实体感，比如名片、封面、对折信息卡。 |
| [scene-footer/index.html](living/scene-footer/index.html) | 整幅铜版画当页脚，船慢慢开过，链接压在天空的留白上。 | 品牌感强、内容少的官网页脚。 |
| [sample-grid-sequencer/index.html](living/sample-grid-sequencer/index.html) | 米白底上十五条细等宽轨道，黑块跟着节拍跳，左边一张云图被切来切去。 | 要做高密度的专业工具界面，或想让图像跟着节奏变。 |
| [generated-screens/index.html](living/generated-screens/index.html) | 桌面上一块深色面板随语音不断变形：日程、周历、图表、世界地图、客户卡、邮件草稿，说完就消失。 | 想让界面按当前问题临时生成、任务完成就收起，而不是打开固定的应用时。 |
| [sketchbook-flip/index.html](living/sketchbook-flip/index.html) | 几本素描本沿弧线转动，点开后拖动翻页，纸会弯曲，左边刻度可以快速翻。 | 想让作品像实物一样被翻看时用。 |
| [floating-objects-canvas/index.html](living/floating-objects-canvas/index.html) | 标语外环绕一圈物件，进入后是可拖动缩放的白色画布，左边有主题刻度。 | 想让知识或收藏类内容可以随意逛时用。 |
| [texture-cat/index.html](living/texture-cat/index.html) | 一只由黑色横线组成的小猫在页面右边走动，旁边是方块字标题。 | 想做黑白、有信号感的产品首屏时。 |
| [particle-palette/index.html](living/particle-palette/index.html) | 奶白海报上，彩色小圆拼成鱼、海龟和蜥蜴，外面一圈细线框和编号标签。 | 生物、健康、科研类品牌想要有机又带数据感的主视觉时。 |
| [pixel-touch/index.html](living/pixel-touch/index.html) | 白底上四幅拼豆风的像素场景：能拖的地球、会冒气泡环的小屋、能拖手机的城区、一碰就散的黑环。 | 想让技术产品的首屏有手工感和可玩性时。 |
| [motion-bento/index.html](living/motion-bento/index.html) | 一张白色大卡里 8 个功能格，每格底部有斜纹面板，里面的小线框场景在进入视口和悬停时演示功能。 | 官网功能太多、每个又值得一眼看懂时。 |
| [pattern-generator/index.html](living/pattern-generator/index.html) | 同一套方格和噪声不断换尺度和色板，从岛屿、半色调到像素草地，最后变成代码标签。 | 做生成式背景、过场或封面时。 |
| [notch-feedback/index.html](living/notch-feedback/index.html) | 屏幕刘海展开成反馈面板，边说话边圈选页面，圈选序号直接嵌进转写文字。 | 想让用户不离开当前页面就能给 Agent 或同事反馈时。 |
| [month-memories/index.html](living/month-memories/index.html) | 一个月的照片从慢到快落进画面，最后铺成贴满贴纸的海报。 | 做月度或年度回顾、把一批照片变成可分享的结果页时。 |
| [craft-diagram/index.html](living/craft-diagram/index.html) | 一张米色长卷，蓝色蜡笔线描出工序状态图，红点沿线走，旁边的小人和火堆一起动。 | 想讲清一个有分支、有回环、有并行的流程，又希望它有手作温度时。 |
| [scroll-3d-landing/index.html](living/scroll-3d-landing/index.html) | 截图版：漆黑的山寺上挂着血红的月亮，大字夹在寺庙和草丘之间，往下滚场景一层层错开。 | 想用很小的体积替代滚动视频做沉浸式落地页时。 |
| [controller-explore/index.html](living/controller-explore/index.html) | 截图版：黑底光晕里的大手柄，换款时整页颜色跟着变，拖动能转 | 少量高价值商品的展示页 |
| [toon-world/index.html](living/toon-world/index.html) | 截图版：灰色旷野上一群墨黑独眼小生物走来走去，还能自己画一只放进去 | 想让多人共创的小世界有存在感、或做一个能让用户画出角色的入口 |
| [walked-map/index.html](living/walked-map/index.html) | 截图版：城市地图上长出贴纸，一周走过的地方变成一张个人地图。 | 做个人回顾或地点记录，想让数据有收藏感时用。 |
| [floating-card-wall/index.html](living/floating-card-wall/index.html) | 截图版：黑色星空里三行卡片排成弧面，中间一行向右，上下两行向左，名字牌在卡片之间换位。 | 想一次展示很多产出，让首屏有空间感时用。 |
| [js-drawings/index.html](living/js-drawings/index.html) | 截图版：四幅用代码逐笔画出的太阳和月亮，分别是圆珠笔、针线、粉笔和蜡笔的质感。 | 想用纯代码生成有手作感的插图、海报或背景时用。 |
| [piano-film/index.html](living/piano-film/index.html) | 截图版：同一段机器人和黑猫弹琴的动作，左边蜡笔 2D，右边 3D。 | 要并排看两个版本，或想用代码做手绘动画时。 |
| [manga-flip/index.html](living/manga-flip/index.html) | 截图版：上面是动画，下面是同一段变成歪斜分镜的漫画，能翻页，拟声词逐字落下。 | 要做翻书转场、漫画式强调或草稿成品对比时。 |
| [svg-draw-process/index.html](living/svg-draw-process/index.html) | 截图版：顶部信息栏显示阶段和元素计数，插画从草稿线、大色块到细节分批长出来。 | 想展示 AI 或程序生成图像的过程时。 |
| [coffee-zine/index.html](living/coffee-zine/index.html) | 截图版：粉、棕、米三色的做旧杂志跨页，每约 0.9 秒硬切一页。 | 做印刷感版式，或想用节奏展示平面作品时。 |
| [physics-notes/index.html](living/physics-notes/index.html) | 截图版：笔记上长出会动的三维插图，每页是图文并排的可拆解课本。 | 做解释原理的教材、文档或产品宣传时。 |
| [map-essay/index.html](living/map-essay/index.html) | 截图版：灰白纸面上极小的打字机字和撑满版面的大词硬切交替，地图一路放大直到铺满，再被黑方块一格格盖掉。 | 做片头、长文开场或发布短片，想用版式节奏代替转场时。 |
| [promise-wall/index.html](living/promise-wall/index.html) | 一面米色墙上钉满手写纸条，点一张它就抬起来，写新的要亲手钉上去。 | 做留言墙、纪念墙这类想让人慢慢逛、亲手摆放的内容时。 |
| [stamp-loupe-collection/index.html](living/stamp-loupe-collection/index.html) | 网格本上散放的邮票，点一张其余失焦，拖出金属放大镜看细节。 | 想让人慢慢翻看一批有细节的图像时用。 |
| [line-drawn-town/index.html](living/line-drawn-town/index.html) | 标题下一条黑线一路向右，画出房子、树和钟楼，小角色沿线走。 | 个人站或小产品站首屏，想让人记住而不是立刻读信息。 |
| [gps-instrument/index.html](living/gps-instrument/index.html) | 深色画面中央一个线描地球，24 颗彩色菱形卫星绕着转，左上是遥测面板，底部是分步讲解；点地球后信号球扩散，放大后四个圆交于一点。 | 要用可操作的真实模型讲一个技术原理时。 |
| [cutup-reading-poster/index.html](living/cutup-reading-poster/index.html) | 截图版：一张把论文摘录、四色荧光笔和手写评论拼在一起的大海报，中间是四象限图，箭头连回摘录。 | 想把一次阅读的结果做成一眼能看全貌、又不丢原文片段的呈现时。 |
| [transcript-reader/index.html](living/transcript-reader/index.html) | 视频转录稿变成可拖动的文档，按住正文上下拖就能跳进度。 | 做长视频、播客或会议记录的阅读器时用。 |
| [svg-launch-film/index.html](living/svg-launch-film/index.html) | 一批点变成球、卡片、文字和立方体，标题逐字升起，最后翻到亮底收成标识。 | 工具或代码库的发布短片。 |
| [flip-browser/index.html](living/flip-browser/index.html) | 截图版：窗口里只有一条地址栏和一张手绘风格的大图，点图上任何地方，旁边弹出缩略图小卡，然后画面钻进去变成下一张图。 | 做图册、地图、知识探索这类点进去看细节的产品，或想讲清楚「整页都由模型生成」长什么样时。 |
| [stickman-wrecker/index.html](living/stickman-wrecker/index.html) | 一个带火箭筒的像素小人在百科页面上乱飞，字母被炸飞悬在半空，炸开的洞里露出夜景，图片碎成多边形。 | 做彩蛋、404 页或想让人记住的活动页时用。 |
| [product-timeline/index.html](living/product-timeline/index.html) | 白底上一个物件压着巨大的灰色年份，下面一排竖条像山峰，拖动时山峰滑动、物件一格一换。 | 让人按顺序翻看一组有时间先后的条目时用。 |
| [trace/index.html](living/trace/index.html) | Agent 依次查五个来源：每步长出一行在扫光，结果卡开两张收一张，答案逐词流出，最后整串收成「Ran 2 searches and read 3 sources」 | Agent / AI 助手展示工具调用过程、思考轨迹、引用来源。`?t=` 能和原视频逐秒对帧 |
| [die-cut-sticker/index.html](living/die-cut-sticker/index.html) | 同一张抠图左右对照：左边是本子上歪 −8° 的模切贴纸（等宽厚白边、纸感颗粒、软投影），右边是粘进来的矩形截图 | Die-cut sticker / 贴纸 / 抠图白边：让一张图融入画面（blend an image into the scene），不像后贴的截图。先问它在场景里是什么物件 |

| [caret-follow/index.html](living/caret-follow/index.html) | 浏览器里一条输入。指针跟着当前目标的盒子走，先是快捷键，再是竖线，再是亮起的那一行。 | 要演示召唤之后指针也跟着时。 |
| [mode-track/index.html](living/mode-track/index.html) | 分段条的滑块按按钮实测宽度走。点一个站，栏上多一枚锁。 | 同一条检索要在全部、站内、模型之间换，而且站能锁住。 |
| [phrase-travel/index.html](living/phrase-travel/index.html) | 一段话里点一句，这句缩成胶囊，飞到角落的栏上。 | 一句要离开正文、落到另一处继续用时。 |
| [resize-dither/index.html](living/resize-dither/index.html) | 同一幅画面换成 Bayer 网点。窗口变大，点的位置不游走。 | 整幅画面的有序抖动。格子按 CSS 像素钉死。标题雾走 halftone。 |
| [drift-frames/index.html](living/drift-frames/index.html) | 三行画框各有倾斜和速度，页面移动时错开。 | 一堵作品墙。不要每张卡再写一段说明。 |
| [quote-band/index.html](living/quote-band/index.html) | 同一列短句贴两次，接成一条不停的带。 | 短句要循环，接缝不能露。 |
| [dock-reach/index.html](living/dock-reach/index.html) | 底部一排图标，指针靠近的更大，远处回到 1。 | 停靠栏放大。不是菜单。 |
| [quiet-fold/index.html](living/quiet-fold/index.html) | 时钟和一句短句收进高度 0，只留下输入。 | 想把装饰收掉，画面还在。 |
| [sheet-switches/index.html](living/sheet-switches/index.html) | 一张用 1px 缝拼起来的表。每格一个开关。 | 一组轻开关，不要做成散落的卡片。 |

## 零件

按要做的那一块查。同一页可以拆出好几块。锚点是页里的 id。

### 跟手面板 / 方案比较 / 排版 / 动效评审

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 拖动阅读面板 / bottom sheet / 弹簧回位 / 中途打断 | [skill-samples](living/skill-samples/apple.html) | 拖顶部横条，松手回位，回弹过程中可再次抓住。可切换减少动态效果。此例已经过确认 |
| 原生拖动面板 / 源码分发 / 多实例 / 销毁清理 | [drag-panel](living/drag-panel/index.html#panel) | 正式源码在此目录。刚度 490、阻尼 42；嵌入式两段停靠；分发快照由 design-parts-mcp 构建，不手改快照 |
| 按钮 / 按压反馈 / press feedback / CSS / 原生 button | [press-feedback](living/press-feedback/index.html#buttons) | 缩放 0.97、100ms；原生键盘和禁用行为；无需 JavaScript 控制器，分发文件以逐项清单为准 |
| 同一组件做三种方向 / 可切换原型 | [skill-samples](living/skill-samples/prototype.html) | 底部切换列表、精选和逐篇；按 1–3 或方向键；点开示例正文 |
| 一页说明 / Kami 纸色衬线排版 | [skill-samples](living/skill-samples/kami.html) | 原模板字阶、数字摘要、段落和页脚；保留此样张的配色，不提升为全局色板 |
| 菜单出现太慢 / 缩放起点 / 动效评审 | [skill-samples](living/skill-samples/review.html) | 点击左右菜单，比较 700ms 与 180ms 的效果，再读修改理由 |
| 暖米色纸底 + 圆润白卡 + 3D 图标底座 | [someday](living/someday/index.html#stage) | 纸底 `#F1EADD`、白卡 `#FFFEFA`（32pt 圆角）、58pt 纯白圆底托 46pt Fluent Emoji 3D 图标、底部三态胶囊 `#nav` |

### 文件 / 上传

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 拖文件 / 投放区 / drop zone / 选文件上传 | [minifolio](living/minifolio/index.html#drop) | 虚线框。Choose file or drag & drop。上限 5MB。点选或拖入，文件留在这台电脑 |
| 上传失败 / Try Again / 文件错误态 | [minifolio](living/minifolio/index.html#files) | `designSystem.pdf` 3MB，红字 Upload failed + Try Again + 垃圾桶 |
| 上传成功 / 已传文件行 | [minifolio](living/minifolio/index.html#files) | `components.pdf` 1.2MB Uploaded。失败和成功必须同时在 |
| 客户端处理、文件不上网 | [minifolio](living/minifolio/index.html) | 整页。压缩和检查都在这台机器上 |
| 进度铺满整张卡 / 文件行灌色 | [flood](living/flood/index.html#card) | 淡紫色从左变宽。细条同一百分比。0% 仍留 16px |
| 暂停拿掉灌色 | [flood](living/flood/index.html#pause) | 灌色透明度收到 0，细条改炭灰。Uploading 换成 Paused |
| 完成后 Change / Download | [flood](living/flood/index.html#actions) | 浅灰托盘。绿勾、垃圾桶、两颗按钮 |

### 文件夹 / 档案 / 容量

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 叠在一起的文件夹卡 / fan stack | [minifolio](living/minifolio/index.html#stack) | Images 248。悬停时后方卡片让开。点击切换一叠 |
| 容量条 / storage bar / 已用空间 | [minifolio](living/minifolio/index.html#storage) | 97 / 128 GB。Photos 48、Documents 13、Videos 26、Sounds 10。条子进场会长 |
| 档案柜 / 悬挂页签 / 案例列表 | [mosby](living/mosby/index.html#files) | 探出的页签叠层，层距 60px |
| 文件夹翻开 / 封面铰链 | [mosby](living/mosby/index.html) | 点任一页签。封面 `rotateY(0 → −180)`，1.5s `power3.inOut`，Flip 到纸面 |
| 案例作为文件，不要卡片墙 | [mosby](living/mosby/index.html) | 整页发明。颜色跟随案例。换内容改 `cases.js` |
| 偶像档案 / 贝克勒试版 | [idols](living/idols/index.html) | 同一套交互。点 `KENENISA BEKELE`。空格标注待归档，不虚构人物 |
| 标题拆字滑入 | [mosby](living/mosby/index.html) | 每个字 `xPercent −150`，0.65s 才开始，间隔 25ms |
| 剪贴簿精确落点 | [mosby](living/mosby/index.html) | 簇的 `x` 乘 1.1。便签撑开，照片 `left/top/width/rotate` |
| 拖文件夹 / 拖剪贴 | [mosby](living/mosby/index.html) | 宽屏。边界是内容宽的 1.1 倍。Lenis 管竖向滚 |
| 下一案小窗 | [mosby](living/mosby/index.html) | 滚过 300px 出现。底边再滚 2000px 自动翻下一案 |

### 阅读 / 批注 / 工具栏

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 工具栏默认隐藏 / 悬停后出现 | [pageflow](living/pageflow/index.html#win) | 150ms。初始为灰带 Hover your cursor here |
| 阅读器落地页 / 以纸为产品 | [pageflow](living/pageflow/index.html) | 窗口内的纸张。不要先放一排图标 |
| 荧光笔、下划线、书签画在正文里 | [pageflow](living/pageflow/index.html#win) | highlight / underline / bookmark 就是句子上的底 |
| 行内片子 / 下划线当播放器 | [cite](living/cite/index.html#mark) | 蓝双下划线。停在上面，片子才出现 |
| 贴在段上的片子 | [cite](living/cite/index.html#clip) | 栏宽 84%，3:2。220ms 淡入。循环，静音 |
| 渗光跟着画面走 | [cite](living/cite/index.html#bloom) | 同一片子放大模糊，垫在后面 |

### 悬停 / 导航 / 三维示意

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 导航悬停加深不推开邻居 / 字重抖动 | [grade](living/grade/index.html#grade) | font-variation-settings "GRAD" 0→150，120ms |
| 徽章环绕轮播 / 前大后模糊 | [flagring](living/flagring/index.html#ring) | 缩放、模糊、层级三个数做空间感 |
| 纯 SVG 三维波浪 / 不用 3D 库 | [paperwave](living/paperwave/index.html#wave) | 点阵投影 + 逐帧重写路径 |
| 胶囊数值条 / 拖动改参数 | [paperwave](living/paperwave/index.html#pills) | 按住左右拖，等宽数字，方向键可用 |

### 批量选择 / 队列 / 工具条

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 黑舞台 + 540 方框 + 框下 meta | [triage](living/triage/index.html#frame-plate) | 黑底一格 68px 极淡网格。框下 meta：`UI EXPERIMENT · 批量选择`、字体/图标标注、三色票 #F6F8FC / #868FA0 / #202124 点击复制（亮色 tooltip 出十六进制）、右下外链箭头 |
| 真字体本地化 / 不联网也有字 | [triage](living/triage/index.html#font-local) | Geist Mono woff2 落在 `fonts/`，@font-face 相对路径 + 可变字重 100–900；中文回退系统字体。打开零请求 |
| 三态复选框驱动全选 / 部分横线 / 全清 | [triage](living/triage/index.html#tri-state) | 18px、圆角 4、白底 + 1px ring；checked = 灰底 + 内侧高光 + 描边对勾；`indeterminate` = 一横。点主框：有勾全清，无勾全选（源 `syncMainFromItems / onMainChange`） |
| 勾选才浮现的批量操作条 | [triage](living/triage/index.html#toolbar) | 有勾 `display:flex` + 子项 40ms 错峰上升（源同名 reveal，0.4s spring），全取消收回。条内含「已选 N 项」mono 读数 |
| 行结构 / hover 浅底 / 来源头像点 | [triage](living/triage/index.html#row) | 行 = 复选框 + 域名首字母圆点（颜色按域名稳定散列）+ 命题 + meta 读数；hover #E8EDF7 过渡，勾选反色 #202124 |
| 键盘路径 / 焦点描边 | [triage](living/triage/index.html#keys) | j/k 移焦点行（1px 深色描边，越界夹住不丢焦点）、x 切勾选、esc 清空；焦点与鼠标点行、复选框自身走同一套状态更新函数 |
| 深色 tooltip / 缩放淡入 | [triage](living/triage/index.html#tooltip) | 按钮的兄弟 span。`scale .95→1 + opacity`，origin bottom，180ms，非瞬跳 |
| 行折叠归档 / 队列计数递减 | [triage](living/triage/index.html#archive-collapse) | 先量高再收到 0、右移淡出后摘节点；侧栏计数同步减。reduced-motion 直达 |
| 状态片脉动 / 派发后呼吸 | [triage](living/triage/index.html#toolbar) | 点「派发核查」状态片变「排查中」+ 1.8s 呼吸。reduced-motion 无脉动 |

### 侧栏 / 子导航 / 合成音

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 手风琴不对称时序 / aria-expanded + inert | [spine](living/spine/index.html#accordion) | 点「任务」展开 300ms `ease-spring`、收起 200ms `ease-in-out`；高度 `0→auto` 过渡靠 `interpolate-size:allow-keywords`；箭头 `-rotate-90` 转正，子容器 `inert` 联动 |
| 脊柱条 / 悬停跟手三档高度 | [spine](living/spine/index.html#spine) | 子导航左缘 10px 宽条，`--bar-height` 注册 `@property` 才能过渡；三档 10/47/84px，升高 0.3s spring、缩没 0.1s ease-in-out；`pointerleave` 先 `commitStyles()` 再 `cancel()` 防跳变 |
| 滑动光点 / 当前项指示 | [spine](living/spine/index.html#dot) | 6px primary 圆 + 辉光，translate 三档 0/37/74px；初次落位 instant（`data-instant` + `offsetHeight` reflow），已显示才 0.2s 滑动；点叶子 `data-current` 迁移 |
| UI 合成音 / 正弦超短包络 | [spine](living/spine/index.html#sfx) | pop（400→200Hz）/ tap（1200Hz）/ swoosh（600→1400Hz），惰性 AudioContext，右下角可关。源音色包「Minimal」，作者 Raphael Salaja |

### 落地 / 产品窗 / 说明

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| how-it-works / 三步不要三个图标 | [minifolio](living/minifolio/index.html) | 三张正在工作的产品卡对应三步 |
| 产品窗口嵌入风景 | [creed](living/creed/index.html#stage) | 天空、正在使用的窗口、胶囊导航 |
| 功能切片 / 用产品界面演示 | [creed](living/creed/index.html) | 向下滚动。左文案，右色垫上的小窗口 |
| 胶囊导航 | [creed](living/creed/index.html#stage) | 顶部白胶囊。进场从透明收到实心 |
| 作品集书脊排架 / PNG 叠层 | [shelf](living/shelf/index.html#hero) | 书为导出 PNG。悬停时左右让开 |
| 摄影封面落下 / 照片作为章节 | [exposure](living/exposure/index.html) | 封面从 1.08 落到 1。向下滚动后图片浮现 |
| 点阵网格落地页 / 施工线绘制 | [laper](living/laper/index.html#draw) | 7px 点阵。线用 clip-path 拉开，不是淡入。钉延迟 420ms。关闭「描线」后只剩文字 |
| 施工线复刻 / clip-path 窗帘 | [laper](living/laper/index.html#lab) | 竖线、横线、钉、对照用的错误淡入。时间表可停在一帧，慢放 ¼ |
| 入口是输入卡 / 不是 Get started | [laper](living/laper/index.html#compose) | 白卡 628×145，圆角 32。关闭「输入卡」后出现按钮，作为对照 |
| 底边探出产品窗口 / 编辑器 | [laper](living/laper/index.html#peek) | 窗口位于图纸下方。整窗风景走 [creed](creed/index.html) |
| 源码与预览叠在同一产品窗口 | [cogito](living/cogito/index.html#swap) | Source / Preview 分段控件 200ms；两张 2212×1746 PNG 叠层，图片无淡入。显示框高度为宽度的 64.5% |
| 标题与正文同号，用字重和灰色分层 | [cogito](living/cogito/index.html#copy) | 16px / 28px，字重 700 / 400，`#0a0a0a` / `#5c5c5c`。一处强调色 `#d9621a` |
| Source / Preview 分段滑块 | [cogito](living/cogito/index.html#swap) | 145×26，内边距 3px，12px Medium，白滑块 `200ms cubic-bezier(0, 0, .2, 1)`。过渡只作用在滑块 |
| 工作室首页 / 声明加视频块 | [tubik](living/tubik/index.html#hero) | 浅灰。左三行大字，右 37vw 圆角视频块 |
| 三行标题用左边距错位 | [tubik](living/tubik/index.html#lines) | 6.3 / 1.5 / 8.5 vw。关闭「三行错位」后齐左 |
| 视频块上的玻璃播放钮跟随指针 | [tubik](living/tubik/index.html#reel) | 6.25vw 圆，毛玻璃。进入方盒后箭头隐藏 |
| 导航词复制一行向上滑动 | [tubik](living/tubik/index.html#nav) | 一词写两遍，容器只露一行。contact us 为蓝色 |
| 奖项横排在声明下方 | [tubik](living/tubik/index.html#awards) | 五个小标，间距 4.4vw。不是跑马灯 |

### 个人页 / 留言 / 字

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 干净个人页 / 灰纸 / 中英夹写 | [you-find](living/you-find/index.html) | 栏宽 624。英文 Newsreader 斜体 |
| 签名按路径揭开 | [you-find](living/you-find/index.html) | 名字用揭开，不要每帧重绘路径 |
| 花瓣下落 | [you-find](living/you-find/index.html) | 气氛层可关闭 |
| 墙上留一句话 / 不是评论区 | [thoughtful](living/thoughtful/index.html#grid) | 纸条、胶带、轻微倾斜 |
| 写下之前先看见自己的纸 | [thoughtful](living/thoughtful/index.html#cta) | add yours。颜色和胶带是在选择物件 |
| 一段话完成导航 / 链接是句法 | [inline](living/inline/index.html#flow) | 一个 p，词为 span / a。关闭「卡片墙」后可见句子为何必须保持流动 |
| 三层墨 / 先降低次要对比 | [inline](living/inline/index.html#layers) | 黑事实、灰从句、色块名词。降低清晰度后色块仍在 |
| 色块换行不断开 / box-decoration-break | [inline](living/inline/index.html#chip-wrap) | 320 栏黄底。底色随每一行裁切，不是跨行大矩形 |
| 图片占据一个词宽 | [chapter-one](living/chapter-one/index.html#op) | 书、钞票、报纸占一个词的位置 |
| 词卡叠在照片上 / 知识图锚在手上 | [almost](living/almost/index.html#graph) | 玻璃白与橙块。细白线连到指尖。词取自原片 |
| 将触未触构图 | [almost](living/almost/index.html) | 空隙比接触更重要。双手是骨架，不是装饰 |
| 同一张图再处理 / 紫橙网点 | [almost](living/almost/index.html#process) | 原片中的处理帧。游戏标题雾仍走 [halftone](halftone/index.html) |

### 排版 / 印

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 屏幕上的文章 / 70ch / 行高 1.8 / 图破栏 | [type](living/type/index.html) | 按钮能把栏挤扁、把图关进栏里 |
| 要印的论文 / 双栏 / 图只占一栏 | [bunsen](living/bunsen/index.html#stage) | Letter。图题是一句完整的话 |

### 纸 / 手势 / 跟手

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 字母 squash 弹出 / 一次停 | [paper-echo](living/paper-echo/index.html#pop) | `50% 80%` 原点，560ms，间隔 55ms。副标题 clip-up。不是循环 |
| 碎片拖到纸上，松手吞没，纸上长出标记 | [paper-echo](living/paper-echo/index.html#compose) | 飞向纸心缩到 0.15，420ms 从中心长出来 |
| 3D 折角 / 纸背 / 字被盖住 | [paper-echo](living/paper-echo/index.html#fold) | 角 `rotate3d`。过 0.42 折住，不够弹回。闲时角呼吸。两折成飞机。文件夹翻皮走 [mosby](mosby/index.html) |
| 圆角卡变成尖头，沿脊撕开 | [paper-echo](living/paper-echo/index.html#dive) | 10 点多边形。0.4 折，再 0.6 成标枪。盖满后左右撕 |
| 同槽交接 / 飞机缩封皮长 | [paper-echo](living/paper-echo/index.html#return) | 同一中心 slot-in / slot-out。底线 ink-draw |
| 两档下拉：拆开，再吞进抽屉 | [paper-echo](living/paper-echo/index.html#return) | 过 28px 拆开。过 108px 缩小进抽屉 |
| 弹弓 / 过线橡胶筋 / 体积守恒 squash | [paper-echo](living/paper-echo/index.html#sling) | 皮筋 SVG 跟手。拉不够弹回 |
| 窗灯开花 / 方块先矮再胀过再收回 | [paper-echo](living/paper-echo/index.html#sling) | 六盏按序开，220ms 一盏。灯开完才能拉 |
| 过阈值才提交 / 手势不换物件 | [paper-echo](living/paper-echo/index.html) | 整页语法。达到阈值才提交，未达到则 `snap` 回去。单击不算提交 |

### 时间轴 / GSAP

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 时间轴 / stagger / 拆字滑入 | [gsap](living/gsap/index.html#hero-block) | `xPercent −150`，0.7s，间隔 25ms，`power3.inOut`。可重播 |
| Flip 换位 | [gsap](living/gsap/index.html#flip) | `getState → 改 DOM → from`。整案翻皮走 [mosby](mosby/index.html) |
| 同一段路两种缓动 | [gsap](living/gsap/index.html#ease) | none 对 power3.out。截图看不出 |

### Bento 画布 / 镜头 / 卡内微动效

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 大画布镜头巡游 / scale+translate 依次聚焦 | [bento](living/bento/index.html#camera) | overflow:hidden 视口对 2400×1900 画布做 `translate+scale`，1800ms `cubic-bezier(0.65,0,0.35,1)`，宽景→A→B 一圈 ≈15.6s。点卡或按钮跳焦点，再播重置。画布外的空纸要夹住 |
| 光标走到流程节点 / 节点高亮再灭 | [bento](living/bento/index.html#builder) | 一段 `cursorWalk 5.5s` transform 关键帧 + 两个节点 `glowA/glowC` 按百分比亮灭，纯 CSS。镜头到达才挂 `.play`，离开即摘 |
| 用户消息逐字打出 → 绿点 toast → 回复滑入 | [bento](living/bento/index.html#chat) | 34ms/字 + `blink` 光标；toast 和回复是 `transform+opacity 350/450ms` 滑入，不单靠 fade。离开焦点复位，回来重播 |
| 折线描线 + 光标沿线 + 双行 tooltip | [bento](living/bento/index.html#chart) | `stroke-dasharray=总长`，rAF 2.2s 推 dashoffset；`getPointAtLength` 拖红点，tooltip 两行数值跟点；CSAT 迷你线同法；横条 `width 900ms`。reduced-motion 直达终态 |
| 圈选一块 / 框外变淡 | [lasso](living/lasso/index.html#lasso) | 圆角 20px。白影盖住框外。和镜头同一条 820ms 缓动 |
| 镜头跟着圈选走 | [lasso](living/lasso/index.html#view) | `translate + scale`，原点 0 0。走查时焦点偏在目录右侧 |
| 步骤目录 / 点一步镜头过去 | [lasso](living/lasso/index.html#narrator) | 四步。当前黑，其余淡。指尖蓝圈 46px `#2f6dff` |
| 三种排法 FLIP 同一组图 | [regrid](living/regrid/index.html#board) | 拼贴 / 主图 / 横排。550ms power3.inOut |
| 拖动让位 / 虚线落点 | [regrid](living/regrid/index.html#ghost) | 拖起 128×168、−8°。虚线框插到哪一格，其余让开 |
| 排法胶囊 | [regrid](living/regrid/index.html#bar) | 三个按钮。当前白底 |

### 产品片 / 发布会镜头

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 一格一事 / 黑底四分格同时对照 | [applecut](living/applecut/index.html#stage) | 原片 9.33s、3840×2160、60fps。本页 1920×1080 循环。每格一件产品，背景 #000 |
| 点一格放大到满框 | [applecut](living/applecut/index.html#solo) | `scale(2)`，原点为该角，0.45s `cubic-bezier(.2, .7, .2, 1)`。再点或「四分格」回到 2×2 |
| 组件库首页 / 目录即实机 | [bencho](living/bencho/index.html#grid) | 三列，间距 12px。卡片 472×约 300–364，圆角 28px，底 `rgba(23,24,26,.06)`。29 张均可点 |
| 标题轮换一个词并染色 | [bencho](living/bencho/index.html#copy) | tune / bench / share / take。色 `#2231dd / #b8431c / #7c3aed / #17181a`。字母交错 18ms，约 6s 一轮 |
| 点选芯片、邻居被推开 | [bencho](living/bencho/index.html#magnet-select) | GROW / ROOM / AURA。衰减用 exp。远芯片每步晚 22ms |
| 搜索盒从圆变成条 | [bencho](living/bencho/index.html#seek) | 一个物体。关闭 44、打开 320，镜头 inset 13，先压 90ms |
| 按钮躲开指针后认输 | [bencho](living/bencho/index.html#escape) | 从家位置计算。`flee=(1-d/r)^2`。键盘不移动 |
| 药丸即面板 | [bencho](living/bencho/index.html#liq-create) | 先缩再铺开。行延迟 70+i×38。点可见盒外关闭 |
| 滑块提交是变形不是交接 | [bencho](living/bencho/index.html#slide-confirm) | 偏移在第一次移动时取。手柄变宽，右缘不动 |
| 卡片下沉而不是抬起 | [bencho](living/bencho/index.html#tilt) | `rx = -ny * tilt`。阴影收紧。透视在框架上 |
| 填充有质量的滑条 | [bencho](living/bencho/index.html#slosh) | 手柄跟手。填充是第二根弹簧。弯月用 clip-path |
| 一行一根弹簧的清单 | [bencho](living/bencho/index.html#checklist) | 填色、勾、删线读同一个数。全部完成后从下塌 |
| 播放器开合由一个数驱动 | [bencho](living/bencho/index.html#sound) | 宽不变，高 78→189。封面是铰链 |
| 正方形长成等轴立方体 | [cubes](living/cubes/index.html#field) | 边长 148px。六个面。转角 `rotateX(-26deg) rotateY(-38deg)`，三枚相同。标签在正面上 |
| 先线框后按对边填色 | [cubes](living/cubes/index.html#build) | 01 → 02 → 03，间隔 520ms。正面与背面 → 两侧 → 顶底。站稳后才漂 |
| 错相上下漂 / 悬停另起一层 | [cubes](living/cubes/index.html#drift) | 2.4 / 3 / 3.8s，中间反向。悬停在 `.lift`：−22px、scale 1.06 |
| 等轴机房地图 / 当前步发亮 | [querypath](living/querypath/index.html#iso) | `rotateX(58deg) rotateZ(-44deg)`。Parser 金，其余轮廓 |
| 跟住一个人 / 其余变淡 | [querypath](living/querypath/index.html#follow) | Maja id 32 在 shard 3，订单散在 1 与 2 |
| 黄点 Replay | [querypath](living/querypath/index.html#replay) | Application → Parser → Planner → Executor → shards，340ms 一步 |
| 九宫目录 / A 居中发橙 | [hai](living/hai/index.html#stage) | 左 39，右 3×3。点一块打开该簇。同时只亮一簇 |
| 进度铺满整张卡 | [flood](living/flood/index.html#card) | 灌色从左变宽。细条同一百分比。0% 最小宽 16px |
| 暂停拿掉灌色 | [flood](living/flood/index.html#pause) | 灌色透明度 0，细条 #3a3a40，Uploading → Paused |
| 完成后 Change / Download | [flood](living/flood/index.html#actions) | 浅灰托盘。绿勾、垃圾桶、两颗按钮 |

### 进场 / 门 / 雾

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 一半风景一半门 / 表单不要盖在英雄图上 | [oasis](living/oasis/index.html#stage) | 右半是纸，inset 10px，圆角 10。悬停后门移开 |
| 雾中挖白洞 / 边缘缓慢变形 | [oasis](living/oasis/index.html#stage) | 6 点 cardinal，半径 330–350，1.2–2s sine。焦散从极光 PNG 的透明处渗出 |
| 颗粒层不覆盖门 | [oasis](living/oasis/index.html#stage) | `noise.png` 80px，透明度 0.6。位于 shader 之上、白洞之下 |
| 一个主按钮、一个次按钮 | [oasis](living/oasis/index.html#stage) | 影子 5→10，0.3s。不要接入真实登录 |

### 玻璃 / 透镜

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 液态玻璃 / 折射透镜 / feDisplacementMap | [liquid-glass](living/liquid-glass/index.html#stage) | 拖动圆角玻璃，文字弯曲；球体穿过时仍弯曲。底部 × 收到底边后变成按钮 |
| 玻璃收成 FAB | [liquid-glass](living/liquid-glass/index.html#fab) | 500ms 收起，600ms 展开。圆角随边长变化 |
| 玻璃预设 | [liquid-glass](living/liquid-glass/index.html#panel) | Simple / Thick / Frosted / Cut / Orange plexiglass |

### 可见相机 / 透视飞行 / 双向时间轴

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 真 three.js 接入 / file:// 直开 / 本地 vendor | [flycam](living/flycam/index.html#part-vendor) | `vendor/three.min.js` = r147 UMD（`npm pack three@0.147.0` 取 `build/three.min.js`），普通 `<script src>`；ES module 会被 CORS 拦。运行时零网络 |
| 一个 renderer 两个窗格 / scissor 双遍 | [flycam](living/flycam/index.html#part-panes) | 一块 canvas 铺满两窗格，`setScissorTest(true)` + 每帧两次 `setViewport/setScissor/render`；雾按相机深度算，逐遍改 `FOG.near/far`（编辑视图抬到 1e6） |
| CameraHelper 黄视锥 / 视锥沿航线走 | [flycam](living/flycam/index.html#rig) | 原生 `CameraHelper(shotCam)`：左窗格渲染时把 shotCam 的 near/far 收成 8/620（不然是根长针），`setColors()` 收成单一暖色。CSS 版对照在 [rig](rig/index.html) |
| 虚线航线 / 路径点点火 / 站号 | [flycam](living/flycam/index.html#part-rig) | `Line` + `LineDashedMaterial` + `computeLineDistances()`；5 枚八面体 `t ≥ 到达时刻` 换 material；站号 01–05 是 Sprite |
| POV 铸镜头 / 时间轴驱动相机 | [flycam](living/flycam/index.html#part-camrig) | 6 个体位（位置 + lookAt 目标）+ 段长；position 段内 smoothstep、lookAt 线性插值（前 62% 稳住看本站，62→82% 转头看下一站）；无 null、无 parenting、scrub 精确 |
| CanvasTexture 排版卡 / 假 UI / 文字绕柱 | [flycam](living/flycam/index.html#part-cards) | 卡与柱面字都是 canvas 现画（衬线大字 + 等宽小字 + 琥珀），anisotropy 拉满；柱面用实底画布 + FrontSide |
| 双向时间轴 / 拖动同步两窗格 | [flycam](living/flycam/index.html#timeline) | rAF 推 t；拖拽 scrub、菱形跳关键帧、`?demo=progress=X` 定帧、`?rm=1` 拍 reduced-motion 帧；两窗格 + 时间轴同吃一个 `render(t)`。CSS 版同款在 [nightflight#timeline](nightflight/index.html#timeline) |
| 真 3D 透视飞行（CSS 3D 版）/ 相机推进反算卡片位移 | [nightflight](living/nightflight/index.html#flight) | v1 系做法：外层 `perspective:900px` + 场景 `preserve-3d`；卡世界坐标固定，场景整体 `translate3d(-cam)`；缓动是 t 的纯函数，scrub 天然与播放一致 |
| 便利贴逐字 / 打字进度换算 | [nightflight](living/nightflight/index.html#typenote) | 字符数 = t 在打字窗口内线性映射；窗口必须套着卡片在画面里的时段 |

### 方法 / 网点

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 陌生网址或截图要做成活笔记 | [stranger](living/stranger/index.html) | 先回答四个定位问题。第一屏先复原机制 |
| 游戏标题雾 / Bayer 网点 | [halftone](living/halftone/index.html) | 网点实时运算。关卡卡离线烘焙 |

### X 收藏复刻

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 透视书脊墙 | [album-spine-coverflow](living/album-spine-coverflow/index.html#wall) | 首页拖动 |
| 封面放大转场 | [album-spine-coverflow](living/album-spine-coverflow/index.html#fly) | 点任意书脊 |
| 折页翻页条 | [album-spine-coverflow](living/album-spine-coverflow/index.html#strip) | 专辑页右侧横向拖动 |
| 迷你播放条 | [album-spine-coverflow](living/album-spine-coverflow/index.html#mini) | 底部 |
| 把控件画成手绘墨迹 | [pen-sketch-controls](living/pen-sketch-controls/index.html#s1) | 第一屏所有控件 |
| 让线条持续抖动 | [pen-sketch-controls](living/pen-sketch-controls/index.html#boil) | 右下角卡片的边框 |
| 悬停时重绘 | [pen-sketch-controls](living/pen-sketch-controls/index.html#redraw) | 鼠标移到 Retry 按钮上 |
| 把多步任务拆成可见阶段 | [rag-flow](living/rag-flow/index.html#pipeline) | 整张卡片按 Run pipeline 看走动 |
| 让引用和来源对应起来 | [rag-flow](living/rag-flow/index.html#docs) | 悬停正文里的序号 2，看来源行光晕 |
| 流式输出正文 | [rag-flow](living/rag-flow/index.html#answer) | Generate 阶段的正文和光标 |
| 显示累计耗时 | [rag-flow](living/rag-flow/index.html#clock) | 右上角胶囊 |
| 做会伸缩的黑色刘海 | [pixel-status-notch](living/pixel-status-notch/index.html#notch) | 页面顶部黑块 |
| 做像素方块加换字动画 | [pixel-status-notch](living/pixel-status-notch/index.html#btm) | 刘海下行 |
| 做生成时的 0/1 雨 | [pixel-status-notch](living/pixel-status-notch/index.html#rain) | 页面底部，Creating prototype 时出现 |
| 让输入框变形成卡片 | [textbox-morph](living/textbox-morph/index.html#box) | 输入 25 min focus，看外框变高 |
| 按文字生成控件 | [textbox-morph](living/textbox-morph/index.html#out) | 输入 split 2400 between 3，改人数 |
| 保留用过的结果 | [textbox-morph](living/textbox-morph/index.html#list) | 回车后看下方列表 |
| 做顶部渐进模糊 | [progressive-blur](living/progressive-blur/index.html#pbTop) | 手机顶部，标题滚到页头下方时 |
| 做底部渐进模糊 | [progressive-blur](living/progressive-blur/index.html#pbBot) | 手机底部，照片滑到按钮后面时 |
| 做玻璃药丸按钮 | [progressive-blur](living/progressive-blur/index.html#fab) | 底部 Create New Event |
| 展示服务依赖关系 | [topology-canvas](living/topology-canvas/index.html#canvas) | 整块画布，拖节点、点缩放 |
| 画直角连线 | [topology-canvas](living/topology-canvas/index.html#edges) | 节点之间的折线 |
| 在节点上直接操作 | [topology-canvas](living/topology-canvas/index.html#pop) | 单击 api 节点 |
| 用拖动控制长度 | [answer-length-drag](living/answer-length-drag/index.html#hd) | 卡片底边的把手 |
| 让删词过程看得见 | [answer-length-drag](living/answer-length-drag/index.html#clip) | 卡片里缩小消失的词 |
| 显示这一档的阅读时间 | [answer-length-drag](living/answer-length-drag/index.html#read) | 卡片右下角小字 |
| 选中文字后提问 | [margin-answer-reader](living/margin-answer-reader/index.html#tb) | 选区上方的深色工具条 |
| 把答案放在原文旁边 | [margin-answer-reader](living/margin-answer-reader/index.html#doc) | 右侧页边卡片和连线 |
| 针对全文提问 | [margin-answer-reader](living/margin-answer-reader/index.html#bar) | 底部悬浮输入条 |
| 显示 AI 正在做什么 | [thinking-process](living/thinking-process/index.html#trace) | 文字逐行追加，进行中和完成用两句话 |
| 表达失败和并行步骤 | [thinking-process](living/thinking-process/index.html#lines) | 左侧竖线的虚线和实线分叉 |
| 展示读过的文件 | [thinking-process](living/thinking-process/index.html#pills) | 第一步下面的白色药丸 |
| 订单抽屉、状态切换 | [qr-concept](living/qr-concept/index.html#d1) | 抽屉标题和三段进度 |
| 店面到二维码的连续镜头 | [qr-concept](living/qr-concept/index.html#world) | 下拉抽屉后的整段转场 |
| 二维码从大缩小 | [qr-concept](living/qr-concept/index.html#qrwrap) | 转场后半段 |
| 带数字的分类节点 | [branching-catalog-tree](living/branching-catalog-tree/index.html#nodes) | 左侧三级节点 |
| 缩略图错峰飞出 | [branching-catalog-tree](living/branching-catalog-tree/index.html#items) | 点 Logo、Digital、Physical |
| 渐隐的细曲线树 | [branching-catalog-tree](living/branching-catalog-tree/index.html#lines) | 节点到缩略图的连线 |
| 背景模糊的放大卡片 | [branching-catalog-tree](living/branching-catalog-tree/index.html#modal) | 点任意缩略图 |
| 确认识别结果的抽屉 | [food-diary-timeline](living/food-diary-timeline/index.html#sheet) | 点相机按钮后 |
| 选中段撑开的分段控件 | [food-diary-timeline](living/food-diary-timeline/index.html#tabs) | 顶部五个图标 |
| 按日期串起的时间线 | [food-diary-timeline](living/food-diary-timeline/index.html#tl) | 主页列表 |
| 餐盘物理玩法 | [food-diary-timeline](living/food-diary-timeline/index.html#stage) | Keep 之后的翻滚页 |
| 显示当前步骤 | [ai-trace-view](living/ai-trace-view/index.html#top) | 最上面一行 |
| 逐步展开来源结果 | [ai-trace-view](living/ai-trace-view/index.html#list) | 缩进的步骤和卡片 |
| 流式显示结构化答案 | [ai-trace-view](living/ai-trace-view/index.html#sum) | 下方的小标题和列表 |
| 做双开门文件夹 | [folder-open](living/folder-open/index.html#folder) | 悬停文件夹 |
| 做后一张卡片滑出 | [folder-open](living/folder-open/index.html#s2) | 取出后悬停邮票 |
| 让物件从容器里飞到容器前面 | [folder-open](living/folder-open/index.html#over) | 悬停后点击文件夹 |
| 让定高列表露出半行 | [list-peek](living/list-peek/index.html#pal) | ⌘K 打开的面板底边 |
| 方向键提前露出下一项 | [list-peek](living/list-peek/index.html#view) | 面板里连按向下 |
| 把指针输入画成波形 | [telemetry-dash](living/telemetry-dash/index.html#seismo) | 移动鼠标看左下角曲线 |
| 做格点字形屏 | [telemetry-dash](living/telemetry-dash/index.html#glyph) | 中上小卡，每 1.6 秒换图案 |
| 标明数据真假 | [telemetry-dash](living/telemetry-dash/index.html#battery) | 电量卡右上角 LIVE 或 SIM |
| 做错峰入场的贡献格 | [telemetry-dash](living/telemetry-dash/index.html#contrib) | 刷新看对角线砸入 |
| 做点阵时钟和打字状态行 | [telemetry-dash](living/telemetry-dash/index.html#hero) | 左上大卡 |
| 做渐隐活动流 | [telemetry-dash](living/telemetry-dash/index.html#feed) | 右下卡 |
| 做有方向的迁移说明动画 | [sketch-to-onboarding](living/sketch-to-onboarding/index.html#hero) | 图标和箭头那一块，等 3.5 秒看切换 |
| 步骤跟动画同步高亮 | [sketch-to-onboarding](living/sketch-to-onboarding/index.html#steps) | 图标下面三行 |
| 做玻璃弹出菜单 | [sketch-to-onboarding](living/sketch-to-onboarding/index.html#menu) | 点重播后的第一屏 |
| 从底部升起一次性流程 | [sketch-to-onboarding](living/sketch-to-onboarding/index.html#sheet) | 点菜单里的从 Apple 日历迁移 |
| 给智能体写动效分镜 | [sketch-to-onboarding](living/sketch-to-onboarding/index.html#sketch) | 左边手绘图 |
| 做一组图标开关 | [icon-toggles](living/icon-toggles/index.html#c-motion) | Motion 一行，点三枚图标看短线滑动 |
| 让选择器就地展开 | [icon-toggles](living/icon-toggles/index.html#c-palette) | Palette 一行，点右侧箭头 |
| 用翻页显示更多色块 | [icon-toggles](living/icon-toggles/index.html#c-color) | Color 一行，点上下箭头 |
| 做整条可拖的滑块 | [icon-toggles](living/icon-toggles/index.html#c-size) | Size 一行，拖过右端看拉长 |
| 给滚动列表加渐隐 | [icon-toggles](living/icon-toggles/index.html#scroll) | 滚动设置列表看顶底 |
| 做开花式取色器 | [icon-toggles](living/icon-toggles/index.html#slot) | 点左侧粉色圆点 |
| 给线条和文字加手绘抖动 | [wiggle-icons](living/wiggle-icons/index.html#wig) | 任何一个图标或标题 |
| 图标集逐笔出场 | [wiggle-icons](living/wiggle-icons/index.html#grid) | 往下滚到 Every stroke draws itself |
| 调幅度和速度的控制条 | [wiggle-icons](living/wiggle-icons/index.html#bar) | 底部胶囊 |
| 拖进标题再上色 | [wiggle-icons](living/wiggle-icons/index.html#row) | 第一屏的图标行 |
| 做开场发光球 | [companion-onboarding](living/companion-onboarding/index.html#sphere) | 开头 2–6 秒 |
| 做助手逐词字幕 | [companion-onboarding](living/companion-onboarding/index.html#say) | 点 Get Started 之后 |
| 对话式输入称呼 | [companion-onboarding](living/companion-onboarding/index.html#names) | 问完称呼后的两个胶囊框 |
| 语言多选加主语言 | [companion-onboarding](living/companion-onboarding/index.html#lang) | 称呼之后的面板 |
| 权限引导和拖拽示意 | [companion-onboarding](living/companion-onboarding/index.html#perm) | 最后的白色窗口 |
| 把文字做成剪报标题 | [collage-letters](living/collage-letters/index.html#palcoGerador) | 中间舞台的 elly linda |
| 让标题像定格动画一样抖 | [collage-letters](living/collage-letters/index.html#btnAnimar) | 点 Animar 看字母换纸片 |
| 用一个滑块调整组字距 | [collage-letters](living/collage-letters/index.html#sliderEspaco) | 拖 Espaço Letras |
| 在回复里画小流程图 | [agent-diagrams](living/agent-diagrams/index.html#flow) | 第 1 节的图 |
| 画两方请求响应 | [agent-diagrams](living/agent-diagrams/index.html#seq) | 第 2 节的图 |
| 画跨分组的流程 | [agent-diagrams](living/agent-diagrams/index.html#nested) | 第 10 节，悬停看工具条 |
| 把架构分步讲 | [agent-diagrams](living/agent-diagrams/index.html#walk) | 第 13 节，点下一步 |
| 带类型的流程图 | [agent-diagrams](living/agent-diagrams/index.html#fan) | 第 17 节 |
| 逐词转写和关键词高亮 | [voice-onboarding](living/voice-onboarding/index.html#say) | 点麦克风开始 |
| 要求项边说边填 | [voice-onboarding](living/voice-onboarding/index.html#cur) | 看白卡 |
| 已完成项渐隐堆叠 | [voice-onboarding](living/voice-onboarding/index.html#stack) | 第 3 题之后看顶部 |
| 换题的颜色过渡 | [voice-onboarding](living/voice-onboarding/index.html#card) | 看换题瞬间 |
| 语音填完后的确认和修改 | [voice-onboarding](living/voice-onboarding/index.html#tbl) | 跑完全程，点 Household |
| 用一句话演示产品动作的落地页 | [highlight-ask-landing](living/highlight-ask-landing/index.html#hero) | 落地页标语的划线入场 |
| 用输入框本身表达加载 | [highlight-ask-landing](living/highlight-ask-landing/index.html#go) | 粘贴链接后按 Read |
| 选中文字后出现操作 | [highlight-ask-landing](living/highlight-ask-landing/index.html#tb) | 阅读页选中任意文字 |
| 回答和原文对照阅读 | [highlight-ask-landing](living/highlight-ask-landing/index.html#margin) | 点 Explain 看页边卡片 |
| 长文的位置和批注分布 | [highlight-ask-landing](living/highlight-ask-landing/index.html#ruler) | 阅读页左侧竖条 |
| 阅读主题和排版设置 | [highlight-ask-landing](living/highlight-ask-landing/index.html#aa) | 点右上 Aa，切 Look 和 Text |
| 汇总问答和高亮 | [highlight-ask-landing](living/highlight-ask-landing/index.html#nb) | 点右上 Notebook |
| 在回答中分步展开地图 | [genui-map](living/genui-map/index.html#mapwrap) | 点页尾“重播入场”，再点标签 |
| 地点详情联动 | [genui-map](living/genui-map/index.html#info) | 点底部左右箭头 |
| 切换主题时的圆形揭示 | [genui-map](living/genui-map/index.html#themes) | 悬停右上角圆点，依次点色块 |
| 异步按钮状态 | [genui-map](living/genui-map/index.html#send) | 点 Send to iPhone |
| 把线稿转成针法或点阵 | [cross-stitch](living/cross-stitch/index.html#art) | 中间图样，拖 Line coverage needed 看线条变化 |
| 让低分辨率效果能拖动把玩 | [cross-stitch](living/cross-stitch/index.html#stage) | 在图样上拖动，点 Spin 和 Smoke |
| 在同一网格上加文字 | [cross-stitch](living/cross-stitch/index.html#lettering) | 展开 Lettering，改 Words |
| 把结果换算成用量和尺寸 | [cross-stitch](living/cross-stitch/index.html#key) | 右栏 Thread key |
| 可转动的等距物件 | [doodle-appliance](living/doodle-appliance/index.html#fig) | 点右下角旋转钮 |
| 手绘感滤镜 | [doodle-appliance](living/doodle-appliance/index.html#hand) | 拖 HAND-DRAWN WOBBLE |
| 平涂投影随光变化 | [doodle-appliance](living/doodle-appliance/index.html#shadow) | 拖 LIGHT DIRECTION |
| 门的开合 | [doodle-appliance](living/doodle-appliance/index.html#door) | 点 Open door, unload |
| 按步骤操作 | [doodle-appliance](living/doodle-appliance/index.html#btns) | 左上按钮按顺序点 |
| 让拖拽像撕贴纸 | [sticker-peel-board](living/sticker-peel-board/index.html#stage) | 按住贴纸往外拉，再拖到便签上 |
| 画卷角和背面 | [sticker-peel-board](living/sticker-peel-board/index.html#fx) | 慢慢拉贴纸一角 |
| 可重复取用的素材盘 | [sticker-peel-board](living/sticker-peel-board/index.html#panel) | 左边九宫格和 RESET |
| 手写感待办便签 | [sticker-peel-board](living/sticker-peel-board/index.html#note) | 右边倾斜的横线纸 |
| 拟物相机图标 | [hardware-icons](living/hardware-icons/index.html#photo1) | 第三行第三个和下方放大图 |
| 七段液晶屏 | [hardware-icons](living/hardware-icons/index.html#alarm) | 第二行第二个 |
| 橙色旋钮和滑槽 | [hardware-icons](living/hardware-icons/index.html#audio1) | 第二行第一个 |
| 圆形网罩 | [hardware-icons](living/hardware-icons/index.html#fan) | 第四行第二个 |
| 打字时标出关键词 | [thought-preview](living/thought-preview/index.html#input) | 输入 make the side panel have 24px padding |
| 在输入框内展开确认区 | [thought-preview](living/thought-preview/index.html#drawer) | 打完整句后看输入卡向上长 |
| 让用户消除歧义 | [thought-preview](living/thought-preview/index.html#yn) | 点 No，再按方向键，再点 Yes |
| 预览改动影响到的区域 | [thought-preview](living/thought-preview/index.html#prev) | 展开色阶点 8，看斜线带变窄 |
| 调数值并同步回句子 | [thought-preview](living/thought-preview/index.html#row) | 横向拖 24，或点 space/xl 展开 |
| 显示组件层级 | [dataflow-overlay](living/dataflow-overlay/index.html#tree) | 整棵树 |
| 悬停时画出数据和回调流向 | [dataflow-overlay](living/dataflow-overlay/index.html#g) | 悬停 props.onToggle |
| 显示 Context 作用范围 | [dataflow-overlay](living/dataflow-overlay/index.html#ctx) | 悬停 ThemeContext.Provider 或 Stats 行 |
| 显示完整字段名 | [dataflow-overlay](living/dataflow-overlay/index.html#tip) | 在属性行停一秒 |
| 做碰一下就倒的贴纸物件 | [marble-relief-invite](living/marble-relief-invite/index.html#vase) | 首屏中间的陶瓶，鼠标移上去 |
| 做线条液体流动 | [marble-relief-invite](living/marble-relief-invite/index.html#pour) | 瓶子倒下后的蓝色液体 |
| 做划过时局部变色的图 | [marble-relief-invite](living/marble-relief-invite/index.html#relief) | 浮雕区域，来回划动鼠标 |
| 做请柬式信息卡 | [marble-relief-invite](living/marble-relief-invite/index.html#facts) | THE FACTS 卡片 |
| 做三维点云和透视转动 | [curriculum-graph](living/curriculum-graph/index.html#graph) | 中间的点云，拖动旋转 |
| 做点选后高亮前置链和计数卡 | [curriculum-graph](living/curriculum-graph/index.html#card) | 点任意一个点，看连线和右上角 |
| 做跟随节点的提示框 | [curriculum-graph](living/curriculum-graph/index.html#tip) | 鼠标停在点上 |
| 做按类别开关的图例 | [curriculum-graph](living/curriculum-graph/index.html#legend) | 左下角面板 |
| 窗口变宽也不露半格的网格 | [desk-objects](living/desk-objects/index.html#gridlayer) | 整个底纹 |
| 锯齿小票与点击聚焦 | [desk-objects](living/desk-objects/index.html#receipt) | 左侧小票 |
| 可折起的贴纸 | [desk-objects](living/desk-objects/index.html#sticker) | 右上角贴纸，先把书挪开 |
| 绕书脊翻页的书 | [desk-objects](living/desk-objects/index.html#side) | Side Projects 那本 |
| 一键把拖乱的物体放回去 | [desk-objects](living/desk-objects/index.html#organize) | 右上 Organize |
| 做有纵深的贴纸世界 | [stray-cat-catcher](living/stray-cat-catcher/index.html#stk) | 首屏飘着的贴纸 |
| 让灵动岛长成取景框 | [stray-cat-catcher](living/stray-cat-catcher/index.html#island) | 点 Capture 后 |
| 照片变贴纸的揭晓 | [stray-cat-catcher](living/stray-cat-catcher/index.html#bigcat) | 拍完之后 |
| 做收藏物详情 | [stray-cat-catcher](living/stray-cat-catcher/index.html#detail) | 点蜘蛛猫贴纸 |
| 做散落拼贴 | [sticker-collage-homepage](living/sticker-collage-homepage/index.html#collage) | 四角的贴纸堆 |
| 一键切换两种布局 | [sticker-collage-homepage](living/sticker-collage-homepage/index.html#toggle) | 中间两个按钮 |
| 做贴纸感标题 | [sticker-collage-homepage](living/sticker-collage-homepage/index.html#title) | 手写的名字 |
| 让静态唱片转起来 | [sticker-collage-homepage](living/sticker-collage-homepage/index.html#vinyl) | 左边的唱片机，点一下 |
| 做粘稠的融合和拉丝 | [open-carousel](living/open-carousel/index.html#ring) | 鼠标移到中间卡片的上下边缘附近 |
| 做文字融化切换 | [open-carousel](living/open-carousel/index.html#mName) | 滚动一格看左侧名字 |
| 做随位置渐亮的索引 | [open-carousel](living/open-carousel/index.html#index) | 右上角列表，点一项 |
| 做逐字升起的入场标题 | [open-carousel](living/open-carousel/index.html#heading) | 刷新后约 4 秒的中央标题 |
| 做跟随指针的标签 | [open-carousel](living/open-carousel/index.html#view) | 鼠标移到卡片上 |
| 角色冒头加字母翻入 | [logo-motions](living/logo-motions/index.html#tl) | 左上格 |
| 两个角色互相推挤 | [logo-motions](living/logo-motions/index.html#bl) | 左下格 |
| 图标汇成标志再扫色 | [logo-motions](living/logo-motions/index.html#tr) | 右上格 |
| 硬币砸进胶囊变徽章 | [logo-motions](living/logo-motions/index.html#br) | 右下格 |
| 做可平移缩放的画布 | [question-canvas](living/question-canvas/index.html#world) | 拖动空白和滚轮 |
| 做节点间连线 | [question-canvas](living/question-canvas/index.html#wires) | 卡片之间的曲线 |
| 做贴底磨砂提问框 | [question-canvas](living/question-canvas/index.html#ask) | 底部输入框 |
| 做可展开的侧栏 | [question-canvas](living/question-canvas/index.html#side) | 左上角按钮 |
| 做中心放大轮播 | [avatar-editor](living/avatar-editor/index.html#carousel) | 首屏中央的卡片 |
| 做可循环的缩略图条 | [avatar-editor](living/avatar-editor/index.html#catalog) | 卡片下方一条小头像 |
| 做错落的图片墙 | [avatar-editor](living/avatar-editor/index.html#grid) | 查看更多以下的网格 |
| 做拖动旋转的对象预览 | [avatar-editor](living/avatar-editor/index.html#art) | 开始创造后的中央画面 |
| 做预设式资源栏 | [avatar-editor](living/avatar-editor/index.html#panel) | 编辑器左栏 |
| 做沿路径走的信号串 | [js-generative-art](living/js-generative-art/index.html#signal) | 顶部长管和中部长管 |
| 做错开亮起的读数 | [js-generative-art](living/js-generative-art/index.html#events) | 各面板内的红色图形 |
| 做流动虚线弧 | [js-generative-art](living/js-generative-art/index.html#arcs) | 面板之间的虚线 |
| 叠压主体和窗口 | [archive-spec-poster](living/archive-spec-poster/index.html#rider) | 第一张的马和橙色窗口 |
| 用构造线做底 | [archive-spec-poster](living/archive-spec-poster/index.html#golden) | 第二张的黄金分割线 |
| 一个中心带多个节点 | [archive-spec-poster](living/archive-spec-poster/index.html#vitruvian) | 第三张的人体和头像 |
| 做印刷肌理 | [archive-spec-poster](living/archive-spec-poster/index.html#stipple) | 第四张的橙色头盔 |
| 做印章 | [archive-spec-poster](living/archive-spec-poster/index.html#seal) | 第四张右下的黑色印章 |
| 做可行走的世界页 | [doodle-walk](living/doodle-walk/index.html#stage) | 按方向键走动 |
| 让角色走到物件后面 | [doodle-walk](living/doodle-walk/index.html#c) | 走到右侧松树林后面 |
| 走近才出提示 | [doodle-walk](living/doodle-walk/index.html#tip) | 走到门口或邻居旁边按 E |
| 加轻微惩罚和玩笑话 | [doodle-walk](living/doodle-walk/index.html#hearts) | 撞一下岛上的邻居 |
| 相机固定、世界移动的侧视图 | [camera-frustum-split](living/camera-frustum-split/index.html#lv) | 左半边 |
| 共用一张世界图的成片视图 | [camera-frustum-split](living/camera-frustum-split/index.html#rv) | 右半边 |
| 视锥和路径 | [camera-frustum-split](living/camera-frustum-split/index.html#fr) | 左半边黄色线框 |
| 可拖动的时间轴 | [camera-frustum-split](living/camera-frustum-split/index.html#tb) | 底部 |
| 做多列并排滚动的布局 | [column-deck](living/column-deck/index.html#deck) | 侧栏右边的一排列 |
| 让导航跳转看得清 | [column-deck](living/column-deck/index.html#nav) | 点左侧 Photos，看竖条和列闪烁 |
| 列内滚动时保留回到列头 | [column-deck](living/column-deck/index.html#projects) | 在 Projects 列往下滚 |
| 做相纸式图片卡 | [column-deck](living/column-deck/index.html#photos) | Photos 列的卡片 |
| 做跟随鼠标的吉祥物 | [cursor-mascot](living/cursor-mascot/index.html#hero) | 页面顶部的狐狸，移动鼠标再点它 |
| 展示同一素材的多种风格 | [cursor-mascot](living/cursor-mascot/index.html#styles) | Different styles 一行，悬停某格 |
| 做可挑选的角色墙 | [cursor-mascot](living/cursor-mascot/index.html#grid) | 52 already drawn 一节 |
| 不跳页给出安装步骤 | [cursor-mascot](living/cursor-mascot/index.html#panel) | 点 Use 或 Make your own 打开的抽屉 |
| 实时预览排版 | [ornament-drop-caps](living/ornament-drop-caps/index.html#page) | 右侧书页 |
| 做边调边看的样式面板 | [ornament-drop-caps](living/ornament-drop-caps/index.html#panel) | 点工具栏第二排带 5 的按钮 |
| 用蒙版做可换色的装饰字母 | [ornament-drop-caps](living/ornament-drop-caps/index.html#sets) | 面板 initials，切换四组 |
| 做翻开的纸张 | [card-fold](living/card-fold/index.html#card) | 拖卡片到一半，看上下楔形和文字裁切 |
| 同时支持拖动和滑杆 | [card-fold](living/card-fold/index.html#slider) | 卡片下方滑杆和读数 |
| 慢动的整幅背景 | [scene-footer](living/scene-footer/index.html#scene) | 页脚全幅 |
| 压在留白上的四列链接 | [scene-footer](living/scene-footer/index.html#links) | 画面上方 |
| 品牌位和社交图标 | [scene-footer](living/scene-footer/index.html#brand) | 左上 |
| 排多条并行轨道 | [sample-grid-sequencer](living/sample-grid-sequencer/index.html#grid) | 右侧整片网格 |
| 切换同一数据的几种看法 | [sample-grid-sequencer](living/sample-grid-sequencer/index.html#tools) | 顶部模式按钮，点 random |
| 做跟节奏变化的画面 | [sample-grid-sequencer](living/sample-grid-sequencer/index.html#vis) | 左侧云图 |
| 让改动等到循环结束才生效 | [sample-grid-sequencer](living/sample-grid-sequencer/index.html#new) | new phrase 按钮和提示 |
| 一块面板变成不同界面 | [generated-screens](living/generated-screens/index.html#panel) | 点时间跳转按钮或看整段播放 |
| 显示助手状态 | [generated-screens](living/generated-screens/index.html#isl) | 右上角 |
| 语音字幕 | [generated-screens](living/generated-screens/index.html#cap) | 底部程序坞上方 |
| 图表散开转场 | [generated-screens](living/generated-screens/index.html#bars) | 跳到 Revenue，等到 Which one? |
| 控件和正文双向绑定 | [generated-screens](living/generated-screens/index.html#sl) | 跳到 Reply，拖滑块 |
| 沿弧线切换作品 | [sketchbook-flip](living/sketchbook-flip/index.html#car) | 点左侧上下箭头或滚轮 |
| 封面书架 | [sketchbook-flip](living/sketchbook-flip/index.html#shelf) | 左上角第二个图标，悬停封面 |
| 会弯曲的翻页 | [sketchbook-flip](living/sketchbook-flip/index.html#stage) | 点开中间的书，拖动右页 |
| 竖向刻度快速翻 | [sketchbook-flip](living/sketchbook-flip/index.html#dial) | 打开书后按住左侧刻度上下拖 |
| 环绕物件的第一屏 | [floating-objects-canvas](living/floating-objects-canvas/index.html#orbit) | 刷新页面看旋入和公转，点 Start exploring 看退场 |
| 可平移缩放的画布 | [floating-objects-canvas](living/floating-objects-canvas/index.html#canvas) | 拖动画布，按住 ⌘ 滚轮 |
| 竖向主题导航 | [floating-objects-canvas](living/floating-objects-canvas/index.html#rail) | 悬停左侧小圆点，选一个主题 |
| 随机飞到一个主题 | [floating-objects-canvas](living/floating-objects-canvas/index.html#sur) | 右上 Surprise me |
| 把画面变成横线 | [texture-cat](living/texture-cat/index.html#scan) | 右侧的小猫 |
| 不靠字体的方块字标题 | [texture-cat](living/texture-cat/index.html#title) | 左上 HEY, I'M MITTEN |
| 硬朗的主按钮 | [texture-cat](living/texture-cat/index.html#adopt) | Adopt Mitten |
| 用小圆拼主体并可推开 | [particle-palette](living/particle-palette/index.html#scatter-form) | 鼠标移到第一张海报的鱼身上 |
| 用冷暖两色和绘制顺序显结构 | [particle-palette](living/particle-palette/index.html#two-tone) | 第二张海龟的壳 |
| 给插画加图表框和标签 | [particle-palette](living/particle-palette/index.html#diagram-frame) | 第三张的细线和编号 |
| 做格子吸附的可拖地球 | [pixel-touch](living/pixel-touch/index.html#globe) | 左上，拖动或点击 |
| 给事件配错峰亮起的反馈 | [pixel-touch](living/pixel-touch/index.html#house) | 右上，点屋顶旁的黑色小站 |
| 在像素场景里拖主体 | [pixel-touch](living/pixel-touch/index.html#city) | 左下，拖手机 |
| 做分块弹开的 Logo | [pixel-touch](living/pixel-touch/index.html#coin) | 右下，点按或靠近黑环 |
| 做同心圆角的细线功能网格 | [motion-bento](living/motion-bento/index.html#bento-grid) | 整张大卡 |
| 做安静的斜纹示意面板 | [motion-bento](living/motion-bento/index.html#art-panel) | 第一格下半部 |
| 让小场景只讲一个动作到结果 | [motion-bento](living/motion-bento/index.html#scene-play) | 刷新页面看各格错峰播放 |
| 悬停重播不跳变 | [motion-bento](living/motion-bento/index.html#replay-blur) | 鼠标移到任一格 |
| 阈值生长的色块岛屿 | [pattern-generator](living/pattern-generator/index.html#island) | 0 到 7 秒 |
| 半色调大方格 | [pattern-generator](living/pattern-generator/index.html#halftone) | 7 到 12 秒 |
| 黑底色带和短曲线 | [pattern-generator](living/pattern-generator/index.html#bands) | 12 到 17 秒 |
| 竖向渐变和像素热区 | [pattern-generator](living/pattern-generator/index.html#strips) | 17 到 27 秒 |
| 粗细像素混合的草地 | [pattern-generator](living/pattern-generator/index.html#meadow) | 27 到 33 秒 |
| 代码标签聚拢 | [pattern-generator](living/pattern-generator/index.html#tags) | 33 到 38 秒 |
| 刘海展开成面板 | [notch-feedback](living/notch-feedback/index.html#notch) | 第 1 秒和第 19 秒 |
| 跟着下沿走的工具条 | [notch-feedback](living/notch-feedback/index.html#tool) | 刘海或面板下方 |
| 圈选框和跟手圆环 | [notch-feedback](living/notch-feedback/index.html#sel) | 第 6 到 11 秒 |
| 带标记的实时转写 | [notch-feedback](living/notch-feedback/index.html#txt) | 第 48 到 53 秒 |
| 照片逐张落下、压暗前一张 | [month-memories](living/month-memories/index.html#cards) | 1.2 到 5 秒 |
| 按张数走的进度条 | [month-memories](living/month-memories/index.html#fill) | 底部 |
| 海报过冲入场 | [month-memories](living/month-memories/index.html#po) | 6.5 到 7 秒 |
| 贴纸闪白落定 | [month-memories](living/month-memories/index.html#stickers) | 7 到 8 秒 |
| 长按快进和跳到结尾 | [month-memories](living/month-memories/index.html#skip) | 按住屏幕或点右下按钮 |
| 做蜡笔线条和票据节点 | [craft-diagram](living/craft-diagram/index.html#p1) | 第一张海报的线条和票据 |
| 做状态图的回环动画 | [craft-diagram](living/craft-diagram/index.html#p2) | 第二张海报 too thin 回环 |
| 做并行泳道 | [craft-diagram](living/craft-diagram/index.html#p3) | 第三张海报天空和院子两栏 |
| 做贴底播放控制条 | [craft-diagram](living/craft-diagram/index.html#ui) | 底部按钮和说明 |
| 做长卷自动跟随 | [craft-diagram](living/craft-diagram/index.html#scroll) | 播放时观察页面滚动 |
| 做滚动关键帧的分层场景 | [scroll-3d-landing](living/scroll-3d-landing/index.html#gl) | 整页滚动 |
| 做夹在前后景之间的大字 | [scroll-3d-landing](living/scroll-3d-landing/index.html#hero-t) | 第一屏 |
| 做滚过场景的正文和数字条 | [scroll-3d-landing](living/scroll-3d-landing/index.html#stats) | 第二屏 |
| 做半透明章节目录 | [scroll-3d-landing](living/scroll-3d-landing/index.html#chap) | 第四屏，悬停格子 |
| 做竖排大字收尾 | [scroll-3d-landing](living/scroll-3d-landing/index.html#after) | 第五屏 |
| 拖动转商品 | [controller-explore](living/controller-explore/index.html#hero) | 中央手柄 |
| 换款时背景氛围淡入 | [controller-explore](living/controller-explore/index.html#plate) | 整页背景 |
| 大标题逐行错峰换字 | [controller-explore](living/controller-explore/index.html#product-info) | 左侧标题 |
| 只放另外两款的选择卡 | [controller-explore](living/controller-explore/index.html#variants) | 右侧两张卡 |
| 箭头加分段进度 | [controller-explore](living/controller-explore/index.html#carousel) | 底部中间 |
| 做可平移缩放、角色按前后排序的小世界 | [toon-world](living/toon-world/index.html#world) | 整个世界 |
| 人多时悬停显示名字、点击冒气泡 | [toon-world](living/toon-world/index.html#hover-name) | 中上方的生物 |
| 手绘风格小地图 | [toon-world](living/toon-world/index.html#minimap) | 右下角 |
| 底部拉起的画板，画完变成角色 | [toon-world](living/toon-world/index.html#draw-overlay) | 底部把手 |
| 做软糖立体字 | [walked-map](living/walked-map/index.html#word) | 第一段顶部的字 |
| 地图加地点卡 | [walked-map](living/walked-map/index.html#sheet) | 第一段手机里的卡片 |
| 做开场引导 | [walked-map](living/walked-map/index.html#sky) | 第二段从夜到白天 |
| 演示对话 | [walked-map](living/walked-map/index.html#chat) | 第三段 |
| 做城市回顾卡 | [walked-map](living/walked-map/index.html#track) | 第四段贴纸弹出 |
| 弧面排布但不让内容变形 | [floating-card-wall](living/floating-card-wall/index.html#view) | 整面墙，看上下行向两侧翘起 |
| 三行反向循环漂移 | [floating-card-wall](living/floating-card-wall/index.html#scene) | 盯住中间行和上行的相对运动 |
| 静止星空背景 | [floating-card-wall](living/floating-card-wall/index.html#stars) | 卡片之间的黑色区域 |
| 圆珠笔排线和渐变扇子 | [js-drawings](living/js-drawings/index.html#fans) | 第一幅 |
| 放射纹样 | [js-drawings](living/js-drawings/index.html#rays) | 第二幅 |
| 粉笔颗粒 | [js-drawings](living/js-drawings/index.html#moon) | 第三幅月亮 |
| 蜡笔线和纸片拼贴 | [js-drawings](living/js-drawings/index.html#crayon) | 第四幅 |
| 逐帧播放截图 | [piano-film](living/piano-film/index.html#film) | 页面最上方，拖进度条 |
| 裁出左半或右半 | [piano-film](living/piano-film/index.html#split) | 点 2D、3D 按钮 |
| 用笔触画蜡笔动画 | [piano-film](living/piano-film/index.html#crayon) | 页面下方的蜡笔场景 |
| 逐帧播放截图 | [manga-flip](living/manga-flip/index.html#film) | 页面最上方，拖进度条 |
| 做书页翻动 | [manga-flip](living/manga-flip/index.html#turn) | 点“翻一页” |
| 拟声词逐字落下 | [manga-flip](living/manga-flip/index.html#sfx) | 点“再来一次” |
| 草稿到成品的对比 | [manga-flip](living/manga-flip/index.html#reveal) | 拖下方滑块 |
| 给生成过程做进度信息栏 | [svg-draw-process](living/svg-draw-process/index.html#hud) | 顶部深色条 |
| 看分批绘制的节奏 | [svg-draw-process](living/svg-draw-process/index.html#board) | 下方画面，点一下暂停 |
| 硬切翻页 | [coffee-zine](living/coffee-zine/index.html#stage) | 整个画面，等它自动切，或点击换页 |
| 平放的纸和长阴影 | [coffee-zine](living/coffee-zine/index.html#paper) | 跨页下方的阴影 |
| 逐词淡入的说明卡 | [physics-notes](living/physics-notes/index.html#caption) | 3.4 到 10 秒 |
| 矢量每帧重算的圆环 | [physics-notes](living/physics-notes/index.html#loop) | 5 到 10 秒 |
| 四角固定信息的插图卡 | [physics-notes](living/physics-notes/index.html#figcard) | 10 到 21.5 秒 |
| 点开后的说明和推近 | [physics-notes](living/physics-notes/index.html#breakdown) | 22.75 到 24.25 秒 |
| 做分块硬切出现的扉页 | [map-essay](living/map-essay/index.html#title) | 开头 1 到 3 秒 |
| 做压在文献上的大词 | [map-essay](living/map-essay/index.html#doc) | 34 到 39 秒，按方向键单步 |
| 做一拍全黑反相 | [map-essay](living/map-essay/index.html#invert) | 44 到 45 秒 |
| 做逐字打出的结尾 | [map-essay](living/map-essay/index.html#final) | 53 到 56 秒 |
| 做可逛的实体墙 | [promise-wall](living/promise-wall/index.html#scene) | 拖动和滚轮看整面墙 |
| 做选中详情面板 | [promise-wall](living/promise-wall/index.html#panel) | 点一张纸条 |
| 做写纸条弹窗 | [promise-wall](living/promise-wall/index.html#composeWrap) | 点 Write your own promise |
| 做亲手摆放的放置模式 | [promise-wall](living/promise-wall/index.html#placeHint) | 弹窗里点 Place it on the wall 再点墙 |
| 做底部最近内容条 | [promise-wall](living/promise-wall/index.html#dock) | 页面底部 |
| 做可拖、可整理的收藏 | [stamp-loupe-collection](living/stamp-loupe-collection/index.html#list) | 右页拖一张邮票，再点 organize 和 shuffle |
| 聚焦单个对象 | [stamp-loupe-collection](living/stamp-loupe-collection/index.html#zoom) | 点一张邮票 |
| 放大看细节 | [stamp-loupe-collection](living/stamp-loupe-collection/index.html#loupe) | 选中后点 loupe，拖镜片和外圈 |
| 做分类页签 | [stamp-loupe-collection](living/stamp-loupe-collection/index.html#tabs) | 右侧四个页签 |
| 做一笔画出来的场景 | [line-drawn-town](living/line-drawn-town/index.html#town) | 首屏下半部分，等线走几秒 |
| 给循环动画配控制 | [line-drawn-town](living/line-drawn-town/index.html#bar) | 首屏右下角 |
| 悬停时线稿换成产品图 | [line-drawn-town](living/line-drawn-town/index.html#works) | 向下滚到 WORKS，把鼠标移到某一项上 |
| 做可点击的正射地球 | [gps-instrument](living/gps-instrument/index.html#globe) | 中央地球 |
| 做等宽字遥测面板 | [gps-instrument](living/gps-instrument/index.html#telemetry) | 左上面板 |
| 做分步讲解卡 | [gps-instrument](living/gps-instrument/index.html#lesson) | 底部卡片 |
| 做不挡图的说明提示 | [gps-instrument](living/gps-instrument/index.html#tip) | 悬停蓝色虚线词 |
| 把摘录做成剪下来的纸条 | [cutup-reading-poster](living/cutup-reading-poster/index.html#sheet) | 指针移到任意纸条放大；CSS 写法看 rebuilt.html |
| 给标注分类型 | [cutup-reading-poster](living/cutup-reading-poster/index.html#highlight) | 指针移到荧光笔句子上 |
| 把个人评论和摘录并列 | [cutup-reading-poster](living/cutup-reading-poster/index.html#hand) | 指针移到手写字上 |
| 围绕一张图组织全部内容 | [cutup-reading-poster](living/cutup-reading-poster/index.html#figure) | 画面中央的四象限图和箭头 |
| 拖时间戳跳进度、进度线和当前句 | [transcript-reader](living/transcript-reader/index.html#list) | 中间的转录稿，鼠标放到左边时间戳上下拖 |
| 视频置顶边看边读 | [transcript-reader](living/transcript-reader/index.html#player) | 中间顶部的视频 |
| 目录跟随播放和屏幕 | [transcript-reader](living/transcript-reader/index.html#toc) | 左边的章节 |
| 阅读设置列 | [transcript-reader](living/transcript-reader/index.html#tools) | 右上角，鼠标移进页面后点 Aa |
| 滑出摘录面板、高亮写进摘录 | [transcript-reader](living/transcript-reader/index.html#panel) | 右边，点右上角最右的按钮 |
| 回到当前位置胶囊 | [transcript-reader](living/transcript-reader/index.html#now) | 滚动正文后底部出现 |
| 同一批点变形 | [svg-launch-film](living/svg-launch-film/index.html#particles) | 全片，看 5 到 7 秒和 28 秒 |
| 逐字升起的标题 | [svg-launch-film](living/svg-launch-film/index.html#type) | 左侧文字 |
| 四个小球错峰入场 | [svg-launch-film](living/svg-launch-film/index.html#adapters) | 24–26 秒 |
| 亮底片尾 | [svg-launch-film](living/svg-launch-film/index.html#logo) | 30 秒后 |
| 做面包屑、状态、输入合一的地址栏 | [flip-browser](living/flip-browser/index.html#pill) | 顶部胶囊，点图后看它的变化 |
| 做以点击点为中心的换页 | [flip-browser](living/flip-browser/index.html#paper) | 点图上任意位置 |
| 做带缩略图的等待小卡 | [flip-browser](living/flip-browser/index.html#toast) | 点图后立刻出现 |
| 做只有一句话的空状态 | [flip-browser](living/flip-browser/index.html#blank) | 点 Clear 之后 |
| 把文字变成可炸飞的物理对象 | [stickman-wrecker](living/stickman-wrecker/index.html#article) | 看爆炸外圈的字母 |
| 撕开页面露出背后场景 | [stickman-wrecker](living/stickman-wrecker/index.html#scene) | 看洞内的夜景和焦边 |
| 像素特效层 | [stickman-wrecker](living/stickman-wrecker/index.html#fx) | 看火球、灰烟、激光 |
| 图片碎裂 | [stickman-wrecker](living/stickman-wrecker/index.html#fig-stick) | 看右侧图片被击中 |
| 做可拖动的时间标尺 | [product-timeline](living/product-timeline/index.html#rail) | 竖条区域，按住左右拖 |
| 单物件展示版式 | [product-timeline](living/product-timeline/index.html#stage) | 上半部分的年份和物件 |
| 带键帽提示的计数按钮 | [product-timeline](living/product-timeline/index.html#votes) | had 和 wanted 按钮 |

### main 合入补充（trace / die-cut）

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 正在运行的一行 / 扫光 / shimmer text | [trace](living/trace/index.html#sweep) | 一道 28% 的淡带从右往左扫过正常字色，chip 里的图标一起变淡。用 mask，不用 background-clip |
| Agent 当前在做什么 / 实时状态行 / 进度一句话 | [trace](living/trace/index.html#live-head) | Working on it → 当前步骤文字 → Ran 2 searches and read 3 sources + 图标叠片 |
| 工具调用结果卡 / 搜索结果预览 / +N more | [trace](living/trace/index.html#card) | 比底亮一档的灰卡，白分隔线；前导位放未读点、字母头像、PR / 工单状态 |
| 多步结果太长 / 只开最近几张 / 手风琴自动收 | [trace](living/trace/index.html#window) | 新卡展开的同一帧收起倒数第三张，`grid-template-rows 0fr→1fr` 340ms |
| 来源标签 / 引用 chip / 正文里的出处 | [trace](living/trace/index.html#chip) | 3.5% 黑底、圆角 6、图标 + 名字；正文里缩一号夹在句末 |
| 答案逐词出现 / 流式输出 / 过程收成摘要 | [trace](living/trace/index.html#stream) | 按词淡入，chip / code / 链接整块出；写完后步骤列表收成一行，模糊淡入 |
| 贴纸白边 / die-cut outline / 抠图外描边 / white border | [die-cut-sticker](living/die-cut-sticker/index.html#edge) | `feMorphology dilate radius=7`（宽×0.03）+ blur 1.5 阈值圆角，暖白 #fffdf8 |
| 贴纸投影 / sticker drop shadow / 阴影跟轮廓走 | [die-cut-sticker](living/die-cut-sticker/index.html#shadow) | `drop-shadow(0 4px 10px rgba(0,0,0,.15))` 写在 url(#diecut) 之后；不用 box-shadow |
| 贴纸倾斜 / tilt / rotate 手贴感 | [die-cut-sticker](living/die-cut-sticker/index.html#tilt) | `rotate(-8deg)`，区间 −12…−4deg |
| 贴纸尺寸 / sticker scale | [die-cut-sticker](living/die-cut-sticker/index.html#scale) | 宽 240px ≈ 场景 25–30%，白边随宽缩放 |
| 纸感颗粒 / paper grain / noise texture | [die-cut-sticker](living/die-cut-sticker/index.html#grain) | `feTurbulence fractalNoise .9`，只上白边，α 0.06–0.14 |
| 图片融入画面 / 不像粘贴的截图 / blend image into scene | [die-cut-sticker](living/die-cut-sticker/index.html) | 整页：左贴纸右截图反例 |

### 产品站里拆出的机制

| 要做 | 打开 | 看哪一块 |
|------|------|----------|
| 指针跟着书写位置 | [caret-follow](living/caret-follow/index.html#pointer) | 先停在快捷键，再跟着竖线，最后跟着亮起的行。过渡 280ms |
| 字按 150ms 补进输入 | [caret-follow](living/caret-follow/index.html#caret) | 输入里的竖线 |
| 分段滑块按实测宽度 | [mode-track](living/mode-track/index.html#indicator) | 滑块宽和位移来自按钮的 offsetWidth / offsetLeft，220ms |
| 把一个站锁在栏上 | [mode-track](living/mode-track/index.html#chip) | 点站名后栏上的锁 |
| 一句收成胶囊再飞走 | [phrase-travel](living/phrase-travel/index.html#flyer) | 160ms 收到 0.92，420ms 飞到终点盒子 |
| 整幅 Bayer 网点，改大小不游走 | [resize-dither](living/resize-dither/index.html#canvas) | 细 4px，粗 8px，按 CSS 像素钉死 |
| 三行不同速度的画框 | [drift-frames](living/drift-frames/index.html#wall) | 每行一个系数，插值 0.12 |
| 无缝循环的短句带 | [quote-band](living/quote-band/index.html#track) | 两份相同列表走到 -50%，36s |
| 停靠栏靠近放大 | [dock-reach](living/dock-reach/index.html#dock) | 120px 内从 1 到 1.45，原点在底边 |
| 装饰收到高度 0 | [quiet-fold](living/quiet-fold/index.html#extra) | opacity 与 max-height 一起收到 0，220ms |
| 1px 缝的开关表 | [sheet-switches](living/sheet-switches/index.html#sheet) | 缝是表的背景。滑块移动 16px，180ms |
