---
title: maven 笔记
date: 2024-09-15 10:04:15
categories:
- java
- maven
tags:
- java
- maven
---

# 阿里云镜像

```xml
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
```

# maven 基本操作

## 设置 MAVEN_OPTS 环境变量

通常 `MAVEN_OPTS` 用来配置运行时内存大小

```
-Xms1024m -Xmx1024m
```


如果不指定, 则使用本机默认的 `jvm` 配置, 例如我的电脑上默认配置如下

```
E:\code\idea\maven-study\maven-study\jx-boot>java -XX:+PrintFlagsFinal -version | findstr /i "HeapSize PermSize ThreadStackSize"
     intx CompilerThreadStackSize                   = 0                                   {pd product}
    uintx ErgoHeapSizeLimit                         = 0                                   {product}
    uintx HeapSizePerGCThread                       = 87241520                            {product}
    uintx InitialHeapSize                          := 1069547520                          {product}
    uintx LargePageHeapSizeThreshold                = 134217728                           {product}
    uintx MaxHeapSize                              := 4227858432                          {product}
     intx ThreadStackSize                           = 0                                   {pd product}
     intx VMThreadStackSize                         = 0                                   {pd product}
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)

E:\code\idea\maven-study\maven-study\jx-boot>
```

`Xms` 配置为 1G

```
uintx InitialHeapSize                          := 1069547520                          {product}
```

`Xmx` 配置为 4G

```
uintx MaxHeapSize                              := 4227858432                          {product}
```

