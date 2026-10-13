---
title: electron hello world
date: 2026-10-11 15:07:44
categories:
  - web
  - node
  - electron
tags:
  - web
  - node
  - electron
---


# 原生 electron

## 工程配置

### .pnpmrc

```
# 淘宝镜像
registry=https://registry.npmmirror.com

# 依赖链接模式为 hoisted（平铺模式，用于解决 Electron 打包或原生模块路径问题）
node-linker=hoisted

# Electron 官方二进制文件的下载镜像源
electron_mirror=https://npmmirror.com/mirrors/electron/
```

### electron 下载

如果下载太慢可以参考: [Electron 踩坑记：从 npm 迁移到 pnpm](https://www.woyioii.cn/posts/%E5%85%B3%E4%BA%8Eelectron%20%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E8%BF%81%E7%A7%BB%E5%88%B0pnpm.html)

或者可以设置环境变量

### package.json

```json
{
    "name": "electron-hello",
    "version": "1.0.0",
    "description": "",
    "main": "main.js",
    "scripts": {
        "start": "electron .",
        "make": "electron-forge make"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devEngines": {
        "packageManager": {
            "name": "pnpm",
            "version": "12.11.2",
            "onFail": "download"
        }
    },
    "packageManager": "pnpm@12.11.2",
    "dependencies": {

    },
    "devDependencies": {
        "electron": "^44.7.0",
        "@electron-forge/cli": "^8.0.1",
        "@electron-forge/maker-zip": "^8.0.1"
    }
}
```

### pnpm-workspace.yaml

```yml
nodeLinker: hoisted
```

## 代码

### main.js

```js
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()
})
```

### index.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'self'; script-src 'self'"
        />
        <meta
            http-equiv="X-Content-Security-Policy"
            content="default-src 'self'; script-src 'self'"
        />
        <title>来自 Electron 渲染器的问好！</title>
    </head>
    <body>
        <h1>来自 Electron 渲染器的问好！</h1>
        <p>👋</p>
        <p id="info"></p>
    </body>
    <script src="./renderer.js"></script>
</html>
```

### preload.js

```js
const { contextBridge,ipcRenderer  } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
    // 除函数之外，我们也可以暴露变量
})
```

### renderer.js

```
const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // 打印 'pong'
}

func()
```

### forge.config.js

```js
module.exports = {
    packagerConfig: {
        asar: true, // 开启 asar 打包，保护源码
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip',
            platforms: ['win32', 'darwin', 'linux'], // 支持你想要的目标平台
        },
    ],
};
```