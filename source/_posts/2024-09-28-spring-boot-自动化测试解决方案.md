---
title: spring boot 自动化测试解决方案
date: 2024-09-28 20:39:26
categories:
- 测试
- 解决方案
tags:
- 测试
- 解决方案
---

# 设计概要

1. 声明式 `http` 请求
2. 测试报告支持
3. 流程控制支持,类似 `flowable`
4. `groovy dsl` 脚本化

# 参考资料

## httpclient

### okhttp

**官方文档**
[https://square.github.io/okhttp/](https://square.github.io/okhttp/)

**胡飞洋的Android进阶**
[网络请求框架OkHttp3全解系列（一）：OkHttp的基本使用](https://cloud.tencent.com/developer/article/1667338)
[网络请求框架OkHttp3全解系列 - （二）OkHttp的工作流程分析](https://cloud.tencent.com/developer/article/1667339)
[网络请求框架OkHttp3全解系列 - （三）拦截器详解1：重试重定向、桥、缓存（重点）](https://cloud.tencent.com/developer/article/1667342)
[你想要的系列：网络请求框架OkHttp3全解系列 - （四）拦截器详解2：连接、请求服务（重点）](https://cloud.tencent.com/developer/article/1667344)


[基本使用——OkHttp3详细使用教程](https://www.cnblogs.com/it-tsz/p/11748674.html)

[OkHttp 使用教程](https://www.baeldung-cn.com/guide-to-okhttp)

**OkHttp官方文档 翻译**
[OKHttp 官方文档【一】](https://www.cnblogs.com/xiaxveliang/p/13406804.html)
[OKHttp 官方文档【二】](https://www.cnblogs.com/xiaxveliang/p/13414320.html)

[OkHttp 官方中文文档](https://blog.csdn.net/jackingzheng/article/details/51778793)

[OkHttp 官方中文文档](https://zthinker.com/archives/okhttp%E5%AE%98%E6%96%B9%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3)

### Spring RestTemplate

[spring 中文文档 · REST 客户端](https://docs.springjava.cn/spring-framework/reference/integration/rest-clients.html)
[spring 中文网 · 1.2. RestTemplate](https://springdoc.cn/spring/integration.html#rest-resttemplate)

### Spring WebClient

### feign
[Spring Cloud OpenFeign 中文文档](https://springdoc.cn/spring-cloud-openfeign/)

**阿好程序 springbot 专栏**
[如何在Spring Boot中使用OpenFeign，这一篇足够了。](https://blog.csdn.net/qq_28754027/article/details/129924437)
[OpenFeign修改默认通讯协议Https](https://blog.csdn.net/qq_28754027/article/details/129927529)
[OpenFeign默认通讯方式修改成OkHttp，包含FeignConfigruation自定义、OkHttp客户端自定义详细配置介绍](https://blog.csdn.net/qq_28754027/article/details/129927746)

## liteflow
[https://gitee.com/dromara/liteFlow](https://gitee.com/dromara/liteFlow)

## 接口与自动化测试解决方案

[eolinker](http://blog.eolinker.com/)
[MeterSphere ](https://www.fit2cloud.com/metersphere/index.html)

## jmeter
[java使用jmeter生成jmx文件并运行](https://www.cnblogs.com/liufei96/p/13799669.html)

## postman
[Postman 中文文档](https://postman.xiniushu.com/)
[postman 各个版本下载](https://www.postman.com/release-notes/postman-app/)
[postman windows 版本下载](https://www.filehorse.com/download-postman/old-versions/)
[postman 9.31.0 下载地址](https://www.filehorse.com/download-postman/75425/download/)

[postman archive / postman old versions / postman 历史版本下载](https://blog.csdn.net/iTarget/article/details/132841694)

```
Installing earlier versions of Postman:

    Downloading Postman v9:

        Download Postman v9 for Windows 64-bit: https://go.pstmn.io/dl-win64-v9-latest

        Download Postman v9 for Linux 64-bit: https://go.pstmn.io/dl-linux64-v9-latest

        Download Postman v9 for macOS (Intel chip) 64-bit: https://go.pstmn.io/dl-osx64-v9-latest

        Download Postman v9 for macOS (Apple silicon) 64-bit: https://go.pstmn.io/dl-osxarm64-v9-latest

    Downloading Postman v8:

        Download Postman v8 for Windows 64-bit: https://go.pstmn.io/dl-win64-v8-latest

        Download Postman v8 for Windows 32-bit: https://go.pstmn.io/dl-win32-v8-latest

        Download Postman v8 for Linux 64-bit: https://go.pstmn.io/dl-linux64-v8-latest

        Download Postman v8 for macOS 64-bit: https://go.pstmn.io/dl-macos64-v8-latest

    Downloading Postman v7:

        Download Postman v7 for Windows 64-bit: https://go.pstmn.io/dl-win64-v7-latest

        Download Postman v7 for Windows 32-bit: https://go.pstmn.io/dl-win32-v7-latest

        Download Postman v7 for Linux 64-bit: https://go.pstmn.io/dl-linux64-v7-latest

        Download Postman v7 for macOS 64-bit: https://go.pstmn.io/dl-macos64-v7-latest

     Downloading Postman v6:

        Download Postman v6 for Windows 64-bit: https://go.pstmn.io/dl-win64-v6-latest

        Download Postman v6 for Windows 32-bit: https://go.pstmn.io/dl-win32-v6-latest

        Download Postman v6 for Linux 64-bit: https://go.pstmn.io/dl-linux64-v6-latest

        Download Postman v6 for macOS 64-bit: https://go.pstmn.io/dl-macos64-v6-latest
```

## junit

[Junit5 入门系列](https://blog.csdn.net/ryo1060732496/category_9276134.html)
[Java单元测试之JUnit 5快速上手](https://www.cnblogs.com/one12138/p/11536492.html)
[《单元测试》Junit5入门教程——非常详细，入门即精通](https://blog.csdn.net/qq_15283475/article/details/127328418)
[单元测试-Junit5结合Allure2生成漂亮的测试报告，老板都夸你厉害](https://blog.csdn.net/qq_15283475/article/details/127347968)
[使用JUnit5，Mockito，Hamcrest进行单元测试](https://zhuanlan.zhihu.com/p/402270321)
[Allure + JUnit5](https://www.cnblogs.com/juno3550/p/15427113.html)