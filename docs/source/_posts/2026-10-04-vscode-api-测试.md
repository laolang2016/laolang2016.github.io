---
title: vscode api 测试
date: 2026-10-04 14:22:24
categories:
  - 登神长阶
  - 器
  - vscode
tags:
  - 登神长阶
  - 器
  - vscode
---

## rest client

### 地址

插件地址: https://marketplace.visualstudio.com/items?itemName=humao.rest-client

github readme.md: https://github.com/Huachao/vscode-restclient/blob/master/README.md

### 基本使用

#### 后端接口

```js
// Require the framework and instantiate it
const fastify = require('fastify')({logger: true})

// x-www-form-urlencoded 支持
fastify.register(require('@fastify/formbody'))
// form-data 支持
fastify.register(require('@fastify/multipart'))

fastify.get('/', function handler(request, reply) {
    reply.send({hello: 'world'})
})

// 无参 get 请求
fastify.get('/get/simple', function handler(request, reply) {
    reply.send({msg: '无参 get 请求'})
})

// 带查询参数 get 请求
fastify.get('/get/simpleWithQuery', function handler(request, reply) {
    const {pageNum, pageSize} = request.query
    reply.send({msg: '带查询参数 get 请求', data: {pageNum, pageSize}})
})

// 带路径参数 get 请求
fastify.get('/get/simpleWithParams/:id', function handler(request, reply) {
    const {id} = request.params
    reply.send({msg: '带路径参数 get 请求', data: {id}})
})

// 无参 post 请求
fastify.post('/post/simple', function handler(request, reply) {
    reply.send({msg: '无参 post 请求'})
})

// json post 请求
fastify.post('/post/simpleWidthRequestBody', function handler(request, reply) {
    const req = request.body
    reply.send({msg: 'json post 请求', data: req})
})

// x-www-form-urlencoded post 请求
fastify.post('/post/simpleWidthFormUrlencoded', function handler(request, reply) {
    const {pageNum, pageSize} = request.body
    reply.send({msg: 'x-www-form-urlencoded post 请求', data: {pageNum, pageSize}})
})

// form-data post 请求
fastify.post('/post/simpleWidthFormData', async function handler(request, reply) {
    const file = await request.file()
    // 文件元信息
    console.log('文件名:', file.filename)
    console.log('MIME类型:', file.mimetype)
    console.log('编码:', file.encoding)
    console.log('字段名:', file.fieldname)

    // 方式一：输出文件内容（转为 Buffer）
    const buffer = await file.toBuffer()
    console.log('文件内容(文本):', buffer.toString('utf8'))  // 如果是文本文件

    const pageNum = file.fields.pageNum?.value
    const pageSize = file.fields.pageSize?.value
    reply.send({msg: 'form-data post 请求', data: {pageNum, pageSize}})
})


// Run the server!
fastify.listen({port: 3000}, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
```

#### rest.http

```http
### 无参 get 请求
GET http://localhost:3000/get/simple HTTP/1.1

### 带查询参数 get 请求
GET http://localhost:3000/get/simpleWithQuery?pageNum=1&pageSize=10 HTTP/1.1

### 带查询参数 get 请求
GET http://localhost:3000/get/simpleWithParams/123 HTTP/1.1


### 无参 post 请求
POST http://localhost:3000/post/simple HTTP/1.1

### json post 请求
POST http://localhost:3000/post/simpleWidthRequestBody HTTP/1.1
content-type: application/json

{
    "pageNum": 1,
    "pageSize": 10
}


### x-www-form-urlencoded post 请求
POST http://localhost:3000/post/simpleWidthFormUrlencoded HTTP/1.1
Content-Type: application/x-www-form-urlencoded

pageNum=1&pageSize=10

### x-www-form-urlencoded post 请求
POST http://localhost:3000/post/simpleWidthFormUrlencoded HTTP/1.1
Content-Type: application/x-www-form-urlencoded

pageNum=1&pageSize=10

### form-data post 请求
POST http://localhost:3000/post/simpleWidthFormData HTTP/1.1
Content-Type: multipart/form-data; boundary=----boundary

------boundary
Content-Disposition: form-data; name="pageNum"

1
------boundary
Content-Disposition: form-data; name="pageSize"

10
------boundary
Content-Disposition: form-data; name="file"; filename="one.txt"
Content-Type: text/plain

< ./test.txt
------boundary--
```


### 命名请求与接口联动

#### 后端接口

