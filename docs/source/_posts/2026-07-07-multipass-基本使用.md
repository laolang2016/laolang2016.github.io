---
title: multipass 基本使用
date: 2026-07-07 18:28:23
categories:
  - 虚拟机
  - multipass
tags:
  - 虚拟机
  - multipass
---

# 参考资料

官网: https://canonical.com/multipass

# 常用命令

|命令|作用|说明
|--|--|--|
|multipass ls|查看已经安装的虚拟机示例||
|multipass shell <虚拟机实名名称>|进入虚拟机||
|multipass start|||
|multipass stop|||
|multipass delete <虚拟机实名名称>|删除虚拟机示例||
|multipass purge|清理所有已删除示例||
|multipass recover <虚拟机实名名称>|恢复删除但是未清理的实例||
|multipass info [虚拟机实例的名字]|查看实例信息||
|multipass exec [虚拟机实例的名字] pwd|外部执行实例内命令||
|multipass mount  宿主机目录  实例名:实例内目录|挂在外部目录到实例内部||
|multipass umount <实例名>[:<挂载路径>]|卸载挂在目录|如果未指定挂载路径则卸载实例内的所有挂载目录|
|multipass transfer [options] <source> [<source> ...] <destination>|文件传输||


# 创建虚拟机

```bash
# --name 名称
# -c cpu 核数
# -m 内存大小
# -d 磁盘大小
# 24.04 系统版本
multipass launch --name devstudio -c 4 -m 16G -d 50G 24.04
```

# 切换底层虚拟化技术

**virtualbox**

```bash
multipass set local.driver=virtualbox
```

**hyuper-v**

```bash
multipass set local.driver=hyperv
```