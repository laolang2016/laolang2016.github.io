---
title: spring boot kotlin java 混编
date: 2024-08-29 17:34:37
categories:
- java
- spring boot
tags:
- java
- spring boot
---

spring boot kotlin java 混编

<!-- more -->

# 参考资料

[SpringBoot（maven）项目接入Kotlin与Java混合开发](https://blog.csdn.net/kill_the_king/article/details/123246308)

[maven如何编译java和kotlin编码的混合项目](https://blog.csdn.net/ly199108171231/article/details/105121249)

# pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.laolang.thresh</groupId>
    <artifactId>thresh-boot</artifactId>
    <version>0.1</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <springboot.version>2.2.13.RELEASE</springboot.version>
        <tlog.version>1.5.0</tlog.version>

        <!-- 设置kotlin版本 -->
        <kotlin.version>1.3.72</kotlin.version>
        <!-- 启用kotlin增量编译 -->
        <kotlin.compiler.incremental>true</kotlin.compiler.incremental>

        <maven-compiler-plugin.version>3.11.0</maven-compiler-plugin.version>
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
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>com.yomahub</groupId>
            <artifactId>tlog-web-spring-boot-starter</artifactId>
            <version>${tlog.version}</version>
        </dependency>

        <!-- kotlin -->
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-reflect</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib-jdk8</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.module</groupId>
            <artifactId>jackson-module-kotlin</artifactId>
            <exclusions>
                <exclusion>
                    <artifactId>kotlin-reflect</artifactId>
                    <groupId>org.jetbrains.kotlin</groupId>
                </exclusion>
            </exclusions>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
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
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <configuration>
                    <jvmTarget>1.8</jvmTarget>
                    <args>
                        <arg>-Xjsr305=strict</arg>
                    </args>
                    <compilerPlugins>
                        <!-- Spring使用动态代理需要所有Bean可继承，该插件为所有Bean添加open关键字 -->
                        <plugin>spring</plugin>
                        <!-- 该插件为jpa实体类解决没有无参构造器的问题 -->
                        <!-- <plugin>jpa</plugin> -->
                        <plugin>no-arg</plugin>
                    </compilerPlugins>
                    <pluginOptions>
                        <!-- 有些持久层框架需要实体类需要无参构造器，使用该注解标注解决kotlin data class没有无参构造器的问题 -->
                        <option>no-arg:annotation=com.example.annotations.NoArg</option>
                    </pluginOptions>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-maven-allopen</artifactId>
                        <version>${kotlin.version}</version>
                    </dependency>
                    <dependency>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-maven-noarg</artifactId>
                        <version>${kotlin.version}</version>
                    </dependency>
                </dependencies>
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
                <executions>
                    <!-- 替换会被 maven 特别处理的 default-compile -->
                    <execution>
                        <id>default-compile</id>
                        <phase>none</phase>
                    </execution>
                    <!-- 替换会被 maven 特别处理的 default-testCompile -->
                    <execution>
                        <id>default-testCompile</id>
                        <phase>none</phase>
                    </execution>
                    <execution>
                        <id>java-compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>java-test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>testCompile</goal>
                        </goals>
                        <configuration>
                            <skip>true</skip>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
             <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${springboot.version}</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal> <!-- 将引入的 jar 打入其中 -->
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

# Application
```java
package com.laolang.thresh;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class ThreshApplication {
    public static void main(String[] args) {
        SpringApplication.run(ThreshApplication.class, args);
        log.info("thresh is running...");
    }
}
```

# JavaDemoController
```java
package com.laolang.thresh.controller.java;

import com.laolang.thresh.domain.R;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("java")
@RestController
public class JavaDemoController {

    @GetMapping("hello")
    public R<Map<String, Object>> hello() {
        log.info("java hello");
        Map<String, Object> map = new HashMap<>(1);
        map.put("msg", "Hello World");
        return R.ok(map);
    }
}
```

# KotlinDemoController
```kotlin
package com.laolang.thresh.controller.kotlin

import com.laolang.thresh.domain.R
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("kotlin")
@RestController
class KotlinDemoController {

    private val log = LoggerFactory.getLogger(KotlinDemoController::class.java)

    @GetMapping("hello")
    fun hello(): R<Map<String, Any>> {
        log.info("kotlin hello")
        val map = hashMapOf<String, Any>("msg" to "Hello World")
        return R.ok(map)
    }
}
```

# 注意

`kotlin` 版本为 `1.3.72` , 是经过验证的,其他版本可能会有问题, 比如:

`java.lang.NoSuchMethodError: kotlin.collections.MapsKt.createMapBuilder()Ljava/util/Map;`

