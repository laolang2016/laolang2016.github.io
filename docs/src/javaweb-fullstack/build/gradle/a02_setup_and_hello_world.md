---
title: 环境搭建与 Hello World
order: 102
icon: /assets/image/javaweb-fullstack/build/gradle/gradle_icon.png
---


## 1. 下载

https://services.gradle.org/distributions/

可根据需要下载. 推荐下载 all 版本的, 有离线文档

## 2. 安装

解压后, 设置如下三个环境变量

1. `GRADLE_HOME` : 指向 gradle 目录

2. `PATH` : %GRADLE_HOME%\bin

3. `GRADLE_USER_HOME` : 指向一个目录

关于 `GRADLE_USER_HOME` 的作用, 可参考: https://blog.csdn.net/LG_15011399296/article/details/134333647



## 3. Hello World 新建

### 3.1. 新建项目选择

```shell {9,18,27,32,3}
E:\work\gitee\wild-ghost-bible\gradle-study\gradle-01-quickstart>gradle init
Starting a Gradle Daemon (subsequent builds will be faster)

Select type of build to generate:
  1: Application
  2: Library
  3: Gradle plugin
  4: Basic (build structure only)
Enter selection (default: Application) [1..4] 1

Select implementation language:
  1: Java
  2: Kotlin
  3: Groovy
  4: Scala
  5: C++
  6: Swift
Enter selection (default: Java) [1..6] 1

Enter target Java version (min: 7, default: 21): 8

Project name (default: gradle-01-quickstart):

Select application structure:
  1: Single application project
  2: Application and library project
Enter selection (default: Single application project) [1..2] 1

Select build script DSL:
  1: Kotlin
  2: Groovy
Enter selection (default: Kotlin) [1..2] 1

Select test framework:
  1: JUnit 4
  2: TestNG
  3: Spock
  4: JUnit Jupiter
Enter selection (default: JUnit Jupiter) [1..4] 3

Generate build using new APIs and behavior (some features may change in the next minor release)? (default: no) [yes, no]


> Task :init
Learn more about Gradle by exploring our Samples at https://docs.gradle.org/8.14.2/samples/sample_building_java_applications.html

[Incubating] Problems report is available at: file:///E:/work/gitee/wild-ghost-bible/gradle-study/gradle-01-quickstart/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.14.2/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 37s
1 actionable task: 1 executed
E:\work\gitee\wild-ghost-bible\gradle-study\gradle-01-quickstart>
```

### 3.2. 修改配置

**gradle/wrapper/gradle-wrapper.properties**

> 修改 `distributionUrl` , 指向国内镜像

```properties {3,4}
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
# distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.2-bin.zip
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.14.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```


**app/build.gradle.kts**

```kotlin {10-13}

> 添加国内 maven 源

plugins {
    // Apply the groovy plugin to also add support for Groovy (needed for Spock)
    groovy

    // Apply the application plugin to add support for building a CLI application in Java.
    application
}

repositories {
    maven("https://maven.aliyun.com/repository/public/")
    maven("https://maven.aliyun.com/repository/spring/")
    mavenLocal()
    mavenCentral()
}
```

### 3.3. idea 配置修改

菜单位置: `File -> New Project Setup -> Settings for New Projects...`

修改 `Distribution` 为本地 gradle 安装目录

![](/assets/image/javaweb-fullstack/build/gradle/a02_setup_and_hello_world/001.png)

### 3.4. 命令行测试

直接运行 `gradlew.bat build` 即可

### 3.5. idea 测试

打开项目后, 如果一直从默认的 `distributionUrl` 下载, 说明设置不正确, 此时有两个方法

1. 等待下载完毕
2. 重新配置
    2.1 删除 `.idea` , `.gradle` 目录
    2.2 执行 `gradlew.bat --stop` 停止守护进程
    2.3 按照上面的说明重新配置 `idea` 新项目的默认设置



## 4. 简化项目结构

其实默认的单模块项目还是一个多模块项目, 只不过只有一个 `app` 模块, 按照如下步骤修改, 即可成为真正的单模块

1. 删除所有的缓存目录, 包括 `.idea` , `.gradle` , `build`
2. 将 `app` 目录中的所有文件复制到项目根目录
3. 删除 `app` 目录
4. 注释 `settings.gradle.kts` 中的 include("app")

经过上述几个步骤, 即可成为真正的单模块项目


## 基本的单体项目配置

### 配置内容

### 如何使用

gradlew.bat cleanTest test

gradlew.bat build taskTree --no-configuration-cache



