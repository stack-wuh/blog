---
title: 如何使用 pnpm
labels: [Node.js, pnpm]
summary: 从安装、镜像源配置到包管理命令，再用 pnpm workspace 把所有博客相关仓库聚拢到一个 monorepo 内部管理。
keywords: [pnpm, monorepo, workspace, Node.js]
---

## 什么是 pnpm

Next 已经升级到了 14 版本，具有一些全新的功能特性。现在有一个全新的计划：将所有的博客相关仓库全部聚拢到一个仓库内部管理。

而这个功能可以利用 pnpm 来帮助我实现。

![image-20240414162924726](https://src.wuh.site/2024-04/2024-04-14-082928.png)

## 一、安装 pnpm

在 mac 上直接使用 npm 安装：

```bash
brew install pnpm
```

设置华为的镜像源：

```bash
npm config set registry https://mirrors.huaweicloud.com/repository/npm/
```

包的管理：

```bash
# 新增
pnpm install react
pnpm add react      # 默认 -S，装到 dependencies
pnpm add react -D   # devDependencies
pnpm add -g react   # 全局

# 移除
pnpm remove react
pnpm remove react -g
```

给子包安装包：

```bash
pnpm add react --filter package-name -D
```

## 二、工程化配置

同 npm 一样，`pnpm init` 会自动生成一个 package.json 文件。

先确定一下整个工程的结构：全部的子项目都在 packages 目录下，然后在 `pnpm-workspace.yaml` 里面维护一下。

![image-20241208173114701](https://src.wuh.site/2024-11/2024-12-08-093146.png)

在 packages 目录下的每一个子项目都需要执行一次 `pnpm init`，生成一个 package.json 文件。

在将子项目添加到根目录的说明文件下的时候，需要配置一下 `.npmrc` 文件，让 pnpm 优先使用本地包，否则会报出 404 错误。

这里贴一个 nextjs 的 monorepo 实现：[nextjs-sharing-code-monorepo](https://github.com/cpvdeveloper/nextjs-sharing-code-monorepo/tree/main/packages)
