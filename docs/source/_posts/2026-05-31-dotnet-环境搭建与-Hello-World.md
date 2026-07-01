---
title: dotnet 环境搭建与 Hello World
date: 2026-05-31 23:51:43
categories:
  - dotnet
tags:
  - dotnet
---


# 安装

# Hello World

## 创建解决方案

```
# 创建项目目录
mkdir hello-dotnet
cd hello-dotnet

# 创建解决方案
dotnet new sln

# 创建 .gitignore 文件
dotnet new gitignore

# 创建 .editorconfig 文件
dotnet new editorconfig
```

## 创建控制台项目

```
# 创建控制台项目, -n:名称 , --use-program-main: 不使用顶级语句
dotnet new console -n HelloDotnet --use-program-main

# 将控制台项目添加到解决方案
dotnet sln add HelloDotnet/HelloDotnet.csproj

# 编译
dotnet build --configuration Release

# 运行
dotnet run --configuration Release --project HelloDotnet/HelloDotnet.csproj
```

## xunit 项目

### 添加 xunit 项目

```
# 创建 xunit 项目
dotnet new xunit -o HelloDotnet.Tests

# 将 xunit 项目添加到解决方案
dotnet sln add HelloDotnet.Tests/HelloDotnet.Tests.csproj

# 将控制台项目作为依赖添加到 xunit 项目
dotnet add HelloDotnet.Tests/HelloDotnet.Tests.csproj reference HelloDotnet/HelloDotnet.csproj
```


### 控制台项目

控制台项目添加一个类

```csharp
using System;

namespace HelloDotnet;

internal class Calc
{
    /// <summary>
    /// 加法
    /// </summary>
    /// <param name="a">加数</param>
    /// <param name="b">被加数</param>
    /// <returns>加法结果</returns>
    public int Add(int a, int b)
    {
        return a + b;
    }

    public int Sub(int a, int b)
    {
        return a - b;
    }
}
```

然后修改控制台项目的 `.csproj` 文件

```xml
<!-- 设置单元测试可访问 internal -->
<ItemGroup>
    <AssemblyAttribute Include="System.Runtime.CompilerServices.InternalsVisibleToAttribute">
        <_Parameter1>HelloDotnet.Tests</_Parameter1>
    </AssemblyAttribute>
</ItemGroup>
```

在 `xunit` 项目中添加单测类

```csharp
using System;

using Xunit.Abstractions;

namespace HelloDotnet.Tests;

public class CalcTest(ITestOutputHelper output)
{

    [Fact]
    public void AddTest()
    {
        output.WriteLine("AddTest start");
        Calc calc = new();
        Assert.Equal(3, calc.Add(1, 2));
        output.WriteLine("AddTest end");
    }
}
```

### 运行单测

```
dotnet test HelloDotnet.Tests/HelloDotnet.Tests.csproj
```

### 单测输出

要使用如下命令

```
dotnet test HelloDotnet.Tests/HelloDotnet.Tests.csproj --logger "console;verbosity=detailed"
```

效果如下

