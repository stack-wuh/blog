# Blog Publish CLI

## ADDED

### Requirement: Markdown 一键发布到 GitHub Issues
- **GIVEN** 本地存在含 YAML frontmatter 的 Markdown 文件
- **WHEN** 执行 `pnpm publish <file-path>`
- **THEN** 解析 frontmatter 获取 title、labels、summary、cover、keywords
- **AND** 在 `stack-wuh/blog` 仓库创建新的 GitHub Issue
- **AND** Issue 标题为 frontmatter 中的 title
- **AND** Issue 标签为 frontmatter 中的 labels（去重后）
- **AND** Issue 正文为 Markdown 正文 + metadata 尾部注入
- **AND** 输出 Issue URL

### Requirement: Frontmatter 必填校验
- **GIVEN** 用户执行 `pnpm publish <file-path>`
- **WHEN** Markdown 文件缺少 YAML frontmatter 或缺少 title 字段
- **THEN** 脚本输出错误信息并退出
- **AND** 不创建 Issue

### Requirement: 元数据尾部注入
- **GIVEN** Markdown 文件包含 summary、cover、keywords 等可选字段
- **WHEN** 脚本组装 Issue 正文
- **THEN** metadata 以 `<!-- wuh-site-metadata: {"summary":"...","cover":"...","keywords":[...]} -->` 格式追加到 body 末尾
- **AND** 该注释不影响 Markdown 渲染
