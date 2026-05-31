## 我用 30 天完成了个人网站（上）：Nginx 配置实践

> **摘要：** 要认识一个技术最快的方法就是直接上手一个项目，Nginx 的配置远比想象中简单。

---

### 为什么选 Nginx

2019 年底腾讯云做活动，我买了一台服务器，从此开始接触 Linux 命令。在此之前，我对 Nginx 最深的印象就是"反向代理"和"负载均衡"，因为办公室的后台开发一直津津乐道这两个概念。

我一直认为，要认识一个技术最快的方法就是直接上手一个项目。不要害怕开发过程中遇到无法解决的问题，现在的网络太发达了，身边的同事队友也可以一起研究。

---

### 什么是 Nginx

Nginx 是一款轻量级的 Web 服务器、静态资源服务器和反向代理服务器。启动极快，配置上手极其简单，网上资料丰富。

---

### 反向代理

配置反向代理时最大的问题是：没理解什么叫"反向代理"。与之相对的是"正向代理"。

在知乎上看到一种简单理解：

- **正向代理**：代理的是客户端，服务器不知道请求来自哪一台客户端
- **反向代理**：客户端发起的请求不知道被哪一台服务器处理

共同点是中间都有一个服务器起到转发作用。

![nginx-proxy_1]

正向代理示意图：

![nginx-proxy_2]

我只实现了反向代理，下面是实现过程。

---

### 配置反向代理

安装 Nginx 后，执行以下命令查看安装位置：

```bash
whereis nginx
# /usr/local/nginx  ← 我的安装位置
```

进入安装文件夹后，`.conf` 结尾的文件就是 Nginx 的配置文件：

![nginx.conf]

#### 分离配置文件

我有四个项目需要配置，写在一个 `nginx.conf` 里不方便查找，所以使用了 `include` 属性。所有配置文件以 `.nginx.conf` 结尾，在 `include` 中统一引入。

#### 反向代理配置

项目打包上线后，访问的接口是线上正式环境接口。请求地址如 `https://wuh.site/api/articles`，在没有代理之前，这个地址访问的结果可能是项目网页或 404。

配置脚本：

![nginx.conf_proxy]

核心就是 `location` 的拦截处理，匹配所有包含 `/api/` 的地址，与项目路由地址区分开，命中规则的转发请求至 `localhost:3100`。转发的关键是 `proxy_pass` 属性。

之所以代理到 3100 端口，是因为我把 Express 项目部署到了这个端口。所以访问 `https://wuh.site/api/articles` 实际访问的是 `http://localhost:3100`。

端口详情：

![node.port]

---

### 配置 HTTPS

SSL（安全套接字层）数字证书用于客户端与服务器建立加密链接，保护交换的敏感数据不被劫持篡改。

我使用腾讯云服务器，在控制台中有 SSL 证书下载入口。申请后将证书上传到服务器的专门文件夹中存放。

Nginx 默认 HTTPS 端口是 443，配置如下：

```bash
server {
    listen 443 ssl;
    server_name domain;

    ssl_certificate /path/domain.crt;
    ssl_certificate_key /path/domain.key;
    ....
}
```

配置完成后，打开浏览器输入域名验证 SSL 是否生效。但此时需要手动修改协议为 https，所以还需要配置 HTTP 到 HTTPS 的重定向。

---

### HTTP 重定向到 HTTPS

Nginx 中重定向有两种方式：`return` 和 `rewrite`。

#### return

使用简单，在 location 中命中规则后返回：

```bash
location ~ /re/ {
    return 301 https://$host$request_uri;
}
```

#### rewrite

语法：`rewrite reg replace flag`

需要正则表达式，使用如下：

```bash
server {
    location /re/ {
        rewrite (.?\/re\/) https://baidu.com permanent;
    }
}
```

flag 列表：

| 属性 | 说明 | 备注 |
|------|------|------|
| last | 不再向下执行 rewrite | 与 break 不同，last 会立即发起新一轮 location |
| break | 不再向下执行 rewrite | 只能终结 rewrite 模块，不能终结其他模块 |
| permanent | 301 永久重定向 | |
| redirect | 302 临时重定向 | |

配置后打开浏览器验证自动跳转是否成功，如果不成功按以下方向排查：

1. Nginx 服务器是否重启成功
2. 检查 location 的正则是否匹配
3. 尝试换一种重定向方式，再次重启验证
4. 稍等一下后重试（遇到过配置后睡一觉才生效的情况）

---

### 部署项目

前端项目部署参考 [antd-pro 部署配置](https://pro.ant.design/docs/deploy-cn)，核心配置属性：

| 属性 | 说明 |
------|------|
| root | 静态文件的绝对地址，指定 dist 文件夹的绝对地址 |
| index | 指定项目的入口文件（.html/.htm） |
| location | 用于匹配静态文件和错误页面 |
| gzip | 配置加载使用 gzip 文件 |

#### 部署前端项目

部署前端项目本身很简单，比较困难的是怎么让浏览器加载速度更快。具体可以看我的另一篇文章《优化网页加载速度》。

#### 部署 Express 应用

Express 官网推荐了几个进程管理工具：

| 工具 | 地址 |
|------|------|
| StrongLoop Process Manager | http://strong-pm.io/ |
| PM2 | https://github.com/Unitech/pm2 |
| Forever | https://github.com/foreverjs/forever |

我使用的是 PM2，具体使用可以看另一篇博客《使用 PM2 部署 Node 应用》。

---

### 总结

1. 多看文档，就算记不住概念，也要大致记住某个概念出现的位置，方便遇到问题时快速定位
2. 勤快动手，有目标地验证，带着问题去验证会收获更多
3. 将想法赋予实现

[nginx-proxy_1]: https://cdn.wuh.site/img/20041101.png
[nginx-proxy_2]: https://cdn.wuh.site/img/20041102.png
[nginx.conf]: https://cdn.wuh.site/img/20041103.png
[nginx.conf_proxy]: https://cdn.wuh.site/img/20041104.png
[node.port]: https://cdn.wuh.site/img/20041105.png
