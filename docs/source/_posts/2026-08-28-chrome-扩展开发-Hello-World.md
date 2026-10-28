---
title: chrome 扩展开发 Hello World
date: 2026-08-28 08:19:48
categories:
  - chrome
tags:
  - chrome
---



# 参考

官方文档: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn

# 一个最简单的案例

## hello world

### 目录结构

```
E:\work\code\chrome\ext-01-hello>tree /F
卷 新加卷 的文件夹 PATH 列表
卷序列号为 C44C-B362
E:.
    hello.html
    icon.png
    manifest.json

没有子文件夹


E:\work\code\chrome\ext-01-hello>
```

### manifest.json

1. 该文件是唯一的必须文件
2. 该文件必须的字段为 `manifest_version` , `name` , `version`
3. 该文件在开发期间支持注释,但发布时必须删除注释

```json
{
    "name": "ext 01 hello",
    "description": "第一个 chrome 扩展",
    "version": "1.0",
    "manifest_version": 3,
    "action": {
        "default_popup": "hello.html",
        "default_icon": "icon.png"
    }
}
```

### hello.html

```html
<html>
  <body>
    <h1>Hello Extensions</h1>
  </body>
</html>
```

### icon.png

https://developer.chrome.com/static/docs/extensions/get-started/tutorial/hello-world/image/icon.png?hl=zh-cn

### 效果

1. 打开扩展程序的开发者模式
2. 加载未打包的扩展程序

![](/images/2026-08-28-chrome-扩展开发-Hello-World/001.png)

## 如何刷新

1. 保存文件
2. 刷新扩展

![](/images/2026-08-28-chrome-扩展开发-Hello-World/002.png)

## 打印日志

### 控制台日志

**html**

```html
<html>

<body>
    <h1>Hello Extensions</h1>
    <script src="popup.js"></script>
</body>

</html>
```

**js**

```js
console.log("This is a popup!")
```

然后右键 `审查弹出内容`

![](/images/2026-08-28-chrome-扩展开发-Hello-World/003.png)

即可看到效果

![](/images/2026-08-28-chrome-扩展开发-Hello-World/004.png)

### 错误日志

1. 随便搞个语法错误
2. 刷新扩展
3. 点击扩展以激活语法错误提示

会看到错误提示

![](/images/2026-08-28-chrome-扩展开发-Hello-World/005.png)

点击即可看到错误详情

![](/images/2026-08-28-chrome-扩展开发-Hello-World/006.png)


# 简单工程化

## 目录结构

```
E:\work\code\chrome\ext-01-hello>tree /f
卷 新加卷 的文件夹 PATH 列表
卷序列号为 C44C-B362
E:.
│  .editorconfig
│  .gitignore
│  .npmrc
│  package.json
│  pnpm-lock.yaml
│  tsconfig.json
│  vite.config.ts
│
├─.vscode
│      launch.json
│      settings.json
│
├─public
│  │  index.html
│  │
│  ├─icons
│  │      icon-128.png
│  │      icon-16.png
│  │      icon-32.png
│  │      icon-48.png
│  │
│  └─style
│          reset.css
│
└─src
    │  manifest.ts
    │
    ├─content
    │      content.ts
    │
    └─popup
        └─default
                index.html
                popup.css
                popup.ts

```

## package.json

```json
{
    "name": "ext-01-hello",
    "version": "1.0.0",
    "description": "第一个 chrome 扩展",
    "scripts": {
        "dev": "vite",
        "build": "vite build"
    },
    "keywords": [
        "chrome"
    ],
    "author": "潼关路边的一只野鬼",
    "license": "ISC",
    "devEngines": {
        "packageManager": {
            "name": "pnpm",
            "version": "12.11.2",
            "onFail": "download"
        }
    },
    "packageManager": "pnpm@12.11.2",
    "type": "module",
    "devDependencies": {
        "@crxjs/vite-plugin": "^3.0.0",
        "@types/chrome": "^0.3.5",
        "@types/node": "^26.6.5",
        "typescript": "^6.0.3",
        "vite": "^8.3.4"
    }
}
```

## tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "moduleResolution": "Node",
        "strict": true,
        "jsx": "preserve",
        "sourceMap": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "esModuleInterop": true,
        "lib": [
            "ESNext",
            "DOM"
        ],
        "skipLibCheck": true,
        "baseUrl": ".",
        "paths": {
            "@/*": [
                "src/*"
            ]
        }
    },
    "include": [
        "src/**/*.ts"
    ]
}
```

## vite.config.ts

```ts
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest.ts'

export default defineConfig({
    resolve: {
        alias: {
            '@': `${import.meta.dirname}/src`,
        },
    },
    plugins: [
        crx({ manifest }),
    ],
    server: {
        port: 5173,
        strictPort: true,
        watch: {
            ignored: ['**/tmp/chrome-user-data/**']
        },
        hmr: {
            port: 5173,
        },
    },
})
```

## mainifest.ts

```ts
import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
    manifest_version: 3,
    name: 'ext 01 hello',
    version: '1.0.0',
    description: '第一个 chrome 扩展',
    icons: {
        "16": "icons/icon-16.png",
        "48": "icons/icon-48.png",
        "128": "icons/icon-128.png"
    },
    action: {
        default_popup: 'src/popup/default/index.html',
        default_icon: {
            "16": "icons/icon-16.png",
            "48": "icons/icon-48.png"
        }
    },
    content_scripts: [
        {
            matches: ['<all_urls>'],
            js: ['src/content/content.ts'],
        },
    ],
})
```

## content.ts

```ts
console.log("Content script injected into the page.");

