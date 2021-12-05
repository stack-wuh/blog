## 基于TS重构NextJs应用

> 在10.1的假期中，我用TS重写了博客的前端应用，同时用sass改写了全部组件的样式。对于组件的设计，全部借鉴于ant design的设计规范和开发规范。

第一版的Next应用写的不是很满意，很多代码和实现都不是我喜欢的那一种。恰逢10.1假期，改写了大部分的组件的代码。

由于近期的工作比较多，平时又很累一直没顾得上写一写，这一次重写遇到的问题和解决的方法，以及对整个应用工程化的实现的记录。现在已经过去了两个多月了，很多细节已经回想不起来了。没办法，只能看着现在的代码总结一下。

### 提交规范

无论我们做任何项目，从规范代码提交的开始，应该是对整个项目最负责的体现。

不知道从什么时候开始，我个人的提交规范就朝着angular的方向了。我记得当时我看了一篇讲述angular提交规范的博客，当时一看顿时觉得仪式感太强了，整个commit记录一眼看过去相当整齐，从那时起，我觉得angular规范是最好的。

代码规范和样式美化选用 _prettier_ 和 _eslint_ 。代码的样式美化和统一，给我的感觉就是舒服。这里没什么可以说的，网上的教程一大把，但是我偷懒了，对于react的规则，我用是的umijs的规则，当然nextjs自身的规则继续保留。

只要是严格的遵循了angular的提交规范，就可以使用[ conventional-changelog ][1]工具，快速的生成本次发布的版本的更新日志，这里附上近期的[更新日志][2]。大致就是以下这个样子，看起来就是满满的仪式感。

![][image-1]

Github Actions用起来的感觉就是一个字，太爽了！之前一直不会用，一直在研究到底是怎么玩的。直到看阮老师的博客，发现了一个新的工具[act][3]，可以在本地调试github actions。可以监听git的merge事件，来做一些自动化操作。

所以现在，我把主分支切成了main分支，每一次的功能迭代改为pull merge操作。因为我看到了next的官网上有推荐，可以使用Vercel持续集成应用，这样每一次的merge操作就可以自动发布到Vercel容器了。

### 组件的设计规范
基本原则还是遵照我之前的总结[《浅尝一下UI设计》][4]，基本的设计不变，但是改成sass函数之后，整个css部分变得更加地整齐、清晰和简单。


这里不得不提到sass中的函数和混入，在sass的官网中有它们相当具体地实现。这次我用到的基本都是Map类型操作。我举一个相当简单的用例，实现组件的大中小三种类型的样式函数。文件名: `vars.scss`
```scss
	$font-size-base: 14px;
	$compose-base: 8px;
	$sizes: ((small, $font-size-base - 2px, $compose-base * 0.5),
	  (middle, $font-size-base, $compose-base),
	  (large, $font-size-base+2px, $compose-base*2));
	
	@mixin getSizes () {
	
	  @each $size,
	  $fontsize,
	  $padding in $sizes {
	    .is-#{$size} {
	      font-size: $fontsize;
	      padding: $padding;
	    }
	  }
	}
```

在调用`getSizes`函数之后，自动生成了`.is-small`、`.is-middle`和`.is-large`三个类名，对应着组件的三种大小状态。在此处我只定义了`基本字体大小`和`内边距`两种属性，如果需要扩展属性，可以很轻易地实现。

其编译之后的代码如下: 
![][image-2]

所以，我们可以借助类似的一些自定义函数，在快速完成我们样式代码的同时减少代码量。less和sass其功能相差不大，基本功能都可以实现，具体的一些功能函数可以参考ant的代码实现。

### React.FC 全函数式组件的实现

完全舍弃类组件，全部由函数式组件构建。

如果你不会做，不妨跟着会做的人做。

在本次更新中，很多组件都是模仿ant。包括对于TS的使用下的React组件定义，自定义组件对外暴露的属性，组件内部classname的命名和条件渲染，大量代码都借鉴了ant。

Hooks的实现借鉴了另一个开源库`ahooks`，但是hooks文件的规则还是沿用umijs。

当然，audio的单例模式实现也发生了一些变化。在init阶段的单例实现没有任何变化，但是我创建了一个全局的context，在这个context中新建了ref来保存audio实例。整个应用似乎不太需要Redux。

