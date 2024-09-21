---
title: docker 启动 spring boot
date: 2024-09-22 05:46:55
categories:
- java
- spring boot
tags:
- java
- spring boot
---

# 准备一个项目

```
laolang@laolang-pc:~$ curl http://localhost:8092/system/menu/list
{"profile":"dev","id":1001,"time":"2024-07-13 07:59:02","title":"菜单管理"}
```

# 项目基本配置

## application.yml
```yml
spring:
  profiles:
    active: ${spring.profiles.active}
  application:
    name: thresh-boot
```
## application-dev.yml
```yml
server:
  port: 8092
  servlet:
    context-path: /

logging:
  config: classpath:log4j2-dev.xml
```

## application-prod.yml
```yml
server:
  port: 8080
  servlet:
    context-path: /

logging:
  config: /usr/local/thresh-boot/conf/log4j2-prod.xml
```

## log4j2-dev.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <properties>
        <property name="LOG_HOME">../logs/thresh-boot</property>
        <property name="FILE_NAME">app</property>
        <property name="thresh.level">debug</property>
    </properties>


    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%25t] %-5level %l - %msg%n"/>
        </Console>

        <RollingRandomAccessFile name="RollingRandomAccessFile" fileName="${LOG_HOME}/${FILE_NAME}.log"
                                 filePattern="${LOG_HOME}/${date:yyyy-MM-dd}/${FILE_NAME}-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%25t] %-5level %l - %msg%n"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="10 MB"/>
            </Policies>
            <DefaultRolloverStrategy max="20"/>
        </RollingRandomAccessFile>
    </Appenders>

    <Loggers>
        <Root level="${thresh.level}">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="RollingRandomAccessFile"/>
        </Root>

        <Logger name="com.laolang" level="${thresh.level}" additivity="false">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="RollingRandomAccessFile"/>
        </Logger>
    </Loggers>
</Configuration>
```

## log4j2-prod.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <properties>
        <!-- 这里用全路径 -->
        <property name="LOG_HOME">/usr/local/thresh-boot/log/</property>
        <property name="FILE_NAME">app</property>
        <!-- 改为 info 级别 -->
        <property name="thresh.level">info</property>
    </properties>


    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %l - %msg%n"/>
        </Console>

        <RollingRandomAccessFile name="RollingRandomAccessFile" fileName="${LOG_HOME}/${FILE_NAME}.log"
                                 filePattern="${LOG_HOME}/${date:yyyy-MM-dd}/${FILE_NAME}-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %l - %msg%n"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="10 MB"/>
            </Policies>
            <DefaultRolloverStrategy max="20"/>
        </RollingRandomAccessFile>
    </Appenders>

    <Loggers>
        <Root level="${thresh.level}">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="RollingRandomAccessFile"/>
        </Root>

        <Logger name="com.laolang" level="${thresh.level}" additivity="false">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="RollingRandomAccessFile"/>
        </Logger>
    </Loggers>
</Configuration>
```


# maven 打包

## maven 打包命令

```
mvn clean package -Dmaven.test.skip=true
```

## maven 打包注意事项

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

    <profiles>
        <profile>
            <id>dev</id>
            <properties>
                <profiles.active>dev</profiles.active>
            </properties>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
        </profile>
        <profile>
            <id>prod</id>
            <properties>
                <profiles.active>prod</profiles.active>
            </properties>
        </profile>
    </profiles>

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

# docker 打包

## Dockerfile
```docker
# 基础镜像使用 java8
FROM java:8
# 作者
MAINTAINER khl <xiaodaima2016@163.com>
# 修正时区问题
RUN bash -c 'echo "Asia/Shanghai" > /etc/timezone'
# 端口
EXPOSE 8080
# 挂载目录
VOLUME /usr/local/thresh-boot/conf
VOLUME /usr/local/thresh-boot/log
# 添加配置文件
ADD src/main/resources/application.yml /usr/local/thresh-boot/conf/application.yml
ADD src/main/resources/application-prod.yml /usr/local/thresh-boot/conf/application-prod.yml
ADD src/main/resources/log4j2-prod.xml /usr/local/thresh-boot/conf/log4j2-prod.xml
# 将jar包添加到容器中并更名为app.jar
ADD target/thresh-boot.jar /usr/local/thresh-boot/app/app.jar
# 运行jar包
# -Dspring.config.location 的值可以是文件名也可是路径， 如果是路径，需要以 / 结尾
ENTRYPOINT [ "java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Dspring.config.location=/usr/local/thresh-boot/conf/", \
    "-Dspring.profiles.active=prod", \
    "-jar", \
    "/usr/local/thresh-boot/app/app.jar" \
]
```

## 打包命令

> 注意: 修改镜像时，如果不需要修改版本号，最好将本地镜像删除

```
docker build -t khl/thresh-boot:0.1 .
```

# 启动

## 目录结构

> 配置文件从工程复制即可

```
laolang@laolang-pc:thresh-boot$ tree
.
├── conf
│   ├── application-prod.yml
│   ├── application.yml
│   └── log4j2-prod.xml
└── log
    └── app.log

3 directories, 4 files
laolang@laolang-pc:thresh-boot$ 
```

## 启动命令

```
docker run --name thresh-boot-dev -d -p 10201:8080 \
-v /home/laolang/app/thresh-boot/conf:/usr/local/thresh-boot/conf \
-v /home/laolang/app/thresh-boot/log:/usr/local/thresh-boot/log \
khl/thresh-boot:0.1
```

## 效果

![image](/images/2024-09-22-run-spring-boot-with-docker/001.png)

