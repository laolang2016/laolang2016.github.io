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


# 参考

[Qt6入门教程 2：Qt6下载与安装](https://blog.csdn.net/caoshangpa/article/details/135420524)
[Linux 系统（Ubuntu）下安装 Qt 环境](https://blog.csdn.net/YMGogre/article/details/130565726)


[Qt6入门教程 3：创建Hello World项目](https://blog.csdn.net/caoshangpa/article/details/135428677)

# 安装

linux 注意事项

```
sudo apt-get install build-essential libgl1-mesa-dev
sudo apt installibxcb-cursoro libxcb-cursor-dev
```

# 卸载

# 代码地址

[https://github.com/ghost-hello-project/qt-study/tree/main/qt-hello](https://github.com/ghost-hello-project/qt-study/tree/main/qt-hello)

# Hello World

使用 qt creator 新建一个 Hello World 项目

# 改造

## 改造说明

1. 能够命令行编译
2. vscode 编写、调试


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


## linux 脱离 qt creator

linux 版本只需要修改 `CMakePresets.json` 即可, 不需要其他特殊配置

### CMakePresets.json


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
        },
        {
            "name": "linux-base",
            "displayName": "linux base",
            "description": "linux 通用设置",
            "generator": "Unix Makefiles",
            "cacheVariables": {
                "CMAKE_PREFIX_PATH": "/home/laolang/Qt/6.7.2/gcc_64",
                "CMAKE_CXX_COMPILER": "/usr/bin/g++",
                "CMAKE_CXX_FLAGS": "-Wall -Wextra"
            }
        },
        {
            "name": "linux-release",
            "displayName": "linux release",
            "description": "linux 平台下使用 gcc 构建 release 版本",
            "inherits": "linux-base",
            "binaryDir": "${sourceDir}/build/linux-release",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        }
    ],
    "buildPresets": [
        {
            "name": "windows-release",
            "configurePreset": "windows-release"
        },
        {
            "name": "linux-release",
            "configurePreset": "linux-release"
        }
    ]
}
```

## 多目录构建

### 与 Hello World 相比修改了哪些内容

1. 添加了一个 `Makefile` 文件用于控制构架流程
2. 添加了 `windows` 与 `linux` 平台的 `debug` 配置
3. 添加了一些 `vscode` 的配置文件


### 目录结构

```
laolang@laolang-mint:qt-hello$ tree
.
├── CMakeLists.txt
├── CMakePresets.json
├── include
│   └── qt-hello
│       └── app
│           └── mainwindow.h
├── Makefile
└── src
    ├── app
    │   ├── CMakeLists.txt
    │   ├── main.cpp
    │   └── mainwindow.cpp
    └── CMakeLists.txt

6 directories, 8 files
laolang@laolang-mint:qt-hello$ 
```

### 总构建脚本 Makefile
```makefile

ifeq ($(shell uname -s), Linux)
	OS = Linux
	PRESET_DEBUG = linux-debug
	PRESET_RELEASE = linux-release
else
	OS = Windows
	PRESET_DEBUG = windows-debug
	PRESET_RELEASE = windows-release
endif

BUILD_DIR_DEBUG = build/$(PRESET_DEBUG)
BUILD_DIR_RELEASE = build/$(PRESET_RELEASE)


ALL: app

t:
	@echo $(PRESET_DEBUG)
	@echo $(PRESET_RELEASE)

app: print config_release build_release

config_debug:
	cmake --preset=$(PRESET_DEBUG)
build_debug:
	cmake --build --preset=$(PRESET_DEBUG)
config_release:
	cmake --preset=$(PRESET_RELEASE)
build_release:
	cmake --build --preset=$(PRESET_RELEASE)

print:
	@echo "OS:$(OS)"

clean_debug:
	-rm -rf $(BUILD_DIR_DEBUG)

clean_release:
	-rm -rf $(BUILD_DIR_RELEASE)

clean_all: clean_debug clean_release

.PHONY: app config_debug build_debug config_release build_release print clean_debug clean_release clean_all
```

### CMakePresets.json
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
        },
        {
            "name": "windows-debug",
            "displayName": "windows debug",
            "description": "windows 平台下使用 mingw 构建 debug 版本",
            "inherits": "windows-base",
            "binaryDir": "${sourceDir}/build/windows-debug",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        },
        {
            "name": "linux-base",
            "displayName": "linux base",
            "description": "linux 通用设置",
            "generator": "Unix Makefiles",
            "cacheVariables": {
                "CMAKE_PREFIX_PATH": "/home/laolang/Qt/6.7.2/gcc_64",
                "CMAKE_CXX_COMPILER": "/usr/bin/g++",
                "CMAKE_CXX_FLAGS": "-Wall -Wextra"
            }
        },
        {
            "name": "linux-release",
            "displayName": "linux release",
            "description": "linux 平台下使用 gcc 构建 release 版本",
            "inherits": "linux-base",
            "binaryDir": "${sourceDir}/build/linux-release",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        },
        {
            "name": "linux-debug",
            "displayName": "linux debug",
            "description": "linux 平台下使用 gcc 构建 debug 版本",
            "inherits": "linux-base",
            "binaryDir": "${sourceDir}/build/linux-debug",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        }
    ],
    "buildPresets": [
        {
            "name": "windows-release",
            "configurePreset": "windows-release"
        },
        {
            "name": "windows-debug",
            "configurePreset": "windows-debug"
        },
        {
            "name": "linux-release",
            "configurePreset": "linux-release"
        },
        {
            "name": "linux-debug",
            "configurePreset": "linux-debug"
        }
    ]
}
```

### CMakeLists.txt

#### 顶层 CMakeLists.txt
```cmake
cmake_minimum_required(VERSION 3.16)

# 语言环境配置 ###########################################################################################################
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 项目配置 ##############################################################################################################
project(qt-hello VERSION 0.1 LANGUAGES CXX)

# 构建目录
set(dist_dir ${CMAKE_BINARY_DIR}/dist)

# 二进制文件目录
set(bin_dir ${dist_dir}/bin)

find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets)

# 编译相关配置 ###########################################################################################################
# 生成 compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 包含全局头文件
include_directories(${PROJECT_SOURCE_DIR}/include ${RAPIDJSON_INCLUDE_DIRS})


# 添加子目录 #############################################################################################################
add_subdirectory(src)
```


#### src/app/CMakeLists.txt
```cmake
set(APP_SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/mainwindow.cpp
    ${PROJECT_SOURCE_DIR}/include/qt-hello/app/mainwindow.h
)

qt_add_executable(qt-hello
    MANUAL_FINALIZATION
    ${APP_SOURCES}
)

target_link_libraries(qt-hello PRIVATE Qt${QT_VERSION_MAJOR}::Widgets)

set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${bin_dir})

set_target_properties(qt-hello PROPERTIES
    ${BUNDLE_ID_OPTION}
    WIN32_EXECUTABLE TRUE
)

qt_finalize_executable(qt-hello)

if(WIN32)
    # 构建后动作
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD

        # 复制 qt 资源文件
        COMMAND ${CMAKE_COMMAND} -E copy ${PROJECT_SOURCE_DIR}/resources_build/win32/qt/Qt6Core.dll $<TARGET_FILE_DIR:${PROJECT_NAME}>/
        COMMAND ${CMAKE_COMMAND} -E copy ${PROJECT_SOURCE_DIR}/resources_build/win32/qt/Qt6Gui.dll $<TARGET_FILE_DIR:${PROJECT_NAME}>/
        COMMAND ${CMAKE_COMMAND} -E copy ${PROJECT_SOURCE_DIR}/resources_build/win32/qt/Qt6Widgets.dll $<TARGET_FILE_DIR:${PROJECT_NAME}>/
        COMMAND ${CMAKE_COMMAND} -E copy_directory ${PROJECT_SOURCE_DIR}/resources_build/win32/qt/plugins $<TARGET_FILE_DIR:${PROJECT_NAME}>/plugins
    )
endif()
```

## 添加一个自定义库

### 目录结构
```
laolang@laolang-mint:qt-hello$ tree
.
├── CMakeLists.txt
├── CMakePresets.json
├── include
│   └── qt-hello
│       ├── app
│       │   └── mainwindow.h
│       └── util
│           ├── app_config.h
│           ├── configuration.h
│           └── log_util.h
├── janna_configuration.h.in
├── Makefile
├── src
│   ├── app
│   │   ├── CMakeLists.txt
│   │   ├── main.cpp
│   │   └── mainwindow.cpp
│   ├── CMakeLists.txt
│   └── util
│       ├── app_config.cpp
│       ├── CMakeLists.txt
│       └── log_util.cpp
├── test
│   ├── CMakeLists.txt
│   ├── test_common.cpp
│   ├── test_common.h
│   └── testmain.cpp
└── third
    └── spdlog

16 directories, 123 files
laolang@laolang-mint:qt-hello$ 
```

# 打包

## 参考

[Linux下打包qt程序，可以发布到一台纯净的linux发行版系统上](https://blog.csdn.net/bjbz_cxy/article/details/115440768)

[Linux平台关于可执行程序的动态库加载路径(rpath)的查看与修改](https://blog.csdn.net/u013992330/article/details/115959142)