```
laolang@ubuntu-devstudio:~/work/tmp/hello-dotnet$ dotnet test HelloDotnet.Tests/HelloDotnet.Tests.csproj --logger "console;verbosity=detailed"
还原完成(0.5)
  HelloDotnet net10.0 已成功 (0.2 秒) → HelloDotnet/bin/Debug/net10.0/HelloDotnet.dll
  HelloDotnet.Tests net10.0 已成功 (0.1 秒) → HelloDotnet.Tests/bin/Debug/net10.0/HelloDotnet.Tests.dll
总共 1 个测试文件与指定模式相匹配。
/home/laolang/work/tmp/hello-dotnet/HelloDotnet.Tests/bin/Debug/net10.0/HelloDotnet.Tests.dll
[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v3.1.4+50e68bbb8b (64-bit .NET 10.0.4)
[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v3.1.4+50e68bbb8b (64-bit .NET 10.0.4)
[xUnit.net 00:00:00.06]   Discovering: HelloDotnet.Tests
[xUnit.net 00:00:00.06]   Discovering: HelloDotnet.Tests
[xUnit.net 00:00:00.10]   Discovered:  HelloDotnet.Tests
[xUnit.net 00:00:00.10]   Discovered:  HelloDotnet.Tests
[xUnit.net 00:00:00.12]   Starting:    HelloDotnet.Tests
[xUnit.net 00:00:00.12]   Starting:    HelloDotnet.Tests
[xUnit.net 00:00:00.16]   Finished:    HelloDotnet.Tests
[xUnit.net 00:00:00.16]   Finished:    HelloDotnet.Tests
  已通过 HelloDotnet.Tests.CalcTest.AddTest [5 ms]
  标准输出消息:
 AddTest start
 AddTest end



测试运行成功。
测试总数: 1
     通过数: 1
总时间: 0.7614 秒
  HelloDotnet.Tests 测试 net10.0 已成功 (0.9 秒)

测试摘要: 总计: 1, 失败: 0, 成功: 1, 已跳过: 0, 持续时间: 0.9 秒
在 2.0 秒内生成 已成功
laolang@ubuntu-devstudio:~/work/tmp/hello-dotnet$
```

### 覆盖率

需要安装工具

```
dotnet tool install -g dotnet-reportgenerator-globaltool
```

然后使用如下命令即可生成覆盖率报告

```
dotnet test HelloDotnet.Tests/HelloDotnet.Tests.csproj --logger "console;verbosity=detailed" --collect:"XPlat Code Coverage" reportgenerator -reports:HelloDotnet.Tests/TestResults/*/coverage.cobertura.xml -targetdir:HelloDotnet.Tests/CoverageReport -reporttypes:Html
```

## docfx 支持

docfx 是专为 .NET 生态设计的开源静态文档网站生成器, 可生成文档和API. 由官方开发, 社区维护

### 安装 docfx

```
dotnet tool install -g docfx
```

### 初始化

```
docfx init -y
```

### 简单配置

在跟目录创建一个 `docfx` 目录, 将生成的 `docs` 目录, `index.md` , `docfx.json` , `toc.yml` 都移动到该目录, 然后修改 `docfx.json` 内容如下

```json
{
    "$schema": "https://raw.githubusercontent.com/dotnet/docfx/main/schemas/docfx.schema.json",
    "metadata": [
        {
            "src": [
                {
                    // 源码目录
                    "src": "../HelloDotnet",
                    "files": [
                        "**/*.csproj"
                    ]
                }
            ],
            // 这里修改了 api 输出路径
            "dest": "_api",
            // 输出非 public 成员文档
            "includePrivateMembers": true
        }
    ],
    "build": {
        "content": [
            {
                "files": [
                    "**/*.{md,yml}"
                ],
                "exclude": [
                    "_site/**"
                ]
            }
        ],
        "resource": [
            {
                "files": [
                    "images/**"
                ]
            }
        ],
        "output": "_site",
        "template": [
            "default",
            "modern"
        ],
        "globalMetadata": {
            // 项目名称
            "_appName": "dotnet-hello",
            "_appTitle": "dotnet-hello",
            "_enableSearch": true,
            // 没有开启 pdf 输出
            "pdf": false
        }
    }
}
```

由于修改了 api 输出路径, 所以还需要修改 toc.yml

```yaml
- name: Docs
  href: docs/
- name: API
  href: _api/
```

### 使用

1. 下面的命令需要在 docfx目录运行
2. 命令顺序不能乱

使用如下命令检测配置是否有效

```
docfx metadata
```

使用如下命令可生成文档

```
docfx build
```

使用如下命令可启动服务器查看页面

```
# -n : 地址
# -p : 端口
# _site : 生成的文档目录
docfx serve -n 192.168.56.102 -p 8086 _site
```

### 效果

![](/images/2026-05-31-dotnet-环境搭建与-Hello-World/001.png)

![](/images/2026-05-31-dotnet-环境搭建与-Hello-World/002.png)

# vscode 配置

## 插件列表

> 新建 `.vscode/extensions.json` 文件, 然后在插件搜索栏右侧筛选按钮中选择推荐

