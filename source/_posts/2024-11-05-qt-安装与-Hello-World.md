---
title: qt 安装与 Hello World
date: 2024-11-05 22:51:36
categories:
- 桌面端开发
- qt
tags:
- 桌面端开发
- qt
---


# 安装

# 卸载

# Hello World

使用 qt creator 新建一个 Hello World 项目

# 改造

## 改造说明

## windows 脱离 qt creator

### 准备工作
关闭所有文件和项目
删除 `CMakeLists.txt.user` 文件和构建目录
使用 `qt creator` 重新打开项目
点击 `Configure Project`

![](/images/2024-11-05-qt-安装与-Hello-World/001.png)

复制概要信息的内容

![](/images/2024-11-05-qt-安装与-Hello-World/002.png)

概要信息的内容稍微排版一下

```

[cmake] Running 
D:\program\cpp\cmake-3.30.1-windows-x86_64\bin\cmake.exe 
-S E:/code/qt/qt-hello 
-B E:/code/qt/qt-hello/build/Desktop_Qt_6_5_3_MinGW_64_bit-Debug 
"-DCMAKE_PROJECT_INCLUDE_BEFORE:FILEPATH=E:\code\qt\qt-hello\build\Desktop_Qt_6_5_3_MinGW_64_bit-Debug/.qtc/package-manager/auto-setup.cmake" 
"-DQT_QMAKE_EXECUTABLE:FILEPATH=D:/program/qt/6.5.3/mingw_64/bin/qmake.exe" 
"-DCMAKE_CXX_COMPILER:FILEPATH=D:/program/qt/Tools/mingw1120_64/bin/g++.exe" 
"-DCMAKE_CXX_FLAGS_INIT:STRING=-DQT_QML_DEBUG" 
"-DCMAKE_GENERATOR:STRING=MinGW Makefiles" 
"-DCMAKE_BUILD_TYPE:STRING=Debug" 
"-DCMAKE_C_COMPILER:FILEPATH=D:/program/qt/Tools/mingw1120_64/bin/gcc.exe" 
"-DCMAKE_PREFIX_PATH:PATH=D:/program/qt/6.5.3/mingw_64" in E:\code\qt\qt-hello\build\Desktop_Qt_6_5_3_MinGW_64_bit-Debug.
[cmake] -- The CXX compiler identification is GNU 11.2.0
[cmake] -- Detecting CXX compiler ABI info
[cmake] -- Detecting CXX compiler ABI info - done
[cmake] -- Check for working CXX compiler: D:/program/qt/Tools/mingw1120_64/bin/g++.exe - skipped
[cmake] -- Detecting CXX compile features
[cmake] -- Detecting CXX compile features - done
[cmake] -- Performing Test CMAKE_HAVE_LIBC_PTHREAD
[cmake] -- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Success
[cmake] -- Found Threads: TRUE
[cmake] -- Performing Test HAVE_STDATOMIC
[cmake] -- Performing Test HAVE_STDATOMIC - Success
[cmake] -- Found WrapAtomic: TRUE
[cmake] -- Could NOT find WrapVulkanHeaders (missing: Vulkan_INCLUDE_DIR) 
[cmake] -- Configuring done (2.0s)
[cmake] -- Generating done (0.2s)
[cmake] -- Build files have been written to: E:/code/qt/qt-hello/build/Desktop_Qt_6_5_3_MinGW_64_bit-Debug
[cmake] 
[cmake] Elapsed time: 00:02.
```

### 复制文件

将 `qt creator` 生成的项目源文件复制到一个新的目录

```
E:\code\qt\qt-one>dir
 驱动器 E 中的卷是 新加卷
 卷的序列号是 FA05-F6BD

 E:\code\qt\qt-one 的目录

2024/11/15  07:42    <DIR>          .
2024/11/15  07:42    <DIR>          ..
2024/11/15  07:01             2,151 CMakeLists.txt
2024/11/15  07:03               184 main.cpp
2024/11/15  07:01               131 mainwindow.cpp
2024/11/15  07:01               231 mainwindow.h
               4 个文件          2,697 字节
               2 个目录 276,218,142,720 可用字节

E:\code\qt\qt-one>
```

