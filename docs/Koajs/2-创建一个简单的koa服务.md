## 创建一个简单的koa服务

### 1. 创建一个工程目录
直接使用`npm init`完成仓库
```bash
$ npm init

$ npm i koa
```

创建Koa app的代码极其简单，可以直接使用node 指令 启动koa的入口文件

在根目录下新建`app.js`文件:
```ts
const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
    ctx.body = 'Hello, Welcome to Koajs'
})

app.listen(9999)
```

### 2. nodemon
可以使用nodemon托管我们的koa应用，让我们不必多次重启我们的脚本，更新之后可以立即看到效果:
```json
"script": {
    "start": "node ./app.js",
    "nodemon": "nodemon ./app.js"
}
```

### 3. 引入Typescript
想玩ts很久了，在上面创建的基础上，我们继续添加一些额外的配置进我们的脚手架项目。
需要准备以下库: `typescript, ts-node, @types/koa, @types/node`
全局安装`typescript`之后，可以使用`tsc`指令生成`tsconfig.json`文件:
```bash
$ npm i -g typescript
$ tsc --init
```

在将`.js`后缀的文件改为`.ts`后，我们的node工程将会终止，因为之上的脚本只启动了`app.js`，而我们将`app.js`变为`app.ts`之后，node是没有办法直接编译ts文件的，所以需要我们改一下脚本文件。
```json
"script": {
    "nodemon": "NODE_ENV=local nodemon --inspect -w src/**/*.ts -e ts --exec 'node -r ts-node/register ./src/app.ts'"
}
```

在接入了ts后，我们的写法就需要变一下了，因为不出意外的话，你的vscode现在已经到处都是红色的下划线链接了。
下面是一个简单的中间件:
```ts
import { Context, Next } from 'koa'

const logger = async (ctx: Context, next: Next) => {
    await next()
    
    ctx.body = `<h1>请求总用时: 200ms</h1>`
}
```
在引入koa的中间件库后，我们也需要根据提示，将一些申明文件引入。比如：`koa-router`库需要`@types/koa-router`。同时，也需要将一些ts编译的范围缩小，排除一些不需要的编译的文件:
```json
{
  "include": [
    "src/**/*.ts",
    "typings/**/*.ts"
  ],
  "exclude": [
    "node_modules/*"
  ]
}
```