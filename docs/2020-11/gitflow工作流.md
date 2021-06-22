## 如何使用Git管理代码

我深信，独立开发模式下的开发者们是不需要过多操心我们的代码管理的，更不会担心我这一次的合并`会不会有冲突？` `有冲突了我怎么去改？` `代码改乱了我怎么办？`之类的问题。

### Git的前世今生
代码的版本管理工具有很多，它们从性质上分为：商用与开源，从管理方式上分为：集中式与分布式。商业以BitKeeper为代表，开源首推SVN与Git。而现在Git成为最受欢迎的代码管理工具之一，离不开我们熟知的Linux之父Linus以及全世界为开源工作的开发工程师们的共同努力。

在两个星期之内，Linus用C语言完成了Git的初代版本，一个月之后Linux的源码由Git接管。

Git的快速风靡为开源世界带来的变化，在我们现在的日常工作中深有体现，比如：Github、GitLab、Gitee、GitBook。从命名上看来，我们可以猜测它们都与Git有关，实际上它们都是基于Git。尤其是Github，上面聚集着大量的开源项目，为开源项目提供着免费的托管服务。

一切的一切都让我对**开源才是未来**这个观点深信不疑。

### workflow工作流
既然使用了Git，我们的代码管理还是遵循Git的工作流吧。Git与Linux一样，随处体现着开源项目的无限魅力，让每一个开发者心中都有了一个属于自己的Git或者是Linux，其魅力主要体现在多样性、扩展性。

workflow工作流有以下三种:
1. git flow
2. github flow
3. gitlab flow

#### Git Flow
既然在git中存在着多种管理方式，那么每一个团队都需要寻找适合自己团队的代码工作流。我们前端团队选择的是`gitflow工作流`，其示意图如下：

![][image-1]

其特征是：始终保持两个常驻分支，其他分支即为辅助分支，辅助分支合并之后可以随时删除，并不影响其常驻分支。

#### Github Flow
GithubFlow工作流的管理方式相当特殊，它只有一个分支master，而且受到了保护，有一个专门维护的开发者负责核查合并每一个pr。每一次pr操作之后，设置的github actions自动触发进行CI操作，通过后即可发布relaese版本。

![][image-2]

#### Gitlab Flow
Gitlab Flow工作流是一个混合了GitFlow与GithubFlow特性的新生代工作流，从常驻分支Master和Dev中检出一个release预发布分支，业务代码发布上线之后稳定之后将代码合并入Master分支，并且打上一个Tag版本号。于是我们的代码终于可以配合一些管理平台，快速部署了。

### 实战GitFlow
现在我们亲手实现一个简单的GitFlow工作流，一起动手吧\~\~

```bash
git branch

git branch -a
```
![][image-3]

git branch 可以查看本地的全部分支，git branch -a 可以查看该源上的全部分支，若要查看远程的全部分支可以使用, 如下图所示，前缀以remote/origin开头的即为远程分支名。
```bash
git branch -r
```
![][image-4]

origin为当前代码的远程源之一，如果要查看全部源可以使用
```bash

# 查询关联源
git remote 
#$ origin

# 查询源信息
git remote get-url origin
#$ git@gitlabl.com

```

由上图可见，我们本地已经有了master分支了，gitflow规范dev分支的上游源只有master，所以我们需要从master分支检出一个dev分支
```bash
git checkout master

# parent branch master
git checkout -b dev
```

好啦，现在我们的常驻分支已经全部在我们的工作区啦，现在我们需要管理我们的团队代码啦，我们的前端代码以功能模块区分，新功能以feat-\*开头, 其操作如下:
```bash
git checkout dev

git checkout -b feat-module-name
```
现在我们组内的一个前端开发人员在feat-module-name下开发一个混合查询功能，另外一个前端开发需要开发一个新增以及编辑的表单，所以他需要从dev检出一个feat-module-form

现在我们以这两个功能作为我们工作流的示范。

开发混合查询的前端工作的效率很高，功能很快就开发完成，通过了内测现在进行到了提测阶段，所以我们需要一个辅助分支test用来配合测试环境。现在我们需要将查询功能合并进入test分支啦。

**初始版本的test分支应该由dev分支检出**

现在我们将第一个新功能进入测试环境
```bash
git checkout test

# 不要使用快速合并
git merge feat-module-name --no-ff
```

现在我们的另一个功能的开发也开发完成啦，也需要进测试分支啦，同理我们合并进入`test`
```bash
git checkout test

git merge feat-module-form --no-ff
```
成功合并的提示并没有如期的出现，反而是出现了一串英文，我们可能不认识全部，但是绝对认识一个单词, 它就是团队开发的口头禅: 卧槽 又冲突了, 没错它就是 `CONFLICT`, 翻译一下就是`冲突`