### 添加 CMakePresets.json

```json
{
    "version": 6,
    "cmakeMinimumRequired": {
        "major": 3,
        "minor": 26,
        "patch": 0
    },
    "configurePresets": [
        {
            "name": "windows-base",
            "displayName": "windows base",
            "description": "windows 通用设置",
            "generator": "MinGW Makefiles",
            "cacheVariables": {
                "CMAKE_PREFIX_PATH": "D:/program/qt/6.5.3/mingw_64",
                "CMAKE_CXX_COMPILER": "D:/program/qt/Tools/mingw1120_64/bin/g++.exe",
                "CMAKE_CXX_FLAGS": "-Wall -Wextra"
            }
        },
        {
            "name": "windows-release",
            "displayName": "windows release",
            "description": "windows 平台下使用 mingw 构建 release 版本",
            "inherits": "windows-base",
            "binaryDir": "${sourceDir}/build/windows-release",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        }
    ],
    "buildPresets": [
        {
            "name": "windows-release",
            "configurePreset": "windows-release"
        }
    ]
}
```

### 编译前准备

将 `qt` 目录下的 `Tools/mingw1120_64/bin` 加入环境变量, 且保证环境变量中只有一个 `g++` `make` 起作用

### 编译过程

```
cmake --preset=windows-release
cmake --build --preset=windows-release
```

```
E:\code\qt\qt-one>cmake --preset=windows-release
Preset CMake variables:

  CMAKE_BUILD_TYPE="Release"
  CMAKE_CXX_COMPILER="D:/program/qt/Tools/mingw1120_64/bin/g++.exe"
  CMAKE_CXX_FLAGS="-Wall -Wextra"
  CMAKE_PREFIX_PATH="D:/program/qt/6.5.3/mingw_64"

-- The CXX compiler identification is GNU 11.2.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: D:/program/qt/Tools/mingw1120_64/bin/g++.exe - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Performing Test CMAKE_HAVE_LIBC_PTHREAD
-- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Success
-- Found Threads: TRUE
-- Performing Test HAVE_STDATOMIC
-- Performing Test HAVE_STDATOMIC - Success
-- Found WrapAtomic: TRUE
-- Could NOT find WrapVulkanHeaders (missing: Vulkan_INCLUDE_DIR)
-- Configuring done (2.0s)
-- Generating done (0.2s)
-- Build files have been written to: E:/code/qt/qt-one/build/windows-release

E:\code\qt\qt-one>cmake --build --preset=windows-release
[  0%] Built target qt-hello_autogen_timestamp_deps
[ 16%] Automatic MOC and UIC for target qt-hello
[ 16%] Built target qt-hello_autogen
[ 33%] Building CXX object CMakeFiles/qt-hello.dir/qt-hello_autogen/mocs_compilation.cpp.obj
[ 50%] Building CXX object CMakeFiles/qt-hello.dir/main.cpp.obj
[ 66%] Building CXX object CMakeFiles/qt-hello.dir/mainwindow.cpp.obj
[ 83%] Linking CXX executable qt-hello.exe
[100%] Built target qt-hello

E:\code\qt\qt-one>
```

### 运行准备

此时还不能直接运行, 因为缺失了几个 dll 文件,复制过去就行, 复制了 dll 文件依然不能运行, 会报如下错误

![](/images/2024-11-05-qt-安装与-Hello-World/003.png)

原因: qt 在运行时,需要合适的平台插件来支持图形用户界面
解决办法: 在 `exe` 所在目录新建一个 `plugins` 目录, 并复制 `qt plugins` 目录下的 `platofoms` 目录到 `exe` 同级的 `plugins` 目录下

![](/images/2024-11-05-qt-安装与-Hello-World/004.png)

### 运行

![](/images/2024-11-05-qt-安装与-Hello-World/005.png)

此时将所有需要的文件复制到其他目录也是可以运行的

文件大小
![](/images/2024-11-05-qt-安装与-Hello-World/006.png)


## 修改目录结构



