# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Shadow 的个人 wiki/博客，基于 VitePress 构建，部署到 GitHub Pages。包管理器用 **pnpm**。

## 常用命令

```bash
pnpm run docs:dev       # 本地开发 (localhost:4000)
pnpm run docs:build     # 构建产物，输出到 docs/wiki.wuh.site/
pnpm run docs:preview   # 预览构建产物 (localhost:4400)
```

## 核心架构

### 内容组织

所有内容在 `docs/` 下，两部分构成：

| 类型 | 路径模式 | 说明 |
|------|----------|------|
| 博客文章 | `docs/{YYYY}/{YYYY-MM}/{标题}.md` | 按年份/月份组织，`rewrites` 映射为 `/$blog/{YYYY}/{YYYY-MM}/` |
| 主题文章 | `docs/{$主题}/{文章}.md` | 以 `$` 开头的目录算专题：`$AST`、`$Koajs`、`$pnpm`、`$weekSummary` |

### sidebar/nav 自动生成

`plugins/nav-ganerator/index.js` 是一个 Vite 插件，在 `configResolved` 钩子里根据 pages 文件路径自动生成 sidebar 和 nav 配置，不需要手动维护。规则：

- 文件以第一级目录分组，`index.md` 归属"序言"
- `$weekSummary` 按年份/周折叠分组
- 所有 `20xx` 年份目录合并为"博客"导航入口
- 非年份/非序言目录各成一个导航入口

### VitePress 配置

- 配置文件：`docs/.vitepress/config.mjs`
- 自定义主题：`docs/.vitepress/theme/`（继承 DefaultTheme + `custom.css`）
- `base: '/blog/'`，站点通过 GitHub Pages 部署在 `https://stack-wuh.github.io/blog/`
- 本地搜索（`search.provider: 'local'`）
- 忽略死链（`ignoreDeadLinks: true`）

### 部署

纯 GitHub Pages 静态托管，入口仓库 `https://github.com/stack-wuh/blog`。`.github/workflows/deploy.yaml`：push 到 `gh-page` 分支时触发，`pnpm@8` + `Node@20` 构建，产物上传到 GitHub Pages。构建输出目录 `docs/wiki.wuh.site`。

### 忽略规则

`.gitignore` 中显式忽略了 `docs/.vitepress`（含 cache）、`docs/wiki.wuh.site` 构建产物。
