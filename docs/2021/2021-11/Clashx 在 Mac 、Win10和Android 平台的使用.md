## ClashX 的使用记录

> **摘要：** 从浏览器插件 GHelper 切换到 ClashX，记录 Mac、Windows、Android 三个平台的配置方式。

---

![clashx](https://cdn.wuh.site/2021-12/2021-12-05-021507.png)

之前用的是 Google 浏览器插件 **GHelper**，但在公司内部（可能是内网原因）失效了，只好另寻他法。最终找到 ClashX，几乎不用配置，只需交一点点保护费。

---

## Mac 上使用

在 Mac 上使用特别简单，意愿就是找一个零配置工具。ClashX 在 Mac 上的表现相当亮眼，颜值不错。

![clashx-setting][image-1]

在订阅平台拿到 Clash 的订阅地址，点开菜单栏的猫头，找到配置 → 托管配置 → 管理，把订阅地址贴进去，更新列表。成功更新后可以看到代理服务器列表。

![dingyue][image-2]

选择**规则模式**，打开系统代理。打开浏览器输入 google，不出意外可以访问外网。

Mac 上不同于 Windows：Windows 上用浏览器无痕模式可以直接访问外网，但普通模式不行，还需要 SwitchyOmega 插件做转发。

ClashX Mac 下载地址：[ClashX 1.72.0](https://github.com/yichengchen/clashX/releases/download/1.72.0/ClashX.dmg)

---

## Windows 上的 Clash

Windows 平台的客户端是 Clash（不是 ClashX），都基于 Go 开发，使用简单。

下载地址：[clash_for_windows](https://github.com/Fndroid/clash_for_windows_pkg/releases)

需要多处理一步：给 Google 浏览器装插件 **Proxy SwitchyOmega**。

---

## Android 上的 Clash

下载地址：[clash_for_android](https://github.com/Kr328/ClashForAndroid/releases)

进入 App 后，映入眼帘还是熟悉的黑色猫头。操作老一套：点开配置 → 管理 → 右上角 **+** 图标 → "创建配置" → 选择从 URL 导出 → 贴上 Clash 订阅地址。

完成操作后回到首页，如果第一栏显示"运行中"表示已正常代理。点击启动即可。

![android-1][image-3]
![android-2][image-4]

手机上的操作就这么简单。只要源足够靠谱，代理网速应该差不了，足够日常使用。

---

## 注意

1. 找的源要靠谱，网速才有保障
2. Mac 上打开系统代理即可，Windows 需配合浏览器插件

[image-1]: https://cdn.wuh.site/2021-08/2021-12-04-020018.jpg
[image-2]: https://cdn.wuh.site/2021-08/2021-12-04-024157.png
[image-3]: https://cdn.wuh.site/2021-08/2021-12-04-2021120402.png
[image-4]: https://cdn.wuh.site/2021-08/2021-12-04-20211120403.png
