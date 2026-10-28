---
title: reposilite  基本使用
date: 2026-10-29 00:56:37
categories:
  - devops
  - 镜像
  - java
tags:
  - devops
  - 镜像
  - java
---

# 参考资料

## 官方资料

github: https://github.com/dzikoysk/reposilite

官网: https://reposilite.com/

# 基本搭建

## 下载

https://github.com/dzikoysk/reposilite/releases

下载 jar 包即可

![](/images/2026-10-29-reposilite-基本使用/001.png)


## 初次运行

直接 java -jar 即可, 然后访问 http:IP:8080/#/ 

![](/images/2026-10-29-reposilite-基本使用/002.png)



## 目录结构

此时在当前目录下生成的目录结构含义如下

```
~workspace/
+--logs/              List of 10 latest log files
+--plugins/           Directory with all external plugins to load
+--repositories/      The root directory for all declared repositories
   +--private/        Default private repository
   +--releases/       Default repository for releases
   +--snapshots/      Default repository for snapshot releases
+--static/            Static website content
+--configuration.cdn  Configuration file
+--latest.log         Log from the latest launch of Reposilite instance
+--reposilite.jar     Application file
+--reposilite.db      Data file containing stats and tokens (only if embedded database enabled)
```

## 修改一下端口号

可参考: https://reposilite.com/guide/general#parameters

```bash
java -jar reposilite-3.6.5-all.jar -p=4890
```

## 添加管理员账号

参考官方文档: https://reposilite.com/guide/tokens

命令为

```bash
# --secret=root 意味指定密码
# 第二个 root 是用户名
# m 表示管理员
token-generate --secret=root root m
```

效果如下

```bash
token-generate --secret=root root m
01:11:23.975 INFO |
01:11:24.089 INFO | Generated new access token for root with 'm' permissions. Secret:
01:11:24.089 INFO | root
01:11:24.089 INFO |
tokens
01:11:28.364 INFO |
01:11:28.368 INFO | Tokens (1)
01:11:28.368 INFO | - root: [MANAGER]
01:11:28.368 INFO |   > ~ no routes ~
```

然后登录即可

## 添加镜像

按照如下菜单路径添加镜像地址

![](/images/2026-10-29-reposilite-基本使用/003.png)

建议勾选 **Store**

![](/images/2026-10-29-reposilite-基本使用/004.png)

**一定要更新配置**

![](/images/2026-10-29-reposilite-基本使用/005.png)

## 修改 maven 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
    <localRepository>D:/program/java/repo</localRepository>

    <servers>
        <server>
            <id>reposilite-releases</id>
            <username>root</username>
            <password>root</password>
        </server>
        <server>
            <id>reposilite-snapshots</id>
            <username>root</username>
            <password>root</password>
        </server>
        <server>
            <id>reposilite-private</id>
            <username>root</username>
            <password>root</password>
        </server>
    </servers>

    <mirrors>
        <mirror>
            <id>reposilite-releases</id>
            <!-- mirrorOf 设置为 *,!reposilite-private 或者是直接 *
                 代表拦截所有外部仓库（如 Maven 中央仓库、阿里云等），强制从 Reposilite 的 releases 仓库获取 -->
            <mirrorOf>*</mirrorOf>
            <name>Reposilite Central Mirror</name>
            <url>http://192.168.56.1:8080/releases</url>
        </mirror>
    </mirrors>

    <profiles>
        <profile>
            <id>reposilite-env</id>
            <repositories>
                <!-- 配置 Snapshots 仓库 -->
                <repository>
                    <id>reposilite-snapshots</id>
                    <url>http://192.168.56.1:8080/snapshots</url>
                    <releases><enabled>false</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </repository>
                <!-- 配置 Private 私有仓库 -->
                <repository>
                    <id>reposilite-private</id>
                    <url>http://192.168.56.1:8080/private</url>
                    <releases><enabled>true</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </repository>
            </repositories>
        </profile>
    </profiles>

    <activeProfiles>
        <activeProfile>reposilite-env</activeProfile>
    </activeProfiles>
</settings>
```

## 使用

建议添加 `.mvn/maven.config` 文件,然后指定 `settings.xml` 路径, 例如

```
--settings
C:/Users/laolang/.m2/settings_reposilite.xml
```

如果需要 deploy , 那么 pom.xml 还需要添加如下配置

```xml
<distributionManagement>
    <repository>
        <id>reposilite-releases</id>
        <name>Reposilite Releases Repository</name>
        <url>http://192.168.56.1:8080/releases</url>
    </repository>
    <snapshotRepository>
        <id>reposilite-snapshots</id>
        <name>Reposilite Snapshots Repository</name>
        <url>http://192.168.56.1:8080/snapshots</url>
    </snapshotRepository>
</distributionManagement>
```