```json
// .vscode/extensions.json
{
  "recommendations": [
	// 错误提示
    "usernamehw.errorlens",
    // 官方插件
    "ms-dotnettools.csdevkit",
    "ms-dotnettools.csharp",
    // nuget 可视化管理
    "aliasadidev.nugetpackagemanagergui",
    // 将任务配置到任务栏快捷按钮
    "spencerwmiles.vscode-task-buttons",
    // xml 工具
    "DotJoshJohnson.xml"
  ]
}
```

## settings.json

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
    "[csharp]": {
        "editor.defaultFormatter": "ms-dotnettools.csharp",
        "editor.formatOnSave": true,
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
    // 关闭形参显示
    "editor.inlayHints.enabled": "off",
    // 关闭引用计数
    "editor.codeLens": false,
    // task buttons
    "VsCodeTaskButtons.showCounter": true,
    "VsCodeTaskButtons.tasks": [
        {
            "label": "▶️ HelloDotnetRun",
            "task": "HelloDotnetRun"
        },
        {
            "label": "🧪 HelloDotnetTest",
            "task": "HelloDotnetTest"
        },
        {
            "label": "📊 HelloDotnetCoverage",
            "task": "HelloDotnetCoverage"
        }
    ]
}
```

## task.json

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "command": "dotnet",
            "type": "process",
            "args": [
                "build",
                "${workspaceFolder}/dotnet-hello.slnx",
                // vscode 识别错误和警告时, 需要全路径
                "/property:GenerateFullPaths=true",
                // 不显示编译总结
                // 成功生成 1 个项目
                // 失败生成 1 个项目
                "/consoleloggerparameters:NoSummary;ForceNoAlign"
            ],
            "problemMatcher": "$msCompile"
        },
        {
            "label": "HelloDotnetRun",
            "command": "dotnet",
            "type": "process",
            "args": [
                "run",
                "--configuration",
                "Release",
                "--project",
                "${workspaceFolder}/HelloDotnet/HelloDotnet.csproj"
            ]
        },
        {
            "label": "HelloDotnetTest",
            "command": "dotnet",
            "type": "process",
            "args": [
                "test",
                "${workspaceFolder}/HelloDotnet.Tests/HelloDotnet.Tests.csproj",
                "--logger",
                "console;verbosity=detailed",
                "--collect",
                "XPlat Code Coverage"
            ]
        },
        {
            "label": "HelloDotnetCoverage",
            "command": "reportgenerator",
            "type": "process",
            "args": [
                "-reports:${workspaceFolder}/HelloDotnet.Tests/TestResults/*/coverage.cobertura.xml",
                "-targetdir:${workspaceFolder}/HelloDotnet.Tests/CoverageReport",
                "-reporttypes:Html"
            ],
            "dependsOn": [
                "HelloDotnetTest"
            ]
        },
        {
            "label": "publish",
            "command": "dotnet",
            "type": "process",
            "args": [
                "publish",
                "${workspaceFolder}/dotnet-hello.slnx",
                "/property:GenerateFullPaths=true",
                "/consoleloggerparameters:NoSummary;ForceNoAlign"
            ],
            "problemMatcher": "$msCompile"
        }
    ]
}
```

## launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            // 使用 IntelliSense 找出 C# 调试存在哪些属性
            // 将悬停用于现有属性的说明
            // 有关详细信息，请访问 https://github.com/dotnet/vscode-csharp/blob/main/debugger-launchjson.md
            "name": "HelloDotnet",
            "type": "coreclr",
            "request": "launch",
            "preLaunchTask": "build",
            // 如果已更改目标框架，请确保更新程序路径。
            "program": "${workspaceFolder}/HelloDotnet/bin/Debug/net10.0/HelloDotnet.dll",
            "args": [],
            "cwd": "${workspaceFolder}/HelloDotnet",
            // 有关“控制台”字段的详细信息，请参阅 https://aka.ms/VSCode-CS-LaunchJson-Console
            "console": "externalTerminal",
            "stopAtEntry": false
        }
    ]
}
```
