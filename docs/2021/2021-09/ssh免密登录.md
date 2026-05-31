## SSH 免密登录

> **摘要：** 通过 ssh-keygen 生成密钥对，将公钥推送到服务器的 authorized_keys，配合本地 config 文件实现一键免密登录。

---

免密登录用到的就是一个公钥。如果之前在机器上用过 GitHub 的 SSH 模式，那一定还记得密钥生成到哪个文件夹。

用到的指令就一个 `ssh-keygen`，几乎不用加任何参数，直接生成一对 key 文件：`id_rsa.pub` 和 `id_rsa`。

```bash
ssh-keygen --help
```

---

## 生成密钥

在本地生成 key 文件后，推送到服务器。先检查服务器的 SSH 服务是否开启：

```bash
systemctl status sshd
systemctl start sshd
```

---

## 配置权限

在服务器上设置 `.ssh` 和 `authorized_keys` 的权限：

```bash
sudo chmod 700 ~/.ssh
sudo chmod 600 ~/.ssh/authorized_keys
```

---

## 测试登录

```bash
ssh root@101.101.101.101
```

正常进入云服务器即说明生效。如果不行，检查配置文件路径或权限。

---

## 配置别名

在本地的 `.ssh` 目录新增 `config` 文件：

```
Host aliyun
    user root
    hostname 192.168.1.1
    IdentityFile /Users/root/.ssh/id_rsa
```

执行 `ssh aliyun` 即可一键登录云服务器。

---

## 参考

- [SSH 免密登陆配置](https://segmentfault.com/a/1190000021000360)
