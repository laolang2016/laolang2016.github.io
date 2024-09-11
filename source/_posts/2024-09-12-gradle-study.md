---
title: gradle 基本使用
date: 2024-09-12 04:55:55
categories:
- java
- gradle
tags:
- java
- gradle
---

# 下载

在这里 [https://services.gradle.org/distributions/](https://services.gradle.org/distributions/) 可以下载所有版本的 gralde , 我下载的是 [https://services.gradle.org/distributions/gradle-8.10-all.zip](https://services.gradle.org/distributions/gradle-8.10-all.zip)

# 关于文档

## 一些文档汇总

[gradle 8.10 官方文档](https://docs.gradle.org/8.10/userguide/userguide.html)

[gradle 用户手册](https://doc.qzxdp.cn/gradle/8.1.1/userguide/userguide.html)

[gradle 中文网](https://gradle.github.net.cn/) 目测像是机翻

## 怎么查找每个版本对应的官方文档

第一种就是在官网上看, 在这个地址: [https://gradle.org/releases/](https://gradle.org/releases/), 有每个版本对应的手册

![](/images/2024-09-12-gradle-study/001.png)

第二种就是在下载的 `gradle-xxx-all.zip` 中

!!! tip
    打开 `userguide.html` 即可, 那个 `userguide_single.html` 并不好用

    `userguide.pdf` 是 pdf 版本

![](/images/2024-09-12-gradle-study//002.png)

## 一个视频教程

[Gradle 教程 已完结 (基于Kotlin DSL讲解) 4K蓝光画质 超强的脚本式项目依赖和构建工具](https://www.bilibili.com/video/BV1Fc411x7xF)


# 安装

1. 解压后将 `bin` 目录添加到环境变量
2. 添加 `GRADLE_USER_HOME` 环境变量, 关于此环境变量的作用可参考: [GRADLE_USER_HOME用法指南](https://blog.csdn.net/LG_15011399296/article/details/134333647)

# Hello World

## 直接命令行新建
```
md spring-hello
cd spring-hello
gradle init
```

选项如下

|步骤|我的选择|说明|
|--|--|---|
|Select type of build to generate|1|一个应用程序|
|Select implementation language|1|语言为 java|
|Enter target Java version|8|当前我主要使用 java8|
|project name|默认||
|Select application structure|1|先学会使用单模块项目|
|Select build script DSL|1|官方推荐 kotlin dsl|
|Select test framework|2|个人习惯使用 testng|
|Generate build using new APIs and behavior|默认(即 no)|gradle API 变更极快, 不建议使用哪些尚不稳定的 API|

```
E:\github\gradle-study\spring-hello>gradle init
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

Project name (default: spring-hello):

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
Enter selection (default: JUnit Jupiter) [1..4] 2

Generate build using new APIs and behavior (some features may change in the next minor release)? (default: no) [yes, no]


> Task :init
Learn more about Gradle by exploring our Samples at https://docs.gradle.org/8.10/samples/sample_building_java_applications.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.10/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 31s
1 actionable task: 1 executed
E:\github\gradle-study\spring-hello>
```

## 新建后的一些配置

不要着急用 `idea` 打开, 先修改一下 `gradle/wrapper/gradle-wrapper.properties`

```properties 
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
 distributionUrl=https\://services.gradle.org/distributions/gradle-8.10-bin.zip

 使用腾讯云镜像下载 gradle
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.10-bin.zip

networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

修改 `spring-hello/app/build.gradle.kts`, 添加阿里云镜像

```
repositories {
    maven("https://maven.aliyun.com/repository/public/")
    maven("https://maven.aliyun.com/repository/spring/")
    mavenLocal()
    mavenCentral()
}
```

然后用 `idea` 打开, 修改一下项目配置 File -> Settings -> Build, Execution, Deployment -> Build Tools -> Gradle

![](/images/2024-09-12-gradle-study//003.png)

开始运行

![](/images/2024-09-12-gradle-study//004.png)

# 单模块项目的基本操作

## 修改结构
其实 `gradle` 新建的单模块项目还是一个多模块结构的, 这与我在 `maven` 中的使用习惯不一致

1. 直接复制 `app` 目录中的所有内容到根目录
2. 删除 `app` 目录


## 添加依赖并测试

### 关于 version catalog

目前 `gradle` 在新建项目时会自动创建 `gradle/libs.versions.toml`, 这个目录就是所谓的 `version catalog`, 关于这个文件的作用可参考: 

[gradle 用户手册 - 在项目之间共享依赖版本](https://doc.qzxdp.cn/gradle/8.1.1/userguide/platforms.html)

[如何使用Gradle7.0+的VERSION_CATALOG](https://blog.csdn.net/qq_24889033/article/details/125307004)

我们可以在 `libs.versions.toml` 中添加新的依赖并引用

### libs.versions.toml

```toml 
[versions]
lombok-version = "1.18.30"
guava-version = "23.0"

logback-version = "1.2.12"

testng-version = "6.14.3"

[libraries]
lombok = { module = "org.projectlombok:lombok", version.ref = "lombok-version" }
guava = { module = "com.google.guava:guava", version.ref = "guava-version" }

logback-classic = {module = "ch.qos.logback:logback-classic",version.ref = "logback-version"}

testng = { module = "org.testng:testng", version.ref = "testng-version" }

[bundles]
logback = ["logback-classic"]
```

### build.gradle.kts

```kotlin 
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

plugins {
    application
    jacoco
}

repositories {
    maven("https://maven.aliyun.com/repository/public/")
    maven("https://maven.aliyun.com/repository/spring/")
    mavenLocal()
    mavenCentral()
}

dependencies {
    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    implementation(libs.guava)

    implementation(libs.bundles.logback)

    testImplementation(libs.testng)
    testCompileOnly(libs.lombok)
    testAnnotationProcessor(libs.lombok)
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(8)
    }
}

application {
    mainClass = "com.laolang.jx.SpringHelloApp"
}

/**
 * 测试任务
 */
tasks.named<Test>("test") {
    useTestNG {
        suites("testng.xml")
    }
    // 输出详细日志
    testLogging {
        // 记录日志的事件类型
        events("FAILED", "PASSED", "SKIPPED", "STANDARD_ERROR", "STANDARD_OUT", "STARTED")
        // 记录测试异常的格式
        // FULL: 完整显示异常
        // SHORT: 异常的简短显示
        exceptionFormat = TestExceptionFormat.FULL
        // 是否记录标准输出和标准错误的输出
        showStandardStreams = true
    }

    finalizedBy(tasks.jacocoTestReport)
}

/**
 * jacoco 任务
 */
tasks.named<JacocoReport>("jacocoTestReport") {
    // 依赖于测试任务
    dependsOn(tasks.test)

    reports {
        // 把不需要的报告去掉
        xml.required.set(false)
        csv.required.set(false)

        // 只启用 html 报告
        html.required.set(true)

        // jacoco 报告位置
        html.outputLocation.set(layout.buildDirectory.dir("jacocoHtml"))
    }
}
```

### 解决中文乱码
如果此时直接运行, 在 `jacoco` 报告中查看代码时会有中文乱码的问题, 可以修改 `gradlew.bat` , 避免中文乱码, 同时也建议使用 `gradlew.bat` 来运行, 即通过 `wrapper` 运行 `gradle`
```
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m" "-Dfile.encoding=UTF-8"
```

### 效果

此时直接运行 `gradlew.bat clean test` 即可, 运行之后可以查看如下两个报告

1. `build/jacocoHtml/index.html` 是 `jacoco` 的报告
2. `build/reports/tests/test/index.html` 是 `gradle` 的测试报告

![](/images/2024-09-12-gradle-study//005.png)

![](/images/2024-09-12-gradle-study//006.png)

### 注意

1. `lombok` 需要同时添加编译依赖和测试依赖
2. `gradle` 默认不会输出测试日志, 需要配置
3. 尽量使用 `wrapper` 运行

## 打包与发布

### build.gradle.kts

```kotlin 
import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

/**
 * 添加插件
 */
plugins {
    application
    jacoco
    id("maven-publish")
    id("com.github.johnrengelman.shadow") version "7.0.0"
}

/**
 * 配置仓库
 */
repositories {
    maven("https://maven.aliyun.com/repository/public/")
    maven("https://maven.aliyun.com/repository/spring/")
    mavenLocal()
    mavenCentral()
}

// 项目坐标
group = "com.laolang.jx"
version = "0.1"

/**
 * 声明启动类
 */
application {
    mainClass = "com.laolang.jx.SpringHelloApp"
}

// 配置依赖
dependencies {
    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    implementation(libs.guava)

    implementation(libs.bundles.logback)

    testImplementation(libs.testng)
    testCompileOnly(libs.lombok)
    testAnnotationProcessor(libs.lombok)
}

/**
 * 打包时生成 source.jar 和 javadoc.jar
 */
configure<JavaPluginExtension> {
    withSourcesJar()
    withJavadocJar()
}

/**
 * java 编译配置
 */
tasks.withType<JavaCompile> {
    options.encoding = Charsets.UTF_8.name()
    sourceCompatibility = JavaVersion.VERSION_1_8.toString()
    targetCompatibility = JavaVersion.VERSION_1_8.toString()
}

/**
 * javadoc
 */
tasks.withType<Javadoc> {
    options {
        encoding = Charsets.UTF_8.name()
        charset(Charsets.UTF_8.name())
    }
    // 忽略 javadoc 报错
    isFailOnError = false
}

/**
 * 测试任务
 */
tasks.named<Test>("test") {
    useTestNG {
        suites("testng.xml")
    }
    // 输出详细日志
    testLogging {
        // 记录日志的事件类型
        events("FAILED", "PASSED", "SKIPPED", "STANDARD_ERROR", "STANDARD_OUT", "STARTED")
        // 记录测试异常的格式
        // FULL: 完整显示异常
        // SHORT: 异常的简短显示
        exceptionFormat = TestExceptionFormat.FULL
        // 是否记录标准输出和标准错误的输出
        showStandardStreams = true
    }

    finalizedBy(tasks.jacocoTestReport)
}

/**
 * jacoco 任务
 */
tasks.named<JacocoReport>("jacocoTestReport") {
    // 依赖于测试任务
    dependsOn(tasks.test)

    reports {
        // 把不需要的报告去掉
        xml.required.set(false)
        csv.required.set(false)

        // 只启用 html 报告
        html.required.set(true)

        // jacoco 报告位置
        html.outputLocation.set(layout.buildDirectory.dir("jacocoHtml"))
    }
}

/**
 * 打包可执行 jar
 */
tasks.named<ShadowJar>("shadowJar") {
    archiveBaseName.set(project.name)
    archiveVersion.set(project.version.toString())
    archiveFileName.set(project.name + ".jar")

    destinationDirectory.set(layout.buildDirectory.dir("shaded"))
}

/**
 * 发布到本地
 */
publishing {
    repositories {
        mavenLocal()
    }
    publications {
        create<MavenPublication>("maven") {
            groupId = project.group.toString()
            artifactId = project.name
            version = project.version.toString()

            from(components["java"])
        }
    }
}
```

### 效果

1. 执行 `gradlew.bat build`, 可在 `build/shaded` 目录下生成可执行 jar
2. 执行 `gradlew.bat publish` 可以发布到本地 maven 仓库

### 注意

如果没有在家目录的 `.m2/settings.xml` 中指定本地仓库路径, 那么默认会发布到 C 盘

## 使用 bom

### 如何引入 maven bom

在 `maven` 项目中经常使用如下代码
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-framework-bom</artifactId>
            <version>${spring.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

在 `gradle` 中同样具备此功能

```kotin
dependencies {

    implementation(platform("org.springframework:spring-framework-bom:5.3.31"))

    implementation("org.springframework:spring-context")
}
```

### 参考
[gradle 中文手册 导入 Maven BOM](https://doc.qzxdp.cn/gradle/8.1.1/userguide/platforms.html#sub:bom_import)

[stack overflow How to use a maven BOM for Spring in Gradle?](https://stackoverflow.com/questions/53619890/how-to-use-a-maven-bom-for-spring-in-gradle)

[Gradle-04：BOM管理依赖版本](https://developer.aliyun.com/article/1025091)

## 查看和解决依赖冲突

### 引入依赖

例如引入如下依赖
```
implementation("com.baomidou:mybatis-plus:3.5.1")
implementation("com.github.pagehelper:pagehelper:5.3.0")
```

### 查看方式一

运行 `gradle dependencies` 可以看到 `pagehelper` 和 `mybatis-plus` 同时引入了 `jsqlparser`
```

...

------------------------------------------------------------
Root project 'spring-hello'
------------------------------------------------------------

annotationProcessor - Annotation processors and their dependencies for source set 'main'.
\--- org.projectlombok:lombok:1.18.30

apiElements - API elements for main. (n)
No dependencies

archives - Configuration for archive artifacts. (n)
No dependencies

compileClasspath - Compile classpath for source set 'main'.
+--- org.projectlombok:lombok:1.18.30
+--- ch.qos.logback:logback-classic:1.2.12
|    +--- ch.qos.logback:logback-core:1.2.12
|    \--- org.slf4j:slf4j-api:1.7.32
+--- com.google.guava:guava:23.0
|    +--- com.google.code.findbugs:jsr305:1.3.9
|    +--- com.google.errorprone:error_prone_annotations:2.0.18
|    +--- com.google.j2objc:j2objc-annotations:1.1
|    \--- org.codehaus.mojo:animal-sniffer-annotations:1.14
+--- com.baomidou:mybatis-plus:3.5.1
|    \--- com.baomidou:mybatis-plus-extension:3.5.1
|         +--- com.baomidou:mybatis-plus-core:3.5.1
|         |    +--- com.baomidou:mybatis-plus-annotation:3.5.1
|         |    +--- com.github.jsqlparser:jsqlparser:4.3
|         |    \--- org.mybatis:mybatis:3.5.9
|         \--- org.mybatis:mybatis-spring:2.0.6
\--- com.github.pagehelper:pagehelper:5.3.0
     \--- com.github.jsqlparser:jsqlparser:4.2 -> 4.3

compileOnly - Compile only dependencies for source set 'main'. (n)
\--- org.projectlombok:lombok:1.18.30 (n)

...

```

### 查看方式二

也可以运行命令 `gradle dependencyInsight --dependency jsqlparser --configuration compileClasspath` 查看

```
E:\github\ghost-hello-project\gradle-study\spring-hello>gradle dependencyInsight --dependency jsqlparser --configuration compileClasspath

> Task :dependencyInsight
com.github.jsqlparser:jsqlparser:4.3
  Variant compile:
    | Attribute Name                 | Provided | Requested    |
    |--------------------------------|----------|--------------|
    | org.gradle.status              | release  |              |
    | org.gradle.category            | library  | library      |
    | org.gradle.libraryelements     | jar      | classes      |
    | org.gradle.usage               | java-api | java-api     |
    | org.gradle.dependency.bundling |          | external     |
    | org.gradle.jvm.environment     |          | standard-jvm |
    | org.gradle.jvm.version         |          | 8            |
   Selection reasons:
      - By conflict resolution: between versions 4.3 and 4.2

com.github.jsqlparser:jsqlparser:4.3
\--- com.baomidou:mybatis-plus-core:3.5.1
     \--- com.baomidou:mybatis-plus-extension:3.5.1
          \--- com.baomidou:mybatis-plus:3.5.1
               \--- compileClasspath

com.github.jsqlparser:jsqlparser:4.2 -> 4.3
\--- com.github.pagehelper:pagehelper:5.3.0
     \--- compileClasspath

A web-based, searchable dependency report is available by adding the --scan option.

BUILD SUCCESSFUL in 1s
1 actionable task: 1 executed
E:\github\ghost-hello-project\gradle-study\spring-hello>
```

### 排除依赖

```
implementation("com.baomidou:mybatis-plus:3.5.1")
implementation("com.github.pagehelper:pagehelper:5.3.0") {
    exclude(group = "com.github.jsqlparser", module = "jsqlparser")
}
```



运行命令 `gradle dependencies --configuration compileClasspath` 再次查看

```
E:\github\ghost-hello-project\gradle-study\spring-hello>gradle dependencies --configuration compileClasspath

> Task :dependencies

------------------------------------------------------------
Root project 'spring-hello'
------------------------------------------------------------

compileClasspath - Compile classpath for source set 'main'.
+--- org.projectlombok:lombok:1.18.30
+--- ch.qos.logback:logback-classic:1.2.12
|    +--- ch.qos.logback:logback-core:1.2.12
|    \--- org.slf4j:slf4j-api:1.7.32
+--- com.google.guava:guava:23.0
|    +--- com.google.code.findbugs:jsr305:1.3.9
|    +--- com.google.errorprone:error_prone_annotations:2.0.18
|    +--- com.google.j2objc:j2objc-annotations:1.1
|    \--- org.codehaus.mojo:animal-sniffer-annotations:1.14
+--- com.baomidou:mybatis-plus:3.5.1
|    \--- com.baomidou:mybatis-plus-extension:3.5.1
|         +--- com.baomidou:mybatis-plus-core:3.5.1
|         |    +--- com.baomidou:mybatis-plus-annotation:3.5.1
|         |    +--- com.github.jsqlparser:jsqlparser:4.3
|         |    \--- org.mybatis:mybatis:3.5.9
|         \--- org.mybatis:mybatis-spring:2.0.6
\--- com.github.pagehelper:pagehelper:5.3.0

A web-based, searchable dependency report is available by adding the --scan option.

BUILD SUCCESSFUL in 1s
1 actionable task: 1 executed
E:\github\ghost-hello-project\gradle-study\spring-hello>
```

### 参考

[gradle 中文文档 查看和调试依赖项](https://doc.qzxdp.cn/gradle/8.1.1/userguide/viewing_debugging_dependencies.html)

[使用Gradle命令查看项目中库的依赖关系](https://blog.csdn.net/Jason847/article/details/76849680)

## 查看任务依赖关系

### 引入插件

```kotlin
plugins {
    application
    jacoco
    id("com.github.johnrengelman.shadow") version "7.0.0"
    id("com.dorongold.task-tree") version "3.0.0"
}
```

### 如何使用

执行 `gradle <task 1>...<task N> taskTree` 即可查看任务依赖关系, 例如 `gradle build taskTree` 输出如下


```
E:\github\ghost-hello-project\gradle-study\spring-hello>gradle build taskTree

> Task :taskTree

------------------------------------------------------------
Root project 'spring-hello'
------------------------------------------------------------

:build
+--- :assemble
|    +--- :distTar
|    |    +--- :jar
|    |    |    \--- :classes
|    |    |         +--- :compileJava
|    |    |         \--- :processResources
|    |    \--- :startScripts
|    |         \--- :jar *
|    +--- :distZip
|    |    +--- :jar *
|    |    \--- :startScripts *
|    +--- :jar *
|    +--- :shadowDistTar
|    |    +--- :shadowJar
|    |    |    \--- :classes *
|    |    \--- :startShadowScripts
|    |         \--- :shadowJar *
|    \--- :shadowDistZip
|         +--- :shadowJar *
|         \--- :startShadowScripts *
\--- :check
     \--- :test
          +--- :classes *
          \--- :testClasses
               +--- :compileTestJava
               |    \--- :classes *
               \--- :processTestResources


(*) - subtree omitted (printed previously)
Add --repeat to allow printing a subtree of the same task more than once.

To see task dependency tree for a specific task, run gradle <project-path>:<task> <project-path>:taskTree [--depth <depth>] [--with-inputs] [--with-outputs] [--with-description] [--repeat]
Executions of all tasks except for taskTree are skipped. They are used for building the task graph only.
For example, try running gradle :build :taskTree

BUILD SUCCESSFUL in 822ms
1 actionable task: 1 executed
E:\github\ghost-hello-project\gradle-study\spring-hello>
```

### 参考

[gradle-task-tree github](https://github.com/dorongold/gradle-task-tree)

## profile

### 添加 buildSrc

关于 `buildSrc` 可参考 [在子项目之间共享构建逻辑](https://gradle.github.net.cn/current/userguide/sharing_build_logic_between_subprojects.html)

`buildSrc/build.gradle.kts` 内容如下
```kotlin 
plugins {
    `kotlin-dsl`
}

repositories {
    maven {
        setUrl("https://maven.aliyun.com/repository/public/")
    }
    maven {
        setUrl("https://maven.aliyun.com/repository/spring/")
    }
    gradlePluginPortal()
    mavenLocal()
    mavenCentral()
}
```

在 `buildSrc` 中添加一个单例类

```kotlin 
package com.laolang.jx.gradle

object GradleUtil {

    fun getProfile(defaultProfile: String): String {
        var profile: String? = System.getProperty("profile")
        if (profile.isNullOrBlank()) {
            profile = defaultProfile
        }
        return profile
    }
}
```

### 修改目录结构

删除 `src/main/resources` 中的所有文件, 并新建 `src/main/resources/dev` 和 `src/main/resources/test`. 将配置文件放在对应的目录, 例如 `src/main/resources/dev/spring-context.xml` 内容如下

```xml 
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context" xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <context:component-scan base-package="com.laolang.jx">
    </context:component-scan>

    <bean id="" class="com.laolang.jx.bean.HelloService" p:msg="dev msg"/>
</beans>
```

### 修改根目录 build.gradle.kts

```kotlin 
import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import com.laolang.jx.gradle.GradleUtil
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

/**
 * 添加插件
 */
plugins {
    application
    jacoco
    id("maven-publish")
    id("com.github.johnrengelman.shadow") version "7.0.0"
    id("com.dorongold.task-tree") version "3.0.0"
}

/**
 * 配置仓库
 */
repositories {
    maven("https://maven.aliyun.com/repository/public/")
    maven("https://maven.aliyun.com/repository/spring/")
    mavenLocal()
    mavenCentral()
}

// 项目坐标
group = "com.laolang.jx"
version = "0.1"

/**
 * 声明启动类
 */
application {
    mainClass = "com.laolang.jx.SpringHelloApp"
}

// profile
val profile: String = GradleUtil.getProfile("dev")
// 资源目录
val resourceDir = "src/main/resources/$profile"

// 设置资源目录
sourceSets {
    main {
        resources {
            srcDir(resourceDir)
        }
    }
}

// 配置依赖
dependencies {

    implementation(platform("org.springframework:spring-framework-bom:5.3.31"))

    implementation("org.springframework:spring-context")

    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    implementation(libs.guava)

    implementation(libs.bundles.logback)

    testImplementation(libs.testng)
    testCompileOnly(libs.lombok)
    testAnnotationProcessor(libs.lombok)
}

/**
 * 打包时生成 source.jar 和 javadoc.jar
 */
configure<JavaPluginExtension> {
    withSourcesJar()
    withJavadocJar()
}

/**
 * java 编译配置
 */
tasks.withType<JavaCompile> {
    options.encoding = Charsets.UTF_8.name()
    sourceCompatibility = JavaVersion.VERSION_1_8.toString()
    targetCompatibility = JavaVersion.VERSION_1_8.toString()
}

/**
 * 排除 dev 目录和 test 目录
 */
tasks.withType<ProcessResources> {
    exclude("dev/**")
    exclude("test/**")
}

/**
 * javadoc
 */
tasks.withType<Javadoc> {
    options {
        encoding = Charsets.UTF_8.name()
        charset(Charsets.UTF_8.name())
    }
    // 忽略 javadoc 报错
    isFailOnError = false
}

/**
 * 测试任务
 */
tasks.named<Test>("test") {
    useTestNG {
        suites("testng.xml")
    }
    // 输出详细日志
    testLogging {
        // 记录日志的事件类型
        events("FAILED", "PASSED", "SKIPPED", "STANDARD_ERROR", "STANDARD_OUT", "STARTED")
        // 记录测试异常的格式
        // FULL: 完整显示异常
        // SHORT: 异常的简短显示
        exceptionFormat = TestExceptionFormat.FULL
        // 是否记录标准输出和标准错误的输出
        showStandardStreams = true
    }

    finalizedBy(tasks.jacocoTestReport)
}

/**
 * jacoco 任务
 */
tasks.named<JacocoReport>("jacocoTestReport") {
    // 依赖于测试任务
    dependsOn(tasks.test)

    reports {
        // 把不需要的报告去掉
        xml.required.set(false)
        csv.required.set(false)

        // 只启用 html 报告
        html.required.set(true)

        // jacoco 报告位置
        html.outputLocation.set(layout.buildDirectory.dir("jacocoHtml"))
    }
}

/**
 * 打包可执行 jar
 */
tasks.named<ShadowJar>("shadowJar") {
    archiveBaseName.set(project.name)
    archiveVersion.set(project.version.toString())
    archiveFileName.set(project.name + ".jar")

    destinationDirectory.set(layout.buildDirectory.dir("shaded"))
}

/**
 * 发布到本地
 */
publishing {
    repositories {
        mavenLocal()
    }
    publications {
        create<MavenPublication>("maven") {
            groupId = project.group.toString()
            artifactId = project.name
            version = project.version.toString()

            from(components["java"])
        }
    }
}
```

### 运行结果

`gradlew.bat -Dprofile=test run`

```
E:\github\gradle-study\spring-hello>gradlew.bat -Dprofile=test run

> Configure project :
profile:test

> Task :run

...

2024-09-11 09:08:51.229 [main] INFO  com.laolang.jx.SpringHelloApp            - bean.msg:test msg

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.10/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 2s
7 actionable tasks: 2 executed, 5 up-to-date
E:\github\gradle-study\spring-hello>
```

`gradlew.bat -Dprofile=dev run` 或者 `gradlew.bat run`

```
E:\github\gradle-study\spring-hello>gradlew.bat run

> Configure project :
profile:dev

> Task :run

...

2024-09-11 09:10:03.309 [main] INFO  com.laolang.jx.SpringHelloApp            - bean.msg:dev msg

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.10/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 1s
7 actionable tasks: 2 executed, 5 up-to-date
E:\github\gradle-study\spring-hello>
```


### 参考
[gradle 中文手册 · 配置构建环境](https://gradle.github.net.cn/current/userguide/build_environment.html#sec:gradle_system_properties)

[Gradle构建时像Maven那样根据profile环境打包](https://cloud.tencent.com/developer/article/1798260)

[gradle项目中profile的实现](https://www.cnblogs.com/yjmyzz/p/gradle-profile.html)

[Gradle's Support for Maven POM Profiles](https://blog.gradle.org/maven-pom-profiles)

## 单模块项目总结与代码地址

### 总结

1. 遇事不决, google
2. 多看官方文档
3. 理论与实践相结合
4. profile 的实现有很多种方式, 我只是选了其中一种

### 代码地址

[https://github.com/laolang2016/gradle-study/tree/master/spring-hello](https://github.com/laolang2016/gradle-study/tree/master/spring-hello)

# spring mvc schema 项目示例

## 代码地址

[https://github.com/laolang2016/gradle-study/tree/master/jx-schema](https://github.com/laolang2016/gradle-study/tree/master/jx-schema)

## gradle 配置说明

### libs.version.toml

!!! tip
    使用 bom 之后, 这个文件就不需要写 spring 依赖的版本号了

```toml
[versions]
javax-servlet-api-version = "3.1.0"
jackson-version = "2.13.5"

logback-version = "1.2.12"

lombok-version = "1.18.30"
hutool-version = "5.8.11"
vavr-version = "0.10.4"
mapstruct-version = "1.4.2.Final"
guava-version = "23.0"
commons-lang3-version = "3.12.0"

testng-version = "6.14.3"

[libraries]
javax-servlet-api = { module = "javax.servlet:javax.servlet-api", version.ref = "javax-servlet-api-version" }

spring-context = { module = "org.springframework:spring-context" }
spring-context-support = { module = "org.springframework:spring-context-support" }
spring-webmvc = { module = "org.springframework:spring-webmvc" }

jackson-databind = { module = "com.fasterxml.jackson.core:jackson-databind", version.ref = "jackson-version" }
jackson-datatype-jdk8 = { module = "com.fasterxml.jackson.datatype:jackson-datatype-jdk8", version.ref = "jackson-version" }
jackson-datatype-jsr310 = { module = "com.fasterxml.jackson.datatype:jackson-datatype-jsr310", version.ref = "jackson-version" }
jackson-module-parameter-names = { module = "com.fasterxml.jackson.module:jackson-module-parameter-names", version.ref = "jackson-version" }

logback-classic = { module = "ch.qos.logback:logback-classic", version.ref = "logback-version" }

lombok = { module = "org.projectlombok:lombok", version.ref = "lombok-version" }
hutool-all = { module = "cn.hutool:hutool-all", version.ref = "hutool-version" }
vavr = { module = "io.vavr:vavr", version.ref = "vavr-version" }
mapstruct-mapstruct = { module = "org.mapstruct:mapstruct", version.ref = "mapstruct-version" }
mapstruct-jdk8 = { module = "org.mapstruct:mapstruct-jdk8", version.ref = "mapstruct-version" }
mapstruct-processor = { module = "org.mapstruct:mapstruct-processor", version.ref = "mapstruct-version" }
guava = { module = "com.google.guava:guava", version.ref = "guava-version" }
commons-lang3 = { module = "org.apache.commons:commons-lang3", version.ref = "commons-lang3-version" }

testng = { module = "org.testng:testng", version.ref = "testng-version" }

[bundles]
spring = ["spring-context", "spring-context-support", "spring-webmvc"]
jackson = ["jackson-databind", "jackson-datatype-jdk8", "jackson-datatype-jsr310", "jackson-module-parameter-names"]
mapstruct = ["mapstruct-mapstruct", "mapstruct-jdk8", "mapstruct-processor"]
logback = ["logback-classic"]
```

### build.gradle.kts

`maven` 有 `jetty` 插件, `gradle` 则有 `gretty`, 运行方式都一样, 但是 `gretty` debug 需要使用远程调试, 目前还没找到 idea 直接 debug 的方式

```kotlin 
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

/**
 * 添加插件
 */
plugins {
    war
    id("org.gretty") version "3.0.9"
    jacoco
    id("maven-publish")
    id("com.dorongold.task-tree") version "3.0.0"
}

/**
 * 配置仓库
 */
repositories {
    maven("https://maven.aliyun.com/repository/public/")
    maven("https://maven.aliyun.com/repository/spring/")
    mavenLocal()
    mavenCentral()
}

// 项目坐标
group = "com.laolang.jx"
version = "0.1"

// 配置依赖
dependencies {

    implementation(platform("org.springframework:spring-framework-bom:5.3.31"))

    implementation(libs.javax.servlet.api)
    implementation(libs.bundles.spring)
    implementation(libs.bundles.jackson)

    implementation(libs.bundles.logback)

    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    implementation(libs.hutool.all)
    implementation(libs.vavr)
    implementation(libs.bundles.mapstruct)
    implementation(libs.guava)
    implementation(libs.commons.lang3)

    testImplementation(libs.testng)
    testCompileOnly(libs.lombok)
    testAnnotationProcessor(libs.lombok)
}

/**
 * 打包时生成 source.jar 和 javadoc.jar
 */
configure<JavaPluginExtension> {
    withSourcesJar()
    withJavadocJar()
}

/**
 * java 编译配置
 */
tasks.withType<JavaCompile> {
    options.encoding = Charsets.UTF_8.name()
    sourceCompatibility = JavaVersion.VERSION_1_8.toString()
    targetCompatibility = JavaVersion.VERSION_1_8.toString()
}

/**
 * javadoc
 */
tasks.withType<Javadoc> {
    options {
        encoding = Charsets.UTF_8.name()
        charset(Charsets.UTF_8.name())
    }
    // 忽略 javadoc 报错
    isFailOnError = false
}

/**
 * 测试任务
 */
tasks.named<Test>("test") {
    useTestNG {
        suites("testng.xml")
    }
    // 输出详细日志
    testLogging {
        // 记录日志的事件类型
        events("FAILED", "PASSED", "SKIPPED", "STANDARD_ERROR", "STANDARD_OUT", "STARTED")
        // 记录测试异常的格式
        // FULL: 完整显示异常
        // SHORT: 异常的简短显示
        exceptionFormat = TestExceptionFormat.FULL
        // 是否记录标准输出和标准错误的输出
        showStandardStreams = true
    }

    finalizedBy(tasks.jacocoTestReport)
}

/**
 * war 任务
 */
tasks.withType<War>{
    archiveBaseName = project.name
    version = project.version
}

/**
 * jacoco 任务
 */
tasks.named<JacocoReport>("jacocoTestReport") {
    // 依赖于测试任务
    dependsOn(tasks.test)

    reports {
        // 把不需要的报告去掉
        xml.required.set(false)
        csv.required.set(false)

        // 只启用 html 报告
        html.required.set(true)

        // jacoco 报告位置
        html.outputLocation.set(layout.buildDirectory.dir("jacocoHtml"))
    }
}

/**
 * 发布到本地
 */
publishing {
    repositories {
        mavenLocal()
    }
    publications {
        create<MavenPublication>("maven") {
            groupId = project.group.toString()
            artifactId = project.name
            version = project.version.toString()

            from(components["java"])
        }
    }
}

/**
 * gretty
 */
gretty{
    // 服务端口号
    httpPort = 8096
    // 服务根路径
    contextPath = '/'

    // 远程调试端口号
    debugPort = 8098
}
```

## 运行

直接执行 `gretty` 的 `appRun` 即可

![](/images/2024-09-12-gradle-study//007.png)

## debug

首先执行 `gretty` 的 `appRunDebug`

![](/images/2024-09-12-gradle-study//008.png)

然后配置 remote debug 并启动

![](/images/2024-09-12-gradle-study//009.png)

然后切换到 `appRunDebug`, 稍等一两秒就会看到项目成功启动了, 此时断点已经可以正常使用

![](/images/2024-09-12-gradle-study//010.png)

## 参考

[gradle 中文文档 war 插件](https://doc.qzxdp.cn/gradle/8.1.1/userguide/war_plugin.html)

gretty 官网: [https://gretty-gradle-plugin.github.io/gretty-doc/](https://gretty-gradle-plugin.github.io/gretty-doc/)

[IDEA community + Gradle + Gretty 调试 servlet 应用 + war包部署到tomcat](https://www.cnblogs.com/qrlozte/p/8734512.html)

[Java Gradle入门指南之gretty插件（安装、命令与核心特性）](https://www.cnblogs.com/gzdaijie/p/5267166.html)

# spring 单体项目

## 根目录 build.gradle.kts

与 [spring mvc schema](https://github.com/laolang2016/gradle-study/tree/master/jx-schema) 项目比起来并没有太大的区别

```kotlin 
import com.laolang.gradle.mavenAlibaba
import com.laolang.gradle.util.GradleUtil
import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.internal.classpath.Instrumented.systemProperty
import org.springframework.boot.gradle.tasks.bundling.BootJar


repositories {
    mavenAlibaba()
    mavenLocal()
    mavenCentral()
}

plugins {
    application
    jacoco
    id("com.dorongold.task-tree") version "3.0.0"
    id("maven-publish")
    id("org.springframework.boot") version "2.7.6"
    id("io.spring.dependency-management") version "1.0.15.RELEASE"
    id("my-plugin")
}

// 项目坐标
group = "com.laolang.jx"
version = "0.1"

application {
    mainClass.set("com.laolang.jx.JxApplication")
}

// profile
val profile: String = GradleUtil.getProfile("dev")
// 资源目录
val resourceDir = "src/main/resources/$profile"

println("profile:$profile")

// 设置资源目录
sourceSets {
    main {
        resources {
            srcDir(resourceDir)
        }
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-log4j2")
    implementation("org.springframework.boot:spring-boot-starter-json")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    compileOnly("org.springframework.boot:spring-boot-configuration-processor")

    implementation(libs.tlog)

    implementation(libs.hutool.all)
    implementation(libs.vavr)
    implementation(libs.bundles.mapstruct)
    implementation(libs.guava)
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    implementation("org.apache.commons:commons-lang3")

    testImplementation(libs.testng)
    testCompileOnly("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")

    // 由于引入了 log4j2 , 故此处排除 spring-boot 默认的 logback 日志依赖
    configurations {
        all {
            exclude(group = "org.springframework.boot", module = "spring-boot-starter-logging")
        }
    }
}


/**
 * 打包时生成 source.jar 和 javadoc.jar
 */
configure<JavaPluginExtension> {
    withSourcesJar()
    withJavadocJar()
}

/**
 * java 编译配置
 */
tasks.withType<JavaCompile> {
    options.encoding = Charsets.UTF_8.name()
    sourceCompatibility = JavaVersion.VERSION_1_8.toString()
    targetCompatibility = JavaVersion.VERSION_1_8.toString()
}

tasks.named<Test>("test") {
    useTestNG {
        suites("testng.xml")
    }
    // 输出详细日志
    testLogging {
        // 记录日志的事件类型
        events("FAILED", "PASSED", "SKIPPED", "STANDARD_ERROR", "STANDARD_OUT", "STARTED")
        // 记录测试异常的格式
        // FULL: 完整显示异常
        // SHORT: 异常的简短显示
        exceptionFormat = TestExceptionFormat.FULL
        // 是否记录标准输出和标准错误的输出
        showStandardStreams = true
    }
    finalizedBy(tasks.jacocoTestReport)
}

/**
 * javadoc
 */
tasks.withType<Javadoc> {
    options {
        encoding = Charsets.UTF_8.name()
        charset(Charsets.UTF_8.name())
        windowTitle = "spring-hello"
        header = "spring-hello"
    }
    // 忽略 javadoc 报错
    isFailOnError = false
}

/**
 * jacoco 任务
 */
tasks.named<JacocoReport>("jacocoTestReport") {
    // 依赖于测试任务
    dependsOn(tasks.test)

    reports {
        xml.required.set(false)
        csv.required.set(false)
        html.required.set(true)

        html.outputLocation.set(layout.buildDirectory.dir("jacocoHtml"))
    }
}


/**
 * spring-boot 打包
 */
tasks.named<BootJar>("bootJar") {
    // jar 包名称
    archiveBaseName.set("jx-boot")
    // 版本号设置为空
    archiveVersion.set("")
}

/**
 * 发布到本地
 */
publishing {
    repositories {
        mavenLocal()
    }
    publications {
        create<MavenPublication>("maven") {
            groupId = project.group.toString()
            artifactId = project.name
            version = project.version.toString()

            from(components["java"])
        }
    }
}
```

## spring 配置文件

在每个 `profile` 目录中直接写死 `spring.profiles.active`, 例如 `resources/dev/application.yml`
```yaml
server:
  port: 8096
  servlet:
    context-path: /

spring:
  profiles:
    active: dev
  application:
    name: jx-boot

logging:
  config: classpath:log4j2.xml
```

## 代码地址

[https://github.com/laolang2016/gradle-study/tree/master/jx-boot](https://github.com/laolang2016/gradle-study/tree/master/jx-boot)

## 参考

[Run a Spring Boot application with the dev profile (Gradle Kotlin DSL)](https://gist.github.com/jakzal/1ff82e1c4c2a83805c370c17cc7308bc)

# spring boot 多模块项目

## 目录结构

![](/images/2024-09-12-gradle-study//011.png)


## settings.gradle.kts
```kotlin 
pluginManagement {
    repositories {
        // 插件使用阿里云 maven 源
        maven("https://maven.aliyun.com/repository/gradle-plugin")
        gradlePluginPortal()
    }
}

rootProject.name = "jx-boot-multi"

include(":jx-app")

include(":jx-framework:jx-common")
include(":jx-framework:jx-spring-boot-starter-web")

include(":jx-module:jx-module-system:jx-module-system-api")
include(":jx-module:jx-module-system:jx-module-system-biz")
```

## 根目录 build.gradle.kts【重要】

!!! tip
    重要文件

```kotlin 
import com.laolang.gradle.Version
import com.laolang.gradle.mavenAlibaba
import io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension

/**
 * 使用插件之前需要先声明
 */
plugins {
    id("org.springframework.boot") version "2.7.18"
    id("io.spring.dependency-management") version "1.0.14.RELEASE"
    id("maven-publish")
    id("java")
    id("com.dorongold.task-tree") version "3.0.0"
}

/**
 * 所有工程的配置, 包含根项目
 */
allprojects {
    repositories {
        mavenAlibaba()
        mavenLocal()
        mavenCentral()
    }
}

/**
 * 所有子工程的配置, 不包含根项目
 */
subprojects {
    // 不处理主工程, 主工程单独写构建文件
    if (name != "jx-app") {
        apply(plugin = "java-library")
        apply(plugin = "maven-publish")
        apply(plugin = "com.dorongold.task-tree")
        apply(plugin = "io.spring.dependency-management")

        group = "com.laolang.jx"
        version = "0.1"

        // 导入 Spring Boot 的 bom
        the<DependencyManagementExtension>().apply {
            imports {
                mavenBom(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES)
            }
        }

        // 注意这里 全局导入 lombok
        dependencies {
            compileOnly(rootProject.libs.lombok)
            annotationProcessor(rootProject.libs.lombok)
        }

        // 打包时生成 source.jar 和 javadoc.jar
        configure<JavaPluginExtension> {
            withSourcesJar()
            withJavadocJar()
        }

        /**
         * java 编译配置
         */
        tasks.withType<JavaCompile> {
            options.encoding = Charsets.UTF_8.name()
            sourceCompatibility = Version.sourceCompatibility.toString()
            targetCompatibility = Version.targetCompatibility.toString()
        }

        /**
         * javadoc
         */
        tasks.withType<Javadoc> {
            options {
                encoding = Charsets.UTF_8.name()
                charset(Charsets.UTF_8.name())
            }
            // 忽略 javadoc 报错
            isFailOnError = false
        }

        /**
         * 发布到本地
         */
        publishing {
            repositories {
                mavenLocal()
            }
            publications {
                create<MavenPublication>("maven") {
                    groupId = project.group.toString()
                    artifactId = project.name
                    version = project.version.toString()

                    from(components["java"])
                }
            }
        }
    }
}

/**
 * 注意这里
 * 由于根项目添加了 spring-boot 插件, 所有根项目在打包时也会执行 bootJar
 * 而根项目又没有 java 启动类, 就会导致打包报错
 * 下面的配置可忽略根项目的 bootJar 任务
 */
tasks.bootJar {
    enabled = false
}
```


## 主工程 build.gradle.kts【重要】

其实和 [spring boot](https://github.com/laolang2016/gradle-study/tree/master/jx-boot) 比起来并没有什么不同

```kotlin 
import com.laolang.gradle.Version
import com.laolang.gradle.util.GradleUtil
import org.springframework.boot.gradle.tasks.bundling.BootJar

/**
 * 已经在根项目声明过的插件,在子项目中使用时, 不需要写版本号
 */
plugins {
    application
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    id("maven-publish")
    id("com.dorongold.task-tree")
}

/**
 * 设置启动类
 */
application {
    mainClass.set("com.laolang.jx.App")
}

// profile
val profile: String = GradleUtil.getProfile("dev")
// 资源目录
val resourceDir = "src/main/resources/$profile"

println("profile:$profile")

// 设置资源目录
sourceSets {
    main {
        resources {
            srcDir(resourceDir)
        }
    }
}

/**
 * 依赖
 */
dependencies {
    implementation(project(":jx-module:jx-module-system:jx-module-system-biz"))

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // 由于引入了 log4j2, 所以此处排除默认的 logback 依赖
    configurations {
        all {
            exclude(group = "org.springframework.boot", module = "spring-boot-starter-logging")
        }
    }
}

group = "com.laolang.jx"
version = "0.1"

java {
    targetCompatibility = Version.targetCompatibility
    sourceCompatibility = Version.sourceCompatibility
    withSourcesJar()
    withJavadocJar()
}

/**
 * java 编译配置
 */
tasks.withType<JavaCompile> {
    options.encoding = Charsets.UTF_8.name()
}

/**
 * javadoc
 */
tasks.withType<Javadoc> {
    options {
        encoding = Charsets.UTF_8.name()
        charset(Charsets.UTF_8.name())
    }
    isFailOnError = false
}

/**
 * 发布到本地
 */
publishing {
    repositories {
        mavenLocal()
    }
    publications {
        create<MavenPublication>("maven") {
            groupId = project.group.toString()
            artifactId = project.name
            version = project.version.toString()

            from(components["java"])
        }
    }
}

/**
 * spring-boot 打包
 */
tasks.named<BootJar>("bootJar") {
    // jar 包名称
    archiveBaseName.set("jx-boot")
    // 版本号设置为空
    archiveVersion.set("")
}
```

## common build.gradle.kts
```kotlin 
dependencies {
    compileOnlyApi("org.springframework.boot:spring-boot-starter-web")
    api("org.springframework.boot:spring-boot-starter-json")
    api("org.springframework.boot:spring-boot-starter-log4j2")

    compileOnlyApi(libs.knife4j)

    api(libs.tlog)

    api(libs.hutool.all)
    api(libs.vavr)
    api(libs.bundles.mapstruct)
    api(libs.guava)
    api("org.apache.commons:commons-lang3")

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
}
```

## jx-spring-boot-starter-web build.gradle.kts
```kotlin 
dependencies {
    api(project(":jx-framework:jx-common"))

    api("org.springframework.boot:spring-boot-starter-web")
    api(libs.knife4j)

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
}
```

## 其他构建文件

**略**

## 几个小问题

### 打包时 bootJar 找不到启动类

![](/images/2024-09-12-gradle-study//012.png)

根项目忽略 `bootJar` 任务

```
/**
 * 注意这里 
 * 由于根项目添加了 spring-boot 插件, 所有根项目在打包时也会执行 bootJar
 * 而根项目又没有 java 启动类, 就会导致打包报错
 * 下面的配置可忽略根项目的 bootJar 任务
 */
tasks.bootJar {
    enabled = false
}
```

### idea 打包时 lombok 报错

![](/images/2024-09-12-gradle-study//013.png)

此问题不一定每次都会出现, 在设置中使用 `wrapper` 构建打包即可

![](/images/2024-09-12-gradle-study//014.png)

一个小发现: 如果 `lombok` 报错, 那么在 `idea` 中先用 `wrapper` 打包, 此时不报错, 再用 `Local installtion` 打包, 也不会再报错了

### 关于 spring boot 与 lombok 的引入

按照 [官方文档](https://docs.springframework.org.cn/spring-boot/gradle-plugin/managing-dependencies.html) 的描述, 引用方式是这样的
```
plugins {
	java
	id("org.springframework.boot") version "3.3.0" apply false
	id("io.spring.dependency-management") version "1.1.5"
}

dependencyManagement {
	imports {
		mavenBom(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES)
	}
}
```

但是我这样操作之后无法全局引入 `lombok`, 所以只好用一个比较丑陋的方式

```
subprojects {
    // 不处理主工程, 主工程单独写构建文件
    if (name != "jx-app") {
        apply(plugin = "java-library")
        apply(plugin = "maven-publish")
        apply(plugin = "com.dorongold.task-tree")
        apply(plugin = "io.spring.dependency-management")

        group = "com.laolang.jx"
        version = "0.1"

        // 导入 Spring Boot 的 bom
        the<DependencyManagementExtension>().apply {
            imports {
                mavenBom(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES)
            }
        }

        // 注意这里 全局导入 lombok
        dependencies {
            compileOnly(rootProject.libs.lombok)
            annotationProcessor(rootProject.libs.lombok)
        }
    }
}
```

### 关于 subproject 如何使用版本目录

可参考 [这里](https://stackoverflow.com/questions/77527617/using-version-catalog-in-gradle-kotlin-build-for-subprojects), 重点就是添加 `rootProject` 前缀

```
subprojects {
    // 不处理主工程, 主工程单独写构建文件
    if (name != "jx-app") {
        // 注意这里 全局导入 lombok
        dependencies {
            compileOnly(rootProject.libs.lombok)
            annotationProcessor(rootProject.libs.lombok)
        }
    }
}
```


## 代码地址

[https://github.com/laolang2016/gradle-study/tree/master/jx-boot-multi](https://github.com/laolang2016/gradle-study/tree/master/jx-boot-multi)

## 总结

1. 多模块有很多比较有意思的问题, 比如依赖传递, 比如子项目公用构建逻辑等, 我这里只是给出了一个可行的例子, 并没有详细解释, 或者说我了解的太过流于表面
2. 使用 gradle 进行多模块构建出了上面这种一个启动项目的, 还有一种就是多个启动项目, 比如 spring cloud 项目, 这个等之后再处理. 大致思路是这样的: 写一个自定义插件, 然后将这个插件应用到每个微服务的启动项目中, 在此插件的配置中填写依赖哪些子模块类似这样
```
jxBootApp {
    dependencies {
        module("jx-module-system-api")
        module("jx-module-auth-api")
        module("jx-mall-product-api")
    }

    // 启动类就不用配置了, 由自定义插件根据项目名自动填充, 当然命名要有规律
    // 比如项目名是 jx-mall-product-biz , 那么启动类应该是 JxMallProductBizApplication
}
```
3. 为什么项目结构是这样的? 主要是为了和 `maven` 构建方式兼容, 如果不考虑兼用 `maven` , 其实所有子模块应该平铺而不是嵌套
4. 尚未考虑 `gradle` 和 `docker` 或者 `jenkins` 如何结合
5. 有些工程化的东西还没处理, 例如 `checkstyle`

## 参考

[SpringBoot+Gradle构建多模块项目](https://zhuanlan.zhihu.com/p/354119928)

[springboot gradle kotlin 多模块（或微服务）统一依赖及版本管理和构建不同环境打包task,docker镜像构建task](https://blog.csdn.net/qq_36279799/article/details/131983818)

[https://github.com/emmapatterson/multi-module-spring-boot](https://github.com/emmapatterson/multi-module-spring-boot)

[spring 中文文档 gradle 插件 管理依赖项](https://docs.springframework.org.cn/spring-boot/gradle-plugin/managing-dependencies.html)

[spring boot gradle 插件官方文档](https://docs.spring.io/spring-boot/docs/2.4.5/gradle-plugin/reference/htmlsingle/)

[Springboot 多模块依赖构建常见问题](https://juejin.cn/post/6955854790027345934)

[Using version catalog in Gradle Kotlin build for subprojects](https://stackoverflow.com/questions/77527617/using-version-catalog-in-gradle-kotlin-build-for-subprojects)