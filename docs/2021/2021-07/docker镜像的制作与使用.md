## Docker 镜像的制作与使用

> **摘要：** 将镜像编译从服务器迁移到本地，通过本地制作 → 推送 Docker Hub → 服务器拉取更新的流水线实现部署。

---

![docker-hub](https://cdn.wuh.site/2021-08/2021-08-29-090210.png)

GitHub 的速度太慢，只好把镜像编译工作放在本地。本地制作镜像后托管到 Docker Hub，直接使用线上镜像。

---

## 工具链

| 工具 | 用途 |
|------|------|
| docker | 镜像构建与管理 |
| docker-compose | 多容器编排 |
| Bash | 自动化脚本 |
| npm/yarn + Node.js | 应用依赖与运行 |

**基本流水线：**

1. 本地制作镜像
2. 推送镜像至 Docker Hub
3. 服务器更新镜像
4. 重启容器和 Nginx

连接服务器更新的脚本没有提交到 GitHub，下面会讲实现方式。

---

## Docker 基础

常用指令：

```bash
docker build
docker run
docker pull
docker push
docker tag
docker create
docker login
docker config
docker restart
```

镜像托管在 Docker 官网，`docker login` 必须执行。每个镜像需指定两个版本号：`latest` 和具体版本号（如 `1.6.0`），方便回退。

---

## 本地构建脚本

在 `bin` 目录下创建 `docker-push.sh`：

```bash
#!/usr/bin/env node

version=$(node -e "
  const path = require('path')
  const pathname = path.resolve(__dirname, './package.json')
  console.log(require(pathname).version)
")

docker build -t 'shadowu/wuh.site:latest' -t 'shadowu/wuh.site:'$version
```

`package.json` 中的 `version` 字段作为镜像版本号。在 `scripts` 中添加：

```json
{
  "build:docker": "./bin/docker-push.sh"
}
```

---

## Dockerfile

参考之前写的《从 PM2 到 Docker，离不开的 Nginx》。`Dockerfile` 简单制作，先让项目跑起来：

```dockerfile
FROM mhart/alpine-node

WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN yarn install
COPY . /usr/src/app
ENV NODE_ENV production
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
```

---

## docker-compose

docker-cli 已集成 docker-compose，相当方便。

最小配置：

```yaml
version: "3"
services:
  nextjs_app:
    build: ./
    ports:
      - 3100:3000
```

优化镜像体积时，需要 volume 挂载卷和针对 `node_modules` 的专用镜像，两个镜像之间用 `network` 桥接。

之前服务器端配置：

```yaml
frontend:
  build: frontend
  ports:
    - 3100:3000
  container_name: frontend
  restart: always
  depends_on:
    - backend
  networks:
    - react-express
    - mongo-db
```

现在直接使用镜像名+版本号：

```yaml
frontend:
  image: shadowu/wuh.site:latest
  ports:
    - 3100:3000
  container_name: frontend
  restart: always
```

---

## Bash 脚本与 SSH

使用 `source` 指令加载同步服务器端的脚本文件。常用 SSH 登录：

```bash
ssh username@ip
# 输入密码
```

免去输密码的方法：安全证书（SSH 免密登录）。

---

## 执行结果与问题

![result](https://cdn.wuh.site/2021-08/2021-08-29-101747.png)

初次制作时间约 43 秒，后续编译会快一点。

**注意事项：**

1. `yarn install` 特别耗时，可改用淘宝镜像源
2. volume 配置需注意使用姿势，可将 `node_modules` 单独做成镜像
3. 启动容器一定要加端口号映射，容器默认 3000 但浏览器直接访问可能不行
4. Docker Hub 设置为公共源，才能用到三方工具（如 GitHub icon 标签）
5. 注意 Node.js 版本问题，Linux 上可用 `n` 工具快速切换
6. `WORKDIR` 是容器内运行目录，容器起不来时可进入容器排查

---

## 常用指令速查

```bash
# 查看容器和镜像
docker container ls -a
docker image ls -a

# 停止并删除容器
docker stop container_id && docker rm container_id

# 删除镜像（需先删除容器）
docker image rm image_id

# 查看配置
docker container inspect container_id
docker image inspect image_id
```

- 必须删除容器才能删除创建容器的镜像，删除容器前必须先停掉容器
- `docker run` 和 `docker create` 区别不大，建议加上 `-it`
- 优先使用 `docker-compose up -d`

---

## Docker Desktop

官方提供的图形化工具，可以：

1. 直观查看本机镜像和运行容器
2. 查看容器占用资源
3. 查看变量属性
4. 快速部署 k8s 任务

![desktop-about](https://cdn.wuh.site/2021-08/2021-08-29-105910.png)
