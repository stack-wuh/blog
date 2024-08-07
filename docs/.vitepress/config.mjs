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
