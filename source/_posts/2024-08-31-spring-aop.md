---
title: spring aop
date: 2024-08-31 23:03:13
categories:
- java
- ssm
- spring
tags:
- java
- ssm
- spring
---

# aop Hello World

## pom
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.laolang.jx</groupId>
	<artifactId>aop-study</artifactId>
	<version>0.0.1-SNAPSHOT</version>

	<properties>
		<maven.compiler.source>8</maven.compiler.source>
		<maven.compiler.target>8</maven.compiler.target>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>

		<maven-compiler-plugin.version>3.11.0</maven-compiler-plugin.version>

		<!-- spring -->
		<spring.version>5.3.31</spring.version>

		<aspectj.version>1.9.7</aspectj.version>

		<!-- 日志 -->
		<logback.version>1.2.12</logback.version>

		<!-- 工具类库 -->
		<lombok.version>1.18.30</lombok.version>
		<hutool.version>5.8.11</hutool.version>
		<vavr.version>0.10.4</vavr.version>
		<guava.version>23.0</guava.version>
		<commons-lang3.version>3.12.0</commons-lang3.version>

		<!-- 测试先关 -->
		<testng.version>6.14.3</testng.version>
	</properties>
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

	<dependencies>
		<!-- spring -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context-support</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-aop</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-aspects</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-test</artifactId>
			<scope>test</scope>
		</dependency>

		<!-- logback -->
		<dependency>
			<groupId>ch.qos.logback</groupId>
			<artifactId>logback-classic</artifactId>
			<version>${logback.version}</version>
		</dependency>

		<!-- 工具类库 -->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<version>${lombok.version}</version>
		</dependency>
		<dependency>
			<groupId>cn.hutool</groupId>
			<artifactId>hutool-all</artifactId>
			<version>${hutool.version}</version>
		</dependency>
		<dependency>
			<groupId>io.vavr</groupId>
			<artifactId>vavr</artifactId>
			<version>${vavr.version}</version>
		</dependency>
		<dependency>
			<groupId>com.google.guava</groupId>
			<artifactId>guava</artifactId>
			<version>${guava.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.commons</groupId>
			<artifactId>commons-lang3</artifactId>
			<version>${commons-lang3.version}</version>
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
				<artifactId>maven-resources-plugin</artifactId>
				<version>2.7</version>
				<configuration>
					<encoding>UTF-8</encoding>
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

## 被代理类
```java
package com.laolang.jx.module.system.dict.logic;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SysDictTypeLogic {

	
	public void dictTypeList() {
		log.info("dict type list");
	}
	
	public void dictTypeDelete() {
		log.info("dict type delete");
	}
}
```

## 注解配置
### aspect 代理
```java
package com.laolang.jx.module.system.dict.aop;

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class SysDictLogicAspect {

	@Before("execution(public * com.laolang.jx.module.system..logic.SysDictTypeLogic.* (..))")
	public void preHandler() {
		log.info("pre handler");
	}
	
	@After("execution(public * com.laolang.jx.module.system..logic.*.* (..))")
	public void postHandler() {
		log.info("post handler");
	}
}
```

### spring 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:p="http://www.springframework.org/schema/p" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.3.xsd
		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

	<context:component-scan base-package="com.laolang"></context:component-scan>

	<aop:aspectj-autoproxy />
</beans>
```

## schema 配置
### 代理类
```java
package com.laolang.jx.module.system.dict.aop;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SysDictLogicAspect {

	public void preHandler() {
		log.info("pre handler");
	}

	public void postHandler() {
		log.info("post handler");
	}
}
```
### spring 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:p="http://www.springframework.org/schema/p" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.3.xsd
		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

	<context:component-scan base-package="com.laolang"></context:component-scan>

	<bean id="logicAspect" class="com.laolang.jx.module.system.dict.aop.SysDictLogicAspect" />

	<aop:config>
		<aop:pointcut expression="execution(public * com.laolang.jx.module.system..logic.*.* (..))" id="logicPointcut"/>
		<aop:aspect ref="logicAspect" order="1">
			<aop:before method="preHandler" pointcut-ref="logicPointcut"/>
			<aop:after method="postHandler" pointcut-ref="logicPointcut"/>
		</aop:aspect>
	</aop:config>
</beans>
```

## 测试类
```java
package com.laolang.jx;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.laolang.jx.module.system.dict.logic.SysDictTypeLogic;

public class CommonTest {
	
	private ApplicationContext context; 
	
	@BeforeClass
	public void before() {
		context = new ClassPathXmlApplicationContext("spring-context.xml");
	}

	@Test
	public void testOne() {
		SysDictTypeLogic sysDictTypeLogic = context.getBean(SysDictTypeLogic.class);
		sysDictTypeLogic.dictTypeList();
	}
}
```

## 效果

```
2024-09-01 00:22:59.024 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - pre handler
2024-09-01 00:22:59.058 [main] INFO  c.l.j.m.s.d.l.SysDictTypeLogic - dict type list
2024-09-01 00:22:59.058 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - post handler
```

# 各种增强混合使用时的顺序
```java
/**
 * @throws Throwable 
 * @Around：环绕	:是Spring中强大的通知；
 * @Around：环绕:动态代理；
 * 	try{
 * 			//前置通知
 * 			method.invoke(obj,args);
 * 			//返回通知
 * 	}catch(e){
 * 			//异常通知
 *  }finally{
 * 			//后置通知
 * 	}
 * 		
 * 	四合一通知就是环绕通知；
 * 	环绕通知中有一个参数：	ProceedingJoinPoint pjp
 * 
 *环绕通知：是优先于普通通知执行，执行顺序；
 *
 *[普通前置]
 *{
 *	try{
 *		环绕前置
 *		环绕执行：目标方法执行
 *		环绕返回
 *	}catch(){
 *		环绕出现异常
 *	}finally{
 *		环绕后置
 *	}
 *}
 *
 *
 *[普通后置]
 *[普通方法返回/方法异常]
 *新的顺序：
 *  （环绕前置---普通前置）----目标方法执行----环绕正常返回/出现异常-----环绕后置----普通后置---普通返回或者异常
 *注意：
 */
```

# aop 失效
## 问题复现
### logic
```java
package com.laolang.jx.module.system.dict.logic;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SysDictTypeLogic {

	public void dictTypeList() {
		log.info("dict type list");
		dictTypeDelete();
	}

	public void dictTypeDelete() {
		log.info("dict type delete");
	}
}
```

### 代理类
```java
package com.laolang.jx.module.system.dict.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class SysDictLogicAspect {

	@Before("execution(public * com.laolang.jx.module.system..logic.SysDictTypeLogic.* (..))")
	public void preHandler(JoinPoint joinPoint) {
		log.info("{} pre handler", joinPoint.getSignature().getName());
	}

	@After("execution(public * com.laolang.jx.module.system..logic.*.* (..))")
	public void postHandler(JoinPoint joinPoint) {
		log.info("{} post handler", joinPoint.getSignature().getName());
	}
}
```

### 输出
```
2024-09-01 13:19:31.273 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - dictTypeList pre handler
2024-09-01 13:19:31.301 [main] INFO  c.l.j.m.s.d.l.SysDictTypeLogic - dict type list
2024-09-01 13:19:31.301 [main] INFO  c.l.j.m.s.d.l.SysDictTypeLogic - dict type delete
2024-09-01 13:19:31.301 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - dictTypeList post handler
```

## 解决方法
### spring 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:p="http://www.springframework.org/schema/p" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.3.xsd
		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

	<context:component-scan base-package="com.laolang"></context:component-scan>

	<aop:aspectj-autoproxy expose-proxy="true" />
</beans>
```

### logic
```java
package com.laolang.jx.module.system.dict.logic;

import org.springframework.aop.framework.AopContext;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SysDictTypeLogic {

	public void dictTypeList() {
		log.info("dict type list");
		SysDictTypeLogic self = (SysDictTypeLogic) AopContext.currentProxy();
		self.dictTypeDelete();
	}

	public void dictTypeDelete() {
		log.info("dict type delete");
	}
}
```

### 效果
```
2024-09-01 13:21:22.928 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - dictTypeList pre handler
2024-09-01 13:21:22.936 [main] INFO  c.l.j.m.s.d.l.SysDictTypeLogic - dict type list
2024-09-01 13:21:22.937 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - dictTypeDelete pre handler
2024-09-01 13:21:22.937 [main] INFO  c.l.j.m.s.d.l.SysDictTypeLogic - dict type delete
2024-09-01 13:21:22.937 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - dictTypeDelete post handler
2024-09-01 13:21:22.937 [main] INFO  c.l.j.m.s.d.a.SysDictLogicAspect - dictTypeList post handler
```

## 原理

aop 失效有多种情况, 上述属于在类内部调用方法, 并不是通过代理对象调用, 所以内部调用的方法 aop 会失效. 解决方法时通过代理类调用

## 参考
[spring中expose-proxy的作用与原理](https://www.cnblogs.com/mzcx/p/11430846.html)
[Spring专题: 4. AOP失效的场景与原理](https://www.jianshu.com/p/5df09b132abd)