## docker配置镜像源

之前用的Docker Desktop 这个工具可以直接在面板里面改，现在换成了podman，面板里面没有位置可以编辑了，在网上找了一些方法来解决问题。



### podman

这里有一个前提，我刚开始看的时候没有留意，导致查了好多资料，最后看大家都一样的写法，最后才发现了别人博客里面最开始就写了一句话: *如果**/etc/docker/daemon.json**这个文件有就直接改，如果没有就新增一个。*

```json
// vim /etc/docker/daemon.json

{
  "registry-mirrors": [
    "https://docker.m.daocloud.io"
  ]
}
```



![image-20241020161925696](https://src.wuh.site/2024-09/2024-10-20-081939.png)

![image-20241020162019965](https://src.wuh.site/2024-09/2024-10-20-082020.png)



### docker run

```bash
docker run -d -P m.daocloud.io/docker.io/library/镜像名称

样例:
docker run -d -P m.daocloud.io/docker.io/library/mongo
```



除此之外，还有另一种方法，直接用docker把容器跑起来，在镜像前面把代理的域名加上去就可以了。我就是没有把podman的代理问题解决，改用了这种方式，可以快速搞定。



在github上面找到了一个收集代理源[仓库[public-image-mirror](https://github.com/DaoCloud/public-image-mirror)](https://github.com/DaoCloud/public-image-mirror)

