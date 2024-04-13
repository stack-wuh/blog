## 使用vitepress搭建wiki



![image-20240413153801040](https://src.wuh.site/2024-04/2024-04-13-073812.png)

![image-20240413170409041](https://src.wuh.site/2024-04/2024-04-13-090412.png)

前面几个月一直在学习bebal、eslint这种AST相关的知识，一直没有时间去写一篇正儿八经的博客，刚好体验了一下vitepress，在这里记录一下我是如何使用vitepress将我的知识仓库[blog](https://github.com/stack-wuh/blog)做成**wiki**的。

![image-20240413153919880](https://src.wuh.site/2024-04/2024-04-13-073922.png)

先展示一下我的文件目录结构，所有文件全部放在**docs**目录下，例如AST、Koa和工作周报这种比较特殊的文件夹是以关键字命名，剩余的博客全部是以年份，年份-月份，年份-月份-博客标题方式命名。

在vitepress的环境中，可以直接指定其工作目录为**docs**这样我们就可以快速地搭建出项目的基本目录。至于如何使用vitepress大家可以快速移步至[vitepress的官网](https://vitepress.dev/zh/guide/getting-started)。在这里不做过多的介绍，浪费大家太多的时间，使用的步骤非常简单。

下面列出大家可能需要解决的问题:

1. vitepress不会自动生成菜单和导航，需要你自己维护
2. vitepress采用约定式路由，文件路径即为路由地址
3. 分组维护菜单时必须保证其键值与路由匹配
4. 配合github actoins自动构建发布wiki

### 一、如何自动生成菜单

为了处理上述的问题一与问题二，我们必须先认识一下vitepress的配置文件。在我们执行vitepress的init指令后，会在工作目录下生成**index.md**文件与**.vitepress**目录。

其中，**index.md**文件就是项目的首页，在这个页面中可以维护这个网站的快捷入口、标题、描述，具体的就是下面这个样式，这个模板就是vitepress提供的默认模板。

```markdown
---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "shadow's wiki"
  text: "Fragmented knowledge manager"
  tagline: 碎片化知识管理库
  image: https://user-images.githubusercontent.com/34117238/117454439-b7d41d00-af78-11eb-8b6f-7e4be67d9aa8.jpeg
  actions:
    - theme: brand
      text: 主站点 - wuh.site
      link: https://wuh.site
    - theme: alt
      text: 开放API - api.wuh.site
      link: https://api.wuh.site/v2
    - theme: alt
      text: 文档站点 - docs.wuh.site
      link: https://docs.wuh.site

features:
  - title: 搬山计划
    icon: { src: 'https://user-images.githubusercontent.com/34117238/117454439-b7d41d00-af78-11eb-8b6f-7e4be67d9aa8.jpeg', width: '120px', height: '120px' }
    details: 自我修养,犹如搬山
    link: /$blog/2021/2021-05/搬山计划.html
  - title: 2022年度总结
    details: 每年年中发布一次的年度总结
    icon: { src: 'https://src.wuh.site/2022-02/2022-02-08-124302.png', width: '120px', height: '120px' }
    link: /$blog/2022/2022-01/2022年度总结.html
  - title: 进取
    icon: { src: 'https://src.wuh.site/2022-09/20220901.001.png', width: '120px', height: '120px' }
    details: 静以修身，俭以养德。勿以善小而不为，勿以恶小而为之。
    link: /$blog/2022/2022-09/进取.html
---

```

另外，在**.vitepress**中存在一个**config.mjs**文件，它就是整个项目的配置文件了，下面是我的配置文件：

```javascript
import { defineConfig } from 'vitepress'
import navGenerator from '../../plugins/nav-ganerator'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "shadow's wiki",
  description: "Fragmented knowledge manager",
  titleTemplate: '吴尒红',
  head: [
    ['link', { rel: 'icon', href: 'https://wuh.site/_next/image?url=%2Ficons%2F64.png&w=64&q=75' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-X4ZVBQXW9E' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-X4ZVBQXW9E');`
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' }
    ],

    sidebar: {},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/stack-wuh/blog/tree/gh-page' },
      { icon: 'twitter', link: 'https://twitter.com/wuh131420' }
    ],

    footer: {
      message: 'MIT License.',
      copyright: 'Copyright ©2023. shadow'
    },

    editLink: {
      text: '去github编辑',
      pattern: 'https://github.com/stack-wuh/blog/blob/master/docs/:path'
    },

    lastUpdatedText: '最后更新于',
    lastUpdated: true,

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    },

    logo: {
      src: 'https://wuh.site/_next/image?url=%2Ficons%2F64.png&w=64&q=75'
    }
  },
  vite: {
    plugins: [navGenerator()]
  },
  markdown: {
  },
  sitemap: {
    hostname: 'https://wuh.site'
  },
  rewrites: {
    '([0-9]{4})/(.*)': '$blog/([0-9]{4})/(.*)'
  },
  outDir: 'wiki.wuh.site',
  srcExclude: ['**/README.md', '**/*.js', '**/*.png', '**/*.assets'],
  metaChunk: true,
  base: '/blog/',
  ignoreDeadLinks: true
})

