# 三个小优化

## 动机
- 产出目录 `wiki.wuh.site` 命名不直观，对齐为标准 `dist`
- VitePress 版本较老（1.0.2），升级到 1.6.4
- sidebar 博客和周报列表当前是时间正序，改为倒序

## 范围
- `docs/.vitepress/config.mjs`: outDir
- `.github/workflows/deploy.yaml`: 部署路径
- `.gitignore`: 忽略规则
- `package.json`: vitepress 版本
- `plugins/nav-ganerator/index.js`: sidebar 排序逻辑
