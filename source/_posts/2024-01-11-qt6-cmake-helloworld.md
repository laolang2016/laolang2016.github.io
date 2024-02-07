---
title: qt6 cmake helloworld
date: 2024-01-11 02:06:05
tags:
- C/C++
- qt

categories:
- C/C++
- qt
---

qt6 cmake helloworld
<!--more-->

# 一键打包效果
> 1. 复制了依赖的 qt 动态库,包含 plugins/platforms 及其依赖库
> 2. 复制了自定义和第三方库
> 3. 生成了 desktop 文件
> 4. 使用 shell 脚本启动项目
> 5. 一个最基本的多目录构建的示例


## commit id
[https://gitcode.com/m0_53402432/qt-guide/commits/detail/893ce77c8a8350365f7903c29e6cc9becdc428dd?ref=main](https://gitcode.com/m0_53402432/qt-guide/commits/detail/893ce77c8a8350365f7903c29e6cc9becdc428dd?ref=main)

## 目录结构
```shell
(.venv) laolang@laolang-pc:hello-qt(main)$ tree
.
├── CMakeLists.txt
├── CMakeLists.txt.user
├── dist
│   ├── build.py
│   ├── hello-qt
│   ├── hello-qt.desktop
│   ├── ldd_qxcb.sh
│   └── pack.sh
├── format.sh
├── res
│   ├── cpp.ico
│   ├── cpp.png
│   ├── icons
│   │   └── new.png
│   ├── logo.ico
│   └── logo.png
├── res.qrc
└── src
    ├── app
    │   ├── CMakeLists.txt
    │   ├── main.cpp
    │   ├── mainwindow.cpp
    │   └── mainwindow.h
    ├── CMakeLists.txt
    ├── person
    │   ├── CMakeLists.txt
    │   ├── person.cpp
    │   └── person.h
    └── util
        ├── CMakeLists.txt
        ├── log_util.cpp
        └── log_util.h

7 directories, 25 files
(.venv) laolang@laolang-pc:hello-qt(main)$
```

## 使用方法
1. 修改 `dist/build.py`,如下部分需要根据自己项目的实际情况进行修改
```python
# app 名称
APP_NAME = "janna"
# 家目录
HOME_DIR = "/home/laolang"
# 打包目录
DEPLOY_PATH = "/home/laolang/tmp/janna/janna"
# 编译目录
BUILD_PATH = "/home/laolang/csdn/gitcode/qt-guide/janna/build-janna-Desktop_Qt_6_5_3_GCC_64bit-Release"
# qt platforms 目录
QT_PLATFORMS_PATH = "/home/laolang/program/qt6/6.5.3/gcc_64/plugins/platforms"
# 自己的动态库或其他三方库
LIBS = ("libutil", "libspdlog", "libfmt")
# 构建目录中的可执行程序
BUILD_BIN_PATH = f"{BUILD_PATH}/src/app/janna"
```

2. 修改 `dist/hello-qt.desktop` , 同样根据自己项目的实际情况进行修改

## 使用流程
```shell
(.venv) laolang@laolang-pc:dist(main)$ # 注意:需要先进行 Release 构建
(.venv) laolang@laolang-pc:dist(main)$
(.venv) laolang@laolang-pc:dist(main)$ # 查看部署目录
(.venv) laolang@laolang-pc:dist(main)$ cd ~/tmp/hello-qt
(.venv) laolang@laolang-pc:hello-qt$ pwd
/home/laolang/tmp/hello-qt
(.venv) laolang@laolang-pc:hello-qt$ l
总计 0
(.venv) laolang@laolang-pc:hello-qt$ cd -
/home/laolang/csdn/gitcode/qt-guide/hello-qt/dist
(.venv) laolang@laolang-pc:dist(main)$ # 开始部署
(.venv) laolang@laolang-pc:dist(main)$ pwd
/home/laolang/csdn/gitcode/qt-guide/hello-qt/dist
(.venv) laolang@laolang-pc:dist(main)$ l
总计 24K
-rw-rw-r-- 1 laolang laolang 5.5K 2024-01-23 16:24:34 build.py
-rwxrwxr-x 1 laolang laolang  579 2024-01-11 04:38:19 hello-qt*
-rwxr-xr-x 1 laolang laolang  250 2024-01-11 04:38:08 hello-qt.desktop*
-rw-rw-r-- 1 laolang laolang  144 2024-01-23 16:18:57 ldd_qxcb.sh
-rw-rw-r-- 1 laolang laolang  165 2024-01-23 16:23:49 pack.sh
(.venv) laolang@laolang-pc:dist(main)$ python3 build.py
开始打包...

清理并初始化打包目录

复制 qt 动态库

复制 qt plugin

复制自定义库和三方库

复制快捷方式


(.venv) laolang@laolang-pc:hello-qt$ # 部署完毕,检查部署目录
(.venv) laolang@laolang-pc:hello-qt$ cd ~/tmp/hello-qt
(.venv) laolang@laolang-pc:hello-qt$ l
总计 4.0K
drwxrwxr-x 9 laolang laolang 4.0K 2024-01-23 16:36:44 hello-qt/
(.venv) laolang@laolang-pc:hello-qt$ tree
.
└── hello-qt
    ├── bin
    │   └── hello-qt
    ├── data
    ├── lib
    │   ├── libfmt.so.10
    │   ├── libspdlog.so.1.12
    │   └── libutil.so
    ├── logo.png
    ├── logs
    ├── plugins
    ├── qt_lib
    │   ├── lib
    │   │   ├── libbrotlicommon.so.1
                   ...
    │   ├── libbrotlicommon.so.1
                   ...
    │   └── plugins
    │       └── platforms
    │           ├── libqeglfs.so
                   ...
    └── sbin
        └── hello-qt

11 directories, 122 files
(.venv) laolang@laolang-pc:hello-qt$
```

然后执行部署目录下 `sbin/hello-qt` 以及检查快捷方式是否生效

---


# 一个 HelloWorld 项目
## 新建项目并运行
略

# 修改项目为多目录结构

## commit id

[https://gitcode.com/m0_53402432/qt-guide/commits/detail/8364fb1ff6a6e8c94d4e0451d8ee4ef9d63e14f6?ref=main](https://gitcode.com/m0_53402432/qt-guide/commits/detail/8364fb1ff6a6e8c94d4e0451d8ee4ef9d63e14f6?ref=main)

## 参考
官网 6.5 参考: [https://doc.qt.io/qt-6.5/cmake-get-started.html](https://doc.qt.io/qt-6.5/cmake-get-started.html)
中文6.4 参考: [http://qt6.digitser.top/6.4/zh-CN/cmake-get-started.html#building-a-c-gui-application](http://qt6.digitser.top/6.4/zh-CN/cmake-get-started.html#building-a-c-gui-application)

# 如何打包

## 参考
[Linux下打包qt程序，可以发布到一台纯净的linux发行版系统上](Linux下打包qt程序，可以发布到一台纯净的linux发行版系统上)
[Linux平台关于可执行程序的动态库加载路径(rpath)的查看与修改](Linux平台关于可执行程序的动态库加载路径(rpath)的查看与修改)

## step 01 编译并复制可执行程序

例如把可执行程序复制到如下目录
```shell
laolang@laolang-pc:hello-qt$ l && pwd
总计 36K
-rwxrwxr-x 1 laolang laolang 34K 2024-01-11 02:18:43 hello-qt*
/home/laolang/tmp/hello-qt
laolang@laolang-pc:hello-qt$
```

## step 02 复制依赖库
新建 pack.sh ,内容如下
```shell
#!/bin/sh  
exe="hello-qt" #你需要发布的程序名称
des="/home/laolang/tmp/hello-qt" #程序所在路径
deplist=$(ldd $exe | awk  '{if (match($3,"/")){ printf("%s "),$3 } }')
cp $deplist $des
```

执行之后目录内容如下
```shell
laolang@laolang-pc:hello-qt$ ls
hello-qt  pack.sh
laolang@laolang-pc:hello-qt$ sh pack.sh
laolang@laolang-pc:hello-qt$ ls
hello-qt              libc.so.6       libfontconfig.so.1  libglib-2.0.so.0     libicudata.so.56  libmd.so.0      libpng16.so.16   libQt6Widgets.so.6  libX11.so.6        libz.so.1
libbrotlicommon.so.1  libdbus-1.so.3  libfreetype.so.6    libGL.so.1           libicui18n.so.56  libm.so.6       libpthread.so.0  librt.so.1          libXau.so.6        libzstd.so.1
libbrotlidec.so.1     libdl.so.2      libgcc_s.so.1       libGLX.so.0          libicuuc.so.56    libOpenGL.so.0  libQt6Core.so.6  libstdc++.so.6      libxcb.so.1        pack.sh
libbsd.so.0           libEGL.so.1     libgcrypt.so.20     libgpg-error.so.0    liblz4.so.1       libpcre.so.3    libQt6DBus.so.6  libsystemd.so.0     libXdmcp.so.6
libcap.so.2           libexpat.so.1   libGLdispatch.so.0  libgthread-2.0.so.0  liblzma.so.5      libperson.so    libQt6Gui.so.6   libuuid.so.1        libxkbcommon.so.0
laolang@laolang-pc:hello-qt$
```

## step 03 复制 platforms 目录
> 根据自己的 qt 安装目录调整
> **注意: 要在程序部署目录操作,不要删错,也可以提前备份 qt 安装目录下的 platforms 目录**
```shell
mkdir plugins
cp -r ~/program/qt6/6.5.3/gcc_64/plugins/platforms plugins/
rm -rf plugins/platforms/*.debug
```

## step 04 复制 libqxcb.so 依赖
进入 qt 安装目录下的 platforms 目录,新建 ldd_qxcb.sh , 内容如下
```shell
#!/bin/sh
mkdir lib
exe="libqxcb.so"
des="$(pwd)/lib"
deplist=$(ldd $exe | awk  '{if (match($3,"/")){ printf("%s "),$3 } }')
cp $deplist $des
```

然后在 qt 安装目录的 platforms 下执行改脚本,在 platforms 目录下会有一个 lib 目录, 将此目录复制到程序发布目录
```shell
cp -r ~/program/qt6/6.5.3/gcc_64/plugins/platforms/lib .
```

## step 05 编写启动脚本
启动脚本内容如下
```shell
#!/bin/bash

# 获取当前脚本的绝对路径
script_path=$(readlink -f "$0")
# 获取当前脚本所在目录
script_dir=$(dirname "$script_path")

# 设置 plugins 目录
qt_platforms_dir=$script_dir/plugins/platforms
export QT_QPA_PLATFORM_PLUGIN_PATH=$qt_platforms_dir

# 设置 依赖库路径
lib_dir=$script_dir
export LD_LIBRARY_PATH=$lib_dir

# 查看依赖库是否有缺失
ldd hello-qt

# 查看所有需要的插件是否有缺失
export QT_DEBUG_PLUGINS=1

# 启动程序
$script_dir/hello-qt
```

不出意外的话,即可成功启动

## step 06 新建一个 .desktop 文件
> 目录为
> ~.local/share/applications/hello-qt.desktop

```shell
[Desktop Entry]
Encoding=UTF-8
Name=hello-qt
Comment=hello-qt
Exec=/home/laolang/tmp/hello-qt/hello-qt.sh
Icon=/home/laolang/tmp/hello-qt/logo.png
Terminal=false
StartupNotify=true
Type=Application
Categories=Application;Development;
```


## step07 优化程序部署目录
从上面的结果可以看到,指定了 `LD_LIBRARY_PATH` 之后,程序可以正常启动,但是某些qt库有依赖 `platforms`下的库,而 `platforms`下的库的依赖库位置为 `../../lib`,此时我们可以做如下调整

1. 部署目录下除可执行程序与启动脚本之外的所有文件复制到部署目录下的 `lib` 目录
2. 移动可执行程序到部署下目录的 `bin` 目录中
3. 移动启动脚本到部署下目录的 `sbin` 目录中
4. 修改启动脚本内容如下
```shell
#!/bin/bash

# 获取当前脚本的绝对路径
script_path=$(readlink -f "$0")
# 获取当前脚本所在目录
script_dir=$(dirname "$script_path")

# 设置 plugins 目录
qt_platforms_dir=$script_dir/../lib/plugins/platforms
export QT_QPA_PLATFORM_PLUGIN_PATH=$qt_platforms_dir

# 设置 依赖库路径
lib_dir=$script_dir/../lib
export LD_LIBRARY_PATH=$lib_dir

# 查看依赖库是否有缺失
ldd hello-qt

# 查看所有需要的插件是否有缺失
export QT_DEBUG_PLUGINS=1

# 启动程序
$script_dir/../bin/hello-qt
```

测试该脚本是否能正常启动程序

5. 修改 desktop 文件内容如下

> 注意
> 1. icon 文件路径
> 2. 启动脚本名称
```
[Desktop Entry]
Name=hello-qt
Comment=hello qt
Exec=/home/laolang/tmp/hello-qt/sbin/hello-qt
Icon=/home/laolang/tmp/hello-qt/logo.png
Terminal=false
StartupNotify=true
Type=Application
Categories=Development;
```

测试能否正常启动程序

## step 08 移动自己的动态库位置

上面的操作将自己的动态库与 qt 动态库混在了一起,分开放置是一种更明智的选择

1. 重命名源部署目录下的 `lib` 为 `qt_lib`
2. 移动自己的动态库到部署目录的 `lib` 中
3. 修改启动脚本内容如下
```shell
#!/bin/bash

# 获取当前脚本的绝对路径
script_path=$(readlink -f "$0")
# 获取当前脚本所在目录
script_dir=$(dirname "$script_path")

# 设置 plugins 目录
qt_platforms_dir=$script_dir/../qt_lib/plugins/platforms
export QT_QPA_PLATFORM_PLUGIN_PATH=$qt_platforms_dir

# 设置 依赖库路径
lib_dir=$script_dir/../lib:$script_dir/../qt_lib
export LD_LIBRARY_PATH=$lib_dir

# 查看依赖库是否有缺失
ldd hello-qt

# 查看所有需要的插件是否有缺失
export QT_DEBUG_PLUGINS=1

# 启动程序
$script_dir/../bin/hello-qt
```

测试程序能否正常启动

此时部署目录结构如下
```shell
├── bin                 ---- 可执行程序目录
│   └── hello-qt
├── lib                 ---- 放置自己的动态库
│   └── libperson.so
├── log                 ---- 日志目录
├── logo.png            ---- 程序图标
├── qt_lib              ---- 防止 qt 动态库
└── sbin                ---- 启动相关目录
    └── hello-qt        ---- 启动脚本
```

将部署目录打包即可, 打包前后的大小对比
> 压缩命令: `tar -I 'xz -9' -cf hello-qt.tar.xz hello-qt`
> 解压命令: `tar -xJf hello.xz`
```shell
laolang@laolang-pc:t$ du hello-qt -h
4.0K	hello-qt/log
40K	hello-qt/bin
64M	hello-qt/qt_lib/lib
1016K	hello-qt/qt_lib/plugins/platforms
1020K	hello-qt/qt_lib/plugins
135M	hello-qt/qt_lib
20K	hello-qt/lib
8.0K	hello-qt/sbin
135M	hello-qt
laolang@laolang-pc:t$ l
总计 20M
drwxrwxr-x 7 laolang laolang 4.0K 2024-01-11 03:03:23 hello-qt/
-rw-rw-r-- 1 laolang laolang  20M 2024-01-11 03:13:30 hello-qt.xz
laolang@laolang-pc:t$
```

## step 09 使用 python 脚本自动化打包

### commit id
[https://gitcode.com/m0_53402432/qt-guide/commits/detail/893ce77c8a8350365f7903c29e6cc9becdc428dd?ref=main](https://gitcode.com/m0_53402432/qt-guide/commits/detail/893ce77c8a8350365f7903c29e6cc9becdc428dd?ref=main)