![][image-5]

如上图: 是由于我们两个前端在两个分支中同时修改了index.js文件，命令行中也指出了我们冲突的文件位置，那么我们应该怎么修复冲突才算是正确操作呢?

![][image-6]
首先不要轻易的选择Accept Current Change / Accept InComing Change / Accept Both Change。
我们必须有相当清晰思路，现在我们是两个新功能先不考虑Bug修复的代码冲突，查看一下冲突代码前后文是否有相关联的代码，再决定怎么解决我们的冲突。
现在我们将模拟代码全部保留, 记住解决冲突之后一定要将冲突文件再次提交，最后才是推送远程。

我们回到测试分支，现在的测试分支有了两个新功能了，我们可以通知测试工程师们，可以跑一下脚本啦，代码已经上测试啦。

经过第一轮功能测试之后，测试工程师们提交了好几个Bug，首先是feat-module-name 有一个条件查询无效，其次feat-module-form 表单重新编辑提交报错啦。

好吧有了bug了，我们再次回到我们的工作分支feat-module-name 处理了bug之后合并测试，feat-module-form 也处理完成了，合并之后推送远程测试分支，进行第二轮测试。这一次测试很顺利，我们的功能通过了测试，我们的代码也要合并进入dev分支啦。

操作与发布测试环境相同，代码成功进入了dev分支。现在我们的测试工程师需要进行回归测试，针对于全部功能点来一次回归。

### Git版本回退
但是现在出了一点状况, 我们的混合查询功出问题了，时间上已经来不及了，所以我们选择这一次部署，要移除这个查询功能。
要实现这样的一个功能，就需要使用Git的版本回退指令，Git的版本回退操作，基本上有以下三种:
1. reset
2. rebase
3. revert

那我们一次介绍一下它们对应的操作说明。

#### 1. reset
reset 指令应该是我们日常用到的最多的一个指令，它可以快速撤销已提交到暂存区的文件到工作区 `git reset [path]`，如果指定了文件地址，就只会撤回该文件地址相对应的文件，不指定就会将暂存区文件全部撤回。 如图标红区：
![][image-7]
```bash
# 回退两个提交
git reset --hard HEAD~~

```

执行--hard，然后commit之后会将当前指针之后的全部commit舍弃，而--soft不会，在修改commit之后，它仍然会在保留提交的历史记录。

同为`reset`指令，但是它们的使用情景不相同, 比如:
1. 你已经将一次错误修改`commit`到了本地暂存区，你已经确认不再需要这一次的代码提交了，可以直接选择 `--hard` 丢弃本次commit\_id，回到工作区的代码将会是 HEAD\~\~ 指针的代码
2. 你提交了一次错误修改，但是不需要全部丢弃本次commit的代码，只需要改一下再次提交就可以了，那么你可以选择 `--soft` 回到工作区，此时本次HEAD的代码更改仍然存在，修改之后提交，完美。

#### 2. rebase
`rebase`翻译一下是`重定、变基`的意思。使用`rebase`指令我们可以完成一些比较骚气的操作，比如将我们开发分支的全部提交合并为一次指定提交。除了可以合并多次提交丢弃一些无用的提交记录之外，还可以帮助我们将我们的提交历史整个变为一条时间提交线。下面我们分开演示一下：
1. 合并多次提交
我们可以去查看一下git rebase的文档，有一个具有交互性的指令`git rebase -i`
```bash
git rebase -i HEAD~~~~
```
我pick了最近的一次提交，将其他的commit 全部改为f后，现在提交已经全部合并进入了pick的top\_commit\_id了。这样我们可以将我们的功能分支全部管理起来，在合并进入dev分支之前将我们的代码处理的干干净净。

其操作结果如下图: 
![][image-8]

将代码处理干净了，没有多余提交了，我们可以来美化一下我们的master以及dev分支上面的历史提交记录啦。

在开始之前我们查看一下官网的描述, 关键的流程图已经做出了标记，如下图:
![][image-9]

上图的表达的意思是在E节点检出了一个分支，功能开发完成之后`merge`进入`master`分支就会有一个分叉，而使用了`rebase`之后，将原A、B、C节点隐去，将A'、B'、C'直接合并到`master`分支的G提交后。结合节点图二，表达的是如果两个分支中同时存在一个相同提交，变基之后原节点被隐藏，改为该节点副本，其他提交依次拼接到`master`最近一次提交。

