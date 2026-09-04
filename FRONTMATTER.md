# 博客源文件 Frontmatter 规范

> 版本：v1（2026-09-03）
> 本规范是 `stack-wuh/blog`（真相源）与发布中枢（x.wuh.site `packages/publisher`）之间的契约。
> 对应变更：x.wuh.site `20260903-feature-notion-publisher`。解析器以本文为准。

## 分层原则

**frontmatter 只装声明式元数据（人写）；运行时数据（发布状态、评论、统计）不进源文件。**

- 发布状态（Notion pageId、issue number、lastSyncedAt）→ 发布中枢写入 MongoDB `publications` 集合
- 评论 → 留在 GitHub issue + MongoDB
- `<!-- wuh-site-metadata: {...} -->` HTML 注释是站点专用通道，由管线自动生成进 issue，**源文件里不要手写**（会被覆盖）

## 字段总表

| 字段 | 类型 | 必填 | 缺省推导规则 | 说明 / 平台映射 |
|------|------|------|--------------|------------------|
| `slug` | string | 建议 | 文件名去 `.md`、去开头 `YYYY-MM-DD-` 日期前缀、空格转 `-` | **稳定幂等键，一旦发布永不修改**。站点查询、Notion upsert、issue 映射、publications 集合统一用它。改名/移动文件不影响各平台已有映射 |
| `title` | string | 可选 | 正文第一个 `# H1` | 各平台标题。写了 frontmatter 则 H1 可省 |
| `summary` | string | 可选 | 正文第一个 `> 摘要：` blockquote（兼容存量惯例） | → issue `metadata.summary` / Notion 摘要 / 公众号摘要 |
| `cover` | string(URL) | 可选 | 正文首图 | **封面唯一来源**。→ issue `metadata.cover` / Notion 页面封面 / 公众号封面。建议用 `cdn.wuh.site` 链接 |
| `coverAlt` | string | 可选 | 空 | 封面 alt 文字 → `metadata.coverAlt` |
| `tags` | string[] | 可选 | 空 | → issue labels / Notion multi-select |
| `date` | `YYYY-MM-DD` | 可选 | 文件名日期前缀，其次目录（`docs/2026/2026-07` → `2026-07-01`） | **权威发布日期**。issue 的 createdAt 会被编辑行为扰动，以此为准 |
| `updated` | `YYYY-MM-DD` | 可选 | 空 | 最后一次实质性更新日期 |
| `type` | `post` \| `note` \| `draft` | 可选 | 目录推断：年份目录 → `post`；`$` 前缀目录 → `note` | 控制默认发布矩阵（见下） |
| `publish` | object | 可选 | `type` 的默认矩阵 | `{ notion: true, issues: false }` 按平台覆盖默认矩阵 |
| `rssExcluded` | boolean | 可选 | `false` | → 站点已有 `metadata.rssExcluded`，从 RSS 排除 |

## 发布矩阵默认值

| type | notion | issues（站点） | wechat（未来） |
|------|--------|----------------|-----------------|
| `post` | ✅ | ✅ | ✅ |
| `note` | ✅ | ❌ | ❌ |
| `draft` | ❌ | ❌ | ❌ |

## 完整示例

以 `docs/2026/2026-07/2026-07-13-ai-workflow-governance.md` 为例。

**迁移前（现状）：**

```markdown
# AI 工作流真正解决的，不是写代码，而是治理执行过程

> 摘要：我后来对 AI 开发流程的理解发生了一个明显变化。……

正文……
```

**迁移后（推荐形态）：**

```markdown
---
slug: ai-workflow-governance
title: AI 工作流真正解决的，不是写代码，而是治理执行过程
summary: 我后来对 AI 开发流程的理解发生了一个明显变化。重点不是"怎么让它更快写代码"，而是……
cover: https://cdn.wuh.site/2026/ai-workflow-governance/cover.png
coverAlt: AI 工作流六阶段示意
tags: [AI, 工程化]
date: 2026-07-13
type: post
---

正文……（H1 可省，标题已在 frontmatter）
```

## 存量优化指南（按优先级）

1. **先补要发 Notion 的那批**（原语雀批次）：每篇补 `slug` + `date` 即可发布，其余字段靠推导。
2. **slug 沿用已有值**：部分老文章的 issue `wuh-site-metadata` 里已存在 `slug`——源文件必须沿用同一个值，否则站点与 Notion 的映射会断。不确定时先查 issue 底部 metadata 块。
3. **中文名文件**：推导 slug 会是中文（可用但 URL 长），重要文章建议显式写英文 slug 后再改名文件。
4. **封面**：等发布中枢上线后，贴图会自动转存 `cdn.wuh.site`；过渡期新图可手动传 OSS 后把链接写进 `cover`。
5. **`docs/**/assets/` 里的相对路径图片**：发布时管线自动下载转存 OSS，无需改写；但 VitePress 站内继续用相对路径不受影响。
6. **新文件一律 UTF-8 无 BOM**（历史文件带 BOM，解析器会兼容，但不要再新增）。

## VitePress 兼容性

VitePress 原生解析 YAML frontmatter 并透传给主题，未知自定义字段（`slug`、`publish` 等）不参与构建、无副作用。本规范与 VitePress 现有约定（`title`、`description`）不冲突；`description` 若已在使用，语义等同 `summary`，发布时 `summary` 优先。

## 变更流程

本规范如需变更字段或推导规则：先改本文档（升版本号），再让 x.wuh.site 侧同步解析器与 `frontmatter.spec.ts`，最后按新规则增量补齐存量文件。规范与解析器版本不一致时，以本文档为准并在 publisher 侧报错提示。
