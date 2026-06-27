# 博客本地发布 CLI 工具

## 背景

当前发布流程：手动在 GitHub Issues 页面创建 Issue → 等待 Webhook 同步 → 前端可见。缺少本地一键发布的工具链，写 Markdown 后还要手动搬运到 GitHub Issues。

现有链路（x.wuh.site）已完备：Webhook → SyncService → MongoDB → 前端展示。只需补上本地 CLI 这一环。

## 目标

- 本地 Markdown 文件一键发布到 `stack-wuh/blog` Issues
- YAML frontmatter 声明元数据（标题、标签、摘要、封面、关键词）
- 发布前自动校验 frontmatter 必填字段
- 可选的直接调用 NestJS API 触发即时同步

## 非目标（明确不做）

- 不修改 VitePress 文档结构
- 不修改 x.wuh.site 的 webhook/sync/content 模块
- 不做 Issues 的更新/删除（首版只做创建）
- 不做图片上传（封面用已有 URL）

## 影响范围

**blog 仓库（本仓库）：**
- `scripts/publish.ts` — 新增 CLI 发布脚本
- `package.json` — 添加 Octokit 依赖 + publish 命令
- `.env.example` — GitHub Token 环境变量说明

**x.wuh.site（配套改动）：**
- `packages/wuh.site.nest/src/modules/sync/sync.service.ts` — 从 Issue body 提取 `<!-- wuh-site-metadata: {...} -->` 并写入 Content.metadata
