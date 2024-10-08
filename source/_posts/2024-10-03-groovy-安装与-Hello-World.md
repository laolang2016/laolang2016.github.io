---
title: groovy 安装与 Hello World
date: 2024-10-03 23:43:27
categories:
- java
- groovy
tags:
- java
- groovy
---

# 下载

[https://groovy.apache.ac.cn/download.html](https://groovy.apache.ac.cn/download.html)

{% note info no-icon simple %}
`java8` 最高可用版本为 `3.x`
{% endnote %}

![](/images/2024-10-03-groovy-安装与-Hello-World/001.png)

# 安装

[windows 安装指引](https://groovy-lang.cn/install.html#_installation_on_windows)

解压后设置环境变量
* `GROOVY_HOEM`
* `PATH` : `%GROOVY_HOEM%\bin`

```
C:\Users\user>groovy -v
Groovy Version: 3.0.22 JVM: 1.8.0_151 Vendor: Oracle Corporation OS: Windows 10

C:\Users\user>
```

# Hello World

## 最简单的 Hello World
新建一个 `groovy` 文件
```groovy
println "Hello World"
```

然后执行 `groovy hello.groovy`
```
E:\code\groovy-study>groovy hello.groovy
Hello World

E:\code\groovy-study>
```

## maven 搭建

### pom

{% note info no-icon simple %}
注意 `groovy` 的 `type` 为 `pom`
{% endnote %}

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.laolang.jx</groupId>
    <artifactId>groovy-hello</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <!-- maven 插件 -->
        <maven-resources-plugin.version>2.7</maven-resources-plugin.version>
        <maven-compiler-plugin.version>3.11.0</maven-compiler-plugin.version>
        <maven-surefire-plugin.version>3.2.3</maven-surefire-plugin.version>

        <groovy.version>3.0.22</groovy.version>

        <log4j.version>2.17.2</log4j.version>

        <!-- tool -->
        <hutool.version>5.8.11</hutool.version>
        <lombok.version>1.18.30</lombok.version>
        <commons-lang3.version>3.12.0</commons-lang3.version>

        <!-- 测试相关 -->
        <testng.version>6.14.3</testng.version>
    </properties>

    <dependencies>
        <!-- groovy -->
        <dependency>
            <groupId>org.codehaus.groovy</groupId>
            <artifactId>groovy-all</artifactId>
            <version>${groovy.version}</version>
            <type>pom</type>
        </dependency>

        <!-- log4j2 日志 -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>${log4j.version}</version>
        </dependency>

        <!-- tool -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>${commons-lang3.version}</version>
        </dependency>

        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>${hutool.version}</version>
        </dependency>

        <!-- testng -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>${testng.version}</version>
        </dependency>
    </dependencies>

    <build>
        <finalName>${project.artifactId}</finalName>
        <resources>
            <resource>
                <directory>src/main/resources/</directory>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>${maven-resources-plugin.version}</version>
                <configuration>
                    <encoding>${project.build.sourceEncoding}</encoding>
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
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>${maven-surefire-plugin.version}</version>
                <configuration>
                    <reuseForks>true</reuseForks>
                    <testFailureIgnore>true</testFailureIgnore>
                    <argLine>
                        -Dfile.encoding=UTF-8
                    </argLine>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <repositories>
        <repository>
            <id>maven-central</id>
            <name>maven central</name>
            <url>https://repo.maven.apache.org/maven2</url>
            <releases>
                <enabled>true</enabled>
            </releases>
        </repository>
    </repositories>

    <pluginRepositories>
        <pluginRepository>
            <id>aliyun</id>
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

### 目录结构
![](/images/2024-10-03-groovy-安装与-Hello-World/002.png)

### 启动类
```java
package com.laolang.jx


import org.slf4j.LoggerFactory

class GroovyHelloApplication {
    static def logger = LoggerFactory.getLogger(GroovyHelloApplication.class)

    static void main(String[] args) {
        logger.info "Hello Groovy"
    }
}
```

### 测试类
```java
package com.laolang.jx


import org.slf4j.LoggerFactory
import org.testng.annotations.Test

class CommonTest {
    def logger = LoggerFactory.getLogger(CommonTest.class)

    @Test
    void commonTest() {
        logger.info "common test"
    }
}
```

### 关于 lombok

`lombok` 并不支持 `groovy` , 具体可参考

["@Slf4j" annotation ignored in Groovy class [Lombok v1.18.0] #1776](https://github.com/projectlombok/lombok/issues/1776)

一个 `lombok` 与 `groovy` 整合的示例

[https://github.com/prystasj/lombok-groovy-example](https://github.com/prystasj/lombok-groovy-example)
