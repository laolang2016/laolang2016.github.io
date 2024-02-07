---
title: ubuntu 下使用 vscode 开发 qt
date: 2024-01-24 22:37:51
tags:
- C/C++
- qt

categories:
- C/C++
- qt
---

ubuntu 下使用 vscode 开发 qt
<!--more-->

# commit id
[https://gitcode.com/m0_53402432/janna/commits/detail/a2c06f17c73e73c932d836b45143bfc83d6bfd68?ref=main](https://gitcode.com/m0_53402432/janna/commits/detail/a2c06f17c73e73c932d836b45143bfc83d6bfd68?ref=main)

# 如何使用
## vscode c++ 开发环境搭建
参考: [cmake 扯淡正经 - cmake + vscode cpp 环境搭建](/2024/01/06/cmake-扯淡正经-cmake-vscode-cpp-环境搭建) 搭建基本的 vscode c++ 开发环境

## vscode 中编写 qt
**打开项目之前需要修改如下几个配置**
1. `.vscode/settings.json` 中修改 `clangd.fallbackFlags` 配置
```json5
// clangd 配置
"clangd.fallbackFlags": [
    // 设置clangd代码检查的c++版本，目前默认是c++14
    "-std=c++2a",
    // 增加项目自身头文件依赖路径
    "-I${workspaceFolder}",
    // qt头文件目录
    "-I/home/laolang/program/qt6/6.5.3/gcc_64/include/**"
]
```
2. `CMakeLists.txt` 修改 vcpkg 配置
```
# 如下几个目录修改为自己的本地目录
set(vckpg_dir "/home/laolang/program/vcpkg")
set(CMAKE_TOOLCHAIN_FILE "${vckpg_dir}/scripts/buildsystems/vcpkg.cmake")
set(fmt_DIR "${vckpg_dir}/packages/fmt_x64-linux-dynamic/share/fmt")
set(spdlog_DIR "${vckpg_dir}/packages/spdlog_x64-linux-dynamic/share/spdlog")
```

3. `CMakePresets.json` 修改 `CMAKE_PREFIX_PATH`
```json5
{
    "name": "preset-base",
    "displayName": "preset base",
    "description": "通用设置",
    "cacheVariables": {
    // 修改为自己的本地目录
    "CMAKE_PREFIX_PATH": "/home/laolang/program/qt6/6.5.3/gcc_64"
    }
}
```
直接打开项目目录,然后点击状态栏的 `run` 即可运行
![](/images/2024-01-24-ubuntu-下使用-vscode-开发-qt/001.png)

# qt creator 如何打开
> qt creator 中就不需要那么多预设了, 只需要选中默认的 `Desktip Qt xxx gcc 64big` 即可

![](/images/2024-01-24-ubuntu-下使用-vscode-开发-qt/002.png)