```js
// Require the framework and instantiate it
const fastify = require('fastify')({logger: true})

// x-www-form-urlencoded 支持
fastify.register(require('@fastify/formbody'))
// form-data 支持
fastify.register(require('@fastify/multipart'))


// login
fastify.post('/post/login', function handler(request, reply) {
    const req = request.body
    reply.send({msg: 'login', data: "token"})
})

// users
fastify.post('/post/users', function handler(request, reply) {
    const token = request.headers['authorization']
    console.log(`token:${token}`)
    const req = request.body
    reply.send({msg: 'users', data: {...req, token}})
})


// Run the server!
fastify.listen({port: 3000}, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
```

#### rest.http

```http
### 获取 token
# @name login
POST http://localhost:3000/post/login HTTP/1.1
content-type: application/json

{
    "username": "admin",
    "password": "123456"
}


### 使用 token
# @name users
POST http://localhost:3000/post/users HTTP/1.1
content-type: application/json
Authorization: Bearer {{login.response.body.$.data}}

{
    "pageNum": 1,
    "pageSize": 10
}
```


#### rapid-http

rest.http 并不能一次性运行所有请求, rapid-http 是对 rest.http 插件的增强

https://marketplace.visualstudio.com/items?itemName=Apaya.rapid-http

但是要注意, 请求链获取参数不需要 $

```
Authorization: Bearer {{login.response.body.data}}
```

```http
### 获取 token
# @name login
POST http://localhost:3000/post/login HTTP/1.1
content-type: application/json

{
    "username": "admin",
    "password": "123456"
}


### 使用 token
# @name users
POST http://localhost:3000/post/users HTTP/1.1
content-type: application/json
Authorization: Bearer {{login.response.body.data}}

{
    "pageNum": 1,
    "pageSize": 10
}
```

然后执行 `Rapid REST Client: Send All Requests` 即可

## httpyac

该 组件也可以运行 .http 文件, 且支持 cli 与 vscode 

github: https://github.com/AnWeber/httpyac

vscode: https://marketplace.visualstudio.com/items?itemName=anweber.vscode-httpyac

### Ref and ForceRef

可以在请求之间传递参数

#### http

```http
### 获取 token
# @name login
# @title login

POST http://localhost:3000/post/login HTTP/1.1
content-type: application/json

{
    "username": "admin",
    "password": "123456"
}


### 使用 token
# @name users
# @title users
# @ref login
POST http://localhost:3000/post/users HTTP/1.1
content-type: application/json
Authorization: Bearer {{login.data}}

{
    "pageNum": 1,
    "pageSize": 10
}
```

#### cli

```bash
E:\work\code\fastify\fastify-hello>npx httpyac send --all rest.http

---------------------

=== login ===

POST http://localhost:3000/post/login        
accept: */*
accept-encoding: gzip, deflate, br
content-length: 56
content-type: application/json
user-agent: httpyac

{
    "username": "admin",
    "password": "123456"
}
HTTP/1.1 200  - OK
connection: keep-alive
content-length: 30
content-type: application/json; charset=utf-8
date: Sat, 15 Aug 2026 17:55:28 GMT
keep-alive: timeout=72

{
  "msg": "login",
  "data": "token"
}

---------------------

=== users ===

POST http://localhost:3000/post/users        
accept: */*
accept-encoding: gzip, deflate, br
authorization: Bearer token
content-length: 43
content-type: application/json
user-agent: httpyac

{
    "pageNum": 1,
    "pageSize": 10
}
HTTP/1.1 200  - OK
connection: keep-alive
content-length: 73
content-type: application/json; charset=utf-8
date: Sat, 15 Aug 2026 17:55:28 GMT
keep-alive: timeout=72

{
  "msg": "users",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "token": "Bearer token"
  }
}

2 requests processed (2 succeeded)

E:\work\code\fastify\fastify-hello>
```



### 环境

推荐使用 .env 文件

#### .env

**.env**

```ini
host = http://localhost:3000
```

**.env.dev**

```ini
pageNum = 1
pageSize = 10
```

**.env.stg**

```ini
pageNum = 1
pageSize = 10
```


#### http

```http
### 获取 token
# @name login
# @title login

POST {{host}}/post/login HTTP/1.1
content-type: application/json

{
    "username": "admin",
    "password": "123456"
}


### 使用 token
# @name users
# @title users
# @ref login
POST http://localhost:3000/post/users HTTP/1.1
content-type: application/json
Authorization: Bearer {{login.data}}

{
    "pageNum": {{pageNum}},
    "pageSize": {{pageSize}}
}
```

