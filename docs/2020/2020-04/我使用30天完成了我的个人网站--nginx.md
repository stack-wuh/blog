## 我使用30天完成了我的个人网站--Nginx

在我接触使用Nginx之前, 并不太了解Nginx是什么, 做什么用的. 它给我印象最深的就是反向代理与负载均衡, 因为办公室的后台开发一直所津津乐道的就是这两个'概念'.

我在2019年年底开始接触Nginx, 起因就是腾讯云做活动, 我买了一台服务器. 就在这个时候我开始敲击Linux的一些命令, 尽管我对他们的原理并不太了解.

**我一直认为, 要认识一个技术最快的方法就是直接上手一个项目.**

不要害怕开发过程中会遇到无法解决的问题, 现在的网络太发达了, 可以获取到有效资料的来源非常的多, 身边的同事队友也可以一起研究, 所以别害怕直接上.

### 什么是Nginx?
一款轻量级的Web服务器, 静态资源服务器和反向代理服务器. 启动极快, 配置上手极其简单. 网上的资料也极其丰富, 几乎不同担心遇到了解决不了的问题. 如果遇到了, 那说明我们已经不是一个位面的了.

### 反向代理
我在配置反向代理时遇到的一个最大的问题就是并没有理解什么叫做'反向代理'. 与之相反的那就是'正向代理'了, 那什么又是'正向代理'呢? 

我在知乎上看到了一种简单的理解: '正向代理'就是代理的客户端, 服务器其实不知道请求来自于哪一台客户端. '反向代理'恰恰相反, 客户端发起的请求不知道被哪一台服务器处理. 共同之处就是中间都有一个服务器器, 起到一个转发的作用.

反向代理的示意图: 
![nginx-proxy_1]

正向代理示意图:
![nginx-proxy_2]

我只实现了反向代理, 下面我介绍一下我是怎么实现的反向代理.

### 配置Nginx的反向代理
在服务器安装了Nginx之后, 可以执行如下命令, 用于查看Nginx的安装位置: 
```bash
whereis nginx

# /usr/local/nginx 这个就是我的安装位置
```
在进入了nginx安装文件夹之后, 会看到以.conf结尾的文件, 那就是nginx的配置文件.

如下图: 
![nginx.conf]

#### 配置不同项目的conf文件
我有四个项目需要配置, 如果写在一个nginx.conf文件中不方便, 查找起来未免太过麻烦, 所以我使用了nginx中include属性, 所有的配置文件以.nginx.conf结尾, 在include中引入所有以.nginx.conf结尾的文件.

#### 继续反向代理配置
正如上图反向代理示意图, 在项目正式打包上线之后, 访问的接口就是线上的正式环境的接口啦. 而我们的请求访问的是: https://wuh.site/api/articles. 在没有代理之前, 这个地址访问的结果应该是一个你的项目网页, 又或者是一个404网页.

其配置脚本如下: 
![nginx.conf_proxy]

主要就是location的拦截处理, 匹配所有有/api/的地址, 与项目的路由地址区分开, 命中规则的转发请求至localhost:3100中. 而转发的关键就是: *proxy_pass* 属性. 

是不是很好奇, 我为什么会代理到3100端口呢, 小可爱? 因为我把express项目部署到了3100端口, 所以现在访问 **https://wuh.site/api/articles**, 实际访问的就是: **http://localhost:3100**

端口详情如下图:
![node.port]

好啦, 终于说完了反向代理了, 可以看得出来, 到目前为止nginx的配置还是很简单的. 所以我应该算是踏进了nginx应用的大门了, 因为我已经独立发布了一个项目啦.

下面讲一下我是怎么配置的SSL.

### 使用SSL, 配置https

安全套接字层(SSL)数字证书, 用于客户端与服务器建立加密链接, 保护客户端与服务端之间的交换敏感数据不会被劫持篡改. 

我使用的是腾讯云的服务器, 在控制台中有SSL证书下载的入口, 申请之后需要将已下载的证书上传到自己的服务器中, 这里我特意创建了一个文件夹, 存放所有的网站的证书. 

