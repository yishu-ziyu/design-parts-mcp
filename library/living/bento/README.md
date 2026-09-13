# bento graphics — ElevenLabs Agents Platform 落地页 bento 段

来源：https://x.com/RomaTesla/status/2098399781466886529 （10.9s 屏录，逐帧看过；拷贝在 `_source/`）。

调性一句话：暖纸底上一块安静的 agent 画布，镜头替用户走近，走到哪张卡哪张卡才开口。

## 动效（基于逐帧观察，非凭印象）

- **镜头**：整页视口对一块大画布 scale+translate，依次聚焦 builder 卡 → deploy 行（聊天卡+分析卡），缓动平滑（power3.inOut 气质，约 1.8s），不是瞬跳；循环。
- **builder 卡**：左窄栏 Workflows/Knowledge 两组列表；主区流程图（节点小卡+贝塞尔连线），光标走到节点上节点高亮描边。
- **聊天卡**：用户消息逐字打出带闪烁光标 → 「Request passed」绿点 toast 浮现（原片文案，本页改用 Observed prompt）→ agent 回复卡带头像圆点滑入。
- **分析卡**：Resolution Rate 折线红蓝两条，光标点沿线移动，tooltip 弹两行数值（V1/V2 两个百分比）；旁边 Average CSAT 迷你线；Most Used Languages 横条；Overall Success Rate 大数块。
- 卡内微动效与镜头解耦：镜头停在哪个焦点，哪套微动效才播。

## 可学之处

- 镜头运动是「一屏讲多个能力」的解法：视口 overflow:hidden + 内部大画布 transform，卡内动效挂在焦点到达事件上，离开即复位。
- 层级全靠色阶和细边框（白卡/米白面板/浅灰线），不用阴影，画面因此干净。
- 折线图 tooltip 跟着描线进度走，数据讲解和动画是同一条时间轴。

## 不学之处

- ElevenLabs 文案、品牌名、logo 形状——本页全部换中性占位。
- 原片头像用位图渐变球，本页改 CSS 径向渐变圆点，纯代码绘制。
- 原片跑马灯式右侧卡片被镜头切掉的构图没照搬——本页每个焦点都取整卡。

## 启示

- 「镜头 + 各卡独立时间轴」比「全部动效同时播」信息密度高：每个焦点 5–6 秒刚好讲完一张卡。
- 缓动统一成一条曲线（cubic-bezier(0.65,0,0.35,1)）是画面不乱的关键。
