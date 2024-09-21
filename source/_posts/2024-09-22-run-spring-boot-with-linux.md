---
title: spring boot 在 linux 下的启动
date: 2024-09-22 05:49:59
categories:
- java
- spring boot
tags:
- java
- spring boot
---

# 准备一个项目

```
laolang@laolang-pc:sbin$ curl http://localhost:8092/system/menu/list
{"profile":"dev","id":1001,"title":"菜单管理"}
```

# 项目基本配置

## application.yml
```yml
spring:
  profiles:
    active: dev
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
  port: 8094
  servlet:
    context-path: /

logging:
  config: classpath:log4j2-prod.xml
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
        <property name="LOG_HOME">/home/laolang/tmp/thresh-boot/logs/thresh-boot/</property>
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


# 打包

## 打包命令

```
mvn clean package -Dmaven.test.skip=true
```

## 注意事项

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

# 打包后本地启动

## 目录结构
```
laolang@laolang-pc:thresh-boot$ tree
.
├── conf
│   ├── application-prod.yml
│   ├── application.yml
│   └── log4j2-prod.xml
├── sbin
│   └── thresh.sh
└── thresh-boot.jar

3 directories, 5 files
laolang@laolang-pc:thresh-boot$ 
```

## thresh.sh
```shell
#!/bin/bash
# 不添加此行，远程执行脚本环境变量不生效
source /etc/profile
source /home/laolang/.bashrc
APP_NAME=thresh-boot.jar
OPTIONS="-Dspring.profiles.active=prod \
        -Dspring.config.additional-location=file:///home/laolang/tmp/thresh-boot/conf/application.yml,file:///home/laolang/tmp/thresh-boot/conf/application-prod.yml \
		-Dlogging.config=file:///home/laolang/tmp/thresh-boot/conf/log4j2-prod.xml"

#使用说明
usage() {
	echo "Usage: sh 执行脚本.sh [start|stop|restart|status]"
	exit 1
}

# 检查程序是否在运行
is_exist(){
	pid=$(pgrep -f $APP_NAME)
	# 如果不存在返回1，存在返回0
	if [ -z "${pid}" ]; then
		return 1
	else
		return 0
	fi
}

# 启动方法
start(){
	is_exist
	if [ $? -eq "0" ]; then
		echo "${APP_NAME} is already running. pid=${pid}. "
	else
		nohup java -jar $OPTIONS  ../$APP_NAME > /dev/null 2>&1 &
		echo "${APP_NAME} is running..."
	fi
}

# 停止方法
stop(){
	is_exist
	if [ $? -eq "0" ]; then
		kill -9 $pid
		echo "${APP_NAME} is stoped"
	else
		echo "${APP_NAME} is not running"
	fi
}

# 输出运行状态
status(){
	is_exist
	if [ $? -eq "0" ]; then
		echo "${APP_NAME} is running. Pid is ${pid}"
	else
		echo "${APP_NAME} is not running"
	fi
}

# 重启
restart(){
	stop
	start
}

# 根据输入参数，选择执行对应方法，不输入则执行使用说明
case "$1" in
	"start")
		start
		;;
	"stop")
		stop
		;;
	"status")
		status
		;;
	"restart")
		restart
		;;
	*)
		usage
		;;
esac
```

## 启动与测试

```
./thresh.sh restart && tail -f ../logs/thresh-boot/app.log
curl http://localhost:8094/system/menu/list
```

![](/images/2024-09-22-run-spring-boot-with-linux/001.png)

