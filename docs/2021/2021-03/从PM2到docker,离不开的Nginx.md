## 从 PM2 到 Docker，离不开的 Nginx

> **摘要：** 博客部署方式从 PM2 进程守护升级到 Docker 容器化，Nginx 始终作为反向代理和静态资源服务的核心角色。

---

### 为什么从 PM2 迁移到 Docker

去年上线的博客项目，后台用 Express，当时选择 PM2 启动 Node 服务。

Node.js 基于 V8 运行时，在 shell 中执行 `npm run start` 后，关闭 shell 面板进程也会被终结。PM2 的作用就是进程守卫，让服务永远运行。

PM2 常用指令：

```bash
pm2 list
pm2 start app-name
pm2 stop app-name
pm2 restart app-name
```

对比 Nginx 和 Docker 的操作指令：

| 工具 | 启动 | 重启 | 停止 |
|------|------|------|------|
| Nginx | `systemctl start nginx` | `systemctl restart nginx` | `systemctl stop nginx` |
| Docker | `systemctl start docker` | - | `systemctl stop docker` |

Linux 下的指令高度相似：`search` 查询、`install` 安装、`update/upgrade` 更新。

---

### Docker 容器结构

在迁移数据到阿里云的过程中，遗失了文章数据库，现在的文章全部来自 GitHub Issues。还好部分文章能恢复，但封面图永远丢失了。

现在 MongoDB、Express 应用和 Next.js 应用全部改为 Docker 镜像。Container 在某方面与 PM2 作用相似：只要 Docker 进程存在，下属 container 不会熄火。

```
remote store
  ├── image1
  │   ├── container1 → port:port
  │   └── container2 → port:port
  └── image2
      ├── container1 → port:port
      └── container2
```

远程仓库可上传多个镜像（形如 GitHub），在宿主机检出任意 Image，Container 由 Image 生成驱动。

---

### 使用 Docker 启动项目

GitHub 上有不错的仓库 [awesome-compose](https://github.com/docker/awesome-compose)，Next.js 官网也发布了 Docker 示例。

`Dockerfile` 示例：

```dockerfile
FROM mhart/alpine-node

LABEL maintainer = "shadow <wuh131420@gmail.com>"

WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN yarn install
COPY . /usr/src/app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /usr/src/app/.next
USER nextjs

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
```

`Dockerfile` 是制作 Image 的配置文件。启动 image 可用 docker-compose，也可使用官方原生指令集。

---

### Nginx 域名代理

Next 应用启动后，必须访问带端口号的地址（如 `wuh.site:4000`）。为了去掉丑陋的端口号，只能使用 Nginx。

在阿里云平台免费申请 SSL 证书，升级为 HTTPS 后可再升级到 HTTP/2。HTTP/2 的优势之一是多路复用，面对大量请求时，HTTP/1.1 的排队阻塞问题得到缓解。

影响静态资源访问速度的因素：

1. 减少文件数量
2. 减少文件体积
3. 增加服务器带宽
4. 外部文件使用 CDN

---

### 从 PM2 到 Docker 的升级

技术的升级过程中，陈旧的技术被新兴技术替代，新兴技术又会被下一个时代的技术更换。就像车轮，来回旋转不断向前。

接触从未经历过的事务，是一个痛苦又自豪的过程。

对于 Docker 的使用和了解还是相当初级。曾经坐在大佬旁边看他表演如何用 Docker 发布更新 webapp，现在我想做一个演员，做一个好演员。

现在用 `docker-compose` 构建 Image 和启动 Container。困难在于宿主机和容器之间的内部访问、COPY 指令与 WORKDIR 的联系。

MongoDB 换成镜像后，带来的影响是"几乎没有什么影响"，更加简单快捷，不用自己写 service 文件用 systemctl 托管服务。

---

### SEO 优化

SSR 服务侧渲染让网站更容易被搜索引擎抓取，但真正的 SEO 优化不只是写 meta 头。需要：

- sitemap 网站地图
- robots 告诉爬虫不用爬取无效地址
- 接入三方追踪服务，如 Google Analytics

参考 [Google SEO 优化指南](https://static.googleusercontent.com/media/www.google.com/zh-CN//intl/zh-CN/webmasters/docs/search-engine-optimization-starter-guide-zh-cn.pdf)。

**SEO 最快速的方式就是打广告**，在门户网站推广网站，开启 SSR，配置 sitemap 等优化手段。

WEB App 的性能优化有一些关键指标，依靠 Google 的分析系统持续优化。
