---
title: spring security 笔记
date: 2026-07-03 18:51:43
categories:
  - java
  - 鉴权
tags:
  - java
  - 鉴权
---


# 参考资料

## 官方资料
Spring Security 中文文档 : https://springdoc.cn/spring-security/

## 博文
baeldung Spring Security 教程 : https://www.baeldung-cn.com/security-spring


[https://chencoding.top/rearend/spring/SpringSecurity+Oauth2.html](https://chencoding.top/rearend/spring/SpringSecurity+Oauth2.html)

[双Token机制（Access Token + Refresh Token）安全高效](https://juejin.cn/post/7476388533738504192)

Spring Security 保姆级教程！40000字！: https://blog.csdn.net/qq_17231297/article/details/129173532

万字长文：深入浅出RBAC权限设计 : https://www.woshipm.com/pd/5576757.html

## security 视频教程

[SpringSecurity框架教程-Spring Security+JWT实现项目级前端分离认证授权-挑战黑马&尚硅谷](https://www.bilibili.com/video/BV1mm4y1X7Hc)

[SpringSecurity安全框架详解-权限管理、 核心流程源码解析、SpringBoot整合等-Spring Security](https://www.bilibili.com/video/BV1S64y1i7QA)

[SpringSecurity精讲视频，SpringSecurity视频教程，SpringSecurity入门到精通](https://www.bilibili.com/video/BV1RSwXeTE5w)


# security hello world

## 准备一个接口

```java
package com.laolang.devstudio.module.system.controller;

import com.laolang.devstudio.module.system.domain.res.SysDictTypeGroupInfoRes;
import com.laolang.devstudio.module.system.facade.SysDictFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.extensions.Extension;
import io.swagger.v3.oas.annotations.extensions.ExtensionProperty;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "系统字典管理")
@RequiredArgsConstructor
@Slf4j
@RequestMapping("sys/dict")
@RestController
public class SysDictController {

    final SysDictFacade sysDictFacade;

    /**
     * 字典分组信息
     */
    @Operation(summary = "字典分组信息",
            extensions = {
                    @Extension(properties = { @ExtensionProperty(name = "x-apifox-folder", value = "system/字典管理") }) })
    @GetMapping("type/groupInfo")
    public List<SysDictTypeGroupInfoRes> typeGroupInfo() {
        return sysDictFacade.typeGroupInfo();
    }

}
```

## 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

此时访问该接口会先跳到一个登录页

![](/images/2026-07-03-spring-security-笔记/001.png)

用户名: user

密码: 可在控制台看到

![](/images/2026-07-03-spring-security-笔记/002.png)

## 配置一个自定义的用户名和密码

```yml
spring:
  security:
    user:
      name: superAdmin
      password: 123456
```

## 配置密码加密方式

### 明文

> 此时账密并无变化

```java
package com.laolang.devstudio.framework.auth.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

}
```


### 密文


