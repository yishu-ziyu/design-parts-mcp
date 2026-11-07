# querypath — 跟一个人走过机房

来源：[The lifecycle of a sharded Postgres query](https://planetscale.com/blog/the-lifecycle-of-a-sharded-postgres-query)，[x.com/BenjDicken](https://x.com/BenjDicken/status/2098235061267259756)，2026-09-11。原片 36.2s、2188×1368。本页收第一发明：等轴机房地图 + Follow Maja + Replay。Join 热力图是另一发明，不收录。

打开 [index.html](index.html)。

## 机制逐条

- **房间**：黑底 `#0b0c0d`。世界 `rotateX(58deg) rotateZ(-44deg)`。
- **块**：Primary `#1b4f6e`，Replica / Sidecar 近黑描边。当前步 `#e2c44a`。
- **Follow Maja**：customers.id 32 在 shard 3。customer_id 32 的订单在 shard 1 与 2。其余行 opacity .2。
- **Replay**：黄点 Application → Parser → Planner → Executor → 四 shard，步长 340ms，约 2.8s。

## 可学 / 不学 / 启示

- **可学**：一张不换的图。跟一个具体的人。其余变淡。时间可倒放。
- **收窄**：每一步留在同一张图上。跟 Maja。join 热力图另开一页。
- **启示**：顾客和订单不共置，是跟住一个人之后才看见的。Agent 会话里应对的是「跟住用户刚丢进来的那份东西」。
