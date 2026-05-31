## 认识 GitHub Actions

> **摘要：** GitHub Actions 通过 YAML 配置文件实现 CI/CD 自动化，核心概念是 Workflows → Events → Jobs → Actions → Runners 的事件流模型。

---

![github-actions](https://cdn.wuh.site/2021-12/2021-12-13-135531.png)

在日常开发、部署和更新日志发布中，一定会重复执行一些操作。一直在寻找和尝试简单、自动化的方案，免去重复操作。

---

## 什么是 GitHub Actions

从一个简单配置文件认识：`.github/workflows/first.yml`

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

文件类型是 yaml，后缀 yml。语法和 JSON 很相似，上面的 yml 翻译为 JSON：

```json
{
  "name": "Github Actions Demo First",
  "on": ["push"],
  "jobs": {
    "logger": {
      "runs-on": "ubuntu-latest",
      "steps": [
        { "name": "runner task1", "run": "echo 'actions runner task1'" },
        { "run": "echo 'actions runner task2'" },
        { "run": "echo 'actions runner task3'" }
      ]
    }
  }
}
```

语句前加 `-` 号，父级自动解析为数组。`:` 之后的换行符解析为对象。语法比 JSON **更加简单**。

---

## 文件结构分析

GitHub Actions 包含 5 个基础元素：

| 元素 | 说明 |
|------|------|
| Workflows | 工作流，放在 `.github/workflows` 下 |
| Events | 触发事件 |
| Jobs | 任务，可并行或串联 |
| Actions | 复用的动作单元 |
| Runners | 执行环境（虚拟机） |

和 `docker-compose` 的文件结构相当相似。上述元素全部是复数，可以有一个或多个。

**注意：** Jobs 下的子任务都必须指定 `runs-on` 属性，否则会抛出：

```
ERRO[0000] 'runs-on' key not defined in Github Actions Demo First/tags
```

---

## Events 事件

`on` 可以监听多种事件，还可以针对单独分支监听：

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  schedule:
    - cron: '/5 * * *'
```

- **schedule** 定时任务，函数是一些云函数
- 可对 `push`、`pull_request` 等事件配置分支过滤

---

## Jobs 任务

Jobs 是 GitHub Actions 最核心的元素。比较关注的是环境变量问题，`env` 提供了这一功能，`uses` 和 `with` 成对使用。

任务可以是单行，也可以有先后依赖关系。通过 `jobs.jobs_id.needs` 配置串联：

```yaml
jobs:
  reb:
    runs-on: ubuntu-latest
    needs:
      - first_task
      - second_task
    steps:
      - name: 'third_task'
        run: echo 'third_task'
```

`runs-on` 表示在哪一个虚拟机执行任务，常用选项：

| 虚拟机 | Runs-on label |
|--------|---------------|
| Windows Server 2022 | windows-2022 |
| Windows Server 2019 | windows-latest |
| Ubuntu 20.04 | ubuntu-latest |
| Ubuntu 18.04 | ubuntu-18.04 |
| macOS Big Sur 11 | macos-11 |
| macOS Catalina 10.15 | macos-latest |

---

## Docker 自动编译和推送

GitHub 官方提供的例子，actions 来自 Docker 官方仓库。可查看 [我的编译 yml](https://github.com/stack-wuh/wuh.site/blob/main/.github/workflows/docker-push.yml) 或 [GitHub 官方例子](https://docs.github.com/cn/actions/publishing-packages/publishing-docker-images)。

需要上传 Docker Image 到 Docker Hub，使用 Docker 官方提供的 actions：

1. `docker/login-action` — 登录，只有登录状态才能推送镜像
2. `docker/metadata-actions` — 配置 image 版本号
3. `docker/build-push-action` — 编译和推送

---

## Release 版本更新

很多工作可以用工具自动生成。比如更新日志，之前本地执行脚本生成后推送到 GitHub。现在改为自动化。

版本更新是 CI/CD 的重要环节，可极其方便地控制手动操作。

常用 actions：

| Actions | 用途 |
|---------|------|
| `actions/checkout@v2` | Git 相关操作，使用频率最高 |
| `actions/setup-node@v1` | 选择 Node.js 版本 |
| `release-drafter/release-drafter@v5` | 生成 release notes |
| `appleboy/ssh-action@master` | SSH 登录服务器执行指令 |

**注意：**

1. `release-drafter` 必须使用 `pull_request` 才能拿到分支更新日志
2. `appleboy/ssh-action` 有多种连接服务器方式，用户名+密码需确认远程服务器支持
3. 条件允许时拆分多个任务，不要都写在一个任务里
