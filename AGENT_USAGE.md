# design-parts-mcp · Agent 使用入口

## 何时读取

需要检索设计零件、交互动效、活笔记、机制参数或来源时使用。先读本文件，再读 [README.md](README.md)。按需读返回的 HTML 与来源记录，不批量注入整库。

## 位置与启动

当前项目：`/Users/mahaoxuan/Desktop/AI工作资料/AI组件工作流库/components/design-parts-mcp`。

需要 Node.js 22 或以上。此次整体迁移保留了源码、Git 历史和已安装的 `node_modules`，无需重新安装依赖。

本地 stdio 启动命令：

```sh
node "/Users/mahaoxuan/Desktop/AI工作资料/AI组件工作流库/components/design-parts-mcp/server/index.js"
```

MCP 客户端应使用 `command: "node"`，`args` 为上面的 `server/index.js` 绝对路径。登记入库不等于启用连接；只有明确接入任务时才修改客户端配置。

## 数据源

- 不设置 `DESIGN_NOTES_PATH`：读取项目内 `library/` 快照。
- 使用本机活资料：设置 `DESIGN_NOTES_PATH=/Users/mahaoxuan/Desktop/AI工作资料/Design note`。
- 环境变量必须指向包含 `living/` 的根目录，不能指向 `living/` 本身。索引为 `living/INDEX.md`，笔记为 `living/<name>/index.html`。
- 不为迁移运行 `npm run sync`；该命令会改写内置快照。

## 使用步骤

1. 调用 `search_parts({"query":"镜头"})` 搜索机制；空字符串返回发明表。
2. 调用 `get_part({"id":"spine#dot"})` 读取说明、参数和 HTML 绝对路径。传笔记名，例如 `bento`，可列出全部可拆锚点。
3. 调用 `get_source({"name":"bento"})` 读取 README 与来源 URL。
4. 打开返回的 HTML，检查真实交互，再决定复用哪些机制与参数。

## 边界与错误

这是本地文件读取服务，不提供模型或托管服务。索引死链会被跳过，并写入 stderr 警告。未知笔记、缺少参数和不可用数据目录会返回 `isError`。检索结果不代表原网页仍在线，也不代表目标产品已完成视觉验收。

只复用所需机制与参数。不要照搬来源品牌、文案、签名图或专有插画；保留来源说明。不自动安装依赖、启用 MCP、同步资料、提交或推送。

## 迁移验收 · 2026-10-07

整体同卷重命名后，5207 个原有目录、文件与符号链接的元数据保持一致；普通文件 SHA-256 一致，旧路径已不存在。源码与依赖未改写。

真实子进程 stdio JSON-RPC 验收：默认快照 **20/20**，本机活资料 **20/20**，共 **40/40**。覆盖初始化、三个工具的列表与 schema、搜索、零件参数、绝对路径、来源和未知笔记错误。

当时 `scripts/test.mjs` 的外部资料路径固定为 `~/Documents/design-notes`，验收用了临时测试副本；现在可用环境变量指定，见下方「接入现状」。

## 接入现状 · 2026-11-05

已接入 Claude Code、Codex、Cursor 和 Pi 的全局配置，读本机活资料；配套规则在 `~/.agents/skills/design-parts/SKILL.md`，Claude Code 通过软链接使用。回滚：`claude mcp remove design-parts -s user`、`codex mcp remove design-parts`，删掉 `~/.cursor/mcp.json` 和 `~/.pi/agent/mcp.json` 里的 design-parts，再删除该 skill 和软链接。

`living/<note>/part.json` 是按锚点写好的机制、参数、代码和关键帧；`get_part` 有它就返回新格式和图片，没有就走旧格式。目前只有 flood 有。

`search_parts` 命中任一词即返回，最多 20 条，分数低于最好结果 25% 的不返回；少见的词和笔记名命中排得更前，同一篇最多连占两条。`matched` 是该条命中的词，`unmatched` 是整库都没命中的词。常用界面词有中英文同义词表（`SYNONYMS`），表外的英文词仍然命中少。