```

如果不出意外的话，在你执行**pnpm init **以及 **pnpm dev**之后，会出现由vitepress提供的默认页面。但是你的工作目录下的文件并没有自动生成菜单。

现在我们回到刚刚开始的问题，如何自动生成菜单和导航？

有两种方法，第一种是常规方法，把路由一个个在**themeConfig.sidebar**中维护进去，还有一种是利用其编译时的能力，写一个vite插件，直接在编译时改掉vite上下文中的配置文件。

大家回到**config.mjs**文件中，仔细看一下我在**vite**中配置了一个插件**[navGenerator](https://github.com/stack-wuh/blog/blob/gh-page/plugins/nav-ganerator/index.js)**。在这个插件中我们只需要将文件路径转化为路由地址就可以了，然后在vite的上下文中的themeConfig.sidebar 改写为我们重新生成的对象就可以了。

```javascript
const navGenerator = () => {
  return {
    name: 'nav-generator',
    configResolved(config) {
      const { vitepress } = config
      if (!vitepress) return
      const menus = slideGroupByHead(vitepress.pages)

      Reflect.deleteProperty(menus, '序言')
      vitepress.userConfig.themeConfig.sidebar = menus
      vitepress.userConfig.themeConfig.nav = transformToNav(menus)
    }
  }
}
```

**vite**中的插件开发极其简单，利用**vite**提供的能力在其对应的钩子中，直接改其上下文的对象，就可以满足我们的需求。

我在刚开始做的时候也去找了一些博客看了一下前人是怎么做的，后来我发现他们的做法有点没必要。他们在利用**vite**的钩子在生成正常的路由地址后，去改写了**config.mjs**源文件中的**sidebar**对象，可实际上完全没有必要。

无论是**webpack**还是**vite**它们的构建流程都是链式的，它代表着上一个插件如果改动了上下文中的配置是会影响下一个插件的。所以完全不用去改源文件，只需要改动钩子中暴露出来的**vitepress context**，就可以满足需求。

但是有一个大前提，这个过程必须发生在最终生成文件的的插件之前。我们已知vitepress将md文件转换成html是利用的**markdown-it**插件，所以必须将**navGenerator**插件的触发时间提前。

正好**configResolved**钩子是最前面的那个入口，而且在此时vitepress已经完成了目录的解析，在此时我们已经可以非常完整地拿到工作目录下全部的md文件了。

插件的全部代码可以点击链接在github中的**[plugins/nav-generator](https://github.com/stack-wuh/blog/blob/gh-page/plugins/nav-ganerator/index.js)**查看。



### 二、如何正确维护多分组sidebar

![image-20240413165436184](https://src.wuh.site/2024-04/2024-04-13-085439.png)

但是分组多侧边栏这里有一个小坑要注意一下。

![image-20240413165641489](https://src.wuh.site/2024-04/2024-04-13-085645.png)

以我的项目文档为例，最后生成的文档对应的对象应该是下面这样，我只截取一部分展示。

![image-20240413170148327](https://src.wuh.site/2024-04/2024-04-13-090150.png)

与生成sidebar同理，nav的数据也可以继续利用这种方法生成。最后的效果就是大家看到的封面图那样。

### 三、自动构建发布

继续利用我们之前介绍过的**github actions**帮助我们自动构建发布。同样在vitepress的官网中提供的一个[工作流示例](https://vitepress.dev/zh/guide/deploy#github-pages)。

**github actions**是一个非常友好的工作流，在之前我已经写了一篇博客，详细地介绍了我是如何actions实现了我的博客项目自动构建发布，可以移步原文[Github Actions 自动部署应用](https://wuh.site/post/Github%20Actions%20%E8%87%AA%E5%8A%A8%E9%83%A8%E7%BD%B2%E5%BA%94%E7%94%A8)。

下面是我的[工作流配置文件](https://github.com/stack-wuh/blog/blob/gh-page/.github/workflows/deploy.yaml):

```yaml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [gh-page]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
        with:
          version: 8
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: pnpm install # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: pnpm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/wiki.wuh.site

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

```

在使用**vitepress**搭建wiki库之前，先切一个**gh-page**分支出来，后期我们做自动构建主要是以这个分支为主，而不是master分支。

注意，我们只需要改几处就可以使github正常工作了:

1. 构建分支，将其改为gh-page
2. 将打包器改为使用pnpm
3. 将指令也改为pnpm配套指令
4. 更改产出文件目录

与此同时，项目内部的**config.mjs**文件产出目录也需要改一下，因为github pages的部署路由会自动在前面加上**/blog/**，所以项目的basePath也需要加一个前缀**/blog/**。

到此为止，全部的流程就介绍完啦~~~