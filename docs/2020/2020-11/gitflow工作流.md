## 如何使用 Git 管理代码：Git Flow 工作流实战

> **摘要：** Git Flow 的核心是"常驻分支 + 辅助分支"的分离，让代码发布有节奏、回滚有依据。

---

### Git 的前世今生

代码版本管理工具从性质上分为商用与开源，从管理方式上分为集中式与分布式。商业以 BitKeeper 为代表，开源首推 SVN 与 Git。Git 成为最受欢迎的代码管理工具之一，离不开 Linux 之父 Linus 以及全世界开源开发者的共同努力。

两个星期之内，Linus 用 C 语言完成了 Git 的初代版本，一个月之后 Linux 的源码由 Git 接管。

Git 的快速风靡为开源世界带来的变化，在日常工作中深有体现：GitHub、GitLab、Gitee、GitBook。尤其是 GitHub，聚集了大量开源项目，提供免费的托管服务。

一切的一切都让我对"开源才是未来"这个观点深信不疑。

---

### Workflow 工作流

Git 与 Linux 一样，随处体现着开源项目的魅力：多样性、扩展性。

workflow 工作流有三种：

| 工作流 | 特点 | 适用场景 |
|--------|------|----------|
| Git Flow | 两个常驻分支 + 多个辅助分支 | 有固定发布周期的团队 |
| GitHub Flow | 只有一个 master 分支，受保护 | 持续部署的小团队 |
| Gitlab Flow | 混合 Git Flow + GitHub Flow | 需要预发布环境的中等团队 |

我们前端团队选择的是 Git Flow 工作流。

#### Git Flow

始终保持两个常驻分支，其他分支为辅助分支，辅助分支合并后可以随时删除。

![image-1]

#### GitHub Flow

只有一个 master 分支且受保护，由专人负责核查合并每一个 PR。每次 PR 后触发 GitHub Actions 自动 CI，通过后发布 release 版本。

![image-2]

#### Gitlab Flow

从常驻分支 Master 和 Dev 中检出一个 release 预发布分支，业务代码发布上线并稳定后合并入 Master 分支，打上 Tag 版本号。

---

### 实战 Git Flow

#### 查看分支

```bash
git branch      # 查看本地分支
git branch -a   # 查看全部分支（含远程）
git branch -r   # 查看远程分支
```

前缀以 `remote/origin` 开头的即为远程分支名。`origin` 是当前代码的远程源之一。

```bash
git remote              # 查询关联源
# origin
git remote get-url origin   # 查询源信息
# git@gitlab.com
```

#### 创建常驻分支

Git Flow 规范 dev 分支的上游源只有 master，所以从 master 检出 dev：

```bash
git checkout master
git checkout -b dev   # parent branch: master
```

#### 创建功能分支

前端代码以功能模块区分，新功能以 `feat-*` 开头：

```bash
git checkout dev
git checkout -b feat-module-name
```

假设两个前端分别开发：
- A：`feat-module-name`（混合查询功能）
- B：`feat-module-form`（新增/编辑表单）

#### 合并到测试分支

A 开发完成，通过内测后进入提测阶段，需要一个辅助分支 `test`：

```bash
git checkout test
git merge feat-module-name --no-ff   # 不要使用快速合并
```

B 也开发完成，同样合并到 test：

```bash
git checkout test
git merge feat-module-form --no-ff
```

#### 解决冲突

如果两个前端同时修改了 `index.js`，合并时会出现冲突：

![image-5]

命令行中 `CONFLICT` 会指出冲突文件位置。解决冲突时不要轻易选择 `Accept Current Change / Accept Incoming Change / Accept Both Change`，必须先查看冲突代码前后文是否有相关联的逻辑，再决定怎么解决。

解决冲突后一定要将冲突文件再次提交，最后推送远程。

#### 修复 Bug 后合并

测试工程师提交 Bug 后，回到功能分支修复，合并到 test，再次测试。通过后合并进入 dev 分支，测试工程师进行回归测试。

---

### Git 版本回退

线上出问题需要紧急移除某个功能时，需要用到版本回退。Git 有三种回退方式：

| 方式 | 特点 | 安全性 |
|------|------|--------|
| reset | 直接移除提交记录 | 危险（--hard）/ 安全（--soft） |
| rebase | 重定/变基，合并提交 | 危险，改变提交历史 |
| revert | 生成新 commit 反转 | 安全，指针永远前进 |

#### reset

```bash
git reset --hard HEAD~~   # 回退两个提交，丢弃后续 commit
git reset --soft HEAD~~   # 回退两个提交，保留代码在工作区
```

- `--hard`：确认不再需要本次代码，直接丢弃
- `--soft`：只需要修改一下再次提交，保留代码在工作区

#### rebase

翻译为"重定、变基"，可以完成一些比较复杂的操作：

**合并多次提交：**

```bash
git rebase -i HEAD~~~~
```

pick 最近的提交，将其他 commit 改为 `f`（fixup），全部合并到 pick 的 commit 中。

![image-8]

**变基到目标分支：**

```bash
git checkout -b feat-module-rebase
git add .
git commit -m 'feat(index): create rebase flag'
git rebase dev
git merge feat-module-rebase
```

变基后，分支的提交全部合并到了 dev 分支上，没有分叉，是一条笔直的直线。

但 rebase 和 reset 都会改变仓库的提交记录，对日志是毁灭性打击，不太推荐在共享分支上使用。

#### revert

指针永远前进，生成一个全新的 commit 去"假回退"对应指针，历史提交记录不会更改。

```bash
git revert HEAD~~
```

如果对一次 revert 再次执行 revert，可以将"反转"再一次"反转"，代码就还原了：

```bash
git log --oneline -10
git revert revert_commit_id
```

---

### 线上热修复

线上出现紧急问题，从 dev 分支检出 `hotfix-*` 分支：

```bash
git checkout dev
git checkout -b hotfix-form
```

修复完成后按提测流程：合并到 test 测试 → 通过后进入 dev → 预发布环境再次测试 → 紧急部署到生产环境。

一个完整的 Git Flow 工作流到此闭环。多次流程后，通过测试的功能代码全部进入 dev 分支，未通过的停留在 test 分支。可以在预发布时选择需要发布的功能分支代码合并。

> **注意：**
> 1. 以 master 为主分支，受分支保护，不允许任何人提交，由专人维护
> 2. 全部分支以 dev 为上游源

---

### 参考文章

- [Git 协同与提交规范](https://www.yuque.com/fe9/basic/nruxq8) — 蚂蚁金服前端九部
- [Rebase(变基)](https://www.liaoxuefeng.com/wiki/896043488029600/1216289527823648) — 跟着廖雪峰学习 Git
- [Rebase 变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA) — Git 官网
- [为什么变基操作是危险的?](http://jartto.wang/2018/12/11/git-rebase/)

[image-1]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-gitflow.png
[image-2]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-githubflow.png
[image-3]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-135601.png
[image-4]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-135800.png
[image-5]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-144258.png
[image-6]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-144635.png
[image-7]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-024108.png
[image-8]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-060713.png
[image-9]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-061532.png
[image-10]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-070738.png
[image-11]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-073827.png
[image-12]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-073753.png
[image-13]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-035633.png
[image-14]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-040604.png
[image-15]: https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-043651.png
