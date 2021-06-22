## 我用了30天完成了我的个人网站--Express

四天之前我开始迁移我的Github中的issue, 把我之前的日记迁移到了微信公众号和服务器, 中间遇到了富文本迁移的时候, 样式差异大的问题, 于是我换回了Markdown.

所以有了之前几篇的关于Markdown的踩坑记录, 自定义处理了一下前台渲染时的样式. 第一期的开发到这里基本就全部结束了, 现在它们上线了.

后台我用的是Node, 搭配的是node社区常见的技术, 如下:         
1. Express
2. MongoDB--mongoose
3. jwt--jsonwebtoken
4. multer
5. bcryptjs

### [Express]

为什么选择了Express这么一个框架呢? 我的考虑有以下几点, 总结一下:         

   + 资格老, 代表着资料多, 我将会遇到的问题已经有了解决方法, 我可以踩着前人的脚步前进
   + 接触最早, 我在几年前就接触过, 只不过没有一直坚持下去
   + Nodejs的中文社区里面已经有了很成熟的写法, 包括[cnodejs.org]的后台就是Express
   + 深度的了解Nodejs, 我是一个前端, 一直在使用着Nodejs, 却没有深度的学习, 直接上项目是了解它的最快方式

Nodejs与前端息息相关, 比如说: npm, webpack. 为什么我说我一直在使用着Node, 因为脚手架里面那几条经典的命令: 
```bash
npm install vuex 
npm view vuex

npm run start
npm build
```

慢慢的我了解到了一个名词叫做环境变量NODE_ENV, 于是我开始自定义脚本, 我想开启Mock服务器我就可以敲 *npm run start:mock*, 现在我需要发布测试包我可以敲 *npm run build:test*

再后来打包的体积太大了, 严重的影响了网站的加载速度, 我需要优化打包我的项目包, 于是我开始使用webpack提供的插件了.

**所以每一个前端都离不开Nodejs, 既然离不开那就好好学习它!!!**

### MongoDB与Mongoose

既然是后台开发肯定是离不开数据库的, 因为我做的并不是云应用, 没有给我那种技术支持, 使我不用自己开发Api. 那么对于数据库, 我选择了MongoDB.

Mongodb是什么? 它是一个NoSql, not only sql. 底层基于c++, 是不是有点眼熟呢?

当然使用原生的api写起来稍微有一点点繁琐, 比如对于一个文档的查询: 
```javascript
    db.collection.find(query) 

    db.collection.find({ name: 'shadow', age: 20 }) 

    db.collection.find({ gendor: 1, age: { $gt: 20 } })
```

在设计文档的结构时缺少了sql中对value的强限制, api的操作过于繁琐, 于是乎有了类似于mongoose的驱动, 让我们可以在Nodejs通过npm直接使用.

在开始学习时我使用的原生api, 现在我使用[mongoose]. 为什么使用mongoose, 有几点原因: 
  +  Schame 可以清楚的定义文档结构
  +  Modal 作为Schema的实例, 可以高效的使用api
  +  SchemaTypes 字段的类型有了一个强定义
  +  简洁的, 多样的, 阅读性高的api

我就不过多的描述了, 已经贴上了官网的地址, 可点击链接去查看一下它提供的api. 以后也会一边学习mongoose的玩法, 一边更新文档, 有兴趣的可以一起学习, 共同进步.

### jwt -- [jsonwebtoken]

一种鉴权的实现, 现在的鉴权大概有这么几种: 
+ cookie缓存
+ oAuth三方认证
+ jwt令牌

前端在于服务器端交互时, 在涉及到访问权限时, 处理的方式也有以下几种:
+ cookie
+ 在发起get/post请求时, 表单新增参数token, 值为后台动态返回的token值
+ 在headers中添加Authorization, 用到的就是token令牌

现在我用的就是jwt, 说到这里我一定要正式向一个老哥道谢, 他是一个老外[Andela], 他写了一篇博客就是介绍JWT Authorization, 但是不仅仅是JWT, 而是介绍了Express+Mongoose+JWT用法, 而且非常用心的分析了代码, 标注了使用步骤.

**如果碰巧你也是一个node新手, 也想写一写后台应用, 应该去看一看[JWTAuthorization]**

### [multer] -- 文件上传

既然是一个后台, 怎么可能没有文件上传这个必不可缺的功能呢. 社区里面使用的比较多的文件上传中间件那就是multer.

我从未接触过后台, 我印象中的文件上传是一个很复杂的功能, 比如说: 上传文件类型的限制, 进度条的实现, 大文件的分片上传, 以及前端的断点续传. 你看其实文件上传的内容并不少吧.

但是有了这么一个中间件以后, 我所需要的工作就是, 配置一下上传的文件夹, 然后按照我的想法重置一下文件名, 之后结束.

我为了文件上传这么一个功能准备了一天, 我一直在社区里面看文档, 比较不同中间件的玩法, 让我没想到的是收尾原来这么简单.

### [bcryptjs] -- 零依赖的加密库

这个没有好讲啦, 我只用在了一个位置, user_password加密.


现在终于讲完了后台系统的基本结构, 做一个总结吧: 
**1. 在没有尝试的前提下, 不要小瞧任意一种技术, 不要轻谈它的难易程度**
**2. 在没有尝试的前提下, 不要轻看任意一个功能点**
**3. talk is cheap, show me code**

最后贴上几篇博客: 

[还分不清 Cookie、Session、Token、JWT?](https://mp.weixin.qq.com/s/sF96Vgcp9FU--oeRlh4IdA)

[HTTP灵魂之问，巩固你的 HTTP 知识体系](https://mp.weixin.qq.com/s/zpOvPM3YE5Myujh-bQNtKg)

[多维度分析 Express、Koa 之间的区别](https://mp.weixin.qq.com/s/fPd8FHk2Ak224bgWD5a4oQ)

[学习 koa 源码的整体架构，浅析koa洋葱模型原理和co原理](https://mp.weixin.qq.com/s/Tqj07pSmjJiFNTPYgVV19Q)

[MongoDB，我的道](https://mp.weixin.qq.com/s/ftGwd0Wk-CzK6yAyTzaj1g)


[Express]: https://expressjs.com/
[cnodejs.org]: https://github.com/cnodejs/nodeclub/
[mongoose]: https://mongoosejs.com/
[Andela]: https://twitter.com/Andela
[JWTAuthorization]: https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122
[multer]: https://github.com/expressjs/multer
[bcryptjs]: https://www.npmjs.com/package/bcryptjs
[jsonwebtoken]: https://github.com/auth0/node-jsonwebtoken