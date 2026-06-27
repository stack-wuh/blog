# 设计文档

## 架构

```
blog 仓库 (本地)                              x.wuh.site (服务端)
──────────────────                            ─────────────────

Markdown 文件 (YAML frontmatter)
    │
    ▼
scripts/publish.ts
    ├── 解析 YAML frontmatter (gray-matter)
    ├── 校验必填字段 (title)
    ├── 组装 Issue 内容 (body + metadata)
    └── octokit.issues.create()
              │
              ▼
      stack-wuh/blog Issues ─── Webhook ──► NestJS SyncService
                                                 │
                                                 ▼
                                             MongoDB
                                                 │
                                                 ▼
                                             前端可见 ✓
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| YAML 解析 | `gray-matter` | 最流行的 Markdown frontmatter 解析库 |
| GitHub API | `@octokit/rest` | GitHub 官方 SDK，x.wuh.site 已在用 |
| CLI 参数 | `process.argv` 直接解析 | 单文件路径输入，无需 commander 等库 |
| TypeScript 执行 | `tsx` | 直接运行 .ts 文件，无需编译 |

## 数据模型

### YAML Frontmatter

```yaml
---
title: "Rust 所有权机制详解"     # 必填：Issue 标题
labels: [rust, 编程语言]          # 可选：Issue 标签
summary: "深入理解 Rust 所有权"   # 可选：SEO description
cover: https://cdn.wuh.site/xxx   # 可选：封面图 URL
keywords: [rust, ownership]       # 可选：SEO keywords
---
```

### Issue 组装规则

- `title` → Issue title
- `labels` → Issue labels（直接赋值）
- `body` → Markdown 正文 + JSON metadata footer（供 SyncService 解析 metadata 字段）
- metadata 以 HTML 注释形式嵌入，不影响正文渲染

## 组件/模块设计

### `scripts/publish.ts`

```ts
// 流程
1. 解析 CLI 参数获取文件路径
2. gray-matter 读取并解析 Markdown
3. 校验: title 必填，labels/summary/cover/keywords 可选
4. labels 去重
5. 将 summary/cover/keywords 用 <!-- metadata: {...} --> 注入 body 末尾
6. octokit.issues.create() 创建 Issue
7. 输出 Issue URL + 成功提示
```

### 使用方式

```bash
pnpm publish docs/2025/2025-06/rust-所有权.md
```

## 影响分析

- **新增依赖:** gray-matter, @octokit/rest, tsx (dev)
- **破坏性变更:** 无（x.wuh.site webhook/sync/content 零改动）
- **向后兼容:** 完全兼容，不影响现有 VitePress 构建和部署
- **性能影响:** CLI 工具，本地执行，无运行时影响
