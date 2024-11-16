## 使用docker部署mongodb服务



使用镜像 docker pull mongodb/mongodb-community-server



问题一：拉取镜像文件超时

![image-20241116104439975](https://src.wuh.site/2024-10/2024-11-16-024447.png)

解决：

1. 使用其他的代理镜像源，参考文档https://www.coderjia.cn/archives/dba3f94c-a021-468a-8ac6-e840f85867ea
2. 重启docker服务 sudo systemctl daemon-reload && sudo systemctl restart docker



问题二：每次进来敲命令太麻烦了，能不能把每次的命令做成可执行文件呢？

解决：

1. 首先编辑一个.sh后缀的脚本文件
2. 给.sh文件授权，chmod   +x    **.sh

参考文档:https://www.cnblogs.com/linuxprobe/p/15270358.html



问题三: `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`

重启docker的服务， systemctl stop docker & systemctl stop docker.sock &  systemctl start docker



问题四： 如何进入mongo的容器新增权限用户

$ docker exec -it mongodb.service bash

我一直想在容器里面去新增权限用户，但是其实不用，我用mongodb官方提供的GUI工具mongodb compass直接进它的shell控制台，执行权限代码就可以了。



执行指令

1. ```bash
   db.createUser({user:"root",pwd:"root@123456",roles:[{role:'root',db:'admin'}]})
   ```

2. ```bash
   db.auth('root', 'root@123456')
   ```

完成之后重新连接数据库服务。



运维服务: https://m-zhoujie2.gitbooks.io/-linux-devops-2/content/chapter1-1.html