> 关于 `java8` 查看默认内存大小的方法: 
> 
> windows:
> ```
> java -XX:+PrintFlagsFinal -version | findstr /i "HeapSize PermSize ThreadStackSize"
> ```
> 
> linux:
> ```
> java -XX:+PrintFlagsFinal -version | grep -iE 'HeapSize|PermSize|ThreadStackSize'
> ```
> 
> 关于 `jvm` 各种内存大小的含义可参考: [java -Xms -Xmx -XX:PermSize -XX:MaxPermSize-详解](https://blog.csdn.net/superzyl/article/details/79077166)


# maven 常用插件

## exec-maven-plugin

### 命令说明

`exec:exec` : execute programs and Java programs in a separate process.
`exec:java` : execute Java programs in the same VM.


### 基本使用

**pom.xml**

> **注意:** 这是一个最小化配置

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <version>3.4.1</version>
            <configuration>
                <executable>java</executable>
                <arguments>
                    <argument>-classpath</argument>
                    <classpath/>
                    <argument>com.laolang.jx.JxApplication</argument>
                </arguments>
            </configuration>
        </plugin>
    </plugins>
</build>
```

直接执行 `mvn clean package exec:exec` 即可

> **注意:** `maven-exec-plugin` 不会自动编译代码, 所以需要手动执行编译动作, 自动编译的方法在下面

```
E:\code\idea\maven-study\maven-study\jx-boot>mvn clean package exec:exec
[INFO] Scanning for projects...
[INFO]
[INFO] -----------------------< com.laolang.jx:jx-boot >-----------------------
[INFO] Building jx-boot 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- clean:3.2.0:clean (default-clean) @ jx-boot ---
[INFO] Deleting E:\code\idea\maven-study\maven-study\jx-boot\target
[INFO]
[INFO] --- resources:3.3.1:resources (default-resources) @ jx-boot ---
[WARNING] Using platform encoding (GBK actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] Copying 0 resource from src\main\resources to target\classes
[INFO]
[INFO] --- compiler:3.13.0:compile (default-compile) @ jx-boot ---
[INFO] Recompiling the module because of changed source code.
[WARNING] File encoding has not been set, using platform encoding GBK, i.e. build is platform dependent!
[INFO] Compiling 1 source file with javac [debug target 1.8] to target\classes
[INFO]
[INFO] --- resources:3.3.1:testResources (default-testResources) @ jx-boot ---
[WARNING] Using platform encoding (GBK actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory E:\code\idea\maven-study\maven-study\jx-boot\src\test\resources
[INFO]
[INFO] --- compiler:3.13.0:testCompile (default-testCompile) @ jx-boot ---
[INFO] Recompiling the module because of changed dependency.
[WARNING] File encoding has not been set, using platform encoding GBK, i.e. build is platform dependent!
[INFO]
[INFO] --- surefire:3.2.5:test (default-test) @ jx-boot ---
[INFO]
[INFO] --- jar:3.4.1:jar (default-jar) @ jx-boot ---
[INFO] Building jar: E:\code\idea\maven-study\maven-study\jx-boot\target\jx-boot-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- exec:3.4.1:exec (default-cli) @ jx-boot ---
Hello World
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.025 s
[INFO] Finished at: 2024-09-15T11:19:22+08:00
[INFO] ------------------------------------------------------------------------

E:\code\idea\maven-study\maven-study\jx-boot>
```

### 自动编译

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <version>3.4.1</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>exec</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <executable>java</executable>
                <arguments>
                    <argument>-classpath</argument>
                    <classpath/>
                    <argument>com.laolang.jx.JxApplication</argument>
                </arguments>
            </configuration>
        </plugin>
    </plugins>
</build>
```

直接执行 `mvn package` 即可, 效果如下

```
E:\code\idea\maven-study\maven-study\jx-boot>dir
 驱动器 E 中的卷是 新加卷
 卷的序列号是 FA05-F6BD

 E:\code\idea\maven-study\maven-study\jx-boot 的目录

2024/09/15  11:26    <DIR>          .
2024/09/15  11:26    <DIR>          ..
2024/09/15  11:26             2,030 pom.xml
2024/09/15  10:26    <DIR>          src
               1 个文件          2,030 字节
               3 个目录 332,883,976,192 可用字节

E:\code\idea\maven-study\maven-study\jx-boot>mvn package
[INFO] Scanning for projects...
[INFO]
[INFO] -----------------------< com.laolang.jx:jx-boot >-----------------------
[INFO] Building jx-boot 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- resources:3.3.1:resources (default-resources) @ jx-boot ---
[WARNING] Using platform encoding (GBK actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] Copying 0 resource from src\main\resources to target\classes
[INFO]
[INFO] --- compiler:3.13.0:compile (default-compile) @ jx-boot ---
[INFO] Recompiling the module because of changed source code.
[WARNING] File encoding has not been set, using platform encoding GBK, i.e. build is platform dependent!
[INFO] Compiling 1 source file with javac [debug target 1.8] to target\classes
[INFO]
[INFO] --- resources:3.3.1:testResources (default-testResources) @ jx-boot ---
[WARNING] Using platform encoding (GBK actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory E:\code\idea\maven-study\maven-study\jx-boot\src\test\resources
[INFO]
[INFO] --- compiler:3.13.0:testCompile (default-testCompile) @ jx-boot ---
[INFO] Recompiling the module because of changed dependency.
[WARNING] File encoding has not been set, using platform encoding GBK, i.e. build is platform dependent!
[INFO]
[INFO] --- surefire:3.2.5:test (default-test) @ jx-boot ---
[INFO]
[INFO] --- jar:3.4.1:jar (default-jar) @ jx-boot ---
[INFO] Building jar: E:\code\idea\maven-study\maven-study\jx-boot\target\jx-boot-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- exec:3.4.1:exec (default) @ jx-boot ---
Hello World
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.958 s
[INFO] Finished at: 2024-09-15T11:26:28+08:00
[INFO] ------------------------------------------------------------------------

E:\code\idea\maven-study\maven-study\jx-boot>
```

### 常用参数

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <version>1.2.1</version>
    <executions>
        <execution>
            <phase>install</phase>
            <goals>
                <goal>exec</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <executable>java</executable> <!-- executable指的是要执行什么样的命令 -->
        <arguments>
            <argument>-DsystemProperty1=value1</argument> <!-- 这是一个系统属性参数 -->
            <argument>-DsystemProperty2=value2</argument> <!-- 这是一个系统属性参数 -->
            <argument>-XX:MaxPermSize=256m</argument> <!-- 这是一个JVM参数 -->
            <argument>-classpath</argument> <!-- 这是classpath属性，其值就是下面的<classpath/> -->
            <classpath/> <!-- 这是exec插件最有价值的地方，工程的classpath并不需要手动指定，由exec自动计算得出 -->
            <argument>com.github.binarylei.Main</argument> <!-- 程序入口，主类名称 -->
            <argument>arg1</argument> <!-- 程序的第一个命令行参数 -->
            <argument>arg2</argument> <!-- 程序的第二个命令行参数 -->
        </arguments>
    </configuration>
</plugin>
```

### 参考

[Maven系列（二）exec-maven-plugin](https://www.cnblogs.com/binarylei/p/8628243.html)

[maven-exec-plugin 官方文档](https://www.mojohaus.org/exec-maven-plugin/)

## maven-jar-plugin

## 命令说明

`jar:jar`: 为你的项目类创建一个包含资源的 jar 文件
`jar:test-jar`: 为您的项目测试类创建一个 jar 文件

## 打包可执行 jar

一般 `maven` 打包的 `jar` 文件时不能直接执行的, 此时加入此插件即可执行
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.4.2</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>com.laolang.jx.JxApplication</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## 配置 classpath
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.4.2</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>com.laolang.jx.JxApplication</mainClass>
                <addClasspath>true</addClasspath>
                <classpathPrefix>dependency/</classpathPrefix>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

此时打包后, 还需要执行 `mvn dependency:copy-dependencies` 命令, 将依赖的 `jar` 包下载下来, 此命令默认下载到 `target/dependency` 目录

### 强制使用 SNAPSHOT 依赖

默认 `SNAPSHOT` 依赖不会被加载, 可以使用 `useUniqueVersions` 来启用

```xml
<configuration>
  <archive>
    <manifest>
      <useUniqueVersions>false</useUniqueVersions>
    </manifest>
  </archive>
</configuration>
```

### 参考

[Apache Maven JAR 中文文档](https://maven.org.cn/plugins/maven-jar-plugin/)
[java -jar maven项目打包提示.jar中没有主清单属性](https://blog.csdn.net/whq12789/article/details/106568531)
[maven插件maven-jar-plugin构建jar文件详细使用](https://blog.csdn.net/txhlxy/article/details/136066509)

## maven-shade-plugin

## 基本使用

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.2.4</version>
    <configuration>
        <transformers>
            <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                <manifestEntries>
                    <Main-Class>${app.main.class}</Main-Class>
                </manifestEntries>
            </transformer>
        </transformers>
    </configuration>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>shade</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

直接运行 `mvn package` 会生成两个文件 
`jx-boot-1.0-SNAPSHOT.jar` : 包含所有依赖
`original-jx-boot-1.0-SNAPSHOT.jar`: 只包含项目代码, 不包含依赖

### 参考

[maven-shade-plugin介绍及使用](https://blog.csdn.net/yangguosb/article/details/80619481)
[maven-plugin-shade 详解](https://www.cnblogs.com/lkxed/p/maven-plugin-shade.html)
[Apache Maven Shade Plugin 官网文档](https://maven.apache.org/plugins/maven-shade-plugin/index.html)

## maven-antrun-plugin

## maven-compiler-plugin

### 基本使用

通常用来配置编译时的语言版本
```xml
<project>
  [...]
  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
  [...]
</project>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.13.0</version>
    <configuration>
        <source>${maven.compiler.source}</source>
        <target>${maven.compiler.target}</target>
        <encoding>${project.build.sourceEncoding}</encoding>
    </configuration>
</plugin>
```

### 参考

[maven-compiler-plugin 插件详解](https://blog.csdn.net/Java_1710/article/details/120992614)
[maven-compiler-plugin 中文文档](https://maven.org.cn/plugins/maven-compiler-plugin/)

## maven-resource-plugin

## maven-surefire-plugin

## jetty-maven-plugin

# 参考

[常用 Maven 插件大全（速度收藏）](https://developer.aliyun.com/article/1469391)

[Maven常用插件整理](https://www.cnblogs.com/april-chen/p/10414857.html)

[尚硅谷Maven教程（maven入门+高深，全网无出其右！）](https://www.bilibili.com/video/BV12q4y147e4)

[动力节点最新Maven教程，maven从零到精通](https://www.bilibili.com/video/BV1nx4y1U755)

[玩转Maven](https://blog.csdn.net/txhlxy/category_12566515.html)

[Maven系列](https://blog.csdn.net/weixin_46228112/article/details/134196308)

