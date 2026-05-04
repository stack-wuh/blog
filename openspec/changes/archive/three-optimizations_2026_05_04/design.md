# 技术方案

## 1. 产出目录对齐
- `config.mjs`: `outDir: 'dist'`（相对 docs/）
- `deploy.yaml`: `path: docs/dist`
- `.gitignore`: `/docs/dist`

## 2. VitePress 升级
- `pnpm add -D vitepress@1.6.4`

## 3. nav-generator 时间倒序
- `transformToBlog`: blogKeys 按年份倒序排列
- `transformToWeekly`: 分组结果按 text 倒序，每组 items 反转
