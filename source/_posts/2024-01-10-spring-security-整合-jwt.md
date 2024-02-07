---
title: spring security 整合 jwt
date: 2024-01-10 10:58:01
tags:
- java
- spring boot
- ruoyi
- vue

categories:
- J**A CV 实录
- ruoyi
---

spring security 整合 jwt
<!--more-->

# jwt 的基本使用
## 参考资料
[JWT最详细教程以及整合SpringBoot的使用（简洁易上手）](https://blog.csdn.net/weixin_46195957/article/details/115326648)
[各类JWT库(java)的对比](https://www.cnblogs.com/hlkawa/p/13675792.html)
[认证授权服务实战](https://juejin.cn/column/7163561631698894884)
jwt 官网: [https://jwt.io/](https://jwt.io/)

## 简单使用 spring boot + jwt
> 使用 interceptor 简单的实现了登录以及校验 token
### commit id
[https://gitcode.com/m0_53402432/thresh-reference/commits/detail/65dd94cf1d4de409ecbb643d90b57dc202c89ce7?ref=main](https://gitcode.com/m0_53402432/thresh-reference/commits/detail/65dd94cf1d4de409ecbb643d90b57dc202c89ce7?ref=main)

## 关于 secret、token 的续签、与防止令牌盗用

### 参考
[JWT常见面试总结](https://juejin.cn/post/7180235203753803833)
[springboot中如何获取真实ip地址](https://blog.csdn.net/m0_67390963/article/details/124777396)
[springboot~容器化环境获取真实IP地址](https://www.cnblogs.com/lori/p/15827010.html)
[springboot获取请求ip、系统、浏览器等信息](https://www.cnblogs.com/wscw/p/14304133.html)
### commit id
[https://gitcode.com/m0_53402432/thresh-reference/commits/detail/6a48ae57bbb8bd4e6e8c6710493cfbe6ebb71c4a?ref=main](https://gitcode.com/m0_53402432/thresh-reference/commits/detail/6a48ae57bbb8bd4e6e8c6710493cfbe6ebb71c4a?ref=main)

1. jwt 的生成与校验
2. secret 与用户属性相关
3. 可注销
4. token 保存在 redis 中
5. 每次访问都会刷新 token
6. 简单实现登录日志
7. 并没有处理密码的匹配,只匹配了用户名

关于防止令牌盗用,暂时没有写那么复杂,只是简单对比了请求头与 redis 中的 uuid

### 测试
> 将如下代码保存到一个 html 文件,打开后依次点击界面上的几个按钮即可
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

  </head>
  <body>
  <button id='login'>login</button>
  <br /><br /><br />
  <button id='dict'>dict detail</button>
  <br /><br /><br />
  <button id='logout'>logout</button>

   <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
   <script>
	$(()=>{
		let uuid = undefined
		let token = undefined

		$('#login').on('click',()=>{
			$.ajax({
				url: 'http://localhost:8092/auth/login',
				method: 'POST',
				headers:{'Content-Type':'application/json;charset=utf8'},
				dataType: "json",
				data:JSON.stringify({
					"username": "superAdmin",
					"password": "123456"
				}),
				success: (res)=>{
					console.log(res)
					uuid = res.body.uuid
					token = res.body.token
				},
				error: (err) => {
					console.log(err)
				}
			})
		})

		$('#dict').on('click',()=>{
			$.ajax({
				url: 'http://localhost:8092/system/dict/detail',
				method: 'GET',
				headers:{
					'Content-Type':'application/json;charset=utf8',
					'uuid':uuid,
					'Authorization': 'Bearer ' + token,
				},
				dataType: "json",
				success: (res)=>{
					console.log(res)
				},
				error: (err) => {
					console.log(err)
				}
			})
		})

		$('#logout').on('click',()=>{
			$.ajax({
				url: 'http://localhost:8092/auth/logout',
				method: 'GET',
				headers:{
					'Content-Type':'application/json;charset=utf8',
					'uuid':uuid,
					'Authorization': 'Bearer ' + token,
				},
				dataType: "json",
				success: (res)=>{
					console.log(res)
				},
				error: (err) => {
					console.log(err)
				}
			})
		})
	})
   </script>
  </body>
</html>
```

# 关于 RBAC 权限管理模型与 Spring Security 的参考资料
[RBAC权限管理模型：基本模型及角色模型解析及举例](https://www.woshipm.com/pd/440765.html)
[RBAC权限模型——理论篇](https://www.woshipm.com/share/5944487.html)
[万字长文：深入浅出RBAC权限设计](https://www.woshipm.com/pd/5576757.html)

[Spring Security 中文文档](https://springdoc.cn/spring-security/)

# security 整合 jwt 实现 RBAC0
## commit id
[https://gitcode.com/m0_53402432/thresh-reference/commits/detail/00de576c1e4f6a6791d49cba168aefe74b170cc4?ref=main](https://gitcode.com/m0_53402432/thresh-reference/commits/detail/00de576c1e4f6a6791d49cba168aefe74b170cc4?ref=main)
## api 测试
具体可参考 `security-rbac0/dox/test.http` 文件, 使用不同用户登录,测试不同的 api 即可
```
@hostname = localhost
@port = 8092
@contentType = application/json

### 登录
# @name login
POST http://{{hostname}}:{{port}}/auth/login HTTP/1.1
Content-Type: {{contentType}}

{
    // "username":"superAdmin",
    "username":"eolinkerAdmin",
    // "username":"mallAdmin",
    "password": "12345678"
}

### 保存 token

@token=Bearer {{login.response.body.$.body.token}}
@uuid={{login.response.body.$.body.uuid}}


### 登录即可访问
GET http://{{hostname}}:{{port}}/system/dict/detail HTTP/1.1
Authorization: {{token}}
uuid: {{uuid}}
Content-Type: {{contentType}}

### 超级管理员
GET http://{{hostname}}:{{port}}/system/menu/list HTTP/1.1
Authorization: {{token}}
uuid: {{uuid}}
Content-Type: {{contentType}}

### eolinkerAdmin 角色
GET http://{{hostname}}:{{port}}/eolinker/apiProject/list HTTP/1.1
Authorization: {{token}}
uuid: {{uuid}}
Content-Type: {{contentType}}

### mallAdmin 角色
GET http://{{hostname}}:{{port}}/mall/product/list HTTP/1.1
Authorization: {{token}}
uuid: {{uuid}}
Content-Type: {{contentType}}
```

## 数据解释
数据库脚本在 `security-rbac0/dox/thresh_reference.sql`,详细的数据内容可自行查看数据库脚本
共有三个用户:
`superAdmin` : 超级管理员, 拥有所有角色,和权限字符串 `*:*:*`
`eolinkerAdmin` : eolinker 模块管理员,目前只有一个 `eolinker:apiProject:list` 权限
`mallAdmin` : mall 模块管理员, 目前只有一个 `mall:product:list`

## 效果
`superAdmin` 可访问所有资源
`eolinkerAdmin` 可访问 `/system/dict/detail` 与 `/eolinker/apiProject/list`
`mallAdmin` 可访问 `/system/dict/detail` 与 `/mall/product/list`


# 关于若依的鉴权与数据权限过滤分析

## 参考资料

[若依源码解析：RuoYi-Vue登录和鉴权的实现](https://blog.csdn.net/qq_27575627/article/details/130670211)
[深入分析若依数据权限@datascope （注解+AOP+动态sql拼接） 【循序渐进，附分析过程】](https://blog.csdn.net/m0_52134610/article/details/124122393)
[Mybatis-Plus通过注解形式实现数据权限过滤](https://blog.csdn.net/u011584350/article/details/118968300)
[从零搭建开发脚手架 基于Mybatis-Plus的数据权限实现](https://laker.blog.csdn.net/article/details/115481149)
