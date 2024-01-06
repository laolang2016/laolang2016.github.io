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

# 总览
## 说明
只考虑 `Linux` 环境, 准确的说, 是 `Ubuntu`

## 代码地址
[https://gitcode.com/m0_53402432/cmake-guide/tree/cpp-hello-v1.0](https://gitcode.com/m0_53402432/cmake-guide/tree/cpp-hello-v1.0)

## v1.0 实现功能
1. vscode 状态栏一键运行、重新构建、格式化、生成`doxygen`文档、运行测试
2. 上述功能均有脚本支持
3. 使用 `vcpkg` 管理依赖
4. 使用 `ninja` + `clang++` 编译

## vscode 插件列表
> 在 `.vscode/extensions.json` 中添加如下内容
```json
{
    "recommendations": [
        "xaver.clang-format",
        "josetr.cmake-language-support-vscode",
        "spencerwmiles.vscode-task-buttons",
        "spmeesseman.vscode-taskexplorer",
        "llvm-vs-code-extensions.vscode-clangd",
        "vadimcn.vscode-lldb",
        "cschlosser.doxdocgen"
    ]
}
```

打开扩展市场,筛选推荐即可看到所有需要的插件列表

![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/008.png)

## 目录结构说明
```shell
├── build |-> 构建目录
│   ├── gnu-debug |->  gnu make + gnu g++ debug 构建
│   ├── gnu-release |->gnu make + gnu g++ release 构建
│   ├── ninja-debug |-> ninja + clang++ debug 构建
│   └── ninja-release |-> ninja + clang++ release 构建
├── CMakeLists.txt |-> cmake 脚本
├── CMakePresets.json |-> cmake presets 配置文件
├── coverage.sh |-> 一键执行清理、编译、运行所有测试、生成测试覆盖率报告
├── cpp_hello_configuration.h.in |-> 项目配置文件,此处主要用来生成版本号
├── doc |-> doxygen 配置目录
│   ├── delete_me.css |-> 暂未使用
│   ├── delete_me.html |-> 暂未使用
│   ├── Doxyfile |-> doxygen 配置文件
│   ├── doxygen |-> doxygen 文档
│   │   ├── desc.md |-> doxygen markdown 使用示例
│   │   ├── env_ubuntu.md |-> 另一个doxygen markdown 使用示例
│   │   ├── env_window.h |-> doxygen 文档
│   │   └── mainpage.h |-> doxygen 首页
│   ├── doxygen-awesome-css |-> 一个 doxygen 主题
│   │   ├── doxygen-awesome.css |-> 主题样式
│   │   ├── doxygen-awesome-fragment-copy-button.js |-> 添加复制代码按钮功能
│   │   ├── doxygen-awesome-interactive-toc.js |-> 暂未使用
│   │   └── doxygen-awesome-sidebar-only.css |-> 暂未使用 
│   ├── header.html |-> 自定义 doxygen header, 主要用来添加 doxygen-awesome-css js 脚本
│   └── images |-> 存放 doxygen 文档中的图片
│       └── avatar.jpg |-> 一个示例图片
├── doc.sh |-> 一键生成 doxygen 文档
├── format.sh |-> 一键格式化代码
├── include |-> 头文件目录
│   └── cpp-hello
│       ├── configuration
│       │   ├── configuration.h
│       │   └── version.h
│       ├── person
│       │   └── person.h
│       └── util
│           ├── common_util.h
│           └── log_util.h
├── resources |-> 资源文件目录
│   └── cpp-hello |-> 一个 shell 脚本, 用来启动程序
├── run.sh |-> 一键清理、编译、运行程序
├── src |-> 源代码目录
│   ├── CMakeLists.txt |->  cmake 脚本
│   ├── configuration
│   │   ├── CMakeLists.txt |-> cmake 脚本
│   │   └── version.cpp
│   ├── main |-> 主程序所在目录
│   │   ├── CMakeLists.txt |->  cmake 脚本
│   │   └── main.cpp |-> 主程序
│   ├── person
│   │   ├── CMakeLists.txt |->  cmake 脚本
│   │   └── person.cpp
│   └── util
│       ├── CMakeLists.txt |->  cmake 脚本
│       ├── common_util.cpp
│       └── log_util.cpp
├── test |-> 测试目录
│   ├── CMakeLists.txt |->  cmake 脚本
│   ├── test_common.cpp
│   ├── testmain.cpp
│   └── test_person.cpp
└── third |-> 三方库目录
    └── doctest |-> doctest
        └── doctest.h
```

## 需要安装的软件
```shell
g++
make
pkg-config
vcpkg
cmake
clang
llvm
doxygen
graphviz
```

## 如何运行
在保证所有软件和 vscode 插件都已安装之后,直接命令行执行`./run.sh`脚本,或者 vscode 打开 cpp-hello 目录,点击状态栏的按钮验证相应的功能.

从到右依次是: 任务数量、格式化代码、清理所有、清理release、重新构建release、运行、运行测试(不是运行所有测试,我单独写了个测试，用来测试临时代码,可自行修改)、生成测试覆盖率报告、生产doxygen文档

![](/images/2024-01-06-cmake-扯淡正经-cmake-vscode-cpp-环境搭建/009.png)


---

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


# 添加版本号文件

## commit id

[https://gitcode.com/m0_53402432/cmake-guide/commits/detail/409e84ecbf6b91cf6f9054ec56c8b1db47f25d6d?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/409e84ecbf6b91cf6f9054ec56c8b1db47f25d6d?ref=main)

## 主要配置

### cmake

```
# 项目名称和语言
project(cpp-hello LANGUAGES CXX VERSION 0.0.1)

# 配置类库
set(lib_configuration_name configuration)

# 项目配置文件
configure_file(cpp_hello_configuration.h.in ${PROJECT_SOURCE_DIR}/include/cpp-hello/configuration/configuration.h)
```

### 添加版本号配置文件

> 根目录添加 `cpp_hello_configuration.h.in`
> cmake 会根据此文件自动生成对应的头文件

```
#ifndef _CPP_HELLO_CONFIGURATION_CONFIGURATION_H_
#define _CPP_HELLO_CONFIGURATION_CONFIGURATION_H_

#define CPP_HELLO_VERSION_MAJOR @cpp-hello_VERSION_MAJOR@
#define CPP_HELLO_VERSION_MINOR @cpp-hello_VERSION_MINOR@
#define CPP_HELLO_VERSION_PATCH @cpp-hello_VERSION_PATCH@

#endif
```

### 如何获取版本号

> 主要是将宏定义转为数字
> 参考: [将C语言宏定义转换成字符串！](https://blog.csdn.net/happen23/article/details/50602667)

**include/cpp-hello/configuration/version.h**
```c++
#ifndef _CPP_HELLO_CONFIGURATION_VERION_H_
#define _CPP_HELLO_CONFIGURATION_VERION_H_

#define __CPP_HELLO_VERSION_MAJOR_COPY (CPP_HELLO_VERSION_MAJOR)
#define __CPP_HELLO_VERSION_MINOR_COPY (CPP_HELLO_VERSION_MINOR)
#define __CPP_HELLO_VERSION_PATCH_COPY (CPP_HELLO_VERSION_PATCH)

#define __CPP_HELLO_VERSION_STR(R) #R
#define __CPP_HELLO_VERSION_STR2(R) __CPP_HELLO_VERSION_STR(R)

int get_cpp_hello_version_major();
int get_cpp_hello_version_minor();
int get_cpp_hello_version_patch();

#endif
```

**src/configuration/version.cpp**

```c++


#include "cpp-hello/configuration/version.h"

#include <stdlib.h>

#include "cpp-hello/configuration/configuration.h"

int get_cpp_hello_version_major() {
    return atoi(__CPP_HELLO_VERSION_STR2(CPP_HELLO_VERSION_MAJOR));
}
int get_cpp_hello_version_minor() {
    return atoi(__CPP_HELLO_VERSION_STR2(CPP_HELLO_VERSION_MINOR));
}
int get_cpp_hello_version_patch() {
    return atoi(__CPP_HELLO_VERSION_STR2(CPP_HELLO_VERSION_PATCH));
}
```

## 测试
```c++
#include <iostream>
#include <memory>

#include "cpp-hello/configuration/version.h"
#include "cpp-hello/person/person.h"
#include "cpp-hello/util/log_util.h"
#include "fmt/core.h"

int main() {
    LogUtil::init();
    std::unique_ptr<Person> person = std::make_unique<Person>(23, "laolang");
    dzlog_info("%s", fmt::format(person->sayHello()).c_str());
    dzlog_info("%s", fmt::format(person->name()).c_str());
    dzlog_info("cpp hello version major is : %d", get_cpp_hello_version_major());
    dzlog_info("cpp hello version minor is : %d", get_cpp_hello_version_minor());
    dzlog_info("cpp hello version patch is : %d", get_cpp_hello_version_patch());
    return 0;
}
```

```shell
2024-01-06 23:12:21.144 39562 INFO [person.cpp:14] - hello world
2024-01-06 23:12:21.144 39562 INFO [main.cpp:12] - Hello World
2024-01-06 23:12:21.144 39562 INFO [main.cpp:13] - laolang
2024-01-06 23:12:21.144 39562 INFO [main.cpp:14] - cpp hello version major is : 0
2024-01-06 23:12:21.144 39562 INFO [main.cpp:15] - cpp hello version minor is : 0
2024-01-06 23:12:21.144 39562 INFO [main.cpp:16] - cpp hello version patch is : 1
```

# presets 的使用

## commit id

[https://gitcode.com/m0_53402432/cmake-guide/commits/detail/1a740ca0a5b2fbc91b7b69e1215a23fac2acb7e1?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/1a740ca0a5b2fbc91b7b69e1215a23fac2acb7e1?ref=main)

## 关于 preset 的参考资料
[Cmake封神之作：cmake-presets](https://blog.csdn.net/hashkitty/article/details/124747421)

[https://runebook.dev/zh/docs/cmake/manual/cmake-presets.7](https://runebook.dev/zh/docs/cmake/manual/cmake-presets.7)

## 实际使用

在项目中添加 `CMakePresets.json` , 内容如下
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
      "name": "gnu-base",
      "displayName": "gnu base",
      "generator": "Unix Makefiles",
      "cacheVariables": {
        "CMAKE_CXX_COMPILER": "/usr/bin/g++"
      }
    },
    {
      "name": "gnu-release",
      "displayName": "gnu release",
      "description": "使用 gcc 与 make 构建 release 版本",
      "inherits": "gnu-base",
      "binaryDir": "${sourceDir}/build/gnu-release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release"
      }
    },
    {
      "name": "gnu-release-coverage",
      "displayName": "gnu release",
      "description": "使用 gcc 与 make 构建 release 版本",
      "inherits": "gnu-base",
      "binaryDir": "${sourceDir}/build/gnu-release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "ENABLE_COVERAGE": "ON"
      }
    },
    {
      "name": "gnu-debug",
      "displayName": "gnu debug",
      "description": "使用 gcc 与 make 构建 debug 版本",
      "inherits": "gnu-base",
      "binaryDir": "${sourceDir}/build/gnu-debug",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "gnu-release",
      "configurePreset": "gnu-release"
    },
    {
      "name": "gnu-release-coverage",
      "configurePreset": "gnu-release-coverage"
    },
    {
      "name": "gnu-debug",
      "configurePreset": "gnu-debug"
    }
  ],
  "testPresets": [
    {
      "name": "gnu-release",
      "configurePreset": "gnu-release",
      "output": { "outputOnFailure": true },
      "execution": { "noTestsAction": "error", "stopOnFailure": true }
    },
    {
      "name": "gnu-release-common",
      "configurePreset": "gnu-release",
      "output": { "outputOnFailure": true },
      "execution": { "noTestsAction": "error", "stopOnFailure": true },
      "filter": {
        "include": {
          "name": "test_common"
        }
      }
    },
    {
      "name": "gnu-release-coverage",
      "configurePreset": "gnu-release-coverage",
      "output": { "outputOnFailure": true },
      "execution": { "noTestsAction": "error", "stopOnFailure": true }
    }
  ]
}
```

此时编译与构建过程如下

```shell
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ cmake --preset=gnu-release
Preset CMake variables:

  CMAKE_BUILD_TYPE="Release"
  CMAKE_CXX_COMPILER="/usr/bin/g++"

-- The CXX compiler identification is GNU 11.4.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/g++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- ENABLE_COVERAGE:OFF
-- Configuring done (0.1s)
-- Generating done (0.0s)
-- Build files have been written to: /home/laolang/csdn/gitcode/cmake-guide/cpp-hello/build/gnu-release
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ cmake --build --preset=gnu-release
[  7%] Building CXX object src/configuration/CMakeFiles/configuration.dir/version.cpp.o
[ 15%] Linking CXX shared library ../../dist/lib/libconfiguration.so
[ 15%] Built target configuration
[ 23%] Building CXX object src/util/CMakeFiles/util.dir/common_util.cpp.o
[ 30%] Building CXX object src/util/CMakeFiles/util.dir/log_util.cpp.o
[ 38%] Linking CXX shared library ../../dist/lib/libutil.so
[ 38%] Built target util
[ 46%] Building CXX object src/person/CMakeFiles/person.dir/person.cpp.o
[ 53%] Linking CXX shared library ../../dist/lib/libperson.so
[ 53%] Built target person
[ 61%] Building CXX object src/main/CMakeFiles/cpp-hello.dir/main.cpp.o
[ 69%] Linking CXX executable ../../dist/bin/cpp-hello
[ 69%] Built target cpp-hello
[ 76%] Building CXX object test/CMakeFiles/cpp-hello_test.dir/test_common.cpp.o
[ 84%] Building CXX object test/CMakeFiles/cpp-hello_test.dir/test_person.cpp.o
[ 92%] Building CXX object test/CMakeFiles/cpp-hello_test.dir/testmain.cpp.o
[100%] Linking CXX executable ../dist/test/cpp-hello_test
[100%] Built target cpp-hello_test
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ 
```

## 修改 run.sh
```shell
#!/bin/bash

rm -rf build/gnu-release
cmake --preset=gnu-release
cmake --build --preset=gnu-release
cd build/gnu-release/dist/bin && ./cpp-hello
```

## 修改 coverage.sh
```shell
BUILD_DIR=build/gnu-release
rm -rf ${BUILD_DIR}
cmake --preset=gnu-release-coverage
cmake --build --preset=gnu-release-coverage
ctest --preset=gnu-release-coverage
lcov -d . -o ${BUILD_DIR}/app.info -b . -c --exclude '*/test/*' --exclude '*/src/main/*' --exclude '*/third/*' --exclude '/usr/include/*'
genhtml ${BUILD_DIR}/app.info -o ${BUILD_DIR}/lcov -t 'cpp-hello 测试覆盖率报告'
```

# 使用 ninja 与 clang++

## commid id

[https://gitcode.com/m0_53402432/cmake-guide/commits/detail/c60666db8e5f4206db0943a420e47b7a506c651d?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/c60666db8e5f4206db0943a420e47b7a506c651d?ref=main)

## ninja 与 clang 的安装

[ubuntu 安装ninja](https://blog.csdn.net/u013171226/article/details/120971325)

[Ubuntu 安装 Clang 编译器](https://blog.csdn.net/qq_18671415/article/details/101211003)

## 更新 CMakePresets.json
```json
{
  "version": 6,
  "cmakeMinimumRequired": {
    "major": 3,
    "minor": 26,
    "patch": 0
  },
  "configurePresets": [
    ...
    {
      "name": "ninja-base",
      "displayName": "ninja base",
      "generator": "Ninja",
      "cacheVariables": {
        "CMAKE_CXX_COMPILER": "/usr/bin/clang++"
      }
    },
    {
      "name": "ninja-release",
      "displayName": "ninja release",
      "description": "使用 ninja 与 clang++ 构建 release 版本",
      "inherits": "ninja-base",
      "binaryDir": "${sourceDir}/build/ninja-release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release"
      }
    },
    {
      "name": "ninja-rdebug",
      "displayName": "ninja debug",
      "description": "使用 ninja 与 clang++ 构建 debug 版本",
      "inherits": "ninja-base",
      "binaryDir": "${sourceDir}/build/ninja-debug",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    }
  ],
  "buildPresets": [
    ...
    {
      "name": "ninja-release",
      "configurePreset": "ninja-release"
    },
    {
      "name": "ninja-debug",
      "configurePreset": "ninja-debug"
    }
  ],
  "testPresets": [
    ...
    {
      "name": "ninja-release",
      "configurePreset": "ninja-release",
      "output": { "outputOnFailure": true },
      "execution": { "noTestsAction": "error", "stopOnFailure": true }
    },
    {
      "name": "ninja-release-common",
      "configurePreset": "ninja-release",
      "output": { "outputOnFailure": true },
      "execution": { "noTestsAction": "error", "stopOnFailure": true },
      "filter": {
        "include": {
          "name": "test_common"
        }
      }
    }
  ]
}
```

## 更新 run.sh

```shell
#!/bin/bash

