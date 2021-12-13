## 认识Github Actions

![](https://src.wuh.site/2021-12/2021-12-13-135531.png)

> 什么是github actions? 我们可以使用github actions做一些什么事情?怎么实现我们的需求?

我们在日常的开发过程中，部署过程中或者是更新日志的发布，一定会重复地执行一些操作。我一直在寻找和尝试一些简单、自动化的操作，免去一些重复操作。

首先说明，我也是头一次运用github actions，不过是在完成了一些操作之后，反过头来记录一些我是怎么做的。

### 什么是Github Actions

先从一个简单的配置文件，来认识一下github actions。`.github/workflows/first.yml`

```yaml
name: Github Actions Demo First

on: [push]

jobs:
  logger: 
    runs-on: ubuntu-latest
    steps:
      - name: 'runner task1'
        run: echo 'actions runner task1'
      - run: echo 'actions runner task2'
      - run: echo 'actions runner task3'
```

首先文件的类型是`yaml`,文件名的后缀是`yml`，所以我们需要提前学习一下yml的语法。其语法和json的语法很相似，上面的yml文件翻译为json，其实就是这个样子:

```json
{
  "name": "Github Actinon Demo First",
  "on": ["push"],
  "jobs": {
    "logger": {
      "runs-on": "ubuntu-latest",
      "steps": [
        {
          "name": "runner task1",
          "run": "echo 'actions runner task1'"
        },
        {
          "run": "echo 'actions runner task1'"
        },
				{
          "run": "echo 'actions runner task1'"
        }        
      ]
    }
  }
}
```

只要是在语句之前加上`-`号，那么它的父级会自动解析为数组，在`:`之后的换行符会解析为对象。其语法对比json来讲，**更加简单**。

不出意外，其执行成功的结果就是这个样子:

![](https://src.wuh.site/2021-12/2021-12-06-125421.jpg)



### 文件的结构分析

在github官方对github actions的文档描述看，上面的例子虽然简单，但是已经包含了事件流的基础元素。

+ Workflows
+ Events
+ Jobs
+ Actions
+ Runners

现在对比这么一看，跟我之前写过的`docker-compose`的文件结构相当相似。要知道上面的元素全部是复数，就是说可以有一个也可以有多个，只要保证了基本的结构不错误，那你可以随意的加多个任务。

需要注意的是，对于Jobs下的子任务，都需要指定`runs-on`属性，要不然会抛出：

```sh
ERRO[0000] 'runs-on' key not defined in Github Actions Demo First/tags 
```

**Workflows**文件一般是放在`.github/workflows`文件夹内部，我看了好几个开源项目的文件目录大致上都是这样，因为github会自动拉取这个文件目录下以`.yml`结尾的文件作为任务文件。

**Events**是一个关键点。下面我贴上两个地址，是github actions的官网上对于Events模块的描述。[events-that-trigger-workflows][1],[workflow-syntax-for-github-actions][2]。`on`可以监听到的事件官网上提供了一个索引表，和它们相关的写法和用法。同时不单单是对事件，还可以针对单独的分支进行事件监听。

```bash
name: Github Actions Demo Second

on: 
  push: 
    branches: 
      - main
  pull_request:
    branches:
      - main
  schedule:
    - cron: '/5 * * *'
    
  jobs:
  	reb:
    	runs-on: ubuntu-latest
      steps: 
        - name: 'push main'
          run: echo 'push events'
```

**Events.schedule**定时任务。在文档上`schedule`出现的位相当靠前，估计这个是一个相当不错的特性。它的函数是一些云函数，官网给出了一些例子，但是我目前还没有测试，所以先放着，以后再玩。

**Jobs**和它的一系列参数列表和[语法][3]。Jobs是Github Actions最核心的元素了吧，我们需要的各种各样的功能能不能实现，怎么实现就依赖于怎么实现。其中，我们比较关注就是一些环境变量问题。`env`提供了这一功能，另外`use`和`with`成对使用。

其中，介绍Jobs任务的另一种使用，串联。任务可以是单行，也可以是多个任务有先后、互相依赖的关系存在。所以在github actions中提供了**jobs.jobs_id.needs** 这个配置项，让我们可以个性化配置。使用方法也简单

```bash
jobs: 
	reb: 
		runs-on: ubuntu-latest
		needs:
			- first_task
			_ second_task
		steps:
			- name: 'thrid_task'
			- run: echo 'thrid_task'
```

`jobs.jobs_id.runs-on`表示在哪一个虚拟机执行任务。 现在提供的虚拟机，可能我们日常使用`ubuntu`就够了。它有以下几个选项，可能以后还会再增加。

| 虚拟机               | Runs-on label  |
| -------------------- | -------------- |
| Windows Server 2022  | windows-2022   |
| Windows Server 2019  | windows-latest |
| Windows Server 2016  | windows-2016   |
| Ubuntu 20.04         | ubuntu-latest  |
| Ubunti 18.04         | ubuntu-18.04   |
| macOS Big Sur 11     | macos-11       |
| macOS Catalina 10.15 | macos-latest   |



### Docker 的自动编译和推送

> 这是一个github 官方提供的例子，actions来自于docker官方仓库。
>
> 可以查看我的[编译yml][4]，也可以直接查看github[官方例子][5]。对比一下，你就会发现没有什么太大的差异，只是我换成了分支名，而github例子使用的hashid。

因为需要上传Docker Image镜像到Docker Hub，可以使用由docker官方提供的几个actions：

1. docker/login-action 登录用，只有登录状态下才可以推送镜像
2. docker/metadata-actions 配置image的版本号
3. docker/build-push-action 编译和推送

### Release 版本更新

不得不承认，有很多的工作或者是操作都可以用一些工具自动生成。比如，我现在项目的更新日志，仍然还是在本地执行脚本，生成日志之后再推送到github。

每一次更新，发布release版本时，还需要把本次更新的内容复制粘贴到版本说明中。看起来可以改变一下，让这一步工作自动化进行。

版本更新CI/CD的一个重要环节，其价值不可谓不巨大，可以极其方便地控制一些手动操作。尽管现在有一个工具可以了本地测试，但是还是有缺陷，在我做完了全部的流程之后，我回过头来仔细分析了一下。我之所以干的这么不顺利，就是因为我不太了解linux和虚拟机相关的知识。

另外不太熟悉github actions相关的进阶的玩法。由此可见，我这种英语不行，我看着文档上面例子，也可以做出一些我想要的功能。另外也归功于github actions的仓库，里面准备了一大批日常使用的功能，完全解决了我的需求。

现在介绍使用的actions:

	+ **actions/checkout@v2** 应该算是使用频率最高的actions了吧，只要是涉及到了git相关的操作就离不开它
	+ actions/setup-node@v1 选择任务执行的nodejs版本，可以控制其版本号
	+ **release-drafter/release-drafter@v5** 生成release notes的一个actions，可以生成这个版本号的提交日志
	+ **appleboy/ssh-action@master** 服务器登录执行指令

注意:

	1. 在使用release-drafter的过程中，必须使用pull_request 这样才可以拿到每一次分支的更新日志
	1. appleboy/ssh-action 需要注意的是有多种连接服务器的方式，如果使用的用户名+密码，需要查看远程服务器的是否支持连接
	1. 如果条件允许，还是拆分多个任务比较好，不要都写在一个任务里面





[1]: https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows
[2]: https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#on
[3]: https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idenv
[4]: https://github.com/stack-wuh/wuh.site/blob/main/.github/workflows/docker-push.yml
[5]: https://docs.github.com/cn/actions/publishing-packages/publishing-docker-images#