#### vscode 使用

![](/images/2026-07-16-vscode-基本使用/001.png)

#### cli

```
E:\work\code\fastify\fastify-hello>npx httpyac send rest.http -a -e dev    

---------------------

=== login ===

POST http://localhost:3000/post/login
accept: */*
accept-encoding: gzip, deflate, br
content-length: 56
content-type: application/json
user-agent: httpyac

{
    "username": "admin",
    "password": "123456"
}
HTTP/1.1 200  - OK
connection: keep-alive
content-length: 30
content-type: application/json; charset=utf-8
date: Sat, 15 Aug 2026 18:12:46 GMT
keep-alive: timeout=72

{
  "msg": "login",
  "data": "token"
}

---------------------

=== users ===

POST http://localhost:3000/post/users
accept: */*
accept-encoding: gzip, deflate, br
authorization: Bearer token
content-length: 43
content-type: application/json
user-agent: httpyac

{
    "pageNum": 1,
    "pageSize": 10
}
HTTP/1.1 200  - OK
connection: keep-alive
content-length: 73
content-type: application/json; charset=utf-8
date: Sat, 15 Aug 2026 18:12:46 GMT
keep-alive: timeout=72

{
  "msg": "users",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "token": "Bearer token"
  }
}

2 requests processed (2 succeeded)

E:\work\code\fastify\fastify-hello>
```


### 断言

#### 接口

```js
// Require the framework and instantiate it
const fastify = require('fastify')({logger: true})

// x-www-form-urlencoded 支持
fastify.register(require('@fastify/formbody'))
// form-data 支持
fastify.register(require('@fastify/multipart'))


// login
fastify.post('/post/login', function handler(request, reply) {
    const req = request.body
    reply.send({success: true, code: '200', msg: 'login', data: "token"})
})

// users
fastify.post('/post/users', function handler(request, reply) {
    const token = request.headers['authorization']
    console.log(`token:${token}`)
    const req = request.body
    reply.send({success: true, code: '200', msg: 'users', data: {...req, token}})
})


// Run the server!
fastify.listen({port: 3000}, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
```

#### http

```http
### 获取 token
# @name login
# @title login
POST {{host}}/post/login HTTP/1.1
content-type: application/json

{
    "username": "admin",
    "password": "123456"
}

?? status == 200
?? js response.parsedBody.success == true
?? js response.parsedBody.code == 200
###
# @name users
# @title users
# @ref login
POST http://localhost:3000/post/users HTTP/1.1
content-type: application/json
Authorization: Bearer {{login.data}}

{
    "pageNum": {{pageNum}},
    "pageSize": {{pageSize}}
}

?? status == 200
?? js response.parsedBody.success == true
?? js response.parsedBody.code == 200
```

#### cli

```bash
E:\work\code\fastify\fastify-hello>npx httpyac send rest.http -a -e dev

---------------------

=== login ===

POST http://localhost:3000/post/login
accept: */*
accept-encoding: gzip, deflate, br
content-length: 56
content-type: application/json
user-agent: httpyac

{
    "username": "admin",
    "password": "123456"
}
HTTP/1.1 200  - OK
connection: keep-alive
content-length: 58
content-type: application/json; charset=utf-8
date: Sat, 15 Aug 2026 18:38:43 GMT
keep-alive: timeout=72

{
  "success": true,
  "code": "200",
  "msg": "login",
  "data": "token"
}
[x] status == 200
[x] response.parsedBody.success == true
[x] response.parsedBody.code == 200

---------------------

=== users ===

POST http://localhost:3000/post/users
accept: */*
accept-encoding: gzip, deflate, br
authorization: Bearer token
content-length: 43
content-type: application/json
user-agent: httpyac

{
    "pageNum": 1,
    "pageSize": 10
}
HTTP/1.1 200  - OK
connection: keep-alive
content-length: 101
content-type: application/json; charset=utf-8
date: Sat, 15 Aug 2026 18:38:43 GMT
keep-alive: timeout=72

{
  "success": true,
  "code": "200",
  "msg": "users",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "token": "Bearer token"
  }
}
[x] status == 200
[x] response.parsedBody.success == true
[x] response.parsedBody.code == 200

2 requests processed (2 succeeded)

E:\work\code\fastify\fastify-hello>
```

### httpbook

插件地址: https://marketplace.visualstudio.com/items?itemName=anweber.httpbook

支持 .http 文件可视化

### httpYac UI Extended

类似 postman 的界面

