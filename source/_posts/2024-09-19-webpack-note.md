---
title: webpack 笔记
date: 2024-09-19 04:08:26
categories:
- 前端
- webpack
tags:
- 前端
- webpack
---

# 资料汇总

[webpack 中文网](https://www.webpackjs.com/)

[尚硅谷Webpack5入门到原理（面试开发一条龙）](https://www.bilibili.com/video/BV14T4y1z7sw)
https://pan.baidu.com/s/114lJRGua2uHBdLq_iVLOOQ 提取码：yyds

# 多页面基本使用

## 目录结构

![](/images/2024-09-19-webpack-note/001.png)

## package.json
```json
{
    "name": "webpack-hello",
    "version": "1.0.0",
    "main": "./src/main.js",
    "scripts": {
        "start": "npm run dev",
        "dev": "npx webpack serve --config ./config/webpack.dev.js",
        "build": "npx webpack --config ./config/webpack.prod.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": "",
    "devDependencies": {
        "@babel/core": "^7.25.2",
        "@babel/preset-env": "^7.25.4",
        "babel-loader": "^9.2.1",
        "copy-webpack-plugin": "^12.0.2",
        "css-loader": "^7.1.2",
        "css-minimizer-webpack-plugin": "^7.0.0",
        "html-webpack-plugin": "^5.6.0",
        "mini-css-extract-plugin": "^2.9.1",
        "postcss": "^8.4.47",
        "postcss-loader": "^8.1.1",
        "postcss-preset-env": "^10.0.3",
        "sass": "^1.79.1",
        "sass-loader": "^16.0.1",
        "style-loader": "^4.0.0",
        "webpack": "^5.94.0",
        "webpack-cli": "^5.1.4",
        "webpack-dev-server": "^5.1.0"
    }
}
```

## webpack.dev.js

{% note info no-icon simple %}
下面的代码指定了两个页面
```js
const modules = ['index', 'article']
```
例如 `index` 要求下面几个文件存在
1. `src/build/index.js`
2. `src/html/index.html`
3. `src/js/index.js`
4. `src/sass/index.scss`
{% endnote %}

```js
const modules = ['index', 'article']

// Node.js的核心模块，专门用来处理文件路径
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env' // 能解决大多数样式兼容性问题
                    ]
                }
            }
        },
        preProcessor
    ].filter(Boolean)
}

const getModuleEntry = (moduleName) => {
    return path.resolve(__dirname, '../src/build/' + moduleName + '.js')
}

const getModuleHtml = (moduleName) => {
    return new HtmlWebpackPlugin({
        filename: 'html/' + moduleName + '.html',
        template: './src/html/' + moduleName + '.html',
        chunks: ['common', moduleName],
        inject: true,
        hash: true
    })
}

const moduleConfig = {
    entry: {},
    html: []
}

modules.forEach((m) => {
    moduleConfig.entry[m] = getModuleEntry(m)
    moduleConfig.html.push(getModuleHtml(m))
})

module.exports = {
    // 入口
    // 相对路径和绝对路径都行
    entry: {
        common: path.resolve(__dirname, '../src/build/common.js'),
        ...moduleConfig.entry
    },
    // 路径别名
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
        }
    },
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: undefined,
        // filename: 输出文件名
        filename: 'static/js/[name].js',
        // 自动将上次打包目录资源清空
        clean: true
    },
    // 加载器
    module: {
        rules: [
            // css
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoaders()
            },
            // sass
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            // 图片
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: 'asset',
                generator: {
                    // 将图片文件输出到 static/imgs 目录中
                    // 将图片文件命名 [hash:8][ext][query]
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: 'static/imgs/[hash:8][ext][query]'
                }
            },
            // js
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src/js'), path.resolve(__dirname, 'src/build')],
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, // 开启babel编译缓存
                    cacheCompression: false // 缓存文件不要压缩
                }
            }
        ]
    },
    // 插件
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/libs', to: 'libs' },
                { from: './src/images', to: 'images' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css'
        }),
        new CssMinimizerPlugin(),
        ...moduleConfig.html
    ],
    devServer: {
        host: 'localhost',
        port: '12016',
        open: false,
        hot: true
    },
    // 模式
    mode: 'development',
    devtool: 'cheap-module-source-map'
}
```

## webpack.prod.js
```js
const modules = ['index', 'article']

// Node.js的核心模块，专门用来处理文件路径
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env' // 能解决大多数样式兼容性问题
                    ]
                }
            }
        },
        preProcessor
    ].filter(Boolean)
}

const getModuleEntry = (moduleName) => {
    return path.resolve(__dirname, '../src/build/' + moduleName + '.js')
}

const getModuleHtml = (moduleName) => {
    return new HtmlWebpackPlugin({
        filename: 'html/' + moduleName + '.html',
        template: './src/html/' + moduleName + '.html',
        chunks: ['common', moduleName],
        inject: true,
        hash: true
    })
}

const moduleConfig = {
    entry: {},
    html: []
}

modules.forEach((m) => {
    moduleConfig.entry[m] = getModuleEntry(m)
    moduleConfig.html.push(getModuleHtml(m))
})

module.exports = {
    // 入口
    // 相对路径和绝对路径都行
    entry: {
        common: path.resolve(__dirname, '../src/build/common.js'),
        ...moduleConfig.entry
    },
    // 路径别名
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: path.resolve(__dirname, '../dist'),
        // filename: 输出文件名
        filename: 'static/js/[name].js',
        // 自动将上次打包目录资源清空
        clean: true
    },
    // 加载器
    module: {
        rules: [
            // css
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoaders()
            },
            // sass
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            // 图片
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: 'asset',
                generator: {
                    // 将图片文件输出到 static/imgs 目录中
                    // 将图片文件命名 [hash:8][ext][query]
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: 'static/imgs/[hash:8][ext][query]'
                }
            },
            // js
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src/js'), path.resolve(__dirname, 'src/build')],
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, // 开启babel编译缓存
                    cacheCompression: false // 缓存文件不要压缩
                }
            }
        ]
    },
    // 插件
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/libs', to: 'libs' },
                { from: './src/images', to: 'images' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css'
        }),
        new CssMinimizerPlugin(),
        ...moduleConfig.html
    ],
    devServer: {
        host: 'localhost',
        port: '12016',
        open: false,
        hot: true
    },
    // 模式
    mode: 'production',
    devtool: 'source-map'
}
```

## src/build/index.js
```js
import '../sass/index.scss'

import '../js/common'

import '../js/index'
```

# 合并配置

## 参考
[webpack配置分离(详细)](https://blog.csdn.net/weixin_57677300/article/details/130685271)
[webpack-merge的使用](https://juejin.cn/post/7193535208912584760)

## 安装依赖
```
npm install --save-dev webpack-merge
```

## webpack.module.js
```js
/**
 * 声明页面模块列表
 *
 * 例如 index 模块, 要求如下几个文件存在
 * 1. src/build/index.js
 * 2. src/html/index.html
 * 3. src/js/index.js
 * 4. src/sass/index.scss
 */
const modules = ['index', 'article']

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * 生成 entry
 * @param {string} moduleName 模块名称
 * @returns webpack entry
 */
const getModuleEntry = (moduleName) => {
    return path.resolve(__dirname, '../src/build/' + moduleName + '.js')
}

/**
 * 生成 html 插件实例
 * @param {string} moduleName 模块名称
 * @returns HtmlWebpackPlugin 实例
 */
const getModuleHtml = (moduleName) => {
    return new HtmlWebpackPlugin({
        filename: 'html/' + moduleName + '.html',
        template: './src/html/' + moduleName + '.html',
        chunks: ['common', moduleName],
        inject: true,
        hash: true
    })
}

/**
 * 导出的配置对象
 */
const moduleConfig = {
    entry: {},
    html: []
}

/**
 * 遍历模块配置列表, 生成每个模块对应的配置
 */
modules.forEach((m) => {
    moduleConfig.entry[m] = getModuleEntry(m)
    moduleConfig.html.push(getModuleHtml(m))
})

module.exports = moduleConfig
```

## webpack.common.js
```js
const moduleConfig = require('./webpack.module')

// Node.js的核心模块，专门用来处理文件路径
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env' // 能解决大多数样式兼容性问题
                    ]
                }
            }
        },
        preProcessor
    ].filter(Boolean)
}

module.exports = {
    // 入口
    // 相对路径和绝对路径都行
    entry: {
        common: path.resolve(__dirname, '../src/build/common.js'),
        ...moduleConfig.entry
    },
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: path.resolve(__dirname, '../dist'),
        // filename: 输出文件名
        filename: 'static/js/[name].js',
        // 自动将上次打包目录资源清空
        clean: true
    },
    // 加载器
    module: {
        rules: [
            // css
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoaders()
            },
            // sass
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            // 图片
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: 'asset',
                generator: {
                    // 将图片文件输出到 static/imgs 目录中
                    // 将图片文件命名 [hash:8][ext][query]
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: 'static/imgs/[hash:8][ext][query]'
                }
            },
            // js
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src/js'), path.resolve(__dirname, 'src/build')],
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, // 开启babel编译缓存
                    cacheCompression: false // 缓存文件不要压缩
                }
            }
        ]
    },
    // 插件
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/libs', to: 'libs' },
                { from: './src/images', to: 'images' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css'
        }),
        new CssMinimizerPlugin(),
        ...moduleConfig.html
    ]
}
```

## webpack.dev.js
```js
// 引入webpack-merge
const { merge } = require('webpack-merge')
// 引入公共配置
const common = require('./webpack.common.js')
// 第一个参数是公共配置 第二个参数是环境里的配置
module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        host: 'localhost',
        port: '12016',
        open: false,
        hot: true
    }
})
```

## webpack.prod.js
```js
// 引入webpack-merge
const { merge } = require('webpack-merge')
// 引入公共配置
const common = require('./webpack.common.js')
// 第一个参数是公共配置 第二个参数是环境里的配置
module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map'
})
```