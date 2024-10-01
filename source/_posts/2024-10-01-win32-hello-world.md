---
title: win32 hello world
date: 2024-10-01 19:41:37
categories:
- gui
- win32
tags:
- gui
- win32
---

# 最小化 win32 程序

## 代码

```c
#include <Windows.h>

/**
 * @brief win32 程序入口
 * 
 * @param hInstance 应用程序的当前实例的句柄
 * @param hPrevInstance 应用程序的上一个实例的句柄。 此参数始终 NULL
 * @param szCmdLine 应用程序的命令行，不包括程序名称
 * @param iCmdShow 控制窗口的显示方式
 */
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PSTR szCmdLine, int iCmdShow) {
    MessageBox(NULL, TEXT("第一个 win32 程序！"), TEXT("标题！"), 0);
    return 0;
}
```

## vs 

选择 Windows 桌面向导
![](/images/2024-10-01-win32-hello-world/001.png)

应用程序类型选择: 桌面应用程序(.exe)
选中空项目

![](/images/2024-10-01-win32-hello-world/002.png)

## vscode + cmake

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
            "hidden": true,
            "generator": "Ninja",
            "binaryDir": "${sourceDir}/build/${presetName}",
            "cacheVariables": {
                "CMAKE_C_COMPILER": "cl.exe",
                "CMAKE_MAKE_PROGRAM": "D:/PROGRAM/MICROSOFT/VS2022/COMMUNTITY/COMMON7/IDE/COMMONEXTENSIONS/MICROSOFT/CMAKE/Ninja/ninja.exe",
                "CMAKE_C_FLAGS": "/utf-8 -D_AFXDLL -D_UNICODE -DUNICODE"
            }
        },
        {
            "name": "win64-release",
            "displayName": "win 64 release",
            "inherits": "windows-base",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        },
        {
            "name": "win64-debug",
            "displayName": "win 64 debug",
            "inherits": "windows-base",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        }
    ],
    "buildPresets": [
        {
            "name": "win64-release",
            "configurePreset": "win64-release"
        },
        {
            "name": "win64-debug",
            "configurePreset": "win64-debug"
        }
    ]
}
```

### CMakeLists.txt
```cmake
# 指定 cmake 最小版本, 意指 cmake 版本小于指定版本则构建过程终止
cmake_minimum_required(VERSION 3.26)

# 语言环境配置 ###########################################################################################################

# 语言版本
set(CMAKE_C_STANDARD 17)

# 如果指定的语言版本不受支持, 则构建过程终止
set(CMAKE_C_STANDARD_REQUIRED True)

# 只启用 ISO C++ 标准的编译器标志, 而不使用特定编译器的扩展
# set(CMAKE_C_EXTENSIONS OFF)

# 项目配置 ##############################################################################################################

# 项目名称和语言
project(win32-mini LANGUAGES C VERSION 1.0.0)

# 编译相关配置 ###########################################################################################################

# 生成 compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

aux_source_directory(. SRCS_MAIN)
add_executable(${PROJECT_NAME} WIN32 ${SRCS_MAIN})
```

### 编译脚本
```bat
@echo off
call "D:\program\microsoft\vs2022\communtity\VC\Auxiliary\Build\vcvars64.bat"
if errorlevel 1 (
    echo Warning: Failed to set up the environment. Continuing...
)

if "%1" == "" (
    cmake --preset=win64-release 
    cmake --build --preset=win64-release    
) else if "%1" == "release" (
    cmake --preset=win64-release 
    cmake --build --preset=win64-release
) else if "%1" == "debug" (
    cmake --preset=win64-debug 
    cmake --build --preset=win64-debug
)
```

### vscode
#### tasks.json
```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        // debug 构建
        {
            "label": "build-debug",
            "type": "process",
            "command": "${workspaceRoot}/build.bat",
            "args": [
                "debug"
            ]
        },
        // release 构建
        {
            "label": "build-release",
            "type": "process",
            "command": "${workspaceRoot}/build.bat"
        },
        // 清理 debug
        {
            "label": "clean-debug",
            "type": "shell",
            "command": "rm -rf build/win64-debug"
        },
        // 清理 release
        {
            "label": "clean-release",
            "type": "shell",
            "command": "rm -rf build/win64-release"
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
            "command": "cd build/gnu-debug/dist/bin && ./c-hello",
            "dependsOn": [
                "build-debug"
            ]
        },
        // 运行 release
        {
            "label": "run-release",
            "type": "shell",
            "command": "cd build/win64-release && ./win32-mini",
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
            "label": "run-test",
            "type": "shell",
            "command": "cd build/ninja-release/dist/test && ./c-hello_test",
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

#### setting.json
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
    "editor.inlayHints.enabled": "off",
    // clangd 配置
    "clangd.fallbackFlags": [
        // 设置clangd代码检查的c++版本，目前默认是c++14
        "-std=c17",
        // 增加项目自身头文件依赖路劲，因为使用vs2019编译不会生成compile_command.json文件，项目自己的头文件就不会找到
        "-I${workspaceFolder}", // 项目根目录
    ],
    // clangd
    "clangd.arguments": [
        //后台分析并保存索引文件
        "--background-index",
        //compile_commands.json目录位置
        "--compile-commands-dir=build/win64-release",
        //同时开启的任务数
        "-j=12",
        // "--folding-ranges",
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
        "--ranking-model=decision_forest"
    ],
    //借助网上的信息排序建议
    "clangd.serverCompletionRanking": true,
    //当其它扩展与 clangd 冲突时警告并建议禁用
    "clangd.detectExtensionConflicts": true,
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

#### launch.json
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
            "program": "${workspaceRoot}/build/win64-debug/win32-mini.exe",
            "args": [],
            "cwd": "${workspaceFolder}/build/win64-debug",
            "preLaunchTask": "build-debug"
        }
    ]
}
```

### 运行效果

![](/images/2024-10-01-win32-hello-world/003.png)

### 说明

在命令行中使用 `cmake` + `msvc` 编译项目时, 会有各种报错,此时可以运行 `vcvars64.bat`, 设置当前的编译环境,文件路径:`D:\program\microsoft\vs2022\communtity\VC\Auxiliary\Build`

* `vcvars32.bat`: 用于设置 32 位编译器和工具的环境变量
* `vcvars64.bat`: 用于设置 64 位编译器和工具的环境变量
* `vcvarsall.bat`: 用于设置所有可用架构（32 位、64 位、ARM 等）的编译器和工具的环境变量
* `vcvarsamd64_x86.bat`: 用于设置在 64 位 Windows 上编译 32 位程序的环境变量
* `vcvarsx86_amd64.bat`: 用于设置在 32 位 Windows 上编译 64 位程序的环境变量


![](/images/2024-10-01-win32-hello-world/004.png)

## 参考

[CMake Error: your RC compiler: "CMAKE_RC_COMPILER-NOTFOUND" was not found.](https://blog.csdn.net/wap1981314/article/details/12653545)
[关于使用vcvars32.bat，vcvarsall.bat配置VS编译环境配置的方法](https://www.cnblogs.com/Koomee/p/17158096.html)
[记录Windows下开发C/C++如何避免乱码](https://zhuanlan.zhihu.com/p/627531212?theme=light)

