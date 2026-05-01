---
title: 安装和 Hello World
order: 102
icon: /assets/image/javaweb-fullstack/build/maven/maven_icon.png
---


## 1. 下载

直接下载最新版本即可

> `.tar.gz` 和 `.zip` 除了压缩格式之外并无任何区别

https://maven.apache.org/download.cgi

![](/assets/image/javaweb-fullstack/build/maven/a02_setup_and_hello_world/001.png)

## 2. 安装

其实现在已经不需要所谓的 `M2_HOME` 或者 `MAVEN_HOME` 了, 直接将 bin 目录添加到 `PATH` 即可. 具体可参考: https://maven.apache.org/install.html

也可参考: [Maven 环境变量：M2_HOME、MAVEN_HOME 和 PATH](https://springdoc.cn/java-maven-environment-variables/)

```bash :no-line-numbers
laolang@ubuntu-devstudio:~$ mvn -v
Apache Maven 3.9.15 (98b2cdbfdb5f1ac8781f537ea9acccaed7922349)
Maven home: /home/laolang/program/apache-maven-3.9.15
Java version: 1.8.0_481, vendor: Oracle Corporation, runtime: /home/laolang/program/jdk8/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "linux", version: "6.17.0-20-generic", arch: "amd64", family: "unix"
laolang@ubuntu-devstudio:~$ 
```

## 3. 第一个 maven 项目

### 3.1. 创建项目

安装后不用修改任何 maven 配置文件, 可直接运行一下命令


```
mvn archetype:generate -DgroupId=com.laolang.app -DartifactId=mvn-quickstart-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.5 -DinteractiveMode=false
```


::: code-tabs

@tab linux

```bash
mvn archetype:generate \
-DgroupId=com.laolang.app \
-DartifactId=mvn-quickstart-app \
-DarchetypeArtifactId=maven-archetype-quickstart \
-DarchetypeVersion=1.5 \
-DinteractiveMode=false
```

@tab windows

```powershell
mvn archetype:generate ^
-DgroupId=com.laolang.app ^
-DartifactId=mvn-quickstart-app ^
-DarchetypeArtifactId=maven-archetype-quickstart ^
-DarchetypeVersion=1.5 ^
-DinteractiveMode=false
```

:::


### 3.2. 一些基本配置

> **够用就好, 不够再加**

#### 3.2.1. 修改默认的 jdk 版本

现在 `maven` 生成的是适配 `jdk17` 的版本, 我们可以做一点修改以适配 `jdk8`

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.release>8</maven.compiler.release>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
</properties>
```

#### 3.2.2. .gitignore

```git
target/

.idea/
*.iml

.settings/
.classpath
.project
```

#### 3.2.3. editorconfig

```ini
# EditorConfig 文件：用于跨编辑器统一代码风格
# 官方网站：https://editorconfig.org

root = true

# 所有的文件通用设置
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 4

# Java 源代码规范
[*.java]
indent_style = space
indent_size = 4
# 限制单行长度，通常为 120 或 100
max_line_length = 120

# Maven 项目配置文件 (pom.xml) 及其他 XML
[*.xml]
indent_style = space
indent_size = 4
```

#### 3.2.4. 目录结构

``` :no-line-numbers
laolang@ubuntu-devstudio:~/work/gitea/coder-base/maven-study/mvn-quickstart-app$ tree -a
.
├── .editorconfig
├── .gitignore
├── .mvn
│   ├── jvm.config
│   └── maven.config
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── laolang
    │               └── app
    │                   └── App.java
    └── test
        └── java
            └── com
                └── laolang
                    └── app
                        └── AppTest.java

13 directories, 7 files
laolang@ubuntu-devstudio:~/work/gitea/coder-base/maven-study/mvn-quickstart-app$ 
```