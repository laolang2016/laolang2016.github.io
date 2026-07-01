---
title: sonatype nexus 使用笔记
date: 2026-07-01 12:29:49
categories:
  - devops
  - 镜像
  - java
tags:
  - devops
  - 镜像
  - java
---


# 下载

[https://help.sonatype.com/repomanager3/product-information/download](https://help.sonatype.com/repomanager3/product-information/download)

![](/images/2026-07-01-sonatype-nexus-使用笔记/001.png)


# 启动以及一些问题

在 `nexus-3.86.2-01/bin/README.txt` 中详细描述了各种启动方式

## 安装服务

`install-nexus-service.bat` 可以安装为 windows 服务

此方式默认使用 `sonatype-work` 目录, 也可以自定义 

```script
install-nexus-service.bat C:\my-sonatype-work
```

## 指定 jdk

第一种是设置环境变量 `INSTALL4J_JAVA_HOME_OVERRIDE`
第二种是修改 `nexus.rc` 文件, 设置 `app_java_home` 为 JDK 绝对路径


## 启动

{% note primary modern %}
注意: 需要先安装为 windows 服务
{% endnote %}

如下命令作为控制台应用

```
nexus.exe run SonatypeNexusRepository
```

如下命令启停服务

```
nexus.exe start SonatypeNexusRepository
nexus.exe stop SonatypeNexusRepository
```

如下命令删除 windows 服务

```
sc delete SonatypeNexusRepository
```

## 注意点

1. JDK 版本要求 17
2. 命令行启动要求使用管理员模式
3. 如果之前安装过 jdk8 , 则需要打开 `regedit` 并删除 `HKEY_LOCAL_MACHINE\SOFTWARE\JavaSoft`

# 基本使用

## 账密

初始账号为 `admin` , 初始密码在 `sonatype-work\nexus3\admin.password` . 登录后要求修改密码, 按照提示修改即可

## maven

### 几个 maven 仓库的区别

|名称|类型|说明|
|--|--|--|
|maven-central|proxy|代理仓库. 用于代理并缓存其他仓库|
|maven-public|group|组仓库. 在 `maven` 的 `settings.txt` 中的镜像添加此仓库地址即可|
|maven-releases|hosted|正式版. 只有 `hosted` 类型的仓库才可以 `deploy`|
|maven-snapshots|hosted|快照版本. 只有 `hosted` 类型的仓库才可以 `deploy`|

### 添加仓库

![](/images/2026-07-01-sonatype-nexus-使用笔记/002.png)

![](/images/2026-07-01-sonatype-nexus-使用笔记/003.png)

![](/images/2026-07-01-sonatype-nexus-使用笔记/004.png)

![](/images/2026-07-01-sonatype-nexus-使用笔记/005.png)


双击 `maven-public` , 添加并调整顺序

![](/images/2026-07-01-sonatype-nexus-使用笔记/006.png)


### 设置releases和snapshots为每次deploy覆盖上一个版本

![](/images/2026-07-01-sonatype-nexus-使用笔记/007.png)

### settings.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <localRepository>D:/program/java/repo</localRepository>

  <pluginGroups>
  </pluginGroups>

  <proxies>
  </proxies>

  <servers>
    <server>
      <id>nexus-maven-release</id>
      <username>admin</username>
      <password>admin</password>
    </server>
    <server>
      <id>nexus-maven-snapshots</id>
      <username>admin</username>
      <password>admin</password>
    </server>
  </servers>

  <mirrors>
    <mirror>
      <id>nexus-maven-public</id>
      <mirrorOf>*</mirrorOf>
      <name>nexus-maven-public</name>
      <url>http://localhost:8081/repository/maven-public/</url>
    </mirror>
  </mirrors>

  <profiles>
  </profiles>
</settings>
```

### pomx.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.laolang.jx</groupId>
    <artifactId>jx-boot</artifactId>
    <version>${revision}</version>
    <packaging>pom</packaging>
    <modules>
        <module>jx-framework</module>
        <module>jx-modules</module>
        <module>jx-start</module>
    </modules>


    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <revision>0.0.1</revision>
        <flatten-maven-plugin.version>1.5.0</flatten-maven-plugin.version>

        <springboot.version>2.7.18</springboot.version>

        <maven-compiler-plugin.version>3.11.0</maven-compiler-plugin.version>
        <sonar-maven-plugin.version>5.1.0.4751</sonar-maven-plugin.version>

    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.laolang.jx</groupId>
                <artifactId>jx-dependencies</artifactId>
                <version>${revision}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <finalName>${project.artifactId}</finalName>
        <plugins>
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
                <groupId>org.sonarsource.scanner.maven</groupId>
                <artifactId>sonar-maven-plugin</artifactId>
                <version>${sonar-maven-plugin.version}</version>
            </plugin>


            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>3.3.1</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!-- 注意: 如下两个插件可以将 source 和 doc 发布到仓库 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>3.11.1</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                        <!-- 可选：跳过 Javadoc 错误（开发阶段可用） -->
                        <configuration>
                            <failOnError>false</failOnError>
                            <doclint>none</doclint>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <!-- 注意: 不同的版本要发布到不同的仓库, 所以配置了两个 -->
    <distributionManagement>
        <repository>
            <id>nexus-maven-release</id>
            <url>http://localhost:8081/repository/maven-releases/</url>
        </repository>
        <snapshotRepository>
            <id>nexus-maven-snapshots</id>
            <url>http://localhost:8081/repository/maven-snapshots/</url>
        </snapshotRepository>
    </distributionManagement>

</project>
```


## docker

### 新建 proxy

{% note primary modern %}
注意: 
1. 必须指定端口
2. `Docker Index` 要选 `Use Docker Hub`
{% endnote %}

![](/images/2026-07-01-sonatype-nexus-使用笔记/008.png)

### 新建 hosted

{% note primary modern %}
注意: 
1. 必须指定端口
{% endnote %}

![](/images/2026-07-01-sonatype-nexus-使用笔记/009.png)

### 修改 docker 配置文件

> /etc/docker/daemon.json

```json
{
  "insecure-registries": [
    "192.168.1.6:8085",
    "192.168.1.6:8086"
  ]
}
```

### 拉取

```bash
conf$ docker pull 192.168.1.6:8085/hello-world # 拉取镜像
Using default tag: latest
latest: Pulling from hello-world
17eec7bbc9d7: Pull complete 
Digest: sha256:f7931603f70e13dbd844253370742c4fc4202d290c80442b2e68706d8f33ce26
Status: Downloaded newer image for 192.168.1.6:8085/hello-world:latest
192.168.1.6:8085/hello-world:latest
conf$ 
```

### 推送

{% note primary modern %}
注意: 要重新打 tag
{% endnote %}

```bash
conf$ docker tag ghost/jx-boot:0.0.1 192.168.1.6:8086/ghost/jx-boot:0.0.1 # 重新打 tag
conf$ docker push 192.168.1.6:8086/ghost/jx-boot:0.0.1
The push refers to repository [192.168.1.6:8086/ghost/jx-boot] # 推送
dc051fdcbf49: Layer already exists 
d67402f1ff92: Layer already exists 
fbcba6fe80e2: Layer already exists 
76dc668518f1: Layer already exists 
6ae6fad2eb89: Layer already exists 
723b1a00dd9f: Layer already exists 
ceaf9e1ebef5: Layer already exists 
9b9b7f3d56a0: Layer already exists 
f1b5933fe4b5: Layer already exists 
0.0.1: digest: sha256:583922f1343abfe832d65b9bb9ce9384dbf889b86d98d7810efa61bf0dd3ff8d size: 2194
conf$ docker rmi 192.168.1.6:8086/ghost/jx-boot:0.0.1 # 删除本地镜像
Untagged: 192.168.1.6:8086/ghost/jx-boot:0.0.1
Untagged: 192.168.1.6:8086/ghost/jx-boot@sha256:583922f1343abfe832d65b9bb9ce9384dbf889b86d98d7810efa61bf0dd3ff8d
conf$ docker pull 192.168.1.6:8086/ghost/jx-boot:0.0.1 # 拉取 hosted 仓库镜像
0.0.1: Pulling from ghost/jx-boot
Digest: sha256:583922f1343abfe832d65b9bb9ce9384dbf889b86d98d7810efa61bf0dd3ff8d
Status: Downloaded newer image for 192.168.1.6:8086/ghost/jx-boot:0.0.1
192.168.1.6:8086/ghost/jx-boot:0.0.1
conf$ 
```

# 参考资料

[nexus 3.x私服搭建及使用-windows版本](https://www.cnblogs.com/yilichentu/p/14865915.html)

[部署Nexus作为docker的私有仓库](https://www.cnblogs.com/chuangcc/p/12207037.html)

[从零开始使用Nexus搭建你的Maven私服（Windows系统）](https://blog.csdn.net/jiangyq_/article/details/134823631)

[【Bug】Nexus无法正常启动的五种解决方法 - 指南](https://www.cnblogs.com/yjbjingcha/p/19077222)

[【保姆级教程】nexus私服仓库搭建，如何使用，如何配置，页面各种功能介绍及清除策略](https://www.bilibili.com/video/BV1ir421c7Kp)

[2021年最新nexus搭建docker私服npm私服](https://www.bilibili.com/video/BV1rb4y1f72d/)

