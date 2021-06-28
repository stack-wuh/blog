## 从PM2到docker, 离不开的Nginx

在去年我上线了一个前后端分离的博客项目, 后台服务用的是Express, 在当时我选择了PM2来启动我的Node服务. 为什么会需要PM2呢?

NodeJS是一个基于V8的运行时环境, 当我们打开一个shell面板, 输入启动指令 `npm run start`, 程序开始运行在机器后台, 这个时候我们可以通过服务占用的端口号, 找到这个进程. 例如:![blank][1]

但是, 在我们关掉这个shell面板后, 我们的Node运行时也被终结了, 所以我需要一个工具, 对运行的进程守卫, 使它永远存在, 除非我使用指令结束NodeJS进程, 这个就是PM2的作用. 它的驱动命令就是我经常用到的: 
```javascript
pm2 list
# ===============

pm2 start app-name

pm2 stop app-name

pm2 restart app-name
``` 

对比一下Nginx的操作命令:
```shell
# =========== 启动Nginx ========
systemctl start nginx

# ========== 重启Nginx ============
systemctl restart nginx

# =========== 结束Nginx ============
systemctl stop nginx
```

以及 Docker的操作命令:
```shell
# ============= 查看docker的状态 ============
systemctl status docker

# ============ 启动docker ===========
systemctl start docker

# ============= 结束docker ============
systemctl stop docker
```

我们似乎总结出了一个规律: 在linux下的指令, 工具包的指令都是高度相似的存在, 查询工具包的存在 可以使用 `search` 关键字, 安装工具包可以使用 `install`, 更新可以使用 `update` 或者是 `upgrade`.


在迁移数据到阿里云的过程中, 我遗失了我的文章数据库, 现在的文章全部是来自于Github的Issues, 还好部分文章还能恢复, 但是我永远地丢失了我的封面图, 似乎我可以从公众号平台抓取一次-_-.

现在, 我开始使用Docker了, MongoDB、Express应用和NextJs应用全部改为了docker镜像, container在某一些方面似乎与PM2的作用相似, **`那就是只要Docker的进程存在, 那它的下属container不会熄火`**, 它的结构如下图:
```javascript
-------|              |
       |              | ======== image1-container1 ======= port:port
       |              | ======== image1-container2 ======= port:port
       |====== image1 |
remote |              |
store  |              |
       |              |
       |              | ======= image2-container1 ======= port:port
       |====== image2 | ======= image2-container2
       |              |
-------               |
```

上图表示: 远程仓库可以上传多个镜像仓库, 形如Github, 在宿主机检出任意个Image镜像, Image就是Github上的项目, Container由Image生成驱动. 在Container成功启动后, 作为一个服务, 它被运行在后台. 其结果如下:
![blank][2]

可以看到的是, 现在docker一共启动了三个容器, 一共有4个镜像, 3个容器.

### 如何使用Docker启动项目
github上有一个很不错的一个仓库[awesome-compose], 我选择的就是其中的一个模型, 在实际上线部署的时候, 慢慢的加入自己的配置. 现在Nextjs的官网都发布了Docker的示例, 实际用起来其实并不困难. 下面我贴一个Next的配置, 文件名 `Dockerfile`:

```sheel
FROM mhart/alpine-node

LABEL maintainer = "shadow <wuh131420@gmail.com>"

WORKDIR /usr/src/app

COPY package.json /usr/src/app


RUN yarn install

COPY . /usr/src/app

ENV NODE_ENV production

# COPY  ./app/public /usr/src/app/public
# COPY  ./app/.next /usr/src/app/.next
# COPY  ./app/node_modules /usr/src/app/node_modules

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /usr/src/app/.next
USER nextjs

EXPOSE 3000
# EXPOSE 3100

# CMD npm run build

CMD npm run build

CMD ["node_modules/.bin/next", "start"]

```

`Dockerfile`文件是制作Image镜像的一个配置文件, 启动image 可以使用docker-compose包, 用起来是真的很简单, 很方便. 也可以使用官方提供的一些原生的指令集. 我贴一个[docker-cn]的中文文档.

更多具体的配置可以访问Nextjs的官网提供的示例[next-js].

### Nginx的域名代理

Next应用的部署分为几种模式, 支持静态导出, 也支持持续启用, Next应用其实际也是启动一个Nodejs进程, 但是Node应用启动后, 没有办法支持端口的代理, 什么意思呢? 比如: 我的应用启动的端口是4000, 正式上线后, 我必须访问: wuh.site:4000 才能正确地访问web应用, 为了丢掉这个丑陋的端口号, 只能使用Nginx.

