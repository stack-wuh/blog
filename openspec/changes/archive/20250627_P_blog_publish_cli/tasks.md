# 任务清单

## Phase 1: 环境准备

### Task 1: 安装依赖

- [ ] **文件:** `package.json`
- [ ] 添加 `gray-matter`、`@octokit/rest` 为 dependencies
- [ ] 添加 `tsx` 为 devDependencies
- [ ] 添加 `.env.example` 说明 GITHUB_TOKEN
- [ ] 添加 `publish` 命令：`tsx scripts/publish.ts`
- [ ] **预计耗时:** 10 min
- [ ] **验证:** `pnpm install` 成功

## Phase 2: 核心实现

### Task 2: 编写 publish 脚本

- [ ] **文件:** `scripts/publish.ts`
- [ ] 解析 CLI 参数获取 Markdown 文件路径
- [ ] gray-matter 解析 frontmatter（title/labels/summary/cover/keywords）
- [ ] 校验 title 必填，缺失则报错退出
- [ ] labels 去重
- [ ] metadata 以 `<!-- wuh-site-metadata: {...} -->` 注入 body 末尾
- [ ] octokit.issues.create() 发布到 stack-wuh/blog
- [ ] 输出 Issue URL + 成功提示
- [ ] **预计耗时:** 40 min
- [ ] **验证:** 创建测试 Markdown → `pnpm publish <file>` → 检查 Issue 页面

## Phase 3: x.wuh.site 配套改动

### Task 4: SyncService 提取 metadata

- [ ] **文件:** `packages/wuh.site.nest/src/modules/sync/sync.service.ts`（x.wuh.site 仓库）
- [ ] 新增 `extractMetadata(body)` 函数：正则匹配 `<!-- wuh-site-metadata: {...} -->` 并解析 JSON
- [ ] `syncIssue()` 中调用 `extractMetadata()`，结果写入 `contentData.metadata`
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 发布测试 Issue → 检查 MongoDB 中 Content.metadata 字段

## Phase 4: 端到端验证

### Task 3: 全链路验证

- [ ] 创建测试 Markdown 文件（含完整 frontmatter）
- [ ] `pnpm publish` 发布成功，返回 Issue URL
- [ ] 检查 GitHub Issue 标题/标签/正文正确
- [ ] 等待 Webhook 同步到 MongoDB（或手动调 `sync:init`）
- [ ] 前端 x.wuh.site 可见新博客
- [ ] **预计耗时:** 15 min

## 验收

- [ ] `pnpm publish <markdown-file>` 一键发布到 GitHub Issues
- [ ] 缺少 title 时报错并退出
- [ ] Issue 标题、标签、正文、metadata 正确
- [ ] `npx tsc --noEmit` 零错误
