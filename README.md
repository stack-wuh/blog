# Shadow's blog

> 不要停步不前，每一天都要做出一点改变。

基于 VitePress 的个人博客 / 写作站，同时是 [wuh.site](https://wuh.site) 主站的内容源。

## 内容链路

本仓库在整条博客链路中承担"写作与归档"的角色：

```
写作 (本仓库 markdown)
  │  pnpm post <file>
  ▼
GitHub Issues (stack-wuh/blog 仓库，充当 CMS)
  │  webhook / 发布后即时同步
  ▼
NestJS server (x.wuh.site 仓库 apps/server) ──► MongoDB
  │
  ▼
Next.js 主站 https://wuh.site 展示

另有一条独立链路:
push master ──► GitHub Actions ──► GitHub Pages 静态 wiki
                                   https://stack-wuh.github.io/blog/
```

## 快速开始

```bash
pnpm install            # 安装依赖
pnpm docs:dev           # 本地开发 (localhost:4000)
pnpm docs:build         # 构建静态站点 (输出 docs/.vitepress/dist)
pnpm docs:preview       # 预览构建产物 (localhost:4400)
pnpm post <markdown文件> # 发布文章到 GitHub Issues 并同步主站
```

## 发布文章

任意位置的 markdown 文件，头部声明 frontmatter 后即可发布：

```markdown
---
title: 文章标题        # 必填
labels: [标签1, 标签2]  # 选填，转为 Issue 标签
summary: 文章摘要       # 选填，主站列表摘要
cover: https://cdn.wuh.site/cover.png  # 选填，主站封面
keywords: [关键词1]     # 选填，主站 SEO 关键词
---

正文内容...
```

执行 `pnpm post <file>` 后发生两件事：

1. 在 `stack-wuh/blog` 仓库创建 Issue（`summary` / `cover` / `keywords` 以 `wuh-site-metadata` 注释块附在正文尾部，供主站解析）；
2. 立即调用 `POST {SYNC_URL}/v2/webhook/sync/{issue.number}` 触发 server 同步入库，无需等待 webhook。

所需环境变量（支持仓库根目录 `.env` 文件）：

```bash
GITHUB_TOKEN=ghp_xxx          # 需要 stack-wuh/blog 仓库的 Issue 写权限
SYNC_URL=http://localhost:3200 # 主站 NestJS 地址，默认 localhost:3200
```

## 内容组织

所有内容在 `docs/` 下，两类路径：

| 类型 | 路径模式 | 说明 |
|------|----------|------|
| 博客文章 | `docs/{YYYY}/{YYYY-MM}/{标题}.md` | 按年/月归档，`rewrites` 映射为 `/$blog/{YYYY}/{YYYY-MM}/` |
| 主题文章 | `docs/{$主题}/{文章}.md` | `$` 开头的目录算专题：`$AST`、`$Koajs`、`$pnpm`、`$weekSummary` 等 |

sidebar / nav 由 `plugins/nav-ganerator` 插件在构建时根据目录结构自动生成，无需手动维护。站点配置见 `docs/.vitepress/config.mjs`（`base: '/blog/'`，本地搜索），更多架构细节见 [CLAUDE.md](./CLAUDE.md)。

## 作为 x.wuh.site 仓库的子模块使用

本仓库以 git 子模块形式挂在 `x.wuh.site/apps/blog`，保持独立仓库、独立依赖与独立 CI：

```bash
# x.wuh.site 仓库内首次初始化
git submodule update --init apps/blog

# 依赖需独立安装（不并入父仓库 pnpm workspace）
pnpm install --ignore-workspace
```

父仓库根目录提供快捷命令 `pnpm dev:blog` / `pnpm build:blog`。在本仓库的改动提交推送后，需回到 x.wuh.site 仓库提交子模块指针，父仓库才随之更新。

## 部署（GitHub Pages）

`.github/workflows/deploy.yaml`：push 到 `master` 分支（或手动 workflow_dispatch）时，pnpm@8 + Node 20 执行 `docs:build`，产物 `docs/dist` 上传至 GitHub Pages，站点地址 https://stack-wuh.github.io/blog/。
