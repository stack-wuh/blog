import { defineConfig } from 'vitepress'
import navGenerator from '../../plugins/nav-ganerator'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "shadow's wiki",
  description: "Fragmented knowledge manager",
  titleTemplate: '吴尒红',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' }
    ],

    sidebar: {},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
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
  outDir: 'blog.wuh.site',
  srcExclude: ['**/README.md', '**/*.js', '**/*.png', '**/*.assets'],
  metaChunk: true
})
