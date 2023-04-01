## ssh免密登录

免密登录，用到的就是一个公钥。如果之前在机器上用过github的ssh模式，那你一定还记得，秘钥生成到哪一个文件夹下了。



用到的指令就一个 **ssh-keygen**,几乎可以不用加任何参数，直接生成一对key文件: `id_rsa.pub`和`id_rsa`

```bash
ssh-keygen --help

 usage: ssh-keygen [-q] [-b bits] [-C comment] [-f output_keyfile] [-m format]
                  [-N new_passphrase] [-t dsa | ecdsa | ed25519 | rsa]
       ssh-keygen -p [-f keyfile] [-m format] [-N new_passphrase]
                   [-P old_passphrase]
       ssh-keygen -i [-f input_keyfile] [-m key_format]
       ssh-keygen -e [-f input_keyfile] [-m key_format]
       ssh-keygen -y [-f input_keyfile]
       ssh-keygen -c [-C comment] [-f keyfile] [-P passphrase]
       ssh-keygen -l [-v] [-E fingerprint_hash] [-f input_keyfile]
       ssh-keygen -B [-f input_keyfile]
       ssh-keygen -D pkcs11
       ssh-keygen -F hostname [-lv] [-f known_hosts_file]
       ssh-keygen -H [-f known_hosts_file]
       ssh-keygen -R hostname [-f known_hosts_file]
       ssh-keygen -r hostname [-g] [-f input_keyfile]
       ssh-keygen -G output_file [-v] [-b bits] [-M memory] [-S start_point]
       ssh-keygen -f input_file -T output_file [-v] [-a rounds] [-J num_lines]
                  [-j start_line] [-K checkpt] [-W generator]
       ssh-keygen -I certificate_identity -s ca_key [-hU] [-D pkcs11_provider]
                  [-n principals] [-O option] [-V validity_interval]
                  [-z serial_number] file ...
       ssh-keygen -L [-f input_keyfile]
       ssh-keygen -A [-f prefix_path]
       ssh-keygen -k -f krl_file [-u] [-s ca_public] [-z version_number]
                  file ...
       ssh-keygen -Q -f krl_file file ...
       ssh-keygen -Y check-novalidate -n namespace -s signature_file
       ssh-keygen -Y sign -f key_file -n namespace file ...
       ssh-keygen -Y verify -f allowed_signers_file -I signer_identity
       		-n namespace -s signature_file [-r revocation_file]
```

在本地生成的key文件，推送到服务器上，在此之前先看下服务器的ssh服务开启了没有，没有开启的打开就好。

```shell
systemctl status sshd

systemctl start sshd
```



在服务器上，设置一下`.ssh`和`authorized_keys`的权限，网上有部分资料将权限设置之后，免密登录才生效。

```shell
sudo chmod 700 ~/.ssh
sudo chmod 600 ~/.ssh/authrized_keys
```



设置之后，测试一下，看看免密登录能不能成功：

```shell
ssh root@101.101.101.101
```

只要可以正常进入云服务器就说明已经生效了，如果还不行的，检查一下配置文件的路径或者是权限。



最后，在本地的`.ssh`目录，新增一个配置文件`config`:

```shell
Host aliyun
    user root 
    hostname 192.168.1.1 
    IdentityFile /Users/root/.ssh/id_rsa  (密钥的本地地址)
```

执行一下`ssh aliyun`，就可以登录云服务器了。



### 参考资料

+ [SSH 免密登陆配置](https://segmentfault.com/a/1190000021000360)



