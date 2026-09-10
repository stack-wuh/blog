---
title: 开启 husky 提交检测
labels: [Node.js, pnpm]
summary: 在 pnpm workspace 中安装并启用 husky 与 commitlint，为仓库接入 Git 提交信息规范检测。
keywords: [husky, commitlint, pnpm, Git]
---

## 开启 husky 提交检测

安装 commitlint 与 husky：

```bash
# 安装依赖
pnpm add @commitlint/config-conventional @commitlint/cli husky -wD
```

启用 husky：

```bash
pnpm exec husky init
```

参考文档：

1. https://daotin.github.io/posts/2022/08/10/git-commit%E8%A7%84%E8%8C%83.html
2. https://juejin.cn/post/6886072051942211597
3. https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/types/src/rules.ts
