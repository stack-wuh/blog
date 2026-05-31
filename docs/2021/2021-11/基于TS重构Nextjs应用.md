## 基于 TypeScript 重构 Next.js 应用

> **摘要：** 10.1 假期用 TS + Sass 重写了博客前端，借鉴 Ant Design 的设计规范，实现了提交规范、组件设计、可访问性、SEO 和自动化构建的全面提升。

---

![cover](https://cdn.wuh.site/2021-12/2021-12-05-020136.png)

第一版 Next 应用写的不是很满意，很多代码和实现都不是喜欢的方式。恰逢 10.1 假期，改写了大部分组件代码。由于近期工作多、平时累，一直没顾得上记录。现在已经过去两个多月，很多细节回想不起来了，只能看着代码总结。

---

## 提交规范

从规范代码提交开始，是对整个项目最负责的体现。

个人提交规范朝着 Angular 方向发展。看了 Angular 提交规范的博客后，觉得仪式感太强，commit 记录一眼看过去相当整齐，从那时起 Angular 规范是最好的。

代码规范和样式美化选用 **prettier** 和 **eslint**。对于 React 的规则，用的是 umijs 的规则，Next.js 自身的规则继续保留。

严格遵循 Angular 提交规范后，可以使用 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 工具快速生成本次发布的更新日志。

GitHub Actions 用起来就是一个字：太爽了。通过阮老师博客发现的 [act](https://github.com/nektos/act) 工具，可以在本地调试 GitHub Actions。

现在把主分支切成了 main，每一次功能迭代改为 pull merge 操作。Next.js 官网推荐可以使用 Vercel 持续集成，每一次 merge 自动发布到 Vercel。

---

## 组件设计规范

基本原则遵照之前的总结《浅尝一下 UI 设计》，改成 Sass 函数后，CSS 部分变得更加整齐、清晰和简单。

Sass 中的函数和混入相当实用。以组件大中小三种类型为例，文件名 `vars.scss`：

```scss
$font-size-base: 14px;
$compose-base: 8px;
$sizes: (
  (small, $font-size-base - 2px, $compose-base * 0.5),
  (middle, $font-size-base, $compose-base),
  (large, $font-size-base + 2px, $compose-base * 2)
);

@mixin getSizes () {
  @each $size, $fontsize, $padding in $sizes {
    .is-#{$size} {
      font-size: $fontsize;
      padding: $padding;
    }
  }
}
```

调用 `getSizes` 后自动生成 `.is-small`、`.is-middle`、`.is-large` 三个类名。借助类似自定义函数，快速完成样式代码同时减少代码量。

---

## React.FC 全函数式组件

完全舍弃类组件，全部由函数式组件构建。

很多组件模仿 Ant Design，包括 TS 下的组件定义、对外暴露的属性、内部 className 的命名和条件渲染。

Hooks 借鉴了 `ahooks`，规则沿用 umijs。

Audio 单例模式创建全局 context，用 ref 保存 audio 实例。整个应用似乎不太需要 Redux。

主题切换和 bubble 泡泡改为脚本实现，可直接下载 [bubble.js](https://cdn.wuh.site/scripts/bubble.js) 体验。

---

## Accessibility 可访问性

Google 浏览器性能测试工具中有 Accessibility 指标。在 Antd 的实现中可以看到 `role` 和 `aria-*` 属性。

还有键盘可访问性 `tabindex`，配置后可通过 `tab` 键聚焦：

```html
<div tabindex='0'>hello</div>
```

HTML5 的语义化标签在当时完全用 `section` 取代 `div`，现在大部分改回了 `div`。

> 老师傅的话：如果你不知道怎么用语义化标签，那就不要用。

一轮重构中，对大量元素加入了 role 属性，覆盖率大致 80%。涉及可交互的组件基本完成配置，页面可点击按钮全部换成 button 和 a 元素。

---

## 结构化优化：NextSEO 和事件上报

选择 **NextSEO** 库，不再自己维护代码实现。满足 Google 结构化、标题、关键字等配置需求。

Gtag 完成点击事件上报。页面按钮基础分类：normal、loadmore、link、share、behavior。

---

## 自动化构建：Docker 一键更新

优化 `Dockerfile` 为分段式构建，镜像体积从之前的不明大小降到 **91M**。

构建步骤分三阶段：初始化 → 构建 → 运行时。

升级内容：

1. 不再使用 npm，改为 yarn
2. 使用阿里镜像源，减少依赖安装时间
3. 安装 `jq` JSON 解析工具
4. 分段式构建

```dockerfile
# ============== Deps ==============
FROM mhart/alpine-node as deps
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN apk add jq
RUN npm config set registry https://registry.npmmirror.com
RUN yarn

# ============== Builder ==============
FROM mhart/alpine-node as builder
WORKDIR /usr/src/app
# ...

# ============== Runner ==============
FROM mhart/alpine-node AS runner
WORKDIR /usr/src/app
ENV NODE_ENV production
# ...
USER nextjs
EXPOSE 3000
CMD ["yarn", "start"]
```

结合 GitHub Actions，自动构建、自动升级和镜像清理脚本，一切都变得舒服了起来。

---

## RSS 聚合内容

只要有优质的订阅源，完全可以只使用 RSS 阅读器享受阅读乐趣。它是信息板，只关注想关注的内容。

推荐 [Feed](https://www.npmjs.com/package/feed) 库。每一次更新博客后更新 `rss.xml` 文件，订阅器才有更新推送。feed 文件托管在 AliOSS：[rss.xml](https://cdn.wuh.site/common/rss.xml)。

---

## Web Worker 自动切换主题

用 Web Worker 注册时间轮询器，获取当前设备时间。白天使用 `light` 模式，晚上变为 `dark` 模式。

不在主线程加定时器，不占用主线程资源，在满足条件时切换网站主题模式。

---

## 图片格式转化为 WebP

`.webp` 文件从压缩比率上看具有相当优势。目前把网站背景图片和部分封面图改为了 `.webp`，大部分文件仍然是 `.png`。

HTML5 的 `picture` 标签提供了降级方案，配置额外基础源就可以放心使用 webp。