搜索质量：`DESIGN_NOTES_PATH=<活资料根目录> npm run eval` 用 `scripts/search-eval.json` 的固定任务词检查前 3 条，低于 `search-eval-floor.json` 就失败。改排序或同义词后跑它；`holdout` 那组不要拿来调参。

调用记录：每次工具调用写一行到本机 `~/.local/state/design-parts/calls.jsonl`，含查询词、结果摘要、客户端和项目目录名。`npm run usage` 看汇总。`DESIGN_PARTS_LOG` 可改路径，设为 `off` 关闭。不进仓库。

测试：`DESIGN_NOTES_PATH=<活资料根目录> npm test`，不传时第二条数据路径仍指向已不存在的 `~/Documents/design-notes`。

复刻页只留在本机（用户决定，2026-11-05）。复刻页可能带原帖截图当素材（`source-assets/`）。这个仓库有 GitHub 远端，所以 `npm run sync` 只拷 `scripts/public-notes.json` 名单里的笔记，并跳过 `replica.html`、`part.json`、`source-assets/` 和 `replica-` 开头的关键帧；不要把复刻笔记加进名单。

## Local source distribution · 2026-11-06

The first package is the embedded `drag-panel`, not a modal dialog. The canonical editable source is `living/drag-panel/` in the design-notes root. Its original reference under `living/skill-samples/` remains unchanged.

- Refresh the distribution from canonical source: `DESIGN_NOTES_PATH=<design-notes-root> npm run build:distribution`.
- Rebuild using the portable snapshot without local design notes: `npm run build:distribution`.
- Serve only the distribution: `npm run preview:distribution`, on loopback port 4179. `PORT` can select a different port. `PREVIEW_ROOT` is only for an explicitly selected preview or consumer directory; never point it at the entire private library.
- `site/` contains the showcase shell. Its iframe loads `distribution/parts/drag-panel/example.html`, which imports the exact files embedded in the registry item.
- `distribution/` is generated, not an independently maintained source tree. Do not hand-edit it. The build exports only each selected component's explicitly approved files and public metadata, not the original library, private source material or local paths.
- `.devin/skills/design-parts-distribution/` is the portable skill source. Generated copies live under `distribution/skills/`. It provides `search`, `show`, read-only `plan` and post-install `verify`; actual installation uses the official pinned `shadcn@4.23.0` CLI.
- Verified CLI behavior: normal universal-file `add` works in an empty directory with no React, Tailwind, `package.json` or `components.json`. In this CLI version, `add --dry-run` instead enters framework setup. Use `view` plus the skill's read-only `plan` command, not that flag.
- `plan` fails on conflicts or symlink targets. `verify` checks installed contents and catalog hashes. Neither executes downloaded code or installs dependencies. Checksum consistency does not authenticate a compromised registry.

The current artifacts are local previews. A versioned filename is not an immutable published release yet. Before any public publication, approve the contents and hosting destination, freeze the version's bytes, and run consumer installation, interaction and existing MCP checks again. Never replace an already published version with different bytes; use a new version. Consumers update by inspection and explicit merging, not silent overwrites.

The existing MCP tools, `library/` snapshot and `sync` allowlist are unchanged. Stop the loopback preview to stop serving this distribution. Rolling back the new distribution does not require migrating original notes or changing MCP clients.

Acceptance on 2026-11-06: the official registry schemas accepted all entries; a clean consumer directory received five component files and two skill files; installed checksums matched; conflicts were reported without replacing the local change. Chromium browser checks covered pointer drag, interruption, keyboard/focus, system reduced motion, independent instances, teardown/remount and English/Chinese layouts at 320, 375 and 1280 pixels. Existing MCP checks passed 51/51 across both data paths. Search evaluation met the existing floors (tune 21/23, holdout 14/15), with three unmatched tasks remaining. Real phones, Safari, Firefox and public/cross-machine deployment were not checked.

