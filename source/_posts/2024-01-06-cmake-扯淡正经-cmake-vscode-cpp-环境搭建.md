---
title: cmake 扯淡正经 - cmake + vscode cpp 环境搭建
date: 2024-01-06 20:23:53

tags:
- C/C++
- CMake
- Ubuntu
- vscode

categories:
- 'cmake 扯淡正经'
---

cmake 扯淡正经 - cmake + vscode c++ 环境搭建
<!--more-->

# 说明
只考虑 `Linux` 环境, 准确的说, 是 `Ubuntu`

# 代码地址
[https://gitcode.com/m0_53402432/cmake-guide/tree/main/cpp-hello](https://gitcode.com/m0_53402432/cmake-guide/tree/main/cpp-hello)
# 一个最简单的 cmake 项目
## 目录结构
```shell
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ tree
.
├── CMakeLists.txt
└── main.cpp

0 directories, 2 files
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ 
```

## 代码
**CMakeLists.txt**
```
# 该项目所需 cmake 的最小版本, 如果 cmake 版本小于设置的版本,  cmake 将停止处理并报错
cmake_minimum_required(VERSION 3.26)

# 指定 c++ 版本
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 设置项目名称和语言
project(cpp-hello CXX)

# 使用指定的源文件向项目添加可执行文件
add_executable(${PROJECT_NAME} main.cpp)
```

**main.cpp**
```c++
#include <iostream>
int main(){
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```

运行效果如下
```shell
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ cmake -S . -B build && cmake --build build
-- The CXX compiler identification is GNU 11.4.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done (0.1s)
-- Generating done (0.0s)
-- Build files have been written to: /home/laolang/csdn/gitcode/cmake-guide/cpp-hello/build
[ 50%] Building CXX object CMakeFiles/cpp-hello.dir/main.cpp.o
[100%] Linking CXX executable cpp-hello
[100%] Built target cpp-hello
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ cd build/
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello/build$ l
总计 52K
-rw-rw-r-- 1 laolang laolang  13K 2024-01-06 04:45:45 CMakeCache.txt
drwxrwxr-x 6 laolang laolang 4.0K 2024-01-06 04:45:45 CMakeFiles/
-rw-rw-r-- 1 laolang laolang 1.7K 2024-01-06 04:45:45 cmake_install.cmake
-rwxrwxr-x 1 laolang laolang  17K 2024-01-06 04:45:45 cpp-hello*
-rw-rw-r-- 1 laolang laolang 5.3K 2024-01-06 04:45:45 Makefile
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello/build$ ./cpp-hello 
Hello World!
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello/build$ 
```

# vscode 配置开发环境
## 改进项目的运行方式
### CMakeLists.tx
添加如下内容
> tasks.json 中根据 `CMAKE_BUILD_TYPE` 在不同的目录构建
> 亦可自行修改, **注意:要同时修改 CMakeLists.txt 和 tasks.json , 不然执行任务时找不到可执行程序**
```
# 可执行程序生成目录
set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/dist/bin)
```
### 插件
安装如下插件
- task buttons : [https://marketplace.visualstudio.com/items?itemName=spencerwmiles.vscode-task-buttons](https://marketplace.visualstudio.com/items?itemName=spencerwmiles.vscode-task-buttons)
- task explorer : [https://marketplace.visualstudio.com/items?itemName=spmeesseman.vscode-taskexplorer](https://marketplace.visualstudio.com/items?itemName=spmeesseman.vscode-taskexplorer)
### vscode 配置
tasks.json 配置如下
```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        // debug 构建
        {
            "label": "build-debug",
            "type": "shell",
            "command": "cmake -S . -B cmake-build-debug -DCMAKE_BUILD_TYPE=Debug && cmake --build cmake-build-debug"
        },
        // release 构建
        {
            "label": "build-release",
            "type": "shell",
            "command": "cmake -S . -B cmake-build-release -DCMAKE_BUILD_TYPE=Release && cmake --build cmake-build-release"
        },
        // 清理 debug
        {
            "label": "clean-debug",
            "type": "shell",
            "command": "rm -rf cmake-build-debug"
        },
        // 清理 release
        {
            "label": "clean-release",
            "type": "shell",
            "command": "rm -rf cmake-build-release"
        },
        // 清理 所有
        {
            "label": "clean-all",
            "type": "shell",
            "dependsOn": [
                "clean-debug",
                "clean-release"
            ]
        },
        // 重新 debug 构建
        {
            "label": "rebuild-debug",
            "type": "shell",
            "dependsOn": [
                "clean-debug",
                "build-debug"
            ]
        },
        // 重新 release 构建
        {
            "label": "rebuild-release",
            "type": "shell",
            "dependsOn": [
                "clean-release",
                "build-release"
            ]
        },
        // 运行 debug
        {
            "label": "run-debug",
            "type": "shell",
            "command": "cd cmake-build-debug/dist/bin && ./cpp-hello",
            "dependsOn": [
                "build-debug"
            ]
        },
        // 运行 release
        {
            "label": "run-release",
            "type": "shell",
            "command": "cd cmake-build-release/dist/bin && ./cpp-hello",
            "dependsOn": [
                "build-release"
            ]
        }
    ]
}
```

settings.json 配置如下
```json
{
    // 任务栏 task 快捷按钮
    "VsCodeTaskButtons.showCounter": true,
    "VsCodeTaskButtons.tasks": [
        {
            "label": "$(notebook-delete-cell) clean-all",
            "task": "clean-all"
        },
        {
            "label": "$(notebook-delete-cell) clean",
            "task": "clean-release"
        },
        {
            "label": "$(debug-configure) rebuild",
            "task": "rebuild-release"
        },
        {
            "label": "$(notebook-execute) run",
            "task": "run-release"
        }
    ]
}
```

此时可以在 `vscode` 状态栏看到定义的任务快捷按钮
![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/001.png)
点击相应的按钮即可执行对应的任务
亦可使用 `task explorer` 对任务进行管理. 
> `Ctrl+Ship+P` 搜索 `Task Explorer` 即可打开此面板
> 或者 `查看` -> `打开视图 ` 搜索亦可

![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/002.png)
### 实际效果展示
![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/003.gif)
## C/C++ 环境配置
上一步仅仅实现了一键运行, 并没有实质上支持 C/C++ 编程, 这一步完成 C/C++ 开发所有需要的工作

### 安装插件

- clang-format : [https://marketplace.visualstudio.com/items?itemName=xaver.clang-format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)
- cmake-language-support : [https://marketplace.visualstudio.com/items?itemName=josetr.cmake-language-support-vscode](https://marketplace.visualstudio.com/items?itemName=josetr.cmake-language-support-vscode)
- clangd : [https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd)
- lldb : [https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)

### ubuntu 系统安装软件
```
sudo apt install cland clang-format llvm
```

### vscode 配置
settings.json 内容如下
```json
{
    // 隐藏某些文件
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/Thumbs.db": true,
        // "**/build": true,
        // "**/cmake-build-debug": true,
        // "**/cmake-build-release": true
    },
    // 保存时自动格式化
    "editor.formatOnSave": true,
    "[cmake]": {
        "editor.defaultFormatter": "josetr.cmake-language-support-vscode"
    },
    "[c]": {
        "editor.defaultFormatter": "xaver.clang-format"
    },
    "[h]": {
        "editor.defaultFormatter": "xaver.clang-format"
    },
    "[cpp]": {
        "editor.defaultFormatter": "xaver.clang-format"
    },
    // 修改了注释的颜色
    "editor.tokenColorCustomizations": {
        "comments": {
            "foreground": "#4a524e",
            "fontStyle": ""
        }
    },
    // 右侧标尺
    "editor.rulers": [
        120
    ],
    // clangd 配置
    // clangd
    "clangd.arguments": [
        //后台分析并保存索引文件
        "--background-index",
        //compile_commands.json目录位置
        "--compile-commands-dir=cmake-build-release",
        //同时开启的任务数
        "-j=12",
        "--folding-ranges",
        //"--query-driver=/usr/bin/clang++", //mac上需要配置
        //启用clang-tidy以提供静态检查
        "--clang-tidy",
        //当 clangd 准备就绪时，用它来分析建议
        "--completion-parse=auto",
        //建议风格
        "--completion-style=detailed",
        //补全函数时，给参数提供占位符，可以使用 Tab 切换下一个占位符，知道函数末尾
        "--function-arg-placeholders",
        //默认格式化风格: 可用的有 LLVM, Google, Chromium, Mozilla, Webkit, Microsoft, GNU
        //也可以编写 .clang-format 自定义风格
        "--fallback-style=Webkit",
        //pch 优化的位置(Memory 或 Disk,前者会增加内存开销，但会提升性能)
        "--pch-storage=disk",
        //让clangd生成更详细的日志
        "--log=verbose",
        // 输出的 JSON 文件更加美观
        "--pretty",
        //建议中，已包含头文件的项与还未包含头文件的项会以圆点加以区分
        "--header-insertion-decorators",
        //插入建议时自动引入头文件
        "--header-insertion=iwyu",
        //全局补全，例如没有#include <iostream>时，也会给出std::cout建议
        //建议配合"--header-insertion=iwyu"使用
        "--all-scopes-completion",
        // 建议的排序方案：hueristics (启发式), decision_forest (决策树)
        "--ranking-model=decision_forest",
    ],
    //借助网上的信息排序建议
    "clangd.serverCompletionRanking": true,
    //当其它扩展与 clangd 冲突时警告并建议禁用
    "clangd.detectExtensionConflicts": true,
    // 任务栏 task 快捷按钮
    "VsCodeTaskButtons.showCounter": true,
    "VsCodeTaskButtons.tasks": [
        {
            "label": "format",
            "task": "format"
        },
        {
            "label": "$(notebook-delete-cell) clean-all",
            "task": "clean-all"
        },
        {
            "label": "$(notebook-delete-cell) clean",
            "task": "clean-release"
        },
        {
            "label": "$(debug-configure) rebuild",
            "task": "rebuild-release"
        },
        {
            "label": "$(notebook-execute) run",
            "task": "run-release"
        }
    ]
}
```
### cmake 脚本
添加如下内容
```
# 生成 compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
```

### 效果
![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/004.png)
### 注意

> **如果 `clangd` 插件频繁崩溃, 可以适当降低版本**
> **要使 `clangd` 生效,打开目录之前最好先编译一下**


# 多目录构建与生成并使用动态库
> 关于 cmake 动态库的生成和使用不再赘述, 此处仅对一些要点做一点解释
> 详细配置可查看仓库: [https://gitcode.com/m0_53402432/cmake-guide/tree/main/cpp-hello](https://gitcode.com/m0_53402432/cmake-guide/tree/main/cpp-hello)
> 具体的 commit id 为 : 
> [https://gitcode.com/m0_53402432/cmake-guide/commits/detail/461fa532a1137b11a8c0e0f69bef3caacbb2fb6c?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/461fa532a1137b11a8c0e0f69bef3caacbb2fb6c?ref=main)
> [https://gitcode.com/m0_53402432/cmake-guide/commits/detail/68b44821c777e0f98d6499dfb8120f944c45bb8e?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/68b44821c777e0f98d6499dfb8120f944c45bb8e?ref=main)
> 可以从第二个 commit id 开一个新的分支, 看看内容

## 目录结构
```shell
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ tree
.
├── CMakeLists.txt
├── format.sh
├── include
│   └── cpp-hello
│       ├── person
│       │   └── person.h
│       └── util
│           ├── common_util.h
│           └── log_util.h
├── resources
│   └── cpp-hello
├── run.sh
├── src
│   ├── CMakeLists.txt
│   ├── main
│   │   ├── CMakeLists.txt
│   │   └── main.cpp
│   ├── person
│   │   ├── CMakeLists.txt
│   │   └── person.cpp
│   └── util
│       ├── CMakeLists.txt
│       ├── common_util.cpp
│       └── log_util.cpp
├── third
│   └── fmt
│       ├── args.h
│       ├── chrono.h
│       ├── color.h
│       ├── compile.h
│       ├── core.h
│       ├── format.h
│       ├── format-inl.h
│       ├── os.h
│       ├── ostream.h
│       ├── printf.h
│       ├── ranges.h
│       ├── std.h
│       └── xchar.h
└── zlog.conf

11 directories, 29 files
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ 
```

## 关键文件解释

### CMakeLists.txt
#### 顶层 CMakeLists.txt
主要做了下面这几件事
**1. 配置了编译器选项**
例如语言版本, 是否启用特定的编译器扩展等. 重点是 `rpath`, 此配置作用有二, 其一是防止开发期间找不到动态库, 其二是为了方便制作绿色软件包

**2. 配置了几个重要目录**
release 构建后, `cmake-build/release/dist` 目录结构如下, 勉强算是一个标准的软件目录. 开发完毕后, 将此目录直接打包即可, 复制到目标机器上, 把 `sbin` 目录加入到 `path` 即可
```shell
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ tree cmake-build-release/dist/
cmake-build-release/dist/
├── bin
│   └── cpp-hello
├── conf
│   └── zlog.conf
├── lib
│   ├── libperson.so -> libperson.so.1
│   ├── libperson.so.1 -> libperson.so.1.0
│   ├── libperson.so.1.0
│   ├── libutil.so -> libutil.so.1
│   ├── libutil.so.1 -> libutil.so.1.0
│   └── libutil.so.1.0
├── logs
│   └── app.log
└── sbin
    └── cpp-hello

5 directories, 10 files
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ 
```
**3. 添加编译选项和复制配置文件**
例如生成 `compile_commands.json` 文件, 设置 `fmt` 编译选项等. 重点是复制 `zlog` 配置文件, `zlog` 配置文件一定要和程序中的初始化对应

**4. 添加一个可以直接运行程序的伪目标**
这个配置没多大用, 就是写一个自定义伪目标的例子

`CMakeLists.txt` 内容如下
```
# 指定 cmake 最小版本, 意指 cmake 版本小于指定版本则构建过程终止
cmake_minimum_required(VERSION 3.26)

# 语言环境配置 ###########################################################################################################

# 语言版本
set(CMAKE_CXX_STANDARD 14)

# 如果指定的语言版本不受支持, 则构建过程终止
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 只弃用 ISO C++ 标准的编译器标志, 而不使用特定编译器的扩展
set(CMAKE_CXX_EXTENSIONS OFF)

# 将 install_rpath 的设置应用在 build_rpath 上
# 避免在开发期间出现动态库找不到的问题
set(CMAKE_BUILD_WITH_INSTALL_RPATH True)

# 项目配置 ##############################################################################################################

# 项目名称和语言
project(cpp-hello CXX)

# 发布目录
set(dist_dir ${CMAKE_BINARY_DIR}/dist)

# 二进制文件目录
set(bin_dir ${dist_dir}/bin)

# 启动文件目录
set(sbin_dir ${dist_dir}/sbin)

# 库文件目录
set(lib_dir ${dist_dir}/lib)

# 日志目录
set(log_dir ${dist_dir}/logs)

# 配置文件目录
set(conf_dir ${dist_dir}/conf)

# 内部库
# person 库
set(lib_person_name person)

# 工具类库
set(lib_util_name util)

# 编译相关配置 ###########################################################################################################

# 生成 compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# fmt 标志
add_compile_definitions(FMT_HEADER_ONLY)

# 包含全局头文件
include_directories(${PROJECT_SOURCE_DIR}/include ${PROJECT_SOURCE_DIR}/third)

# 复制 zlog 配置文件
configure_file(${PROJECT_SOURCE_DIR}/zlog.conf ${conf_dir}/zlog.conf COPYONLY)

# 添加子目录
add_subdirectory(src)

# 伪目标配置 ############################################################################################################

# 运行程序的伪目标
# cmake -S . -B build && cmake --build build && cmake --build build --target run
add_custom_target(run
    COMMAND ${bin_dir}/${PROJECT_NAME} # 执行的命令
    WORKING_DIRECTORY ${bin_dir} # 命令的工作目录
    COMMENT "run application" # 描述
    VERBATIM # 执行命令时不会对其进行任何转义或处理，而是直接按照命令中的内容执行
)
```

#### src/main/CMakeLists.txt
1. 设置 rpath
2. 构建后动作, 包括复制 `shell` 脚本到 `sbin` 目录, 以及创建日志目录, `zlog` 要求日志目录必须存在

```
aux_source_directory(. SRCS_MAIN)
add_executable(${PROJECT_NAME} ${SRCS_MAIN})

# 链接动态库
target_link_libraries(${PROJECT_NAME} zlog ${lib_person_name} ${lib_util_name})

# 可执行程序生成目录
set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${bin_dir})

# 设置 rpath
set_target_properties(${PROJECT_NAME} PROPERTIES INSTALL_RPATH "\${ORIGIN}/../lib")

# 构建后复制运行脚本
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy ${PROJECT_SOURCE_DIR}/resources/${PROJECT_NAME} ${sbin_dir}/${PROJECT_NAME}

    # 创建日志目录
    COMMAND ${CMAKE_COMMAND} -E make_directory ${log_dir}
)
```

### shell 脚本
#### format.sh
此脚本可以一键格式化代码

#### run.sh
此脚本主要是避免繁琐的命令输入, 直接一键运行

## 使用到的第三方库
### zlog
> 可自行替换为 spdlog

github: [https://github.com/HardySimpson/zlog](https://github.com/HardySimpson/zlog)

中文文档: [http://hardysimpson.github.io/zlog/UsersGuide-CN.html](http://hardysimpson.github.io/zlog/UsersGuide-CN.html)

注意:

1. 安装 `zlog` 后, 需要执行 `sudo ldconfig` , [参考手册 3.1 编译和安装 zlog](http://hardysimpson.github.io/zlog/UsersGuide-CN.html#htoc6)
2. `zlog` 要求日志目录提前存在, 所以如果 `zlog` 一直初始化失败, 先检查一下日志目录是否存在

### fmt
github: [https://github.com/fmtlib/fmt](https://github.com/fmtlib/fmt)

## 如何运行
1. vscode 状态栏的 run 按钮
2. ./run.sh 脚本
3. cmake -S . -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build && cmake --build build --target run
4. cmake -S . -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build && cd build/dist/sbin && ./cpp-hello

# 关于测试

## commit id

[https://gitcode.com/m0_53402432/cmake-guide/commits/detail/0286908e48cbf5fcfb2e505dc08fd9ab2e7ccd58?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/0286908e48cbf5fcfb2e505dc08fd9ab2e7ccd58?ref=main)
## doctest 参考

github: [https://github.com/onqtam/doctest](https://github.com/onqtam/doctest)

一个吊炸天的教程: [C++单元测试工具——doctest](https://blog.csdn.net/liao20081228/article/details/76984975)

## 目录结构
```shell
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ tree
.
├── CMakeLists.txt
├── coverage.sh
├── format.sh
├── include
│   └── cpp-hello
│       ├── person
│       │   └── person.h
│       └── util
│           ├── common_util.h
│           └── log_util.h
├── resources
│   └── cpp-hello
├── run.sh
├── src
│   ├── CMakeLists.txt
│   ├── main
│   │   ├── CMakeLists.txt
│   │   └── main.cpp
│   ├── person
│   │   ├── CMakeLists.txt
│   │   └── person.cpp
│   └── util
│       ├── CMakeLists.txt
│       ├── common_util.cpp
│       └── log_util.cpp
├── test
│   ├── CMakeLists.txt
│   ├── test_common.cpp
│   ├── testmain.cpp
│   ├── test_person.cpp
│   └── zlog.conf
├── third
│   ├── doctest
│   │   └── doctest.h
│   └── fmt
│       ├── args.h
│       ├── chrono.h
│       ├── color.h
│       ├── compile.h
│       ├── core.h
│       ├── format.h
│       ├── format-inl.h
│       ├── os.h
│       ├── ostream.h
│       ├── printf.h
│       ├── ranges.h
│       ├── std.h
│       └── xchar.h
└── zlog.conf

13 directories, 36 files
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ 
```

## 执行测试
点击 vscode 状态栏 run-test-common 即可, 具体内容可参考仓库代码

## 另一种运行测试的方法
```shell
# 执行所有测试
ctest --test-dir build
# 执行命名的测试
ctest --test-dir build -R test_common
```

## 关于 gcc 测试覆盖率
[GCOV+LCOV 代码调试和覆盖率统计工具](https://blog.csdn.net/gatieme/article/details/78368667)
## 关键文件解释
### CMakeLists.txt
添加如下内容, 主要是添加一个选项, 用于指定是否开生成启测试覆盖率. **注意: 顶层 CMakeLists.txt 和 test/CMakeLists.txt 都需要添加**
```
option(ENABLE_COVERAGE "gen coverage" OFF)

if(ENABLE_COVERAGE)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fprofile-arcs -ftest-coverage")
    SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -fprofile-arcs -ftest-coverage")
endif()
```

### coverage.sh
> 就是一个简单脚本
```shell
#!/bin/bash
rm -rf cmake-build-release
cmake -S . -B cmake-build-release -DENABLE_COVERAGE=ON -DCMAKE_BUILD_TYPE=Release 
cmake --build cmake-build-release
cd cmake-build-release/dist/test && ./cpp-hello_test
cd ../../../
lcov -d . -o cmake-build-release/app.info -b . -c --exclude '*/test/*' --exclude '*/src/main/*' --exclude '*/third/*' --exclude '/usr/include/*'
genhtml cmake-build-release/app.info -o cmake-build-release/lcov -t 'cpp-hello 测试覆盖率报告'
```

### 其他
参考: [https://gitcode.com/m0_53402432/cmake-guide/commits/detail/0286908e48cbf5fcfb2e505dc08fd9ab2e7ccd58?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/0286908e48cbf5fcfb2e505dc08fd9ab2e7ccd58?ref=main)

### 效果
点击任务栏的 coverage 按钮或者命令行执行 `./coverage.sh` , 打开 `cmake-build-release/lcov/index.html` 即可看到测试覆盖率报告
![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/005.png)
![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/006.png)
# 关于 doxygen 文档生成

## commit id
[https://gitcode.com/m0_53402432/cmake-guide/commits/detail/c5de6ed8ba9693a515b26aa9a00e64e43174362f?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/c5de6ed8ba9693a515b26aa9a00e64e43174362f?ref=main)
## 参考资料
一个 `doxygen` 入门教程 : [doxygen 教程](https://blog.csdn.net/qq_28867779/category_11409535.html)

使用 `doxygen` 需要安装 `doxygen` 与 `graphviz`, 可自行根据操作系统安装

关于 `doxygen` 的样式可参考: [doxygen-awesome-css](https://jothepro.github.io/doxygen-awesome-css/index.html)

wxWidgets: [https://wxwidgets.org/](https://wxwidgets.org/)

## 效果
点击 vscode 状态栏的 doc 按钮或者直接命令行执行 `./doc.sh` 即可

![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/007.png)
## 注意
1. 需要安装 npm serve, 亦可将 `doc.sh` 中启动 npm serve 的代码去除, 自行部署到 nginx
2. 必须部署到服务器 npm serve 或者 nginx 均可
3. 仓库中代码有主页示例, 相关页面示例, 文件链接示例, markdown 文件示例, 插入图片示例, 基本上比较完整了
4. 有什么其他功能想要的, 可以直接参考 wxWidgets 的在线文档, 把源码下载下来, 仔细查看`docs/doxygen` 目录中的文件即可



