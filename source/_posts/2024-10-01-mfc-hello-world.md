---
title: mfc hello world
date: 2024-10-01 23:31:11
categories:
- gui
- win32
tags:
- gui
- win32
---

# 最小化程序

## 源码
```c++
#include <afxwin.h>  // MFC core and standard components

// 应用程序类
class CMinimalMFCApp : public CWinApp {
public:
    virtual BOOL InitInstance();
};

// 主窗口类
class CMainFrame : public CFrameWnd {
public:
    CMainFrame() {
        Create(NULL, _T("Minimal MFC Application"));
    }
};

BOOL CMinimalMFCApp::InitInstance() {
    m_pMainWnd = new CMainFrame;
    m_pMainWnd->ShowWindow(SW_SHOW);
    m_pMainWnd->UpdateWindow();
    return TRUE;
}

// 应用程序对象
CMinimalMFCApp theApp;
```

## CMakePresets.json
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
                "CMAKE_CXX_COMPILER": "cl.exe",
                "CMAKE_MAKE_PROGRAM": "D:/PROGRAM/MICROSOFT/VS2022/COMMUNTITY/COMMON7/IDE/COMMONEXTENSIONS/MICROSOFT/CMAKE/Ninja/ninja.exe",
                "CMAKE_CXX_FLAGS": "/utf-8 -D_AFXDLL -D_UNICODE -DUNICODE"
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

## CMakeLists.txt
```cmake
# 指定 cmake 最小版本, 意指 cmake 版本小于指定版本则构建过程终止
cmake_minimum_required(VERSION 3.26)

# 语言环境配置 ###########################################################################################################

# 语言版本
set(CMAKE_CXX_STANDARD 17)

# 如果指定的语言版本不受支持, 则构建过程终止
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 只弃用 ISO C++ 标准的编译器标志, 而不使用特定编译器的扩展
# set(CMAKE_CXX_EXTENSIONS OFF)

# 项目配置 ##############################################################################################################

# 项目名称和语言
project(mfc-hello LANGUAGES CXX VERSION 1.0.0)

# 编译相关配置 ###########################################################################################################
SET(CMAKE_MFC_FLAG 1)

# 生成 compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

aux_source_directory(. SRCS_MAIN)
add_executable(${PROJECT_NAME} WIN32 ${SRCS_MAIN})

target_link_options(${PROJECT_NAME} PRIVATE /ENTRY:wWinMainCRTStartup)
```

## build.bat
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

## 运行效果

![](/images/2024-10-01-mfc-hello-world/001.png)

## 说明

**关于 `CMAKE_MFC_FLAG`**

```
# 在用静态库中使用 MFC
SET(CMAKE_MFC_FLAG 1)
# 在用动态库中使用 MFC
SET(CMAKE_MFC_FLAG 2)
```

**关于 `/ENTRY:wWinMainCRTStartup`**
> CMake目前没有为Unicode建模Windows应用程序入口点。它在Visual Studio生成器中工作，只是因为此代码和此代码识别_UNICODE定义并相应地修改生成的.vcxproj字段。MSBuild将其转换为/entry：wWinMainCRTStartup（或类似的东西）的正确链接标志。
> 现在，为/entry：wWinMainCRTStartup显式添加target_link_options是一个很好的解决方法。
> Ninja（和Makefile）生成器需要学习一个抽象来显式地对此进行建模，以便他们知道添加标志。

## 参考
[CMake笔记(2)-编译MFC](https://www.dennisthink.com/post/2019/01/cmake%E7%AC%94%E8%AE%B02-%E7%BC%96%E8%AF%91mfc/)
[CMake创建MFC桌面应用](https://blog.csdn.net/alionsss/article/details/135013330)
[Unresolved WinMain error in Unicode MFC application built with CMake using Ninja generator](https://gitlab.kitware.com/cmake/cmake/-/issues/21202)