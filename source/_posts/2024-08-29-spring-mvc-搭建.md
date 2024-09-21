---
title: spring mvc 搭建
date: 2024-08-29 23:47:18
categories:
- java
- spring
tags:
- java
- spring
---

# 目录结构
```
E:\code\sts3\spring_study\jx-ssm>tree /f
卷 新加卷 的文件夹 PATH 列表
卷序列号为 FA05-F6BD
E:.
│  pom.xml
│
│
└─src
    ├─main
    │  ├─java
    │  │  └─com
    │  │      └─laolang
    │  │          └─jx
    │  │              └─modules
    │  │                  └─system
    │  │                      └─dict
    │  │                          └─controller
    │  │                                  SysDictController.java
    │  │
    │  ├─resources
    │  │  │  logback.xml
    │  │  │
    │  │  └─spring
    │  │          spring-context.xml
    │  │          spring-mvc.xml
    │  │          spring-public.xml
    │  │
    │  └─webapp
    │      │  favicon.ico
    │      │
    │      └─WEB-INF
    │              web.xml
    │
    └─test
        ├─java
        └─resources

E:\code\sts3\spring_study\jx-ssm>
```

# pom.xml

> 推荐使用 `jetty` 插件, 本代码示例使用的 `spring` 版本为 `5.x` , `tomcat` 插件在启动时会报错: `Invalid byte tag in constant pool: 19`, 解决方法为使用更高版本的 `tomcat` 进行部署
> jetty:run     命令会直接使用源代码运行web程序，不将其打包成war文件。jetty插件会保证在运行前所有的类和资源都是最新的。如果你修改了代码，插件会自动重新部署。
> jetty:run-war 会先将程序打包成war文件然后再将其部署。如果有代码修改，会重新打包war文件并部署。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.laolang.jx</groupId>
	<artifactId>jx-ssm</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<packaging>war</packaging>

	<properties>
		<maven.compiler.source>8</maven.compiler.source>
		<maven.compiler.target>8</maven.compiler.target>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>

		<maven-compiler-plugin.version>3.11.0</maven-compiler-plugin.version>

		<!-- java ee -->
		<javax.servlet-api.version>3.0.1</javax.servlet-api.version>
		<jsp-api.version>2.0</jsp-api.version>
		<jstl.version>1.2</jstl.version>

		<!-- spring -->
		<spring.version>5.3.31</spring.version>
		<!-- jackson -->
		<jackson.version>2.13.5</jackson.version>

		<!-- 日志 -->
		<logback.version>1.2.12</logback.version>

		<!-- 工具类库 -->
		<lombok.version>1.18.30</lombok.version>
		
		<!-- 测试先关 -->
		<testng.version>6.14.3</testng.version>
	</properties>

	<dependencies>
		<!-- java ee -->
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>javax.servlet-api</artifactId>
			<version>${javax.servlet-api.version}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>jsp-api</artifactId>
			<version>${jsp-api.version}</version>
			<scope>provided</scope>
			<exclusions>
				<exclusion>
					<groupId>javax.servlet</groupId>
					<artifactId>servlet-api</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>jstl</artifactId>
			<version>${jstl.version}</version>
		</dependency>

		<!-- spring -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context-support</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-webmvc</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<!-- jackson -->
		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-databind</artifactId>
			<version>${jackson.version}</version>
		</dependency>
		<dependency>
			<groupId>com.fasterxml.jackson.datatype</groupId>
			<artifactId>jackson-datatype-jdk8</artifactId>
			<version>${jackson.version}</version>
		</dependency>
		<dependency>
			<groupId>com.fasterxml.jackson.datatype</groupId>
			<artifactId>jackson-datatype-jsr310</artifactId>
			<version>${jackson.version}</version>
		</dependency>
		<dependency>
			<groupId>com.fasterxml.jackson.module</groupId>
			<artifactId>jackson-module-parameter-names</artifactId>
			<version>${jackson.version}</version>
		</dependency>

		<!-- logback -->
		<dependency>
			<groupId>ch.qos.logback</groupId>
			<artifactId>logback-classic</artifactId>
			<version>${logback.version}</version>
		</dependency>

		<!-- lombok -->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<version>${lombok.version}</version>
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
				<directory>src/main/java</directory>
				<includes>
					<include>**/*.xml</include>
					<include>**/*.sql</include>
					<include>**/*.ftl</include>
				</includes>
				<filtering>false</filtering>
			</resource>
			<resource>
				<directory>src/main/resources</directory>
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
			<!-- 配置 tomcat 插件 -->
			<!-- 
				如果使用的 spring 版本是 4.x , 
				可以使用此插件, 更高版本会报错:Invalid byte tag in constant pool: 19  
			-->
			<plugin>
				<groupId>org.apache.tomcat.maven</groupId>
				<artifactId>tomcat7-maven-plugin</artifactId>
				<version>2.2</version>
				<configuration>
					<port>8096</port>
					<uriEncoding>UTF-8</uriEncoding>
					<path>/</path>
				</configuration>
			</plugin>
			<!-- 配置 jetty 插件 -->
			<!-- 
				jetty 和 jdk 版本是对应的, 此版本已经过验证
				jetty:run     命令会直接使用源代码运行web程序，不将其打包成war文件。jetty插件会保证在运行前所有的类和资源都是最新的。如果你修改了代码，插件会自动重新部署。
				jetty:run-war 会先将程序打包成war文件然后再将其部署。如果有代码修改，会重新打包war文件并部署。
			-->
			<plugin>
				<groupId>org.eclipse.jetty</groupId>
				<artifactId>jetty-maven-plugin</artifactId>
				<version>9.4.55.v20240627</version>
				<configuration>
					<httpConnector>
						<!-- 端口 -->
						<port>8096</port>
						<!-- 服务器监听地址 -->
						<host>localhost</host>
					</httpConnector>
					<!-- 扫描进行热部署的间隔时间 -->
					<scanIntervalSeconds>1</scanIntervalSeconds>
				</configuration>
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

# web.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://java.sun.com/xml/ns/javaee"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
	version="3.0">
	<display-name>jx-ssm</display-name>

	<welcome-file-list>
		<welcome-file></welcome-file>
	</welcome-file-list>

	<!-- 加载配置文件 -->
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>classpath:spring/spring-context.xml</param-value>
	</context-param>

	<!-- 防止 maven 部署时出现内在泄漏 -->
	<!--<listener> -->
	<!--<listener-class>se.jiderhamn.classloader.leak.prevention.ClassLoaderLeakPreventorListener</listener-class> -->
	<!--</listener> -->

	<!-- Spring监听器 -->
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	<!-- 防止Spring内存溢出监听器 -->
	<listener>
		<listener-class>org.springframework.web.util.IntrospectorCleanupListener</listener-class>
	</listener>

	<!-- 编码过滤器 -->
	<filter>
		<filter-name>CharacterEncodingFilter</filter-name>
		<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
		<init-param>
			<param-name>encoding</param-name>
			<param-value>utf-8</param-value>
		</init-param>
	</filter>
	<filter-mapping>
		<filter-name>CharacterEncodingFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>

	<!-- 解决PUT请求无法提交表单数据的问题 -->
	<filter>
		<filter-name>HttpMethodFilter</filter-name>
		<filter-class>org.springframework.web.filter.HttpPutFormContentFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>HttpMethodFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>

	<!-- 配置 HiddenHttpMethodFilter: 把 POST 请求转为 DELETE、PUT 请求 -->
	<filter>
		<filter-name>HiddenHttpMethodFilter</filter-name>
		<filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
	</filter>

	<filter-mapping>
		<filter-name>HiddenHttpMethodFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>

	<!-- spring servlet -->
	<servlet>
		<servlet-name>dispatcherServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:spring/spring-mvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>dispatcherServlet</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>

	<servlet-mapping>
		<servlet-name>default</servlet-name>
		<url-pattern>*.ico</url-pattern>
	</servlet-mapping>
</web-app>
```

# spring 配置文件

## spring-context.xml
> 此文件为 `spring` 总配置文件, 其他所有的 `spring` 配置文件都 `import` 到本文件中, `web.xml` 只需要引入此配置文件即可
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- Spring容器中注册非@controller注解的Bean -->
    <!-- 使用Annotation自动注册Bean，解决事物失效问题：在主容器中不扫描@Controller注解，在SpringMvc中只扫描@Controller注解。  -->
    <context:component-scan base-package="com.laolang"><!-- base-package 如果多个，用“,”分隔 -->
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <import resource="classpath:spring/spring-public.xml" />
    <import resource="classpath:spring/spring-mvc.xml" />
</beans>
```

## spring-public.xml
> 此文件主要包含公用的类或者配置, 例如配置文件的导入或者数据源等
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">


</beans>
```

## spring-mvc.xml
> 此文件专门用于配置 `spring mvc`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
		http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">


    <!-- TODO 添加 接口包的扫描 -->
    <!-- Spring容器中注册@controller注解的Bean -->
    <context:component-scan base-package="com.laolang.jx.**.controller" use-default-filters="false">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>


    <!-- 注解驱动 -->
    <mvc:annotation-driven />

    <!-- 静态资源过虑 -->
    <mvc:default-servlet-handler/>

    <mvc:resources mapping="/favicon.ico" location="favicon.ico"/>
</beans>
```

# logback.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- scan: 当此属性设置为true时，配置文件如果发生改变，将会被重新加载，默认值为true。 scanPeriod: 设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当scan为true时，此属性生效。默认的时间间隔为1分钟。 
	debug: 当此属性设置为true时，将打印出logback内部日志信息，实时查看logback运行状态。默认值为false -->
<configuration scan="true" scanPeriod="60 seconds"
	debug="false">

	<!-- 输出到控制台 -->
	<appender name="console"
		class="ch.qos.logback.core.ConsoleAppender">
		<encoder>
			<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{20} - %msg%n</pattern>
			<charset>UTF-8</charset>
		</encoder>
	</appender>

	<!-- 输出到滚动文件 -->
	<appender name="rolling-file"
		class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>../logs/jx-ssm/app.log</file>
		<encoder>
			<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{20} - %msg%n</pattern>
			<charset>UTF-8</charset>
		</encoder>
		<rollingPolicy
			class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<fileNamePattern>../logs/jx-ssm/%d{yyyy-MM-dd}/app-%d{yyyy-MM-dd}.%i.log
			</fileNamePattern>
			<timeBasedFileNamingAndTriggeringPolicy
				class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
				<maxFileSize>10MB</maxFileSize>
			</timeBasedFileNamingAndTriggeringPolicy>
			<!-- 日志文件保留天数 -->
			<maxHistory>150</maxHistory>
		</rollingPolicy>
	</appender>

	<root level="DEBUG">
		<appender-ref ref="console" />
		<appender-ref ref="rolling-file" />
	</root>

	<logger name="com.laolang" level="INFO" additivity="false">
		<appender-ref ref="console" />
		<appender-ref ref="rolling-file" />
	</logger>
</configuration>
```

# controller
```java
package com.laolang.jx.modules.system.dict.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("system/dict")
@RestController
public class SysDictController {

	@GetMapping("list")
	public Map<String, Object> list(){
		log.info("system dict list");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("id", 1001L);
		map.put("groupCode", "system");
		return map;
	}	
}
```

# 效果
```
$ curl --request GET \
  --url http://localhost:8096/system/dict/list \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'User-Agent: PostmanRuntime-ApipostRuntime/1.1.0'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    32    0    32    0     0    146      0 --:--:-- --:--:-- --:--:--   146

{"id":1001,"groupCode":"system"}
```
