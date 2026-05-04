# 技术方案

## 1. 产出目录对齐
- `config.mjs`: `outDir: 'dist'`（相对 docs/）
- `deploy.yaml`: `path: docs/dist`
- `.gitignore`: `/docs/dist`

## 2. VitePress 升级
- `pnpm add -D vitepress@1.6.4`
- 兼容性：1.6.4 构建时对 markdown 中的本地资源路径校验更严格，绝对路径（如 `/Users/...`）会直接报错。1.0.2 对此宽松，不检查路径有效性。升级前需确保所有图片/资源引用为相对路径。

## 3. nav-generator 时间倒序
- `transformToBlog`: blogKeys 按年份倒序排列
- `transformToWeekly`: 分组结果按 text 倒序，每组 items 反转
