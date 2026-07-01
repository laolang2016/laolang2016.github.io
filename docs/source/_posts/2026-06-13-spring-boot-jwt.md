---
title: spring boot jwt
date: 2026-06-13 12:05:22
categories:
  - java
  - 鉴权
tags:
  - java
  - 鉴权
---

# 参考资料

`jwt` 官网: https://www.jwt.io/


# 一些概念

`jwt` 有两种实现

1. `jws` : `jwt` 的签名实现, 仅防纂改, 不妨读取. 也就是简单编码而不是加密
2. `jwe` : `jwt` 的加密实现, 同事保证机密性与完整性. 也就是内容无法直接解密

# 各类 jwt 库比较

可在如下网址查看可用的 `jwt` 库: https://www.jwt.io/libraries?programming_language=java

各类JWT库(java)的对比: https://www.cnblogs.com/hlkawa/p/13675792.html

各类JWT库(java)的使用与评价: https://andaily.com/blog/?p=956



# 一些教程

## 0.9.1 及之前

保护你的应用：Spring Boot与JWT的黄金组合: https://cloud.tencent.com/developer/article/2526576

## 0.9.1 之后

JJWT 依赖包完全指南-从入门到精通: https://jishuzhan.net/article/1975725497784008706

JWT 认证全面解析：原理、流程与 Spring Boot 实战: https://jishuzhan.net/article/2065595775350042625

Spring Boot 4 整合 JWT 完整教程: https://www.ddkk.com/springboot/4-action/18.html

Spring Boot 3.0 - JWT Authentication with Spring Security using MySQL Database: https://www.geeksforgeeks.org/springboot/spring-boot-3-0-jwt-authentication-with-spring-security-using-mysql-database/

Spring Boot 与 JWT 的概述: https://www.cnblogs.com/java-note/p/18787761