主题切换，不再使用原方案，改为使用脚本实现。同时，bubble泡泡也改为使用脚本实现。你可以直接下载[bubble.js][5](https://src.wuh.site/scripts/bubble.js)脚本体验。

### Accessibility 可访问性指标

![aria][image-3]
在google浏览器的性能测试工具中，就有\_Accessibility\_指标。在ant的实现中，我们可以发现`role` 和 `aria-*` 属性。当时我看到的时候很迷惑，因为我从来没见到过html元素的属性中，有role这个属性。知道后来我听了\_《重学前端》\_这门课，我才知道原来是这么回事。

除此之外，还有键盘的可访问性，那就是`tabindex`。其对应的键盘按件就是`tab`键。在对一个html元素配置该属性之后，就可以通过`tab`键聚焦。如下: 
```html
  <div tabindex='0'>hello</div>
```

我们都知道在Html5 中发布了一些新的元素，这一些元素被称之为**语义化标签**，我记得在当时，我是完全用section标签取代了div标签。现在我的大部分标签改回了div。

所以，在一轮的重构中，我对大量的元素加入了role属性，覆盖率大致上达到了80%。只要是涉及到了可交互的组件基本上完成了配置。页面可点击按钮全部换成button元素和a元素。

或许，我们都应该听老师傅的话：**如果你不知道的怎么用语义化标签，那就不要用**

### App的结构化优化，NextSEO和点击事件上报
一个网站的SEO是极其重要的，所以在一次的重构中，我选择了**NextSEO**库，不再使用自己维护的代码实现。这个仓库满足了我全部的需求，因为我只需要配置google结构化，标题，关键字这一些属性，其他的我并不需要。

Gtag可以完成满足我的上报需求。首先我对页面的按钮进行了基础分类，大致分为了: `normal`、`loadmore`、`link`、`share`、`behivor`。这样，我完成了页面点击按钮的事件上报。

接口上报还没来得及做，现在我的服务后台换成了Nest应用，很多功能都没有时间去做。

### 自动化构建，Docker的一键更新和发布
我优化了`Dockerfile`构建文件，改成了分段式构建。

早前我是自己的野路子，能把应用跑起来就行，但是后来我发现，构建的Docker镜像太大了，感觉告诉我有点点不太对劲儿。在我改了构建文件之后，现在我的镜像的体积是91M。

构建步骤大致分为三个阶段: 初始化、构建、运行时。

本次升级内容，如下：
1. 不再使用npm, 改为使用yarn
2. 改为使用ali的镜像源，减少依赖的安装时间
3. 安装`jq`一个json文件的解析工具
4. 改为分段式构建

```sh
# ==================== Deps ==============
# =================== 安装依赖 =============
FROM mhart/alpine-node as deps
LABEL maintainer = "shadow [wuh131420@gmail.com][6]"
  
WORKDIR /usr/src/app
  
COPY package.json yarn.lock /usr/src/app/
  
RUN apk add jq
RUN npm config set registry https://registry.npmmirror.com
RUN yarn
  
# ================== Builder ================
# ================= 编译 ===================
FROM mhart/alpine-node as builder
WORKDIR /usr/src/app
  
.......
  
# ============== Runing ===========
# ============== 运行时 ===========
FROM mhart/alpine-node AS runner
WORKDIR /usr/src/app
  
ENV NODE\_ENV production
...
  
USER nextjs
  
EXPOSE 3000
  
CMD ["yarn", "start"]
```

更为关键的是自动构建，自动升级和镜像清理脚本，结合一下`github actions`，一切都变得舒服了起来。

### RSS 聚合内容的实现

![][image-4]

只要有优质的订阅源，我们完全可以只使用RSS阅读器，就可以享受阅读的乐趣。它是一个信息板，只关注我想关注的内容。所以现在的一些博客网站都会配置rss。

怎么配置实现rss就成了我们需要关注的内容啦。

在这里我推荐使用[Feed][6](https://www.npmjs.com/package/feed)，但是我的实现稍有不同。

每一次更新博客之后，都需要更新维护的rss.xml文件，只有这个文件更新了，订阅器才会有更新推送。现在我把这个功能集成到了我的管理后台，我的feed文件托管在aliOSS，这个是我的[feed][7](https://src.wuh.site/common/rss.xml)。

### web worker 来一个自动切换主题的实现
我用 `web worker` 注册一个时间轮询器，用于获取当前设备的时间。白天使用`light`模式，晚上变为`dark`模式。怎么让它们实现自动切换就是一个比较指的研究的问题啦。

难道要在主线程中加一个定时器，让它每次30分钟更新一次吗？

或许，有别的方式。在不占用主线程的资源的前提下，还可以监听时间的变化，在满足条件的前提下，切换网站的主题模式。

这是一个相当简单的实现，如果你感兴趣，可以在项目的源文件里面，查看相关的代码。

### 图片格式转化为webp
`.webp`类型的文件，从文件可压缩的大小的比率上看具有相当的优势。但是目前为止，我只是把网站的背景图片和部分封面图改为了`.wepb`，大部分文件仍然还是`.png`。

来自于h5的新标签`picture`，提供了非常棒的降级方案，只需要配置额外的基础源就可以放心使用webp文件。

看起来，需要实现一下转换图片的格式了

[1]:	https://github.com/conventional-changelog/conventional-changelog
[2]:	https://github.com/stack-wuh/wuh.site/releases
[3]:	https://github.com/nektos/act
[4]:	https://wuh.site/post/%E6%B5%85%E5%B0%9D%E4%B8%80%E4%B8%8BUI%E8%AE%BE%E8%AE%A1
[5]:	https://src.wuh.site/scripts/bubble.js
[6]:	https://www.npmjs.com/package/feed "rss-feed"
[7]:	https://src.wuh.site/common/rss.xml

[image-1]:	https://src.wuh.site/2021-12/2021-12-04-070306.png
[image-2]:	https://src.wuh.site/2021-12/2021-12-04-073516.png
[image-3]:	https://src.wuh.site/common/aria.png
[image-4]:	https://src.wuh.site/2021-12/2021-12-04-084011.png