---
title: 基本使用
order: 102
icon: /assets/image/javaweb-fullstack/git/gitea/gitea_favicon.png
---

## 1. 官方文档

[https://docs.gitea.com/zh-cn/](https://docs.gitea.com/zh-cn/)

## 2. 下载地址

[https://dl.gitea.com/gitea/a02_base_use/](https://dl.gitea.com/gitea/a02_base_use/)

下载最新版本即可. 

## 3. windows 平台安装与配置

### 3.1. 下载

下载 `gitea-1.24.6-gogit-windows-4.0-386.exe` 

### 3.2. 首次运行配置

下载 `exe` 之后复制到指定目录, 然后再命令行直接启动, 此时可以打开 `http://localhost:3000/` 进行配置

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/001.png)

根据提示配置即可

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/002.png)

此时点击立即安装页面会一直显示如下状态

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/003.png)

这是由于修改了端口, 可以通过命令行查看是否安装成功. 安装成功后的命令行如下, 直接 `Ctrl+C` 结束即可

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/004.png)


### 3.3. 查看与添加管理员

可以用如下命令查看管理员

```
gitea admin user list
```

当前显示应该如下

```
D:\program\git\gitea>gitea admin user list
ID   Username Email           IsActive IsAdmin 2FA
1    admin    admin@ghost.com true     true    false

D:\program\git\gitea>
```


如果没有配置也可以自行添加

```
gitea admin user create --username myname --password asecurepassword --email me@example.com
```

可参考官方文档: [https://docs.gitea.com/zh-cn/administration/command-line#admin](https://docs.gitea.com/zh-cn/administration/command-line#admin)

### 3.4. 添加用户

在命令行直接运行 `gitea` , 然后访问 [http://localhost:9082/](http://localhost:9082/) 并登录即可


可以通过管理后台添加用户

菜单位置

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/005.png)

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/006.png)

添加用户时, 建议取消勾选修改密码

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/007.png)

### 3.5. windows ssh 特殊配置

由于 windows 默认没有开启 ssh 服务, 可以使用 gitea 内置的 ssh 服务. `Ctrl+C` 停止服务, 并修改 `custom/conf/app.ini`

```ini
SSH_PORT         = 3022
SSH_LISTEN_PORT  = 3022
START_SSH_SERVER = true
```

## 4. gitea actions

### 4.1. 仓库与 ci 文件准备

首先新建一个仓库, 并准备两个分支

* main : 开发分支
* dev_1.0.0 : 部署分支

`ci` 文件位于 `.gitea/a02_base_use/workflows/ci.yaml` , 内容如下

```yaml
name: Build & Pack Release
'on':
  push:
    branches:
      - dev_1.0.0
jobs:
  clone:
    runs-on: linux-amd64
    steps:
      - name: 克隆代码
        run: |
          # 一个示例命令
          pwd
          # 另一个示例命令
          touch /home/laolang/devops/gitea_actions/tmp/one.txt
          echo "this is a git job" > /home/laolang/devops/gitea_actions/tmp/one.txt
          echo "git clone xxx.git"
        working-directory: .
  build-java:
    needs: clone
    runs-on: linux-amd64
    steps:
      - name: test
        run: |
          cat /home/laolang/devops/gitea_actions/tmp/one.txt
          echo "mvn clean test"
      - name: package
        run: |
          echo "mvn clean package"
      - name: build image
        run: |
          echo "docker build"
      - name: restart server
        run: |
          echo "stop server"
          echo "start server"
  build-ui:
    needs: clone
    runs-on: linux-amd64
    steps:
      - name: npm install
        run: |
          echo "npm install"
          pwd
```

### 4.2. gitea 配置修改

```ini
# server 地址不能写 localhost
[server]
SSH_DOMAIN = 192.168.1.6
DOMAIN = 192.168.1.6
HTTP_PORT = 9082
ROOT_URL = http://192.168.1.6:9082/

# 如果没有则手动添加
[actions]
ENABLED=true
```

### 4.3. act_runner 下载

在 [https://gitea.com/gitea/a02_base_use/act_runner/releases](https://gitea.com/gitea/a02_base_use/act_runner/releases) 下载最新稳定版. 此处以 `act_runner-0.2.13-linux-amd64.xz` 版本为例

下载后解压即可

### 4.4. 配置文件

执行如下命令生成配置文件

```shell
./act_runner generate-config > config.yaml
```

然后修改

```yaml
runner:
  # The labels of a runner are used to determine which jobs the runner can run, and how to run them.
  # Like: "macos-arm64:host" or "ubuntu-latest:docker://docker.gitea.com/runner-images:ubuntu-latest"
  # Find more images provided by Gitea at https://gitea.com/docker.gitea.com/runner-images .
  # If it's empty when registering, it will ask for inputting labels.
  # If it's empty when execute `daemon`, will use labels in `.runner` file.
  labels:
    - "linux-amd64:host"
```

### 4.5. 任务注册

在如下位置获取 `token`

> 注意: 此 `token` 只能使用一次

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/011.png)

然后使用如下命令注册任务

```shell
./act_runner register --no-interactive --instance <instance> --token <token>
```

* `instance` : 指 `gitea` 地址, 例如: `http://192.168.1.6:9082`
* `token` : 参考上面的步骤

### 4.6. 运行 actions

使用如下命令运行 `actions`

```shell
./act_runner daemon --config config.yaml
```

### 4.7. 触发 actions

随便写点代码, 然后合并到 `dev_1.0.0` 分支, 可观察到 `actions` 已被触发

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/012.png)


执行效果

![](/assets/image/javaweb-fullstack/git/gitea/a02_base_use/013.png)

### 4.8. 参考

官方文档: [https://docs.gitea.com/usage/actions/overview](https://docs.gitea.com/usage/actions/overview)

中文文档: [https://docs.gitea.com/zh-cn/usage/actions/overview](https://docs.gitea.com/zh-cn/usage/actions/overview)

[windows & linux操作系统实现 Gitea Actions](https://blog.csdn.net/m0_66376607/article/details/142251012)

[GitHub Actions 教程](https://docs.github.com/zh/actions/tutorials)

[Github Actions 超详细教程，看这一篇就够了！](https://blog.natuie.net/posts/2025/02/06/055518/)

[GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)