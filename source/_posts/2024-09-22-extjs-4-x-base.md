---
title: extjs 4.x 基本使用
date: 2024-09-22 02:11:26
categories:
- 前端
- extjs
tags:
- 前端
- extjs
---

# Hello World 搭建

## 下载

* Extjs 5 beta 版下载链接：http://cdn.sencha.com/ext/beta/ext-5.0.0.736.zip
* Extjs 4.2.1 下载链接：http://cdn.sencha.com/ext/gpl/ext-4.2.1-gpl.zip
* Extjs 4.0.7 下载链接：http://cdn.sencha.io/ext-4.0.7-gpl.zip
* Extjs 3.4.0 下载链接：http://cdn.sencha.com/ext/gpl/ext-3.4.1.1-gpl.zip
* Extjs 2.3.0 下载链接：http://dev.sencha.com/deploy/ext-2.3.0.zip

本文使用 `4.2.1-gpl`

## 引入文件

下载后并解压, 将如下几个文件复制到项目目录

1. `resources` : 全部引入
2. `local` : 只需要包含 `ext-lang-zh_CN.js` 即可
3. `ext-all.js`: 发布时引入
4. `ext-all-debug.js` : 开发时引入

## html
```html
<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <!-- extjs 样式文件 -->
        <link rel="stylesheet" href="../libs/extjs/resources/css/ext-all.css" />
        <title>index</title>
    </head>
    <body>
        <!-- extjs -->
        <script src="../libs/extjs/ext-all-debug.js" charset="UTF-8"></script>
        <!-- extjs 国际化文件 -->
        <script src="../libs/extjs/locale/ext-lang-zh_CN.js"></script>
    </body>
</html>
```

## js

**khl.js**
```js
export const khl = {
    buttonText: {
        ok: 'ok',
        yes: 'yes',
        no: 'no',
        cancel: 'cancel'
    }
}
```
**index.js**

```js
import { khl } from '@/js/khl'

Ext.onReady(function() {
    Ext.Msg.show({
        title: '地址',
        msg: '请输入你的地址:',
        width: 300,
        buttons: Ext.Msg.OKCANCEL,
        multiline: true,
        fn: function(op, text) {
            if (op === khl.buttonText.ok) {
                console.log('点击了确定')
                console.log(`输入内容:${text}`)
            } else if (op === khl.buttonText.cancel) {
                console.log('点击了取消')
            }
        },
        animateTarget: 'addAddressBtn',
        icon: Ext.MessageBox.INFO
    })
})
```

## 效果

![](/images/2024-09-22-extjs-4-x-base/001.gif)


## 注意
如果使用 `webpack` 构建, 最好将 `CssMinimizerPlugin` 禁用, 否则会报错: 
**Missed semicolon [libs/extjs/resources/ext-theme-neptune/ext-theme-neptune-all-rtl.css:1,105970]**

## 解读

`Ext.onReady` 个方法是 `Ext` 的准备函数，也就是Ext相关的代码都会在这个函数里书写，它比较类似于window的onload方法，但是注意其执行时机是在页面的DOM对象加载完毕之后立即执行。
而 `window.onload` 是在所哟资源都加载完毕才会执行