---
title: ClashX 在 Mac、Win10 和 Android 平台的使用
labels: [工具]
summary: ClashX 在三个平台的使用方法：Mac 上零配置、Win10 需配合 SwitchyOmega 插件、Android 直接导入订阅地址。
keywords: [ClashX, 代理, Mac, Android]
---

## ClashX 在 Mac、Win10 和 Android 平台的使用

> **摘要：** ClashX 在三个平台的使用方法：Mac 上零配置、Win10 需配合 SwitchyOmega 插件、Android 直接导入订阅地址。

---

![](https://cdn.wuh.site/2021-12/2021-12-05-021507.png)

我之前用的是 google 浏览器的一个插件，大多数朋友可能都有用过，就是**GHelper**。

但是在公司内部，不知道出于什么原因，也可能是内网的原因，这个插件失效了。所以只能另寻他法，终于找到了一个几乎不用啥配置的工具，但是也需要交一点点保护费。

### Mac 上使用

在 Mac 上使用特别的简单，因为我本身的意愿就是找一个零配置的工具。

而且，Clashx 在 Mac 上的表现也相当的亮眼，颜值还是不错的。

![clashx-setting][image-1]

在交保护费的平台拿到 clash 的订阅地址，点开菜单栏的猫头，找到配置-\>托管配置-\>管理。把你的 clash 订阅地址贴到管理里面，之后更新列表，不出意外的话，在成功更新之后就可以看到代理服务器列表了。
![dingyue][image-2]

我选择的代理模式是规则模式，打开系统代理之后。打开浏览器输入 google 看一下，不出意外现在是可以访问外网了。

这是不同于 win10 平台的一点，在 window 平台上，用浏览器的无痕模式可以直接访问外网，但是普通模式不可以，还需要用 SwitchyOmega 这个插件做转发。**真是有够麻烦的**。

最后，附上 clashx 在 Mac 平台的下载地址[clashX][1]，版本号是**1.72.0**。在 Mac 上使用极其简单的，几乎没有费什么工夫就成功的跑了起来，完全没有遇到什么麻烦。

---

### window10 的 Clash
在 window 平台的客户端不再是 ClashX，而是 Clash。都是一家人没什么太大的区别，都是基于 go。不得不说，在各个平台使用 Clash 都很简单，几乎没遇到什么大的麻烦，但是在 window 上需要多处理一点。

在这里附上 Clash 的下载地址[clash_for_window][2](https://github.com/Fndroid/clash\_for\_windows\_pkg/releases)。该链接来自于**github**，请放心使用。

首先，如果没有买飞机票，请先交保护费买一张飞机票，获得 clash 的订阅地址。另外还需要给 google 浏览器装一个插件**Proxy switchyOmega**。

---

### Android 的 Clash

首先贴上[clash_for_android][3]的下载地址：https://github.com/Kr328/ClashForAndroid/releases，该链接来自于**github**，请放心使用。

在进入 app 之后，映入眼帘的还是熟悉的一个黑色的猫头。接下来的操作还是老一套，点开配置进入配置页之后，点击右上角**+**图标，会进入“创建配置”页。进入”创建配置”页之后，选择从 URL 导出，这里就是贴上 clash 的订阅地址。

完成这些操作之后，回到首页。看一下第一栏的文案，如果是“运行中”就表示已经正常代理了，打开手机浏览器，进入 google 浏览器，或者是打开 twitter。如果是“已停止”就点击启动，不出什么意外，就可以正常使用了。


![][image-3]
![][image-4]

手机上的操作就这么简单。

只要是找的源足够靠谱，那代理的网速应该差不了多少，足够日常的使用。

注意：
1. [clashx 教程 — MacOS][4]
2. [飞机场-优云 666][5]
3. [ 飞机场-飞世云 ][6]

[1]:	https://github.com/yichengchen/clashX/releases/download/1.72.0/ClashX.dmg "clashX"
[2]:	https://github.com/Fndroid/clash_for_windows_pkg/releases "clash_for_window"
[3]:	https://github.com/Kr328/ClashForAndroid/releases
[4]:	https://merlinblog.xyz/wiki/ClashX.html "macos clashx 教程"
[5]:	https://youyun222.net/user "优云 666"
[6]:	http://www.caogon.com/auth/register "飞世云"

[image-1]:	https://cdn.wuh.site/2021-08/2021-12-04-020018.jpg
[image-2]:	https://cdn.wuh.site/2021-12/2021-12-04-024157.png
[image-3]:	https://cdn.wuh.site/2021-12/2021-12-04-2021120402.png
[image-4]:	https://cdn.wuh.site/2021-12/2021-12-04-20211120403.png