还是老一套, 在阿里云平台免费拿了20张SSL证书, 给自己的域名申请一下证书, 将我们的服务升级为https, 升级为https后, 就可以升级http版本到http2. 下面是一张升级为http2的站点请求瀑布图:
![blank][http2]

### 影响静态资源访问速度的因素

HTTP2的其中一个优势完全体现了出来: `多路复用`. 面对如此多的请求, 在HTTP2中, HTTP1.1的排队阻塞问题得到了缓解, 从这两条进度条看起来, 它们几乎在同一时间开始, 同一时间结束. 

影响静态资源访问速度的因素, 不外乎:
1. 减少文件数量
2. 减少文件体积
3. 增加服务器带宽
4. 外部文件使用CDN

一方面http2解决了文件数量的问题, 另一方面, 我启用Nginx的gzip, 使用压缩文件, 减少静态资源的体积. ![blank][gzip]

下一步就是用webpack提取公共部分代码, 将common.bundle放入CDN服务中, 进一步优化资源的请求.

另外, 我们需要减少初次请求的接口返回体的大小, 如图: ![blank][response] 

目的就是控制第一屏加载的数量和返回体的字段, 只返回首页需要的关键字段, 让接口的响应速度变快, 富余字段放进详情接口中返回. 


### 从PM2到Docker的升级
我记得我之前写过一篇[《技术世界的打造》][https], 但是这一篇已经丢失了, 再也找不回来了.

技术的升级过程中, 陈旧的技术会被一个又一个新兴的技术所替代, 新兴的技术又会被下一个时代的技术所更换. 就像是一个车轮, 来回旋转不断向前, 谁也不能让它停下了.

接触一个或者是一些, 自己从未经历过的事务, 是一个痛苦又自豪的过程.

我对于Docker的使用和了解都是相当初级的存在, 我曾经坐在一个大佬的旁边, 看他表演如何使用docker发布更新webapp, 看他如何操作自签证书, 看了很多, 也听了很多. 那个时候我只是一个观众, 现在我想做一个演员, 做一个好演员, 做好一个演员.

在升级Http2时, 我提前做了很多准备, 我了解到nginx的版本需要制定版本以上的才可以直接配置 `http2`, 但是我在升级时, 什么都没做, 只是加上`listen 443 ssl http2`配置, 居然成功升级了, 这也算是给我的一个小小的惊喜. 

现在我用`docker-compose`来进行构建Image镜像和启动Container容器, 困难处在于宿主机和容器之间的内部访问, COPY指令与WORKDIR之间的联系.

MongoDB换成镜像而不再是宿主机的服务, 给我带来的更直接的影响是`几乎没有什么影响`, 更加简单, 更加快捷, 我不用自己写一个service文件, 用systemctl来托管服务, 得益于Container的进程守卫, 很多工作省下来了.

我用Nextjs重写了前端应用, 替换了原React-App的生产包. SSR服务侧渲染似乎让网站的更加容易被搜索引擎抓取, 但是在我仔细了解Google的SEO优化指南后, 我发现真正的SEO优化并不是写一写meta头这么简单. 它需要一个sitemap网站地图, 需要一个robots来告诉爬虫不用爬取无效地址, 需要接入一些三方追踪服务帮我做优化, 比如: [Google Analyze][googleAnalyzies].

如果你需要做SEO优化, 可以参考[Google SEO优化指南][googleSEOPDF]. 在优化了搜索引擎的爬取结构后, 从三方平台可以得到结果. ![blank][sitemap]

**SEO最快速的方式就是打广告, 在门户网站推广你的网站, 开启SRR, 配置sitemap或者是其他一些优化手段.**

WEBApp的性能优化也有一些关键指标, 依靠google的分析系统, 我们将持续优化WEBAPP
![blank][perfamance]


[1]: https://src.wuh.site/2021-03-17/lsof.png
[2]: https://src.wuh.site/2021-03-17/docker-status.png
[awesome-compose]: https://github.com/docker/awesome-compose
[next-js]: https://nextjs.org/docs/deployment
[docker-cn]: https://yeasy.gitbook.io/docker_practice/compose/introduction
[http2]: https://src.wuh.site/2021-03-17/http2.png
[gzip]: https://src.wuh.site/2021-03-17/nginx_gzip.png
[response]: https://src.wuh.site/2021-03-17/response.png
[https]: https://wuh.site
[googleAnalyzies]: https://analytics.google.com/
[googleSEOPDF]: https://static.googleusercontent.com/media/www.google.com/zh-CN//intl/zh-CN/webmasters/docs/search-engine-optimization-starter-guide-zh-cn.pdf
[sitemap]: https://src.wuh.site/2021-03-17/sitemap.png
[perfamance]: https://src.wuh.site/2021-03-17/perfamence.png