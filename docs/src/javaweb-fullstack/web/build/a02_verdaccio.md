---
title: verdaccio
order: 102
---

## 1. 参考资料

官方中文文档: https://www.verdaccio.org/zh-CN/

## 2. 安装

```
npm install -g verdaccio
```

## 3. 配置

配置文件可见启动命令行, 具体文件内容说明可参考: https://www.verdaccio.org/zh-CN/docs/configuration

### 3.1. 设置监听地址

> 作用: 防止局域网的其他IP无法访问

```
listen: 0.0.0.0:4873
```

### 3.2. 添加用户

> 根据提示填写用户名, 密码, 邮箱即可

```
npm adduser --registry http://localhost:4873
```

### 3.3. 代理阿里云 npm 源

> 直接修改原配置文件的 `url` 即可

```
uplinks:
  npmjs:
    url: https://registry.npmmirror.com/
```

## 4. 如何使用

### 4.1. 项目源码

#### 4.1.1. packson.json

```json
{
    "name": "@ghost/mcl",
    "version": "0.0.1",
    "description": "一个测试 Verdaccio 的项目",
    "main": "index.js",
    "bin": {
        "mcl": "index.js"
    },
    "scripts": {
        "start": "node index.js",
        "test": "node index.js",
        "prepublishOnly": "shx chmod +x index.js"
    },
    "keywords": [
        "cli"
    ],
    "author": {
        "name": "潼关路边的一只野鬼",
        "email": "xiaodaima2016@163.com",
        "url": "https://laolang2016.github.io/"
    },
    "license": "ISC",
    "files": [
        "dist",
        "index.js",
        "README.md",
        "LICENSE"
    ],
    "devDependencies": {
        "shx": "^0.4.0"
    }
}
```

#### 4.1.2. .npmrc

```
registry=http://192.168.56.1:4873
```

#### 4.1.3. index.js

```js
#!/usr/bin/env node

console.log('test Verdaccio')
```

### 4.2. 发布

```
E:\work\tmp\mcl>npm publish --registry http://192.168.56.1:4873

> @ghost/mcl@0.0.1 prepublishOnly
> shx chmod +x index.js

npm notice
npm notice package: @ghost/mcl@0.0.1
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 15B README.md
npm notice 54B index.js
npm notice 693B package.json
npm notice Tarball Details
npm notice name: @ghost/mcl
npm notice version: 0.0.1
npm notice filename: ghost-mcl-0.0.1.tgz
npm notice package size: 1.3 kB
npm notice unpacked size: 1.8 kB
npm notice shasum: 2ae7903d76649543621faeb9e21135b82618a2e4
npm notice integrity: sha512-zm+77T4O+M+Zj[...]b5SQ0wGuRPPew==
npm notice total files: 4
npm notice
npm notice Publishing to http://192.168.56.1:4873/ with tag latest and default access
+ @ghost/mcl@0.0.1

E:\work\tmp\mcl>
```

### 4.3. 删除

> 注意: 如果只有这一个版本, 需要带上 `--force` 参数

```
E:\work\tmp\mcl>npm unpublish @ghost/mcl@0.0.1 --registry http://192.168.56.1:4873 --force
npm warn using --force Recommended protections disabled.
- @ghost/mcl

E:\work\tmp\mcl>
```

## 5. 验证

```
E:\work\tmp>npm install -g @ghost/mcl@0.0.1 --registry http://192.168.56.1:4873

added 1 package in 542ms

E:\work\tmp>npm list -g --depth=0
D:\program\nvm\nodejs -> .\
+-- @ghost/mcl@0.0.1
+-- @nestjs/cli@11.0.16
+-- corepack@0.34.0
+-- hexo-cli@4.3.2
+-- npm@10.9.4
+-- pnpm@10.32.1
`-- verdaccio@6.3.2


E:\work\tmp>mcl
test Verdaccio

E:\work\tmp>
```