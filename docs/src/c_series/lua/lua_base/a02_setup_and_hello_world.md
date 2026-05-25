---
title: 环境搭建与 Hello World
order: 102
icon: /assets/image/c_series/lua/lua_icon.png
---


## 下载与安装

https://luabinaries.sourceforge.net/download.html

下载需要的版本即可. 下载后将压缩包内的所有文件全部放到同一个目录, 然后加入到环境变量

```
E:\work\test>lua
Lua 5.4.8  Copyright (C) 1994-2025 Lua.org, PUC-Rio
> print('Hello World')
Hello World
> os.exit(0)

E:\work\test>
```

## vscode 

### 插件

```json
{
    "recommendations": [
        "sumneko.lua",
        "actboy168.lua-debug"
    ]
}
```

![](/assets/image/c_series/lua/lua_base/a02_setup_and_hello_world/001.png)


### debug

`launch.json`

```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "emmylua_launch",
            "request": "launch",
            "name": "启动并附加程序",
            "program": "D:/program/cpp/lua/lua54/lua54.exe",
            "workingDir": "${workspaceRoot}",
            "arguments": [
                "${workspaceRoot}/main.lua"
            ],
            "newWindow": false
        }
    ]
}
```

效果

![](/assets/image/c_series/lua/lua_base/a02_setup_and_hello_world/002.png)


