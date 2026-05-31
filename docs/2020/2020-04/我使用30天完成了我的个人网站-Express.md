## 我用 30 天完成了个人网站（下）：Express + MongoDB 后台实践

> **摘要：** 后台开发没有想象中复杂，Express + MongoDB 的组合让前端可以快速涉足服务端。

---

### 背景

四天前我开始迁移 GitHub 中的 issue，把之前的日记迁移到微信公众号和服务器。中间遇到了富文本迁移时样式差异大的问题，于是换回了 Markdown。

所以有了之前几篇关于 Markdown 踩坑记录的文章，自定义处理了一下前台渲染时的样式。第一期开发到这里基本全部结束，现在已经上线。

后台用的是 Node，搭配的是 Node 社区常见的技术栈：

| 技术 | 用途 |
|------|------|
| Express | Web 框架 |
| MongoDB + Mongoose | 数据库及驱动 |
| JWT (jsonwebtoken) | 鉴权 |
| multer | 文件上传 |
| bcryptjs | 密码加密 |

---

### 为什么选 Express

1. **资格老，资料多** —— 遇到的问题基本都有前人踩过坑
2. **接触最早** —— 几年前就接触过，只是没有坚持深入
3. **社区成熟** —— cnodejs.org 的后台就是 Express
4. **深度了解 Node.js** —— 直接上项目是了解它最快的方式

Node.js 与前端息息相关：npm、webpack 都基于 Node。以前只会用脚手架命令 `npm install`、`npm run build`，后来了解了环境变量 `NODE_ENV`，开始自定义脚本如 `npm run start:mock`、`npm run build:test`。再后来打包体积太大影响加载速度，开始使用 webpack 插件优化。

所以每个前端都离不开 Node.js，既然离不开，那就好好学习它。

---

### MongoDB 与 Mongoose

后台开发离不开数据库。我做的不是云应用，没有现成的 API 支持，所以需要自己开发。数据库选择了 MongoDB。

MongoDB 是 NoSql（not only sql），底层基于 C++。使用原生 API 写查询稍微繁琐：

```javascript
db.collection.find({ name: 'shadow', age: 20 })
db.collection.find({ gender: 1, age: { $gt: 20 } })
```

原生 API 缺少 SQL 中对 value 的强限制，操作也比较繁琐。于是有了 Mongoose 这样的驱动，可以在 Node.js 中通过 npm 直接使用。

为什么用 Mongoose：

| 特性 | 说明 |
|------|------|
| Schema | 清楚定义文档结构 |
| Model | 作为 Schema 的实例，高效使用 API |
| SchemaTypes | 字段类型强定义 |
| API | 简洁、多样、阅读性高 |

---

### JWT 鉴权

现在的鉴权方式大概有以下几种：

| 方式 | 说明 |
|------|------|
| Cookie 缓存 | 传统方式 |
| OAuth 三方认证 | 微信/QQ 登录等 |
| JWT 令牌 | 无状态鉴权 |

前端与服务器交互时，涉及访问权限的处理方式：

| 方式 | 说明 |
|------|------|
| Cookie | 浏览器自动携带 |
| 表单新增 token 参数 | 后台动态返回 |
| Headers 中添加 Authorization | 使用 token 令牌 |

我现在用的是 JWT。这里必须感谢一位叫 Andela 的老外，他写了一篇介绍 JWT Authorization 的博客，不仅讲 JWT，还分析了 Express + Mongoose + JWT 的完整用法，非常用心。

如果碰巧你也是一个 Node 新手，推荐去看看 [JWT Authorization](https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122)。

---

### multer —— 文件上传

后台必备功能之一。社区中常用的文件上传中间件是 multer。

我印象中的文件上传很复杂：文件类型限制、进度条、大文件分片、前端断点续传。但用了 multer 之后，只需要配置上传文件夹、按想法重置文件名，然后就结束了。

为了文件上传这个功能准备了一天，在社区里看文档、比较不同中间件，没想到收尾这么简单。

---

### bcryptjs —— 密码加密

零依赖的加密库，只用在了一个地方：user_password 加密。

---

### 总结

1. 在没有尝试的前提下，不要小瞧任意一种技术，不要轻谈它的难易程度
2. 在没有尝试的前提下，不要轻看任意一个功能点
3. talk is cheap, show me code

---

### 参考文章

- [还分不清 Cookie、Session、Token、JWT?](https://mp.weixin.qq.com/s/sF96Vgcp9FU--oeRlh4IdA)
- [HTTP 灵魂之问，巩固你的 HTTP 知识体系](https://mp.weixin.qq.com/s/zpOvPM3YE5Myujh-bQNtKg)
- [多维度分析 Express、Koa 之间的区别](https://mp.weixin.qq.com/s/fPd8FHk2Ak224bgWD5a4oQ)
- [学习 Koa 源码的整体架构，浅析 Koa 洋葱模型原理和 co 原理](https://mp.weixin.qq.com/s/Tqj07pSmjJiFNTPYgVV19Q)
- [MongoDB，我的道](https://mp.weixin.qq.com/s/ftGwd0Wk-CzK6yAyTzaj1g)
