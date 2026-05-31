

## Docker镜像的制作与使用

![docker-hub](https://src.wuh.site/2021-08/2021-08-29-090210.png)

最近github的速度是在是太慢了，实在是受不了了，所以只好把镜像的编译工作放在了本地。在本地制作镜像然后托管到dockerhub，直接使用线上镜像了。

**换一句话描述: 之前在服务器做镜像，现在在本地做镜像。**

首先，介绍一下，这次更换部署方式用了哪一些工具和一些使用的坑，更多关于使用的方法和问题的排查。

1. docker
2. docker-compose
3. Bash
4. Npm/yarn & nodejs

**基本的流水线节点**大致如下: 

1. 第一步: 本地制作镜像文件
2. 第二步: 推送镜像文件至远程dockerhub
3. 第三步：服务器更新镜像文件
4. 第四步：重启容器，重启nginx

连接服务器更新的脚本，没有提交到github，但是我会讲一下我是怎么做的。

### docker

具体的安装流程可以百度一下，网上有很多的教程，就不具体说了。这里贴上一些我经常查看的一些网站，当然都是关于docker的。

1. [docker-run](https://docs.docker.com/engine/reference/run/)(docker的官方文档，当前链接为docker的指令集文档)
2. [docker从入门到实践](https://yeasy.gitbook.io/docker_practice/compose/introduction)(中文版的docker文档，文档很详细，基本满足我现在的需求)
3. [docker.restart](https://www.coder.work/article/41485)(镜像更新后，不断机更新重启容器)

简单列一下我用的比较多的一些docker的指令：

+ docker build
+ docker run 
+ docker pull
+ docker push
+ docker tag
+ docker create
+ docker login
+ docker config
+ docker restart

首先，我是将镜像文件托管到了docker的官方网站，所以login是必须要执行的一个指令。除此之外，每一个镜像文件必须指定两个版本号。`docker pull`指令默认拉取的是`docker-image:latest`版本号，同时我必须将这个镜像打上另一个版本号，以防需要镜像回退。

首先，在bin目录下创建一个脚本文件，执行环境指定为node，`docker-push.sh`

```bash
#!/usr/src/env node
```

所以，在`push`操作之前必须先只执行一句代码，`docker-push.sh`:

```bash
docker build -t 'shadowu/wuh.site:latest' -t 'shadowu/wuh.site:1.6.0'
```

另外一个版本号，来自于`package.json`文件中的`version`字段，基于这个文件可以更新一下执行的脚本:

```bash
version=$(node -e "(function () { 
  const path = require('path')
  const pathname = path.resolve(__dirname, './package.json')
  console.log(require(pathname).version) 
})()")

docker build -t 'shadowu/wuh.site:latest' -t 'shadowu/wuh.site:'$version
```

执行环境指定为node了，我才可以用nodejs的模块化拿到`package.json`文件里面的`version`，这个是我能想到的最简单的方法。

然后，在脚本指令里面，为这个脚本加上一个命令:

```json
"scripts": {
  "build:docker": "./bin/docker-push.sh"
}
```



镜像的文件制作``Dockerfile`，可以访问我之前写过的一篇[《从PM2到docker, 离不开的Nginx》](https://wuh.site/post/2021-03/%E4%BB%8EPM2%E5%88%B0docker%2C%20%E7%A6%BB%E4%B8%8D%E5%BC%80%E7%9A%84Nginx),不用写太多，简单制作一下，先让项目可以用docker跑起来，其他的再说。

### docker-compose

在很早之前，docker-compose还是需要单独安装，但在更新了docker的版本后，docker-cli里面集成了docker-compose，相当的方便，我在[项目的描述文件](https://github.com/stack-wuh/react-router-config#readme)里面记录了两种启动容器的方式。一种是用docker-compose 启动本地制作镜像，另一种是docker启动线上镜像。

在项目里面我提供了[docker-compose.yml](https://github.com/stack-wuh/react-router-config/blob/v2/docker-compose.yml)的执行文件，在不考虑其他优化的前提下，用docker-compose启动镜像是如此的简单。

```bash
version: "3"

services: 
  nextjs_app:
    build: ./
    ports: 
      - 3100:3000
```

必须的配置项就这么简单，但是优化镜像体积的时候，我们还需要用到volume挂载卷，和一个针对`node_modules`的专用镜像。两个镜像之间的网络桥接用到的`network`。

目前我遇到的，比较麻烦的处理就是这两个，因为也是头一次做，很多东西都需要慢慢摸索。

在之前版本中，服务器端的执行脚本是这个样子:

```bash
   frontend:
    build: frontend
    ports:
      - 3100:3000
    stdin_open: true
    container_name: frontend
    restart: always
    depends_on:
      - backend
    networks:
     - react-express
     - mongo-db
```

现在不用执行编译过程，简单改一下，直接使用镜像名+版本号就好:

```bash
   frontend:
    image: shadowu/wuh.site:latest
    ports:
      - 3100:3000
    stdin_open: true
    container_name: frontend
    restart: always
    depends_on:
      - backend
    networks:
     - react-express
     - mongo-db
```



你永远可以使用且可以只使用 **docker-compose up -d** 指令，来完成你想完成的任意操作。

### Bash

首先，介绍一下有关bash相关的教程[《Bash脚本教程》](https://wangdoc.com/bash/startup.html#%E7%99%BB%E5%BD%95-session)(来自于阮老师的教程，链接地址直接指向了Bash的启动环境篇)。

教程的内容很多，但是我用到的实际上也没几个，目前只会写一点相当基础的语句，但是没关系，可以慢慢来。

现在使用的一个`source`指令，用来加载同步服务器端的脚本文件。

```bash
ssh username@ip

$ password
```

这个是比较常用，使用ssh登录服务器的操作。输入密码是必不可少的一步。只有密码正确了才可以操作服务器，我已经将一些基础的操作全部做成了脚本，现在只差服务器的同步。那么有没有一种方法可以免去输密码的这一步？

我用到的一种就是安全证书。

能力有限，原理我说不清，感兴趣的自己百度。



### 执行结果与相关问题

![result](https://src.wuh.site/2021-08/2021-08-29-101747.png)

执行脚本之后，能够正常的走到这一步说明没有遇到问题，而且已经推送成功了。

初次制作的时间还是比较长的达到了43s，别慌，之后的编译过程会快一点。有些问题需要注意下：

1. 看一下执行过程，停留在yarn install 的过程特别耗时，有一次达到了200s+，只好改成淘宝的镜像源了。

2. volume的配置项，不管我放到哪里都感觉没用，也不知道是不是使用的姿势不对。但是我看到了一种方法就是将node_modules单独做成一个镜像，容器之间是可以互相访问，免去每一次制作镜像都需要安装依赖，后面实践一下。

3. 启动容器一定要加上端口号，容器默认端口是3000，但是浏览器访问3000端口是没办法正常访问的，这里我测试过，加上一个映射端口就没问题。

4. docker-hub设置为公共源，才可以用到一些三方工具，比如生成一个icon标签放在github上面。

   ![github-icon-label](https://src.wuh.site/2021-08/2021-08-29-102935.png)

5. 注意nodejs的版本，有很多莫名的问题是nodejs的版本带来的问题，linux上可以使用的`n`这个工具，可以快速的切换nodejs的版本

6. `WORKDIR`是指app在容器里面运行的文件目录，在遇到镜像可以正常制作，但是容器死活起不来的时候，可以减掉一些镜像文件的配置项，进入到容器里面去看一下究竟遇到了什么问题



### docker的常用指令

`docker container ls -a` `docker image ls -a` `docker stop container_id & rm contaier_id``docker image rm image_id`

以上是使用的频率最多的一些指令，同时我们还会用到 `docker container inspect`和`docker image inspect`，它们是用来查询容器和镜像的基础配置的。

+ 必须删除容器才可以删除创建容器的镜像，而再此之前，必须先停掉容器，才可以删除容器。
+ `docker run`和`docker create` 在创建容器的时候，其实没啥大区别，需要注意的是，最好加上`-it`配置，在容器正常启动后会返回容器id
+ 就用`docker-compose`，有了它一切变得简单起来

### 工具

 [Docker Desktop](https://www.docker.com/products/docker-desktop)

官方提供的一个工具，使用简单。

1. 可以相当直观的看到现在使用的机器上面镜像和运行的容器

![desktop-about](https://src.wuh.site/2021-08/2021-08-29-105910.png)

2. 可以看到目前容器占用的资源

   ![desktop-memery](https://src.wuh.site/2021-08/2021-08-29-110020.png)

3. 可以看到一些变量属性

![desktop-env](https://src.wuh.site/2021-08/2021-08-29-110035.png)

4. 可以快速布置k8s任务



======= 分割线以下是更新内容 =======