Showcase presentation: keep the distribution site neutral and separate from specimen styling. The November 6 visual revision uses a compact sidebar, a 30px desktop heading, a bounded live example and an acquisition action beside the title. Do not propagate a specimen's background color, literary typography or research commentary into the site's navigation and page structure. Edit the example skin in canonical `living/drag-panel/example.html`, then rebuild with `DESIGN_NOTES_PATH`; never patch the generated copy. That revision changed the showcase and example skin only; controller source remained byte-identical.

## Multi-part distribution · 2026-11-07

The selected local candidates are `drag-panel` (four source files plus generated metadata) and `press-feedback` (three source files plus generated metadata). The latter is CSS-only; its example's save toggle is demonstration behavior, not a JavaScript component API. Both install under `design-parts/<name>/` and can coexist in one project without a framework setup.

The reviewed selection is `.devin/distribution.json`. It fixes each name, version, license, exact file list and provenance-review note. The canonical `living/<name>/distribution.json` describes that part's API and presentation. The two file lists must match. An existing research note is not automatically selected.

### Add another native part

1. Select a runnable, attributable specimen. Keep the original unchanged. Extract only the reusable source into its canonical `living/<name>/` directory.
2. Provide `LICENSE`, the complete example, and `distribution.json`: bilingual title, description, fit, avoid, previewHint, integration, accessibility, source.summary and mechanism.summary. Declare entry, example, files and technology. Mechanism parameter rows reference existing mechanism keys rather than duplicating the values.
3. Review the actual files and license. Add the exact name, version, MIT license and flat file list to `.devin/distribution.json`. Current support is native text files (`js`, `css`, `html`, `md`, `LICENSE`) without runtime dependencies. Additional asset types, dependencies or licenses require a separately reviewed extension, not a relaxed guard.
4. Rebuild from canonical source with `DESIGN_NOTES_PATH=<design-notes-root> npm run build:distribution`. A build without that variable uses the portable snapshots. Keep the selection, generator, skill and generated snapshots consistent; a new component without a snapshot requires the canonical-source build first.
5. Open `?part=<name>&lang=zh` and `?part=<name>&lang=en`. Verify search, selection, preview, parameter rows, declared source entry, copy-to-agent text and install targets. Use the installed Skill's plan/add/verify flow in a clean consumer, then operate the installed example.

Only metadata and the selection change for another supported native part; the showcase and inspector do not require name-specific branches. The first selected part remains the default when `part` is absent. An unknown part shows a recoverable error rather than silently displaying another component.

Build validation completes before output writes. The builder refuses unapproved files or symlinks remaining in the output; it does not automatically delete them. Inspect the discrepancy and obtain permission before removing anything. This remains a local-preview workflow, not an immutable release/archive system.

### Browser acceptance

Check Back/Forward after switching components, not only clicking between them. Replace the iframe element when changing examples: assigning a new `src` to the existing frame adds nested history entries and can make the preview disagree with the outer URL. Also check a delayed previous source response cannot replace the current source, failed source loads can be retried, and reset works after changing demo state.

The existing search evaluation's “按钮按下手感” accepted-answer list now includes the actually verified `press-feedback` candidate. Previous accepted answers, search ranking, holdout cases and the floors are unchanged. Run `DESIGN_NOTES_PATH=<design-notes-root> npm run eval`; the existing three misses are not resolved by this addition.

Verified locally on November 7: 16 component/language/width combinations; navigation and browser history; actual clipboard writes; stale-source protection and retry; native button press/cancel/repeat, disabled, keyboard, reduced motion, reset and independent instances; both installed examples operated in Chromium. Official CLI installation produced 11 expected files, including the Skill, with matching checksums. Conflict, symlink and unknown-name preflight cases blocked without writing. All 24 distribution files rebuilt byte-identically in a separate directory without the original design library. Unapproved source lists and output files stopped the build without partial writes. MCP remained 51/51; search evaluation remained 21/23 and 14/15.

Evidence for this local run is under `/tmp/design-parts-release-SzULzt/multi-part/`: `ui-verification.json`, `build-verification.json`, `file-protection.json`, screenshots and the independent `consumer/`. These are temporary evidence, not release assets. Existing-product integration, real phones, Safari, Firefox and cross-machine/public delivery have not been checked.