nginx默认的https协议的端口是443, 所以配置时就监听443端口, 如下: 
```bash
server {
    listen 443 ssl;
    server_name domain;

    ssl_certificate /path/domain.crt;
    ssl_certificate_key /path/domain.key;
    ........
}
```
配置完成之后, 可以打开浏览器, 输入域名以验证ssl是否已经生效. 但是需要自己手动修改协议为https, 所以还需要重定向一下由http跳转至https.

#### Nginx中重定向的几种方式

1. return
2. rewrite

#### return

使用时相当的简单, 还是在location中使用, 命中规则之后就返回, 如下: 
```bash
location ~ /re/ {
    return 301 https://$host$request_uri;
}
```

#### rewrite

**语法: rewrite reg replace flag**

rewrite的使用就稍微复杂一点, 需要一个正则表达式, 到现在我愈来愈发现正则表达式确实是一个好东西呀, 其使用如下: 
```bash
server {
    location /re/ {
        rewrite (.?\/re\/) https://baidu.com permanent;
    }
}
```

flag 列表如下: 
| 属性名 |  说明 | 备注 |
| :--:  | :--: | :--: |
| last  |  不再向下执行rewrite操作    | 与break不同, last会立即发起新一轮的location      |
| break | 不再向下执行rewrite操作 | 只能终结rewrite模块, 而不能终结其他模块 |
| permanent | 301 永久重定向 | |
| redirect | 302 临时重定向 | |

配置之后, 打开浏览器验证一下, 看一下自动跳转是否成功, 如果不成功, 可以按照以下几个方向排查: 
1. nginx服务器是否重启成功
2. 检查location的正则是否匹配
3. 如果到现在都没问题, 你可以换一下重定向的方式, 再次重启服务器后验证
4. 稍等一下后重试

针对第四点我就遇到过这个问题, 配置重定向之后始终不生效, 但是在我睡了一觉之后, 它自动跳转了. 我当时就跪了, 有啥可说的呢, 它就是这么的可爱!!!


### 部署项目

我在这里使用一下, [antd-pro]: https://pro.ant.design/docs/deploy-cn的部署配置, 我的配置差不多, 需要配置的属性如下: 
| 属性名 | 属性值 | 说明 |
| :--: | :--: | :--: |
| root | absolute_path | 静态文件的绝对地址, 指定dist文件夹的绝对地址 |
| index | 指定项目的入口文件 | .html/.htm |
| location | Object | 用于匹配静态文件和错误页面 |
| ^gzip | none | 配置加载使用gzip文件 |

#### 部署前端项目

部署前端项目其实是很简单的啦, 比较困难的或者是说可以玩出花儿来的就是, 怎么使浏览器加载的速度更快. 可以看我的另一篇文章: [优化网页加载速度], 现在只写了三种优化, 后边慢慢会补齐我是咋玩的.

#### 部署Express应用

可以在express的官网中看到一篇[Express应用中的进程管理], 它推荐了好几个进程管理工具, 如下:

+ StrongLoop Process Manager, 官网地址: http://strong-pm.io/
+ PM2, 官网地址: https://github.com/Unitech/pm2
+ Forever, 官网地址: https://github.com/foreverjs/forever

我使用的就是其中之一的PM2, 具体的使用可以看我的另一篇博客: [使用PM2部署node应用]

最后还是总结一下吧:

**1. 多看文档, 多读书, 就算记不住概念, 大致上要把某一个概念出现的位置记住, 方便遇到问题时快速定位查找**
**2. 勤快动手, 有目标的验证, 带着问题去验证会收获更多**
**3. 将想法赋予实现**



[nginx-proxy_1]: https://src.wuh.site/img/20041101.png
[nginx-proxy_2]: https://src.wuh.site/img/20041102.png
[nginx.conf]: https://src.wuh.site/img/20041103.png
[nginx.conf_proxy]: https://src.wuh.site/img/20041104.png
[node.port]: https://src.wuh.site/img/20041105.png
[antd-pro]: https://pro.ant.design/docs/deploy-cn
[优化网页加载速度]: https://www.wuh.site/b/func/5e8557be08cd3a01bc20b159
[Express应用中的进程管理]: http://expressjs.com/zh-cn/advanced/pm.html#pm2
[使用PM2部署node应用]: https://www.wuh.site/b/func/5e524b2459dc028de01f79a0