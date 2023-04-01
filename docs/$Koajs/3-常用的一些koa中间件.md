## 在项目中用到的中间件

### 1. koa-router 
必不可缺一个中间件，路由中间件不仅仅是`koa-router`一个库，还有很多router库，如果你喜欢可以自己来一个。但是这个是官方的，我们还是直接用比较好:

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
在Express应用中，我们处理Post请求的参数时，用的是`bodyparser`中间件。同理，在koa中使用的就是`koa-body`。现在支持以下几种:

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

在koa对应的路由里，直接将POST请求的参数以JSON格式返回, 然后观察GET与POST请求的不同与相同之处:
```ts
const router.get('/user', async ctx => {
    ctx.body = {
        query: ctx.request.query，
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
在GET请求中，即使使用了bodyParser中间件，ctx.request.body也是一个空对象。只有在POST等复杂请求中，ctx.request.body才是请求头中的入参。
所不同的是，在POST请求中，ctx.request.query 却并不是一个空对象。

### 3. koa-logger
这个中间件没有什么可说的啦，就是一个日志中间件，可以在中间件中打印请求参数。