rm -rf build/ninja-release
cmake --preset=ninja-release
cmake --build --preset=ninja-release
cd build/ninja-release/dist/bin && ./cpp-hello
```

## 效果
```shell
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ ./run.sh 
Preset CMake variables:

  CMAKE_BUILD_TYPE="Release"
  CMAKE_CXX_COMPILER="/usr/bin/clang++"

-- The CXX compiler identification is Clang 14.0.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/clang++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- ENABLE_COVERAGE:OFF
-- Configuring done (0.2s)
-- Generating done (0.0s)
-- Build files have been written to: /home/laolang/csdn/gitcode/cmake-guide/cpp-hello/build/ninja-release
[1/16] Building CXX object src/configuration/CMakeFiles/configuration.dir/version.cpp.o
[2/16] Linking CXX shared library dist/lib/libconfiguration.so.1.0
[3/16] Creating library symlink dist/lib/libconfiguration.so.1 dist/lib/libconfiguration.so
[4/16] Building CXX object src/util/CMakeFiles/util.dir/common_util.cpp.o
[5/16] Building CXX object src/util/CMakeFiles/util.dir/log_util.cpp.o
[6/16] Linking CXX shared library dist/lib/libutil.so.1.0
[7/16] Creating library symlink dist/lib/libutil.so.1 dist/lib/libutil.so
[8/16] Building CXX object test/CMakeFiles/cpp-hello_test.dir/test_person.cpp.o
[9/16] Building CXX object src/person/CMakeFiles/person.dir/person.cpp.o
[10/16] Building CXX object src/main/CMakeFiles/cpp-hello.dir/main.cpp.o
[11/16] Linking CXX shared library dist/lib/libperson.so.1.0
[12/16] Creating library symlink dist/lib/libperson.so.1 dist/lib/libperson.so
[13/16] Building CXX object test/CMakeFiles/cpp-hello_test.dir/test_common.cpp.o
[14/16] Linking CXX executable dist/bin/cpp-hello
[15/16] Building CXX object test/CMakeFiles/cpp-hello_test.dir/testmain.cpp.o
[16/16] Linking CXX executable dist/test/cpp-hello_test
2024-01-07 02:03:06.145 51683 INFO [person.cpp:14] - hello world
2024-01-07 02:03:06.145 51683 INFO [main.cpp:12] - Hello World
2024-01-07 02:03:06.145 51683 INFO [main.cpp:13] - laolang
2024-01-07 02:03:06.145 51683 INFO [main.cpp:14] - cpp hello version major is : 0
2024-01-07 02:03:06.145 51683 INFO [main.cpp:15] - cpp hello version minor is : 0
2024-01-07 02:03:06.145 51683 INFO [main.cpp:16] - cpp hello version patch is : 1
laolang@laolang-pc:~/csdn/gitcode/cmake-guide/cpp-hello$ 
```

## 更新 vscode 配置

### 说明

> **release 模式使用 `ninja` + `clang++`**
> **debug 模式使用 `gnu make` + `g++`, 主要原因是 debug 时侧边栏可以很方便的查看对象中的内容**
> 同时需要修改 `settings.json` 中 `compile_commands.json` 的位置, 否则 `vscode` 会一直报错

### tasks.json
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
            "command": "cmake --preset=gnu-debug && cmake --build --preset=gnu-debug"
        },
        // release 构建
        {
            "label": "build-release",
            "type": "shell",
            "command": "cmake --preset=ninja-release && cmake --build --preset=ninja-release"
        },
        // 清理 debug
        {
            "label": "clean-debug",
            "type": "shell",
            "command": "rm -rf build/gnu-debug"
        },
        // 清理 release
        {
            "label": "clean-release",
            "type": "shell",
            "command": "rm -rf build/ninja-release"
        },
        // 清理 所有
        {
            "label": "clean-all",
            "type": "shell",
            "command": "rm -rf build"
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
            "command": "cd build/gnu-debug/dist/bin && ./cpp-hello",
            "dependsOn": [
                "build-debug"
            ]
        },
        // 运行 release
        {
            "label": "run-release",
            "type": "shell",
            "command": "cd build/ninja-release/dist/bin && ./cpp-hello",
            "dependsOn": [
                "build-release"
            ]
        },
        // format
        {
            "label": "format",
            "type": "shell",
            "command": "./format.sh"
        },
        {
            "label": "coverage",
            "type": "shell",
            "command": "./coverage.sh",
        },
        // 运行 test common
        {
            "label": "run-test-common",
            "type": "shell",
            "command": "cd build/ninja-release/dist/test && ./cpp-hello_test",
            "dependsOn": [
                "build-release"
            ]
        },
        {
            "label": "doc",
            "type": "shell",
            "command": "./doc.sh",
        }
    ]
}
```