// 监听来自 popup.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FROM_POPUP") {
        console.log("Content 收到消息: ", request.payload);

        // 执行一些简单的 DOM 操作或业务演示
        console.log("当前页面标题:", document.title);

        // 向 Popup 回传响应
        sendResponse({ status: "success", message: "Content 已经成功处理消息！" });
    }
    return true;
});
```


## popup/html

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <title>Popup</title>
    <link rel="stylesheet" href="/reset.css">
    <link rel="stylesheet" href="./popup.css">
</head>

<body>
    <div class="container">
        <h2>插件控制面板</h2>
        <button id="send-btn" class="primary-btn">点击与 Content 交互</button>
    </div>
    <script type="module" src="./popup.ts"></script>
</body>

</html>
```

## popup/css

```css
body {
    width: 240px;
    margin: 0;
    padding: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: #f7f9fa;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

h2 {
    font-size: 14px;
    color: #333;
    margin: 0;
}

.primary-btn {
    width: 100%;
    padding: 8px 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.primary-btn:hover {
    background-color: #2563eb;
}

.primary-btn:active {
    background-color: #1d4ed8;
}
```

## popup/ts
```ts
console.log("Popup script loaded.");

const btn = document.getElementById("send-btn");

if (btn) {
    btn.addEventListener("click", async () => {
        // 点击该按钮在控制台打印一条消息
        console.log("Popup 按钮被点击了！");

        // 实现 popup.js 和 content.js 交互：获取当前激活的标签页并发送消息
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab?.id) {
            chrome.tabs.sendMessage(
                tab.id,
                { type: "FROM_POPUP", payload: "Hello from Popup!" },
                (response) => {
                    console.log("收到来自 Content Script 的回复 :", response);
                }
            );
        }
    });
}
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
            "name": "chrome ext",
            "request": "launch",
            "type": "chrome",
            "url": "https://www.bing.com/?mkt=zh-CN",
            "webRoot": "${workspaceFolder}/src",
            "userDataDir": "${workspaceFolder}/tmp/chrome-user-data",
            "runtimeArgs": [
                "--load-extension=${workspaceFolder}/dist"
            ]
        }
    ]
}
```

## debug

> 初次使用可能需要多启动几次

1. pnpm dev
2. vscode 中 F5 即可打开一个全新的 chrome 实例
3. 手动加载扩展
4. 在启动的 chrome 实例上新开一个页面, 进入 launch.json 指定的页面
5. 控制台日志筛选为插件日志
  ![](/images/2026-08-28-chrome-扩展开发-Hello-World/007.png)
6. 源代码来源中,将 content.ts.js 从忽略列表中移除
  ![](/images/2026-08-28-chrome-扩展开发-Hello-World/008.png)
7. popup 页面右键查看,可看已加载来源映射的 ts 文件
  ![](/images/2026-08-28-chrome-扩展开发-Hello-World/009.png)

效果


![](/images/2026-08-28-chrome-扩展开发-Hello-World/010.png)

![](/images/2026-08-28-chrome-扩展开发-Hello-World/011.png)

# 使用框架 wxt

## 初始化项目

```
 pnpm dlx wxt@latest init
Packages are copied from the content-addressable store to the virtual store.
  Content-addressable store is at: E:\.pnpm-store\v11
  Virtual store is at:             ../../../../C:/Users/laolang/AppData/Local/pnpm-cache/dlx/3f29ad96220ca09012ec677e96c553fd/mv6wmczr-mh0/node_modules/.pacquet
.../mv6wmczr-mh0                         | Progress: resolved 130, reused 81, downloaded 49, added 130, done

dependencies:
+ wxt 0.21.4
                                                                                                                                                                                                                                                                  00:37:42
WXT 0.21.4
ℹ Initializing new project                                                                                                                                                                                                                                       00:37:42
✔ Project Directory › ext-02-wxt-hello
✔ Choose a template › vue
✔ Package Manager › pnpm
✔ Downloading template

✨ WXT project created with the vue template.                                                                                                                                                                                                                     00:38:15 

Next steps:                                                                                                                                                                                                                                                       00:38:15
  1. cd ext-02-wxt-hello                                                                                                                                                                                                                                          00:38:15
  2. pnpm install                                                                                                                                                                                                                                                 00:38:15


Done in 45.1s using pnpm v12.4.2
```

根据提示运行后,同样会打开一个新的 chrome 实例,并且已经加载了扩展

# crxjs

```
 pnpm dlx create-crxjs
Packages are copied from the content-addressable store to the virtual store.
  Content-addressable store is at: E:\.pnpm-store\v11
  Virtual store is at:             ../../../../C:/Users/laolang/AppData/Local/pnpm-cache/dlx/a8e5a13bb37435119f84b3cacc15cf47/mv6xs0rf-b9k/node_modules/.pacquet
.../mv6xs0rf-b9k                         | Progress: resolved 1, reused 0, downloaded 1, added 1, done

dependencies:
+ create-crxjs 0.6.0

┌  create-crxjs - quickly start a browser extension
│
◇  Project name:
│  ext-03-crxjs-hello
│
◇  Extension description (you can edit this anytime in package.json):
│  A browser extension built with CRXJS.
│
◇  Select a framework:
│  Vue
│
◇  Select a variant:
│  TypeScript
│
◇  Scaffolding project in E:\work\code\chrome\ext-03-crxjs-hello...
│
◇  Getting Started ─────────╮
│                           │
│  Done. Now run:           │
│                           │
│    cd ext-03-crxjs-hello  │
│    pnpm install           │
│    pnpm run dev           │
│                           │
├───────────────────────────╯
│
└   🎉 You're all set!


Done in 34.4s using pnpm v12.4.2
```

根据提示启动即可. 此框架需要手动加载扩展

