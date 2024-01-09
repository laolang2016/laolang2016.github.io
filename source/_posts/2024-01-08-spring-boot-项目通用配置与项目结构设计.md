---
title: spring boot 项目通用配置与项目结构设计
date: 2024-01-08 01:22:50
tags:
- java
- spring boot
- ruoyi
- vue

categories:
- J**A CV 实录
- ruoyi
---

spring boot 项目通用配置与项目结构设计
<!--more-->

# 总览

## 说明
- **关于软件安装的过程不再赘述,网上教程有很多**
- **某些代码或配置不做详细的解释,网上教程有很多**
- **开发环境和测试环境都在本地, 暂不考虑云服务器**
- **开发机器为 Ubuntu 22.04 , 不考虑其他系统,之后的字里行间都不会有其他系统如何如何做的解释**
- **些许 BUG 只会简单记录,不做修复,除非是阻碍性的**
- **关于前端不会提及太多,可自行参考源码**
- **很多内容会参考自 [ruoyi-vue-pro](https://gitee.com/zhijiantianya/ruoyi-vue-pro),可自行查看这个项目的源码**


# 有什么
1. 基本的 spring boot 开发
2. 代码规范检查
3. 单元测试报告和测试覆盖率报告
4. jenkins + docker + pipeline 实现 CI/CD
5. SkyWalking 做链路追踪


# 没有什么

1. 不做表单构建
2. 不做代码生成
3. 只考虑 mysql , 不考虑 oracle 等其他数据库
4. 不做线上部署, 只在本地部署一套开发环境和一套测试环境

# maven 聚合项目
## 一个最简单的 bom 使用示例
### commit id
[https://gitcode.com/m0_53402432/thresh/commits/detail/fd5c8348c4eac018f93b4f9e80592802e34f9119?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/fd5c8348c4eac018f93b4f9e80592802e34f9119?ref=main)

### 目录结构
```shell
laolang@laolang-pc:~/csdn/gitcode/thresh$ tree
.
├── LICENSE
├── pom.xml
├── README.md
├── thresh-app
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── laolang
│       │   │           └── thresh
│       │   │               └── ThreshApplication.java
│       │   └── resources
│       └── test
│           └── java
├── thresh-dependencies
│   └── pom.xml
└── thresh.iml

11 directories, 7 files
laolang@laolang-pc:~/csdn/gitcode/thresh$ 
```

### 具体代码分析

参考: [Maven - 全面解析 Maven BOM （Bill of Materials）：打造高效依赖管理与模块化开发](https://developer.aliyun.com/article/1353988)

## 基本的项目结构

### commit id

[https://gitcode.com/m0_53402432/thresh/commits/detail/902bec6531c4108422d853b9231e73bfe73c60f7?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/902bec6531c4108422d853b9231e73bfe73c60f7?ref=main)

### 项目结构说明

- 形如`thresh-M-N-biz`的模块,包含了 dao, service, controller 三层架构,实体类也在这一层,在启动项目中引入模块即可开启相应的功能
- 形如`thresh-M-N-api`的模块,定义了模块之间通信的 API 接口与 dto 类, API 实现类放在对应的 biz 模块,防止循环依赖,也就是解耦
- `M` 指大模块,例如 module 是框架自带的,如果要做电商,就像下面的示例一样添加一个 `thresh-mall`模块
- `N` 大模块中的小模块,如电商中的商品和订单各一个模块
- 将来可考虑添加一键修改包名的功能

```
├── pom.xml
├── thresh-app --- 启动项目
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── laolang
│       │   │           └── thresh
│       │   │               └── ThreshApplication.java --- 启动类
│       │   └── resources -- 各个环境的配置文件
│       │       ├── application-dev.yml
│       │       ├── application-prod.yml
│       │       ├── application-test.yml
│       │       ├── application.yml
│       │       └── logback-spring.xml
├── thresh-dependencies --- 自定义 bom
│   └── pom.xml
├── thresh-framework --- 框架层
│   ├── pom.xml
│   ├── thresh-common --- 框架通用工具类
│   └── thresh-spring-boot-starter-web --- 自定义 starter
├── thresh-mall --- 一个电商模块示例,如果有其他模块,则在同级别目录下添加 , 例如  thresh-cms , thresh-blog 等等
│   ├── pom.xml
│   ├── thresh-mall-order --- 订单模块
│   │   ├── pom.xml
│   │   ├── thresh-mall-order-api
│   │   └── thresh-mall-order-biz
│   └── thresh-mall-product --- 商品模块
│       ├── pom.xml
│       ├── thresh-mall-product-api
│       └── thresh-mall-product-biz
└── thresh-module --- 框架核心模块
    ├── pom.xml
    └── thresh-module-system --- 系统模块
        ├── pom.xml
        ├── thresh-module-system-api
        └── thresh-module-system-biz
```

# 一些规范性的东西

## checkstyle

### commit id
[https://gitcode.com/m0_53402432/thresh/commits/detail/f75942dc76598ea2a85538060b16ab22a317e4c0?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/f75942dc76598ea2a85538060b16ab22a317e4c0?ref=main)

### 参考资料
[最全详解CheckStyle的检查规则](https://blog.csdn.net/rogerjava/article/details/119322285)
[Maven集成CheckStyle](https://juejin.cn/post/6920225089510342664)
[后端必知：遵循Google Java规范并引入checkstyle检查](https://juejin.cn/post/7178683426852044858)


### 使用
参考 [后端必知：遵循Google Java规范并引入checkstyle检查](https://juejin.cn/post/7178683426852044858) ,配置了idea之后,还需要将 `dox/checkstyle/pre-commit`复制到 `.git/hooks`中,并赋予执行权限

### 效果
```shell
laolang@laolang-pc:~/csdn/gitcode/thresh$ git commit -m "✨ feat(thresh): 添加 checkstyle 支持"
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO] 
[INFO] thresh-dependencies                                                [pom]
[INFO] thresh                                                             [pom]
[INFO] thresh-framework                                                   [pom]
[INFO] thresh-common                                                      [jar]
[INFO] thresh-module                                                      [pom]
[INFO] thresh-module-system                                               [pom]
[INFO] thresh-module-system-api                                           [jar]
[INFO] thresh-spring-boot-starter-web                                     [jar]
[INFO] thresh-module-system-biz                                           [jar]
[INFO] thresh-mall                                                        [pom]
[INFO] thresh-mall-product                                                [pom]
[INFO] thresh-mall-product-api                                            [jar]
[INFO] thresh-mall-product-biz                                            [jar]
[INFO] thresh-mall-order                                                  [pom]
[INFO] thresh-mall-order-api                                              [jar]
[INFO] thresh-mall-order-biz                                              [jar]
[INFO] thresh-app                                                         [jar]
[INFO] 
[INFO] ---------------< com.laolang.thresh:thresh-dependencies >---------------
[INFO] Building thresh-dependencies 0.1                                  [1/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-dependencies ---
[WARNING] File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ---------------------< com.laolang.thresh:thresh >----------------------
[INFO] Building thresh 0.1                                               [2/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ----------------< com.laolang.thresh:thresh-framework >-----------------
[INFO] Building thresh-framework 0.1                                     [3/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-framework ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ------------------< com.laolang.thresh:thresh-common >------------------
[INFO] Building thresh-common 0.1                                        [4/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-common ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ------------------< com.laolang.thresh:thresh-module >------------------
[INFO] Building thresh-module 0.1                                        [5/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-module ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] --------------< com.laolang.thresh:thresh-module-system >---------------
[INFO] Building thresh-module-system 0.1                                 [6/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-module-system ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ------------< com.laolang.thresh:thresh-module-system-api >-------------
[INFO] Building thresh-module-system-api 0.1                             [7/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-module-system-api ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ---------< com.laolang.thresh:thresh-spring-boot-starter-web >----------
[INFO] Building thresh-spring-boot-starter-web 0.1                       [8/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-spring-boot-starter-web ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ------------< com.laolang.thresh:thresh-module-system-biz >-------------
[INFO] Building thresh-module-system-biz 0.1                             [9/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-module-system-biz ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] -------------------< com.laolang.thresh:thresh-mall >-------------------
[INFO] Building thresh-mall 0.1                                         [10/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-mall ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ---------------< com.laolang.thresh:thresh-mall-product >---------------
[INFO] Building thresh-mall-product 0.1                                 [11/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-mall-product ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] -------------< com.laolang.thresh:thresh-mall-product-api >-------------
[INFO] Building thresh-mall-product-api 0.1                             [12/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-mall-product-api ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] -------------< com.laolang.thresh:thresh-mall-product-biz >-------------
[INFO] Building thresh-mall-product-biz 0.1                             [13/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-mall-product-biz ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] ----------------< com.laolang.thresh:thresh-mall-order >----------------
[INFO] Building thresh-mall-order 0.1                                   [14/17]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-mall-order ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] --------------< com.laolang.thresh:thresh-mall-order-api >--------------
[INFO] Building thresh-mall-order-api 0.1                               [15/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-mall-order-api ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] --------------< com.laolang.thresh:thresh-mall-order-biz >--------------
[INFO] Building thresh-mall-order-biz 0.1                               [16/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-mall-order-biz ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] 
[INFO] -------------------< com.laolang.thresh:thresh-app >--------------------
[INFO] Building thresh-app 0.1                                          [17/17]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-checkstyle-plugin:3.3.1:check (default-cli) @ thresh-app ---
[INFO] 开始检查……
检查完成。
[INFO] You have 0 Checkstyle violations.
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary for thresh 0.1:
[INFO] 
[INFO] thresh-dependencies ................................ SUCCESS [  0.557 s]
[INFO] thresh ............................................. SUCCESS [  0.399 s]
[INFO] thresh-framework ................................... SUCCESS [  0.040 s]
[INFO] thresh-common ...................................... SUCCESS [  0.035 s]
[INFO] thresh-module ...................................... SUCCESS [  0.041 s]
[INFO] thresh-module-system ............................... SUCCESS [  0.025 s]
[INFO] thresh-module-system-api ........................... SUCCESS [  0.025 s]
[INFO] thresh-spring-boot-starter-web ..................... SUCCESS [  0.025 s]
[INFO] thresh-module-system-biz ........................... SUCCESS [  0.027 s]
[INFO] thresh-mall ........................................ SUCCESS [  0.022 s]
[INFO] thresh-mall-product ................................ SUCCESS [  0.022 s]
[INFO] thresh-mall-product-api ............................ SUCCESS [  0.022 s]
[INFO] thresh-mall-product-biz ............................ SUCCESS [  0.022 s]
[INFO] thresh-mall-order .................................. SUCCESS [  0.021 s]
[INFO] thresh-mall-order-api .............................. SUCCESS [  0.025 s]
[INFO] thresh-mall-order-biz .............................. SUCCESS [  0.027 s]
[INFO] thresh-app ......................................... SUCCESS [  0.031 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.744 s
[INFO] Finished at: 2024-01-08T21:23:43+08:00
[INFO] ------------------------------------------------------------------------
[main f75942d] ✨ feat(thresh): 添加 checkstyle 支持
 1 file changed, 2 insertions(+), 1 deletion(-)
laolang@laolang-pc:~/csdn/gitcode/thresh$ 
```


## 接口文档

最终选择为 [Apipost](https://www.apipost.cn/)

接口共享文档地址:[https://console-docs.apipost.cn/preview/4ff9f4523cb68a96/994111d7d1848d59](https://console-docs.apipost.cn/preview/4ff9f4523cb68a96/994111d7d1848d59)

# 关于测试

测试分三种:
1. 开发过程中的测试
2. python 自动化测试
3. 单元测试

开发过程中的测试主要使用 `Apipost`工具,不会做很复杂的测试
本项目主要侧重第二种,使用 `pytest`,并不会使用测试驱动开发. python 测试项目在 `thresh-test` 中,目前还没有
关于单元测试,精力足够的话,才会写一点

## 参考资料
[Java测试驱动开发](https://item.jd.com/10061474971374.html)
[PowerMock实战手册](https://gitee.com/nateshao/powermock/tree/master)

# 关于 DEVOPS

## 需要做什么
1. 添加 `ui/admin` 后台管理模块
2. 添加 `ui/mall` 商城 pc 端模块
3. 添加 mybatis plus 支持
4. skywalking 链路追踪
5. ELK 日志查看

## 本地环境如何搭建
本地开发环境不需要部署应用程序主要部署一些中间件.进入`dox/docker_local`,执行`docker-compose up -d`即可.
> **注意: 启动之前需要修改对应的配置文件位置,以及检查 docker 网络是否可用**

## skywalking 搭建

### commit id

[https://gitcode.com/m0_53402432/thresh/commits/detail/ee80798823f0f4cc049849b1704b90a44726edf0?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/ee80798823f0f4cc049849b1704b90a44726edf0?ref=main)

### 参考
[springboot-接入skywalking和elk日志收集](https://juejin.cn/post/7067389889028816926)

### 要点
`dox/docker_local/docker-compose.yml`为本地开发环境的 docker-compose 配置文件,主要注意以下几点
1. 必须指定 `TZ: Asia/Shanghai`
2. ui 在添加 `SW_OAP_ADDRESS` 的时候,必须带上 `http://`
3. 如果 ui 一直看不到数据,可以参考: [（低级错误）Skywalking页面没有数据的问题](https://blog.csdn.net/lyhellogod/article/details/120186117)
4. skywalking 8.9.0 agent 下载地址为: [https://archive.apache.org/dist/skywalking/java-agent/8.9.0/apache-skywalking-java-agent-8.9.0.tgz](https://archive.apache.org/dist/skywalking/java-agent/8.9.0/apache-skywalking-java-agent-8.9.0.tgz)
5. idea 启动参数如下(注意替换为自己的实际地址):
```
-javaagent:/home/laolang/program/docker/thresh-dev/skywalking-agent-8.9.0/skywalking-agent.jar
-DSW_AGENT_NAME=thresh-dev
-DSW_AGENT_COLLECTOR_BACKEND_SERVICES=172.23.0.2:11800
```

## skywalking 结合 elk

### commit id

[https://gitcode.com/m0_53402432/thresh/commits/detail/13e447868bb5c35de1f527b884d2a6c63d2f575a?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/13e447868bb5c35de1f527b884d2a6c63d2f575a?ref=main)

### 参考
[springboot-接入skywalking和elk日志收集](https://juejin.cn/post/7067389889028816926)
[如何在kibana上查看ES的数据](https://blog.csdn.net/liuming690452074/article/details/120106397)

### elk + skywalking 测试

#### 请求接口
先启动容器后,再启动服务,然后请求:[http://localhost:8092/mall/order/platform/info](http://localhost:8092/mall/order/platform/info),输出如下(可以多请求几次,每次间隔两三秒钟)
```json
{
	"code": "200",
	"success": true,
	"msg": "操作成功",
	"body": {
		"id": "1",
		"productId": "1001",
		"productTitle": "安卓手机"
	},
	"extra": null,
	"tid": "e8c0fe81e2b94576b14fbe6b8ed67290.64.17047536049460001"
}
```

#### 查看es是否有数据
查询 es, 看看是否生成了数据: [http://172.23.0.4:9200/_cat/indices?v](http://172.23.0.4:9200/_cat/indices?v)

![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/001.png)

#### 查看 skywalking 是否有数据
然后使用 traceId 去 skywalking 查询,是否有数据

![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/002.png)

#### kibana 查看数据
上面的都没问题之后,再使用 kibana 查看数据,流程如下

**进入主页,点击可视化和分析**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/003.png)
**进入管理**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/004.png)
**进入索引模式**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/005.png)
**创建索引模式**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/006.png)
**输入索引模式名称**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/007.png)
**选择时间字段**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/008.png)
**配置字段映射**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/009.png)
**再次进入可视化和分析**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/003.png)
**点击 Discover**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/010.png)
**选择索引**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/011.png)
**输入查询语句**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/012.png)
**查看查询结果是否正确**
![](/images/2024-01-08-spring-boot-项目通用配置与项目结构设计/013.png)

## mybatis plus 整合

### commit id
[https://gitcode.com/m0_53402432/thresh/commits/detail/cb620fa9b6d3b06fe4f7b163f12be5983333f29c?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/cb620fa9b6d3b06fe4f7b163f12be5983333f29c?ref=main)

### 说明
可以打印sql,例如
```
2024-01-09 09:47:18.128 [http-nio-8092-exec-3] INFO  c.l.t.f.m.interceptor.MybatisPrintSqlInterceptor [TID:8640a290586f4071a2cf186e9887ebc6.68.17047648381250001] - map-id: com.laolang.thresh.module.system.user.mapper.SysDictTypeMapper.selectById
2024-01-09 09:47:18.128 [http-nio-8092-exec-3] INFO  c.l.t.f.m.interceptor.MybatisPrintSqlInterceptor [TID:8640a290586f4071a2cf186e9887ebc6.68.17047648381250001] - [ SELECT id,name,type,group_code,status,deleted,create_by,create_time,update_by,update_time,remark,version FROM sys_dict_type WHERE id=1 AND deleted=0; ] [ 2 ] ms 
2024-01-09 09:47:18.128 [http-nio-8092-exec-3] INFO  c.l.t.f.m.interceptor.MybatisPrintSqlInterceptor [TID:8640a290586f4071a2cf186e9887ebc6.68.17047648381250001] - Total: 1
```

## ui 项目

### 说明
ui项目全部放在 `ui`目录下,目前有如下几个
`ui/admin` : 后台管理模块, 之后发布 release 版本 `ui` 目录下只有这一个前端项目
`ui/mall` : 商城 pc 端
`ui/seller` : 商家后端

一切前端的内容不再提及,只做展示以及说明 commit id

### commit id

- admin: [https://gitcode.com/m0_53402432/thresh/commits/detail/73701f8faac984a842beaf12a880ea60601f38a7?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/73701f8faac984a842beaf12a880ea60601f38a7?ref=main)
- seller: [https://gitcode.com/m0_53402432/thresh/commits/detail/411b9e88e3ce975b1a1d53873873f9f6f9aa186e?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/411b9e88e3ce975b1a1d53873873f9f6f9aa186e?ref=main)
- portal: [https://gitcode.com/m0_53402432/thresh/commits/detail/1e93d14faf5da1228a5a7a3a59c7029d4c7c02d3?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/1e93d14faf5da1228a5a7a3a59c7029d4c7c02d3?ref=main)

## 如何部署

### commit id

[https://gitcode.com/m0_53402432/thresh/commits/detail/317e2b74488ee3ae5294bd07d7fec10259468c42?ref=main](https://gitcode.com/m0_53402432/thresh/commits/detail/317e2b74488ee3ae5294bd07d7fec10259468c42?ref=main)

### 安装 python 环境
在根目录执行 `virtualenv .venv` 创建 `python` 虚拟环境,或者可以换成其他目录,然后执行 `source .venv/bin/active`进入虚拟环境,并执行 `pip3 install -r requirements.txt`安装依赖

## 本地环境部署

### 修改 hosts
复制 `dox/docker_local/hosts`中的内容到 `/etc/hosts`中

### 本地环境配置
进入 'dox/docker_local' 目录,执行 `python3 startup_thresh_docker_dev.py`
```shell
(.venv) laolang@laolang-pc:~/csdn/gitcode/thresh/dox/docker_local$ python3 startup_thresh_docker_dev.py 
开始设置本地开发环境
step 01: 检查端口号...
端口号:【12101】可用
端口号:【12102】可用
端口号:【12103】可用
端口号:【12104】可用
端口号:【12105】可用
端口号:【12106】可用
端口号:【12107】可用
端口号:【12108】可用
端口号:【12109】可用
端口号:【12110】可用
端口号:【12111】可用
端口号:【12112】可用
端口号:【12113】可用
=======> 检查端口号结束



step 02: 检查跟目录...
docker 跟目录:/home/laolang/program/docker/thresh-dev



step 03:复制配置文件...
复制 es 配置文件
复制 kibana 配置文件
复制 logstash 配置文件
复制 mysql 配置文件
复制 nginx 配置文件
删除 .keep 文件
复制并解压 skywalking agent
设置相关目录权限



step 04:检查网关是否可用
网关前缀:【172.23】



step 05:根据提示操作
在 dox/docker_local 目录下执行一下命令
docker-compose --env-file=docker.env up -d
docker exec -i thresh-dev-mysql mysql -uroot -proot -e "create database thresh character set utf8mb4 collate utf8mb4_general_ci;"
docker exec -i thresh-dev-mysql mysql -uroot -proot thresh < thresh.sql



本地开发环境设置完毕!!!
(.venv) laolang@laolang-pc:~/csdn/gitcode/thresh/dox/docker_local$ 
```

### 启动服务
```shell
(.venv) laolang@laolang-pc:~/csdn/gitcode/thresh/dox/docker_local$ docker-compose --env-file=docker.env up -d
[+] Running 8/8
 ✔ Network docker_local_thresh-dev      Created                                                                                                             0.1s 
 ✔ Container thresh-dev-mysql           Started                                                                                                             1.0s 
 ✔ Container thresh-dev-skywalking-oap  Started                                                                                                             0.8s 
 ✔ Container thresh-test-nginx          Started                                                                                                             1.0s 
 ✔ Container thresh-dev-elasticsearch   Started                                                                                                             1.1s 
 ✔ Container thresh-dev-skywalking-ui   Started                                                                                                             1.1s 
 ✔ Container thresh-dev-kibana          Started                                                                                                             1.5s 
 ✔ Container thresh-dev-logstash        Started                                                                                                             1.4s 
(.venv) laolang@laolang-pc:~/csdn/gitcode/thresh/dox/docker_local$ 
```

然后依次访问数据库、es、kibana,查看服务是否正常启动

#### 创建数据库并导入数据
```shell
# 创建数据库,此命令稍等几秒再执行
(.venv) laolang@laolang-pc:~/csdn/gitcode/thresh/dox/docker_local$ docker exec -i thresh-dev-mysql mysql -uroot -proot -e "create database thresh character set utf8mb4 collate utf8mb4_general_ci;"
mysql: [Warning] Using a password on the command line interface can be insecure.
# 导入数据,此命令稍等几秒再执行
(.venv) laolang@laolang-pc:~/csdn/gitcode/thresh/dox/docker_local$ docker exec -i thresh-dev-mysql mysql -uroot -proot thresh < thresh.sql
mysql: [Warning] Using a password on the command line interface can be insecure.
(.venv) laolang@laolang-pc:~/csdn/gitcode/thresh/dox/docker_local$ 
```

### 在 idea 中启动项目
> 需要添加以下启动参数,根据自己的目录替换
```shell
-javaagent:/home/laolang/program/docker/thresh-dev/skywalking-agent/skywalking-agent.jar
-DSW_AGENT_NAME=thresh-dev
-DSW_AGENT_COLLECTOR_BACKEND_SERVICES=172.23.0.2:11800
```

请求接口
```shell
curl --request GET --url http://api.thresh-dev.com/system/dict/detail
```

根据返回的 tid 在 skywalking 和 kibana 中查询,如果一切正常,那么和前文提到的应该一样可以查到


## 测试环境部署

### 修改 hosts

复制 `dox/docker_test/hosts` 中的内容到 `/etc/hosts` 中

### 本地环境配置
在 `dox/docker_test` 中执行 `python3 startup_thresh_docker_test.py`

### jenkins 部署
> 具体可项目根目录 `Jenkinsfile`

### 部署之后如何测试

1. 测试环境部署了如下几个服务,查看每个服务的日志，看看是否正常启动
```
thresh-test-nginx
thresh-test-app-02
thresh-test-app-01
thresh-test-skywalking-ui
thresh-test-kibana
thresh-test-logstash
thresh-test-elasticsearch
thresh-test-mysql
thresh-test-ui-admin
thresh-test-ui-seller
thresh-test-ui-portal
thresh-test-skywalking-oap
```

2. 测试环境的应用部署了两个,可以分别打开两个应用的日志,请求 `http://api.thresh-test.com/check/pipeline` 接口,看看两个应用的日志是否交替刷新
3. 每次部署测试环境都会重新创建数据库,可根据需要调整
4. 前端项目目前之后 portal 可用,其他两个测试能否通过域名访问成功即可
[http://admin.thresh-test.com/](http://admin.thresh-test.com/) : 平台端
[http://seller.thresh-test.com/](http://seller.thresh-test.com/) : 商家端
[http://www.thresh-test.com/](http://www.thresh-test.com/) : pc 端