### launch.json
```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "app",
            "type": "lldb",
            "request": "launch",
            "program": "${workspaceRoot}/build/gnu-debug/dist/bin/cpp-hello",
            "args": [],
            "cwd": "${workspaceFolder}/build/gnu-debug/dist/bin",
            "preLaunchTask": "build-debug"
        },
        {
            "name": "test",
            "type": "lldb",
            "request": "launch",
            "program": "${workspaceRoot}/build/gnu-debug/dist/test/cpp-hello_test",
            "args": [],
            "cwd": "${workspaceFolder}/build/gnu-debug/dist/test",
            "preLaunchTask": "build-debug"
        }
    ]
}
```

### settings.json
> 主要修改了 `compile_commands.json` 的位置
```
//compile_commands.json目录位置
"--compile-commands-dir=build/ninja-release",
```

# 使用 vcpkg 管理依赖包

## commit id

[https://gitcode.com/m0_53402432/cmake-guide/commits/detail/d9413f8c5fcda9cb0d2f520a62da9313e575a42e?ref=main](https://gitcode.com/m0_53402432/cmake-guide/commits/detail/d9413f8c5fcda9cb0d2f520a62da9313e575a42e?ref=main)

## vcpkg 快速上手

### 安装

**参考:**

[在Ubuntu 22.04 LTS 上安装微软VCPKG库管理软件](https://blog.csdn.net/qq_46000760/article/details/125005001)
[bullet安装之——Ubuntu中安装vcpkg](https://blog.csdn.net/m0_43436602/article/details/104563093)

> **注意:是否全局安装根据自己的需要选择,本文没有全局安装**

安装命令

```shell
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
./bootstrap-vcpkg.sh
```

### cmake + vcpkg + fmt demo
**参考**

[vscode + cmake + vcpkg搭建c++开发环境](https://zhuanlan.zhihu.com/p/430835667)

**安装 fmt**

```shell
vcpkg install fmt
```

**关于使用方法**
比如安装的是`fmt`库,可以查看`vcpkg安装目录/packages/fmt_x64-linux/share/fmt/usage` 文件

```
laolang@laolang-pc:~/program/vcpkg/packages/fmt_x64-linux/share/fmt$ cat usage 
The package fmt provides CMake targets:

    find_package(fmt CONFIG REQUIRED)
    target_link_libraries(main PRIVATE fmt::fmt)

    # Or use the header-only version
    find_package(fmt CONFIG REQUIRED)
    target_link_libraries(main PRIVATE fmt::fmt-header-only)
laolang@laolang-pc:~/program/vcpkg/packages/fmt_x64-linux/share/fmt$ 
```

关于 cmake toolchain 参考:

[cmake 交叉编译配置设置 CMAKE_TOOLCHAIN_FILE：跨平台编译的秘密武器](https://zhuanlan.zhihu.com/p/661281743)

[https://runebook.dev/zh/docs/cmake/manual/cmake-toolchains.7](https://runebook.dev/zh/docs/cmake/manual/cmake-toolchains.7)

**main.cpp**

```c++
#include <iostream>
#include <fmt/core.h>
int main(){
    std::cout << fmt::format("hello world") << std::endl;
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```

**CMakeLists.txt**
```
# 该项目所需 cmake 的最小版本, 如果 cmake 版本小于设置的版本,  cmake 将停止处理并报错
cmake_minimum_required(VERSION 3.26)

# 指定 c++ 版本
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 设置 toolchain
set(VCPKG_ROOT "/home/laolang/program/vcpkg")
set(CMAKE_TOOLCHAIN_FILE "${VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")

# 设置项目名称和语言
project(cpp-hello CXX)

# 使用指定的源文件向项目添加可执行文件
add_executable(${PROJECT_NAME} main.cpp)

# 查找 fmt 库
find_package(fmt CONFIG REQUIRED)
# 链接 fmt 库
target_link_libraries(${PROJECT_NAME} PRIVATE fmt::fmt)
```

**一键运行**
> cmake -S . -B build && cmake --build build && ./build/cpp-hello
```shell
laolang@laolang-pc:~/tmp/cpp-hello$ cmake -S . -B build && cmake --build build && ./build/cpp-hello
-- Configuring done (0.0s)
-- Generating done (0.0s)
-- Build files have been written to: /home/laolang/tmp/cpp-hello/build
[100%] Built target cpp-hello
hello world
Hello World!
laolang@laolang-pc:~/tmp/cpp-hello$ 
```

## 更换日志库为 spdlog

关于 spdlog 的使用可参考

[c++日志库实战——spdlog，是不是感觉log4cxx有点笨重，不妨试一试spdlog](https://blog.csdn.net/xmcy001122/article/details/105864473)
[【C++】spdlog光速入门，C++logger最简单最快的库](https://www.cnblogs.com/jinyunshaobing/p/16797330.html)

### 头文件
```c++
#ifndef _GRAVER_UTIL_LOG_UTIL_H_
#define _GRAVER_UTIL_LOG_UTIL_H_

#include <stdlib.h>

#include <string>
#include <vector>

#include "spdlog/sinks/basic_file_sink.h"
#include "spdlog/sinks/daily_file_sink.h"
#include "spdlog/sinks/rotating_file_sink.h"
#include "spdlog/sinks/stdout_color_sinks.h"
#include "spdlog/sinks/stdout_sinks.h"
#include "spdlog/spdlog.h"

class LogUtil {
public:
    static void init(spdlog::level::level_enum level = spdlog::level::debug, std::string log_file = "app.log");
    static spdlog::level::level_enum     getGlobalLevel();
    static std::vector<spdlog::sink_ptr> createSinks(const std::string &log_file_name);
    static void createLogger(const std::string &logger_name, spdlog::level::level_enum level = spdlog::level::debug);
    static std::shared_ptr<spdlog::logger> getLogger(const std::string        &logger_name,
                                                     spdlog::level::level_enum level = spdlog::level::debug);

private:
    static spdlog::level::level_enum global_level;
    static std::string               log_file;
};

#endif

```

### 源文件
```c++
#include "cpp-hello/util/log_util.h"

spdlog::level::level_enum LogUtil::global_level = spdlog::level::info;
std::string               LogUtil::log_file     = "app.log";

spdlog::level::level_enum LogUtil::getGlobalLevel() {
    return global_level;
}

std::vector<spdlog::sink_ptr> LogUtil::createSinks(const std::string &log_file_name) {
    std::vector<spdlog::sink_ptr> sinks;

    auto sink1 = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
    sink1->set_level(LogUtil::getGlobalLevel());
    sinks.push_back(sink1);

    auto sink2 = std::make_shared<spdlog::sinks::rotating_file_sink_mt>(log_file_name, 1024 * 1024 * 10, 100, false);
    sink2->set_level(spdlog::level::debug);
    sinks.push_back(sink2);
    return sinks;
}

void LogUtil::createLogger(const std::string &logger_name, spdlog::level::level_enum level) {
    std::string log_file_name = LogUtil::log_file;
    auto        sinks         = LogUtil::createSinks(log_file_name);

    auto logger = std::make_shared<spdlog::logger>(logger_name, begin(sinks), end(sinks));
    logger->set_level(level);
#if 0  // 不带文件名与行号
    logger->set_pattern("%Y-%m-%d %H:%M:%S [%l] [thread %t] [%n] - %v");

    /* 使用方法
    LogUtil::init(spdlog::level::info, "../logs/app.log");
    std::shared_ptr<spdlog::logger> log = LogUtil::getLogger("app");
    log->info("cpp hello");
    */
#endif

#if 1  // 带文件名与行号
    // logger->set_pattern("%Y-%m-%d %H:%M:%S [%l] [thread %t] [%n] - %s:%# - %! - %v"); // 文件名
    logger->set_pattern("%Y-%m-%d %H:%M:%S [%l] [thread %t] [%n] - %g:%# - %! - %v");  // 文件全路径

    /* 使用示例
    LogUtil::init(spdlog::level::info, "../logs/app.log");
    std::shared_ptr<spdlog::logger> log = LogUtil::getLogger("app");
    SPDLOG_LOGGER_INFO(log, "cpp hello");
    */
#endif

    spdlog::register_logger(logger);
}

std::shared_ptr<spdlog::logger> LogUtil::getLogger(const std::string &logger_name, spdlog::level::level_enum level) {
    auto logger = spdlog::get(logger_name);
    if (!logger) {  // looger指向为空
        createLogger(logger_name, level);
        logger = spdlog::get(logger_name);
    }
    return logger;
}

void LogUtil::init(spdlog::level::level_enum level, std::string log_file) {
    LogUtil::global_level = level;
    LogUtil::log_file     = log_file;

    spdlog::flush_every(std::chrono::seconds(1));
    spdlog::flush_on(spdlog::level::debug);
}
```






