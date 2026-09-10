---
title: Koa 常用的一些中间件
labels: [Node.js, Koa]
summary: 整理 Koa 项目中最常用的三个中间件：koa-router 路由、koa-body 请求体解析与 koa-logger 日志，并对比 GET/POST 取参的差异。
keywords: [Koajs, koa-router, koa-body, koa-logger, 中间件]
---

## 在项目中用到的中间件

### 1. koa-router

必不可缺的一个中间件。路由中间件不只是 `koa-router` 一个库，还有很多 router 库，喜欢的话甚至可以自己写一个，不过既然这是官方的，直接用就好：

```js
import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

router.get('/index', async ctx => {
    ctx.body = {}
})

app.use(router.routes()).use(router.allowedMethods())
```

### 2. koa-body

在 Express 应用中，处理 POST 请求参数用的是 `bodyparser` 中间件；同理，在 Koa 中对应的就是 `koa-body`。它现在支持以下几种类型：

```json
multipart/form-data
application/x-www-urlencoded
application/json
application/json-patch+json
application/vnd.api+json
application/csp-report
text/xml
```

```shell
$ curl -d 'username=asd&password=123123' http://localhost:5544/user

$ curl http://localhost:5544/user\?name\=asd\&age\=10
```

在 Koa 对应的路由里，直接将请求参数以 JSON 格式原样返回，观察 GET 与 POST 请求的异同：

```ts
const router.get('/user', async ctx => {
    ctx.body = {
        query: ctx.request.query,
        body: ctx.request.body
    }
})
const router.post('/user', async ctx => {
    ctx.body = {
        body: ctx.request.body,
        query: ctx.request.query
    }
})
```

::: warning
GET 请求中，即使使用了 bodyParser 中间件，`ctx.request.body` 也是一个空对象；只有在 POST 等复杂请求中，它才是请求体中的入参。

所不同的是，在 POST 请求中，`ctx.request.query` 却并不是一个空对象。
:::

### 3. koa-logger

这个中间件没有什么可说的，就是一个日志中间件，可以在中间件中打印请求参数。
