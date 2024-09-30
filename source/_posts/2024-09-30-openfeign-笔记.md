---
title: openfeign 笔记
date: 2024-09-30 06:44:18
categories:
- java
- cloud
tags:
- java
- cloud
---

# 参考资料

[Spring Cloud OpenFeign 中文文档](https://springdoc.cn/spring-cloud-openfeign/)

**阿好程序 springbot 专栏**
[如何在Spring Boot中使用OpenFeign，这一篇足够了。](https://blog.csdn.net/qq_28754027/article/details/129924437)
[OpenFeign修改默认通讯协议Https](https://blog.csdn.net/qq_28754027/article/details/129927529)
[OpenFeign默认通讯方式修改成OkHttp，包含FeignConfigruation自定义、OkHttp客户端自定义详细配置介绍](https://blog.csdn.net/qq_28754027/article/details/129927746)

# 基本使用

## 接口准备

### controller
```java
package com.laolang.jx.module.system.dict.controller;

import com.laolang.jx.framework.common.domain.R;
import com.laolang.jx.module.system.dict.logic.SysDictLogic;
import com.laolang.jx.module.system.dict.req.SysDictTypeListReq;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("admin/system/dict")
@RestController
public class SydDictController {

    private final SysDictLogic sysDictLogic;

    @GetMapping("getMethod")
    public R<SysDictTypeListRsp> getMethod() {
        return R.ok(sysDictLogic.getMethod());
    }

    @GetMapping("getMethodWithParam")
    public R<SysDictTypeListRsp> getMethodWithParam(@RequestParam(value = "id") Long id,
                                                    @RequestParam(value = "name", defaultValue = "laolang") String name) {
        return R.ok(sysDictLogic.getMethodWithParam(id, name));
    }

    @PostMapping("postMethod")
    public R<SysDictTypeListRsp> postMethod() {
        return R.ok(sysDictLogic.postMethod());
    }

    @PostMapping("postMethodWithFormData")
    public R<SysDictTypeListRsp> postMethodWithFormData(SysDictTypeListReq req) {
        return R.ok(sysDictLogic.postMethodWithFormData(req));
    }

    @PostMapping("postMethodWithRequestBody")
    public R<SysDictTypeListRsp> postMethodWithRequestBody(@RequestBody SysDictTypeListReq req) {
        return R.ok(sysDictLogic.postMethodWithRequestBody(req));
    }
}
```

### logic
```java
package com.laolang.jx.module.system.dict.logic;

import com.laolang.jx.framework.common.util.JsonUtil;
import com.laolang.jx.module.system.dict.req.SysDictTypeListReq;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class SysDictLogic {

    public SysDictTypeListRsp getMethod() {
        log.info("getMethod");
        return buildRsp();
    }

    public SysDictTypeListRsp getMethodWithParam(Long id, String name) {
        log.info("getMethodWithParam");
        log.info("id:{}, name:{}", id, name);
        return buildRsp();
    }

    public SysDictTypeListRsp postMethod() {
        log.info("postMethod");
        return buildRsp();
    }

    public SysDictTypeListRsp postMethodWithFormData(SysDictTypeListReq req) {
        log.info("postMethodWithFormData. req:{}", JsonUtil.toJson(req));
        return buildRsp();
    }

    public SysDictTypeListRsp postMethodWithRequestBody(SysDictTypeListReq req) {
        log.info("postMethodWithRequestBody. req:{}", JsonUtil.toJson(req));
        return buildRsp();
    }

    private SysDictTypeListRsp buildRsp() {
        SysDictTypeListRsp rsp = new SysDictTypeListRsp();
        rsp.setId(1L);
        rsp.setName("性别");
        rsp.setType("gender");
        rsp.setTypeDesc("性别");
        rsp.setGroupCode("system");
        return rsp;
    }
}
```

## 基本使用

### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.laolang.jx</groupId>
    <artifactId>openfeign-study</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <maven-resources-plugin.version>2.7</maven-resources-plugin.version>
        <maven-compiler-plugin.version>3.11.0</maven-compiler-plugin.version>

        <springboot.version>2.7.18</springboot.version>
        <spring-cloud.version>2021.0.7</spring-cloud.version>

        <tlog.version>1.5.0</tlog.version>

        <!-- tool -->
        <hutool.version>5.8.11</hutool.version>
        <vavr.version>0.10.4</vavr.version>
        <mapstruct.version>1.4.2.Final</mapstruct.version>
        <guava.version>23.0</guava.version>

        <!-- test -->
        <testng.version>6.14.3</testng.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${springboot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!-- spring cloud 依赖 -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- web 相关 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-json</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <!-- 远程服务调用 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>


        <!-- log4j2 日志 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-log4j2</artifactId>
        </dependency>

        <!-- tool -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>

        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>${hutool.version}</version>
        </dependency>
        <dependency>
            <groupId>io.vavr</groupId>
            <artifactId>vavr</artifactId>
            <version>${vavr.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-jdk8</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava</artifactId>
            <version>${guava.version}</version>
        </dependency>

        <!-- 测试相关 -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>${testng.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <build>
        <finalName>${project.artifactId}</finalName>
        <resources>
            <resource>
                <directory>src/main/resources/</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>${maven-resources-plugin.version}</version>
                <configuration>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <source>${maven.compiler.source}</source>
                    <target>${maven.compiler.target}</target>
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${springboot.version}</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <repositories>
        <repository>
            <id>public</id>
            <name>aliyun nexus</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
        </repository>
    </repositories>

    <pluginRepositories>
        <pluginRepository>
            <id>public</id>
            <name>aliyun nexus</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>

</project>
```

### 启动类
```java
package com.laolang.jx;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@Slf4j
@EnableFeignClients(basePackages = {"com.laolang.jx.remote"})
@SpringBootApplication
public class OpenfeignStudyApplication {
    public static void main(String[] args) {
        SpringApplication.run(OpenfeignStudyApplication.class, args);
        log.info("OpenfeignStudyApplication is running...");
    }
}
``` 

### feign 接口
```java
package com.laolang.jx.remote;

import com.laolang.jx.common.domain.R;
import com.laolang.jx.req.SysDictTypeListReq;
import com.laolang.jx.rsp.SysDictTypeListRsp;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient( name = "sysDict", url = "http://localhost:8092/admin/system/dict")
public interface SysDictRemote {

    @GetMapping("getMethod")
    R<SysDictTypeListRsp> getMethod();

    @GetMapping("getMethodWithParam")
    R<SysDictTypeListRsp> getMethodWithParam(@RequestParam(value = "id") Long id,
                                             @RequestParam(value = "name", defaultValue = "laolang") String name);

    @PostMapping("postMethod")
    R<SysDictTypeListRsp> postMethod();

    @PostMapping("postMethodWithFormData")
    R<SysDictTypeListRsp> postMethodWithFormData(SysDictTypeListReq req);

    @PostMapping("postMethodWithRequestBody")
    R<SysDictTypeListRsp> postMethodWithRequestBody(@RequestBody SysDictTypeListReq req);
}
```

### 测试
```java
package com.laolang.jx;

import cn.hutool.json.JSONUtil;
import com.laolang.jx.common.domain.R;
import com.laolang.jx.remote.SysDictRemote;
import com.laolang.jx.req.SysDictTypeListReq;
import com.laolang.jx.rsp.SysDictTypeListRsp;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.testng.annotations.Test;

@Slf4j
@SpringBootTest(classes = OpenfeignStudyApplication.class)
public class OpenfeignSimpleTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private SysDictRemote sysDictRemote;


    /**
     * 无参 get 请求
     */
    @Test
    public void testGetMethod() {
        R<SysDictTypeListRsp> r = sysDictRemote.getMethod();
        log.info(JSONUtil.toJsonStr(r));
    }

    /**
     * get 请求带参数
     */
    @Test
    public void testGetMethodWithParam() {
        R<SysDictTypeListRsp> r = sysDictRemote.getMethodWithParam(1L, "潼关路边的一只野鬼");
        log.info(JSONUtil.toJsonStr(r));
    }

    /**
     * 无参 post 请求
     */
    @Test
    public void testPostMethod() {
        R<SysDictTypeListRsp> r = sysDictRemote.postMethod();
        log.info(JSONUtil.toJsonStr(r));
    }

    /**
     * post form 表单请求
     */
    @Test
    public void testPostMethodWithFormData() {
        SysDictTypeListReq req = new SysDictTypeListReq();
        req.setName("gender");
        R<SysDictTypeListRsp> r = sysDictRemote.postMethodWithFormData(req);
        log.info(JSONUtil.toJsonStr(r));
    }

    /**
     * post json 请求
     */
    @Test
    public void testPostMethodWithRequestBody() throws IOException {
        SysDictTypeListReq req = new SysDictTypeListReq();
        req.setName("gender");
        R<SysDictTypeListRsp> r = sysDictRemote.postMethodWithRequestBody(req);
        log.info(JSONUtil.toJsonStr(r));
    }
}
```