操作一下，这个时候我们需要格式化一下我们的log日志，试一下吧。
```bash
git log --graph --pretty=oneline
```

进入主题，我们直接进入变基操作，看我操作
```bash
# 先回到dev 分支进行一个检出
git checout -b feat-module-rebase
# 修改文件之后提交
git add .
git commit -m'feat(index): create rebase flag'

# 进入 feat-module-rebase 分支后立即进行变基
git rebase dev

git merge feat-module-rebase
```
其操作结果如下图: 
![][image-10]


我们分别看一下变基的`feat-module-name`分支与未变基的`feat-module-form`分支

**feat-module-name**
![][image-11]

**feat-module-form**
![][image-12]

由图上可以看出，我的rebase操作是基于dev分支，所以feat-module-name以及feat-module-form 两个分支的提交全部合并到了dev分支上，它们没有了分叉，是一条笔直的直线。

rebase 操作与reset操作都会改变仓库的提交记录，对日志都是毁灭性的打击，所以这个指令是不太推荐使用的。


#### 3. revert
revert操作其`指针永远是前进的`，其翻译是`反转`,它只会生成一个全新的commit去假回退对应指针， 修改之后提交其历史提交记录不会更改，不会像 `reset --hard` 直接移除提交记录，而是与 `reset --soft` 类似，所以它的操作永远是安全的，我们对于远程仓库的管理比较推崇 `git revert`

我们看一下`revert`的操作示意图: 
![][image-13]

让我们来试一下revert操作吧，我已经提前准备好了三次提交，如下如，我们将每一次的提交标记清楚：
![][image-14]

现在我认为第一次提交有错误代码，我需要注释它，操作如下:
````bash
```bash
git revert HEAD~~
```
````
没想到吧，报了一个冲突，没关系前后多次版本的提交有冲突是很正常的，修复之后提交，然后再次执行一次revert操作，可以看下面的历史记录，多次以First为基准进行revert操作，修改之后提交，会有一条新的commit提交记录，所以它的指针永远是向前走，以此来达到一种`反转效果`的回退。
![][image-15]

Revert还可以执行一个骚操作，我们Revert了一次，达到了移除指定commit\_id的操作，现在推迟发布上线，已经有时间去改了，我又需要将commit\_id 的操作加上去。我们可以执行对一个Revert执行一次Revert，将指定的`反转`再一次`反转`，这样我们的代码不就还原啦。操作如下：
````bash
```bash
git log --oneline -10
# 查找全部提交记录, 找出其中的需要revert的revert_id

git revert revert_commit_id
```
````
执行之后查看一下代码，如果顺利的话，指定revert\_commit\_id的提交应该已经还原了。

### 线上问题
相当不巧，现在线上出现了一点点小问题，需要紧急修复一下，按照规范，我们需要从dev分支检出一个新的分支以`hotfix-*`命名。操作如下:
```bash
git checkout dev

git checkout -b hotfix-form
```
代码修复完成之后我们按照提测流程，将代码再次合并入test分支测试，测试环境通过后代码进入dev分支，这一次的代码将在预发布环境再次测试，预发布环境测试通过后紧急部署到生产环境。

一个完整的gitflow工作流到此就已经闭环，在多次流程之后，各个团队的测试通过的功能代码就已经全部进入了dev分支。而未通过测试功能代码依旧停留在test分支上，我们可以在预发布决断这一次迭代需要发布哪一些功能，因为我们可以在dev分支合并选择需要的功能分支的代码。

注意:  
**1. 以master分支为主分支，受到分支保护，不允许任何人提交，由专人维护**  
**2. 全部分支以dev分支为上游源**

相关文章:  
[Git协同与提交规范][1](蚂蚁金服前端九部)  
[Rebase(变基)][2](跟着廖雪峰学习Git)  
[Rebase变基][3](Git官网)  
[为什么变基操作是危险的?][4]

[1]:	https://www.yuque.com/fe9/basic/nruxq8#df368884
[2]:	https://www.liaoxuefeng.com/wiki/896043488029600/1216289527823648
[3]:	https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA
[4]:	http://jartto.wang/2018/12/11/git-rebase/

[image-1]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-gitflow.png
[image-2]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-githubflow.png
[image-3]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-135601.png
[image-4]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-135800.png
[image-5]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-144258.png
[image-6]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-14-144635.png
[image-7]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-024108.png
[image-8]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-060713.png
[image-9]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-061532.png
[image-10]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-070738.png
[image-11]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-073827.png
[image-12]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-073753.png
[image-13]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-035633.png
[image-14]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-040604.png
[image-15]:	https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-11-15-043651.png