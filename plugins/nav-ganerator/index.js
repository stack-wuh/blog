const formatterSubtext = (filename) => {
  const paths = filename.replace(/(\s|\$)/gi, '').split('/')

  if (paths.length > 2) {
    return paths.slice(2).join('-')
  }

  if (paths.length > 1) {
    return paths.slice(1)
  }

  return filename
}

const formatterSubLink = (filename) => {
  return '/' + filename.replace('.md', '')
}

const slideGroupByHead = (pages) => {
  const menus = {}
  const groups = pages.reduce((acc, curr) => {
    const paths = curr.split('/')
    const menuGroup = paths[0] || curr
  
    let list = acc[menuGroup] || []
  
    if (curr.startsWith(menuGroup)) {
      list = [].concat(list, curr)
    }

    acc[menuGroup] = list

    return acc
  }, {})

  Object.entries(groups).map(([key, value]) => {
    let menuText = `/${key}/`

    if (menuText === '/index.md/') {
      menuText = '序言'
    }

    menus[menuText] = {
      text: key,
      collapsed: true,
      items: value.map(c => ({ text: formatterSubtext(c), link: formatterSubLink(c) }))
    }
  })

  menus['/$weekSummary/'].items = transformToWeekly(menus['/$weekSummary/'].items)
  menus['/$blog/'] = transformToBlog(menus)

  return menus
}

const transformToWeekly = (items = []) => {
  const safeItems = [].concat(...items).filter(Boolean)
  const itemsArgv = {}

  while(safeItems.length) {
    const current = safeItems.shift()
    if (!current || !current.link) return
    const paths = current.link.split('/').slice(3)
    const itemObj = itemsArgv[paths[0]] || {}

    itemObj.collapsed = true
    itemObj.link = current.link

    if (!itemObj.text) {
      itemObj.text = paths[0]
    }

    itemObj.items = [].concat(itemObj.items, {
      text: paths[1],
      link: current.link
    }).filter(Boolean)

    itemsArgv[paths[0]] = itemObj
  }

  return Object.values(itemsArgv)
}

const transformToBlog = (menus) => {
  const blogKeys = Object.keys(menus).filter(c => c.startsWith('/20'))
  let items = []

  blogKeys.forEach(item => {
    items = [].concat(items, menus[item].items)
  })

  return {
    text: 'blog',
    collapsed: true,
    items: transformToWeekly(items.map(c => ({ text: formatterSubtext(c.text), link: formatterSubLink(c.link).replace('//', '/$blog/') })))
  }
}

const transformToNav = (menus) => {
  const getHead = (nav) => {
    const store = menus[`/${nav}/`]
    return store.items[0].link
  }

  const indexNav = {
    text: '首页',
    link: '/'
  }

  const astNav = {
    text: 'AST',
    link: getHead('$AST')
  }

  const blogNav = {
    text: '博客',
    link: getHead('$blog')
  }

  const otherNav = {
    text: '日常',
    items: [
      {
        text: 'koa.js',
        link: getHead('$Koajs')
      },
      {
        text: '工作周报',
        link: getHead('$weekSummary')
      }
    ]
  }

  return [indexNav, blogNav, astNav, otherNav]
}

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

module.exports = navGenerator