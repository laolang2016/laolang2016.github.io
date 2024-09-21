---
title: vscode 搭建 lua 开发环境
date: 2024-08-29 17:04:44
categories:
- graver
- lua
tags:
- graver
- lua
---


vscode 搭建 lua 开发环境

<!-- more -->

# 安装 lua
> 根据操作系统下载对应的文件, 然后将可执行文件所在目录加入环境变量

[https://luabinaries.sourceforge.net/download.html](https://luabinaries.sourceforge.net/download.html)

![](/images/2024-08-29-vscode-搭建_lua_开发环境/001.png)



# vscode 插件

1. sumneko.lua

2. tangzx.emmylua

直接搜索 `tangzx.emmylua` 即可

![](/images/2024-08-29-vscode-搭建_lua_开发环境/002.png)

# windows 调试

## main.lua

```lua
local a = 1
a = 2
a = 3
a = 4
print(a)
```

## launch.json 
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
            "program": "D:/program/lua/lua542/bin/lua54.exe",
            "workingDir": "${workspaceRoot}",
            "arguments": [
                "${workspaceRoot}/main.lua"
            ],
            "newWindow": false
        }
    ]
}
```

## 效果
![](/images/2024-08-29-vscode-搭建_lua_开发环境/003.png)


# linux 调试

## main.lua
```lua
package.cpath = package.cpath .. ";/home/laolang/program/code/data/extensions/tangzx.emmylua-0.7.1-linux-x64/debugger/emmy/linux/emmy_core.so"
local dbg = require("emmy_core")
dbg.tcpListen("localhost", 9966)
dbg.waitIDE()

local a = 1
a = 2
a = 3
a = 4
print(a)
```
## launch.json
```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "emmylua_new",
            "request": "launch",
            "name": "EmmyLua New Debug",
            "host": "localhost",
            "port": 9966,
            "ext": [
                ".lua",
                ".lua.txt",
                ".lua.bytes"
            ],
            "ideConnectDebugger": true
        }
    ]
}
```

## 注意

> 1. 调试前需要先在终端运行起来
> 2. `/home/laolang/program/code/data/extensions/tangzx.emmylua-0.7.1-linux-x64/debugger/emmy/linux/emmy_core.so` 需要修改为自己的位置
> 3. `emmylua` 插件有时候会自动更新, 路径也就变了, 如果发现启动时找不到 `emmy_core`, 可以检查一下插件的版本

## 效果

![](/images/2024-08-29-vscode-搭建_lua_开发环境/004.png)


## 参考
[Debugging on Mac?](https://github.com/EmmyLua/VSCode-EmmyLua/issues/58)

[Debugger: breakpoint are not working when ide connect to lua](https://github.com/EmmyLua/VSCode-EmmyLua/issues/81)
