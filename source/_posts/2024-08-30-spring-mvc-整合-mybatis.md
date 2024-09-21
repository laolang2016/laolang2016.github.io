---
title: spring mvc 整合 mybatis
date: 2024-08-30 11:37:10
categories:
- java
- spring
tags:
- java
- spring
---

# 整合 mybatis

## pom.xml
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

		<!-- 数据库 -->
		<mybatis.versin>3.5.9</mybatis.versin>
		<mybatis-spring.version>2.0.6</mybatis-spring.version>
		<mysql-connector-j.version>8.0.33</mysql-connector-j.version>
		<druid.version>1.2.4</druid.version>
		<pagehelper.version>5.3.0</pagehelper.version>

		<aspectj.version>1.9.7</aspectj.version>

		<!-- 日志 -->
		<logback.version>1.2.12</logback.version>

		<!-- 工具类库 -->
		<lombok.version>1.18.30</lombok.version>
		<hutool.version>5.8.11</hutool.version>
		<vavr.version>0.10.4</vavr.version>
		<mapstruct.version>1.4.2.Final</mapstruct.version>
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
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context-support</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-webmvc</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-jdbc</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-tx</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-aop</artifactId>
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

		<!-- 数据库 -->
		<dependency>
			<groupId>org.mybatis</groupId>
			<artifactId>mybatis</artifactId>
			<version>${mybatis.versin}</version>
		</dependency>
		<dependency>
			<groupId>org.mybatis</groupId>
			<artifactId>mybatis-spring</artifactId>
			<version>${mybatis-spring.version}</version>
		</dependency>
		<dependency>
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<version>${mysql-connector-j.version}</version>
		</dependency>
		<dependency>
			<groupId>com.alibaba</groupId>
			<artifactId>druid</artifactId>
			<version>${druid.version}</version>
		</dependency>
		<dependency>
			<groupId>com.github.pagehelper</groupId>
			<artifactId>pagehelper</artifactId>
			<version>${pagehelper.version}</version>
		</dependency>

		<!-- aspectj -->
		<dependency>
			<groupId>org.aspectj</groupId>
			<artifactId>aspectjweaver</artifactId>
			<version>${aspectj.version}</version>
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
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct</artifactId>
			<version>${mapstruct.version}</version>
		</dependency>
		<dependency>
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct-jdk8</artifactId>
			<version>${mapstruct.version}</version>
		</dependency>
		<dependency>
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct-processor</artifactId>
			<version>${mapstruct.version}</version>
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
			<id>test</id>
			<properties>
				<profiles.active>test</profiles.active>
			</properties>
		</profile>
	</profiles>

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
				<!-- 资源根目录排除各环境的配置，使用单独的资源目录来指定 -->
				<excludes>
					<exclude>dev/*</exclude>
					<exclude>test/*</exclude>
				</excludes>
			</resource>
			<resource>
				<directory>src/main/resources/${profiles.active}</directory>
			</resource>
		</resources>
		<testResources>
			<testResource>
				<directory>src/test/java</directory>
				<includes>
					<include>**/*.xml</include>
					<include>**/*.sql</include>
					<include>**/*.ftl</include>
				</includes>
				<filtering>false</filtering>
			</testResource>
			<testResource>
				<directory>src/test/resources</directory>
			</testResource>
		</testResources>
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
			<!-- 配置 tomcat 插件 -->
			<!-- 如果使用的 spring 版本是 4.x , 可以使用此插件, 更高版本会报错:Invalid byte tag in constant 
				pool: 19 -->
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
			<!-- jetty 和 jdk 版本是对应的, 此版本已经过验证 jetty:run 命令会直接使用源代码运行web程序，不将其打包成war文件。jetty插件会保证在运行前所有的类和资源都是最新的。如果你修改了代码，插件会自动重新部署。 
				jetty:run-war 会先将程序打包成war文件然后再将其部署。如果有代码修改，会重新打包war文件并部署。 -->
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

## spring-public.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

	<!-- 导入配置文件 -->
	<bean
		class="org.springframework.context.support.PropertySourcesPlaceholderConfigurer">
		<!-- 忽略没有找到的资源文件 -->
		<property name="ignoreResourceNotFound" value="true" />
		<!-- 配置资源文件 -->
		<property name="locations">
			<list>
				<value>classpath:properties/config.properties</value>
				<value>classpath:properties/db.properties</value>
			</list>
		</property>
	</bean>

	<!-- 配置 druid数据源 -->
	<bean id="dataSource"
		class="com.alibaba.druid.pool.DruidDataSource" init-method="init"
		destroy-method="close">
		<!-- 基本属性 url、user、password -->
		<property name="url" value="${jdbc.jdbcUrl}" />
		<property name="username" value="${jdbc.user}" />
		<property name="password" value="${jdbc.password}" />

		<!-- 配置初始化大小、最小、最大 -->
		<property name="initialSize" value="1" />
		<property name="minIdle" value="1" />
		<property name="maxActive" value="20" />

		<!-- 配置获取连接等待超时的时间 -->
		<property name="maxWait" value="60000" />

		<!-- 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒 -->
		<property name="timeBetweenEvictionRunsMillis" value="60000" />

		<!-- 配置一个连接在池中最小生存的时间，单位是毫秒 -->
		<property name="minEvictableIdleTimeMillis" value="300000" />

		<property name="validationQuery" value="SELECT 'x'" />
		<property name="testWhileIdle" value="true" />
		<property name="testOnBorrow" value="false" />
		<property name="testOnReturn" value="false" />

		<!-- 打开PSCache，并且指定每个连接上PSCache的大小 -->
		<property name="poolPreparedStatements" value="true" />
		<property name="maxPoolPreparedStatementPerConnectionSize"
			value="20" />

		<!-- 配置监控统计拦截的filters，去掉后监控界面sql无法统计 -->
		<property name="filters" value="stat" />
	</bean>

</beans>
```

## spring-mybatis.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 配置SqlSessionFactory -->
    <bean id="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 数据源 -->
        <property name="dataSource" ref="dataSource" />
        <!-- 配置 mybatis 配置文件 -->
        <property name="configLocation" value="classpath:mybatis/mybatis-config.xml" />
        <!-- sql 映射文件 -->
        <property name="mapperLocations" value="classpath:mybatis/**/mapping/**/*.xml" />
        <!-- <property name="typeAliasesPackage" value="com.laolang.jd.modules.*.entity" /> -->
    </bean>

    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- 会话工厂 -->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactoryBean" />
        <!-- 扫描包路径 多个包中间用半角逗号分隔 -->
        <property name="basePackage" value="com.laolang.jx.**.mapper" />
    </bean>
</beans>
```

## srping-transaction.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:tx="http://www.springframework.org/schema/tx" xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 定义事务管理器 -->
    <bean id="transactionManager"
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>

    <!-- 定义事务策略 -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <!--所有以find get select query开头的方法都是只读的 -->
            <tx:method name="find*" read-only="true" />
            <tx:method name="get*" read-only="true" />
            <tx:method name="select*" read-only="true" />
            <tx:method name="query*" read-only="true" />
            <tx:method name="list*" read-only="true" />
            <!--其他方法使用默认事务策略 -->
            <tx:method name="*" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>

    <aop:config>
        <aop:pointcut id="myPointcut" expression="execution(* com.laolang.jx..service.*.*(..))" />
        <!--将定义好的事务处理策略应用到上述的切入点 -->
        <aop:advisor advice-ref="txAdvice" pointcut-ref="myPointcut" />
    </aop:config>
</beans>
```

## mybatis-config.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <!-- 输出sql -->
        <setting name="logPrefix" value="dao."/>
        <!-- 开启驼峰命名 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>

        <!-- 全局启用或禁用延迟加载。当禁用时，所有关联对象都会即时加载。 -->
        <setting name="lazyLoadingEnabled" value="true"/>

        <!-- 当启用时，有延迟加载属性的对象在被调用时将会完全加载任意属性。否则，每种属性将会按需要加载。 -->
        <setting name="aggressiveLazyLoading" value="false"/>

        <!-- 指定哪个对象的方法触发一次延迟加载。 	用逗号分隔的方法列表。 默认：	equals,clone,hashCode,toString  -->
        <setting name="lazyLoadTriggerMethods" value="" />
    </settings>

    <plugins>
    	<!-- 打印日志 -->
    	<plugin interceptor="com.laolang.jx.framework.mybatis.interceptor.MybatisPrintSqlInterceptor" />
        <!-- com.github.pagehelper为PageHelper类所在包名 -->
        <plugin interceptor="com.github.pagehelper.PageInterceptor">
            <!-- 4.0.0以后版本可以不设置该参数 -->
            <property name="helperDialect" value="mysql" />
            <!-- 该参数默认为false -->
            <!-- 设置为true时，会将RowBounds第一个参数offset当成pageNum页码使用 -->
            <!-- 和startPage中的pageNum效果一样 -->
            <!-- <property name="offsetAsPageNum" value="true" /> -->

            <!-- 该参数默认为false -->
            <!-- 设置为true时，使用RowBounds分页会进行count查询 -->
            <property name="rowBoundsWithCount" value="true" />

            <!-- 设置为true时，如果pageSize=0或者RowBounds.limit = 0就会查询出全部的结果 -->
            <!-- （相当于没有执行分页查询，但是返回结果仍然是Page类型） -->
            <!-- <property name="pageSizeZero" value="true" /> -->


            <!-- 3.3.0版本可用 - 分页参数合理化，默认false禁用 -->
            <!-- 启用合理化时，如果pageNum<1会查询第一页，如果pageNum>pages会查询最后一页 -->
            <!-- 禁用合理化时，如果pageNum<1或pageNum>pages会返回空数据 -->
            <!-- <property name="reasonable" value="false" /> -->


            <!-- 3.5.0版本可用 - 为了支持startPage(Object params)方法 -->
            <!-- 增加了一个`params`参数来配置参数映射，用于从Map或ServletRequest中取值 -->
            <!-- 可以配置pageNum,pageSize,count,pageSizeZero,reasonable,orderBy,不配置映射的用默认值 -->
            <!-- 不理解该含义的前提下，不要随便复制该配置 -->
            <!-- <property name="params" value="pageNum=pageHelperStart;pageSize=pageHelperRows;" /> -->


            <!-- 支持通过Mapper接口参数来传递分页参数 -->
            <!-- <property name="supportMethodsArguments" value="false" /> -->


            <!-- always总是返回PageInfo类型,check检查返回类型是否为PageInfo,none返回Page -->
            <!-- <property name="returnPageInfo" value="none" /> -->
        </plugin>
    </plugins>
</configuration>
```

## logback.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xml>
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
	
	<logger name="dao" level="DEBUG" additivity="false">
        <appender-ref ref="console" />
		<appender-ref ref="rolling-file" />
    </logger>

	<logger name="com.laolang" level="INFO" additivity="false">
		<appender-ref ref="console" />
		<appender-ref ref="rolling-file" />
	</logger>
</configuration>
```

# 整合 mybatis-plus

## pom.xml
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

		<!-- 数据库 -->
		<mybatis-plus.version>3.5.1</mybatis-plus.version>
		<mysql-connector-j.version>8.0.33</mysql-connector-j.version>
		<druid.version>1.2.4</druid.version>
		<pagehelper.version>5.3.0</pagehelper.version>

		<aspectj.version>1.9.7</aspectj.version>

		<!-- 日志 -->
		<logback.version>1.2.12</logback.version>

		<!-- 工具类库 -->
		<lombok.version>1.18.30</lombok.version>
		<hutool.version>5.8.11</hutool.version>
		<vavr.version>0.10.4</vavr.version>
		<mapstruct.version>1.4.2.Final</mapstruct.version>
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
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context-support</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-webmvc</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-jdbc</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-tx</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-aop</artifactId>
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

		<!-- 数据库 -->
		<dependency>
			<groupId>com.baomidou</groupId>
			<artifactId>mybatis-plus</artifactId>
			<version>${mybatis-plus.version}</version>
		</dependency>
		<dependency>
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<version>${mysql-connector-j.version}</version>
		</dependency>
		<dependency>
			<groupId>com.alibaba</groupId>
			<artifactId>druid</artifactId>
			<version>${druid.version}</version>
		</dependency>
		<dependency>
			<groupId>com.github.pagehelper</groupId>
			<artifactId>pagehelper</artifactId>
			<version>${pagehelper.version}</version>
			<exclusions>
				<exclusion>
					<groupId>com.github.jsqlparser</groupId>
					<artifactId>jsqlparser</artifactId>
				</exclusion>
			</exclusions>
		</dependency>

		<!-- aspectj -->
		<dependency>
			<groupId>org.aspectj</groupId>
			<artifactId>aspectjweaver</artifactId>
			<version>${aspectj.version}</version>
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
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct</artifactId>
			<version>${mapstruct.version}</version>
		</dependency>
		<dependency>
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct-jdk8</artifactId>
			<version>${mapstruct.version}</version>
		</dependency>
		<dependency>
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct-processor</artifactId>
			<version>${mapstruct.version}</version>
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
			<id>test</id>
			<properties>
				<profiles.active>test</profiles.active>
			</properties>
		</profile>
	</profiles>

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
				<!-- 资源根目录排除各环境的配置，使用单独的资源目录来指定 -->
				<excludes>
					<exclude>dev/*</exclude>
					<exclude>test/*</exclude>
				</excludes>
			</resource>
			<resource>
				<directory>src/main/resources/${profiles.active}</directory>
			</resource>
		</resources>
		<testResources>
			<testResource>
				<directory>src/test/java</directory>
				<includes>
					<include>**/*.xml</include>
					<include>**/*.sql</include>
					<include>**/*.ftl</include>
				</includes>
				<filtering>false</filtering>
			</testResource>
			<testResource>
				<directory>src/test/resources</directory>
			</testResource>
		</testResources>
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
			<!-- 配置 tomcat 插件 -->
			<!-- 如果使用的 spring 版本是 4.x , 可以使用此插件, 更高版本会报错:Invalid byte tag in constant 
				pool: 19 -->
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
			<!-- jetty 和 jdk 版本是对应的, 此版本已经过验证 jetty:run 命令会直接使用源代码运行web程序，不将其打包成war文件。jetty插件会保证在运行前所有的类和资源都是最新的。如果你修改了代码，插件会自动重新部署。 
				jetty:run-war 会先将程序打包成war文件然后再将其部署。如果有代码修改，会重新打包war文件并部署。 -->
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

## spring-mybatis
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:tx="http://www.springframework.org/schema/tx"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.3.xsd">

	<!-- 配置 druid数据源 -->
	<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
		<!-- 基本属性 url、user、password -->
		<property name="url" value="${jdbc.jdbcUrl}" />
		<property name="username" value="${jdbc.user}" />
		<property name="password" value="${jdbc.password}" />

		<!-- 配置初始化大小、最小、最大 -->
		<property name="initialSize" value="1" />
		<property name="minIdle" value="1" />
		<property name="maxActive" value="20" />

		<!-- 配置获取连接等待超时的时间 -->
		<property name="maxWait" value="60000" />

		<!-- 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒 -->
		<property name="timeBetweenEvictionRunsMillis" value="60000" />

		<!-- 配置一个连接在池中最小生存的时间，单位是毫秒 -->
		<property name="minEvictableIdleTimeMillis" value="300000" />

		<property name="validationQuery" value="SELECT 'x'" />
		<property name="testWhileIdle" value="true" />
		<property name="testOnBorrow" value="false" />
		<property name="testOnReturn" value="false" />

		<!-- 打开PSCache，并且指定每个连接上PSCache的大小 -->
		<property name="poolPreparedStatements" value="true" />
		<property name="maxPoolPreparedStatementPerConnectionSize" value="20" />

		<!-- 配置监控统计拦截的filters，去掉后监控界面sql无法统计 -->
		<property name="filters" value="stat" />
	</bean>
	
	<!-- SqlSessionFactory Config -->
	<bean id="sqlSessionFactory" class="com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean">
		<property name="dataSource" ref="dataSource" />
		<property name="configuration" ref="configuration" />
		<property name="mapperLocations" value="classpath:mybatis/**/mapping/**/*.xml" />
		<property name="globalConfig" ref="globalConfig" />
		<property name="plugins">
			<array>
				<ref bean="mybatisPrintSqlInterceptor" />
				<ref bean="mybatisPlusInterceptor" />
				<ref bean="pageInterceptor" />
			</array>
		</property>
	</bean>

	<!-- mybatis plus 配置 -->
	<bean id="configuration" class="com.baomidou.mybatisplus.core.MybatisConfiguration">
		<property name="cacheEnabled" value="false" />
	</bean>

	<bean id="globalConfig" class="com.baomidou.mybatisplus.core.config.GlobalConfig">
		<property name="dbConfig" ref="dbConfig" />
	</bean>

	<bean id="dbConfig" class="com.baomidou.mybatisplus.core.config.GlobalConfig.DbConfig">
		<property name="idType" value="AUTO" />
		<property name="logicDeleteField" value="deleted" />
		<property name="logicDeleteValue" value="1" />
		<property name="logicNotDeleteValue" value="0" />
	</bean>

	<!-- 乐观锁配置 -->
	<bean id="optimisticLockerInnerInterceptor"
		class="com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor" />

	<!-- mybatis plus 自带的插件配置 -->
	<bean id="mybatisPlusInterceptor" class="com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor">
		<property name="interceptors">
			<list>
				<ref bean="optimisticLockerInnerInterceptor" />
			</list>
		</property>
	</bean>

	<!-- mybatis 打印 sql 拦截器 -->
	<bean id="mybatisPrintSqlInterceptor"
		class="com.laolang.jx.framework.mybatis.interceptor.MybatisPrintSqlInterceptor" />
	<!-- pagehelper -->
	<bean id="pageInterceptor" class="com.github.pagehelper.PageInterceptor" />

	<!-- 包扫描 -->
	<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
		<property name="basePackage" value="com.laolang.jx.**.mapper" />
	</bean>

	<!-- 定义事务管理器 -->
	<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="dataSource" />
	</bean>

	<!-- 声明式事务 -->
	<tx:annotation-driven transaction-manager="transactionManager"/>

</beans>
```

## 注意

### 拦截器获取 StatementHandler 报错的问题

#### MybatisPrintSqlInterceptor
```java
package com.laolang.jx.framework.mybatis.interceptor;

import java.lang.reflect.Field;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.mapping.ParameterMode;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.SystemMetaObject;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.type.TypeHandlerRegistry;
import org.springframework.core.Ordered;
import org.springframework.util.ReflectionUtils;

import cn.hutool.core.util.StrUtil;

/**
 * 打印 sql 拦截器
 * 
 */
@Slf4j
@Intercepts({
		@Signature(type = StatementHandler.class, method = "query", args = { Statement.class, ResultHandler.class }),
		@Signature(type = StatementHandler.class, method = "update", args = { Statement.class }),
		@Signature(type = StatementHandler.class, method = "batch", args = { Statement.class }) })
public class MybatisPrintSqlInterceptor implements Interceptor, Ordered {

	/**
	 * mybatis 配置对象.
	 */
	private Configuration configuration = null;

	/**
	 * 时间格式化.
	 */
	private static final ThreadLocal<SimpleDateFormat> DATE_FORMAT_THREAD_LOCAL = ThreadLocal
			.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS"));

	/**
	 * 拦截器主方法.
	 *
	 * @param invocation
	 *            invocation
	 * @return sql 执行结果
	 * @throws Throwable
	 *             Throwable
	 */
	@SuppressWarnings("rawtypes")
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		Object target = invocation.getTarget();
		long startTime = System.currentTimeMillis();
		Object result = null;
		try {
			result = invocation.proceed();
			return result;
		} finally {
			try {
				long endTime = System.currentTimeMillis();
				long sqlCost = endTime - startTime;
				StatementHandler statementHandler = (StatementHandler) target;
				BoundSql boundSql = statementHandler.getBoundSql();
				if (configuration == null) {
					// final DefaultParameterHandler parameterHandler = (DefaultParameterHandler) statementHandler.getParameterHandler();
					final ParameterHandler parameterHandler = statementHandler.getParameterHandler();
					Field configurationField = ReflectionUtils.findField(parameterHandler.getClass(), "configuration");
					ReflectionUtils.makeAccessible(configurationField);
					this.configuration = (Configuration) configurationField.get(parameterHandler);
				}

				// 输出 mapper id
				MetaObject metaObject = SystemMetaObject.forObject(target);
				MappedStatement ms = (MappedStatement) metaObject.getValue("delegate.mappedStatement");
				String id = ms.getId();

				// 替换参数格式化Sql语句，去除换行符
				String sql = formatSql(boundSql, configuration).concat(";");
				String warning = "";
				// CHECKSTYLE:OFF
				if (sqlCost > 2000) {
					warning = "[耗时过长]";
				}
				// CHECKSTYLE:ON

				// 开始输出 sql
				log.info("map-id: {}", id);
				log.info("[ {} ] [ {} ] ms {}", sql, sqlCost, warning);

				if (result instanceof List) {
					log.info("Total: {}", ((List) result).size());
				} else {
					log.info("Updates: {}", result);
				}
			} catch (Exception e) {
				log.error("==> 打印sql 日志异常 {0}", e);
			}
		}
	}

	/**
	 * plugin.
	 *
	 * @param target
	 *            target
	 * @return Object
	 */
	@Override
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}

	/**
	 * setProperties.
	 *
	 * @param properties
	 *            properties
	 */
	@Override
	public void setProperties(Properties properties) {

	}

	/**
	 * 获取完整的sql实体的信息.
	 *
	 * @param boundSql
	 *            boundSql
	 * @param configuration
	 *            configuration
	 * @return 格式化后的 sql
	 */
	private String formatSql(BoundSql boundSql, Configuration configuration) {
		String sql = boundSql.getSql();

		Object parameterObject = boundSql.getParameterObject();
		// 输入sql字符串空判断
		if (StrUtil.isBlank(sql)) {
			return "";
		}
		if (configuration == null) {
			return "";
		}
		TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry();
		sql = beautifySql(sql);
		List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
		// 参考mybatis 源码 DefaultParameterHandler
		if (parameterMappings != null) {
			for (ParameterMapping parameterMapping : parameterMappings) {
				if (parameterMapping.getMode() != ParameterMode.OUT) {
					Object value;
					String propertyName = parameterMapping.getProperty();
					if (boundSql.hasAdditionalParameter(propertyName)) {
						value = boundSql.getAdditionalParameter(propertyName);
					} else if (parameterObject == null) {
						value = null;
					} else if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
						value = parameterObject;
					} else {
						MetaObject metaObject = configuration.newMetaObject(parameterObject);
						value = metaObject.getValue(propertyName);
					}
					String paramValueStr = "";
					if (value instanceof String) {
						paramValueStr = "'" + value + "'";
					} else if (value instanceof Date) {
						paramValueStr = "'" + DATE_FORMAT_THREAD_LOCAL.get().format(value) + "'";
					} else {
						paramValueStr = value + "";
					}
					sql = sql.replaceFirst("\\?", paramValueStr);
				}
			}
		}
		return sql;
	}

	/**
	 * 美化 sql.
	 *
	 * @param sql
	 *            sql
	 * @return sql
	 */
	private String beautifySql(String sql) {
		sql = sql.replaceAll("[\\s\n ]+", " ");
		return sql;
	}

	/**
	 * 修改优先级.
	 *
	 * @return 优先级
	 */
	@Override
	public int getOrder() {
		return Ordered.HIGHEST_PRECEDENCE;
	}
}
```

#### 问题
如果配置顺序不正确, 例如 `mybatisPlusInterceptor` 在前, `mybatisPrintSqlInterceptor` 在后
```xml
<bean id="sqlSessionFactory" class="com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean">
	<property name="dataSource" ref="dataSource" />
	<property name="configuration" ref="configuration" />
	<property name="mapperLocations" value="classpath:mybatis/**/mapping/**/*.xml" />
	<property name="globalConfig" ref="globalConfig" />
	<property name="plugins">
		<array>
			<ref bean="mybatisPlusInterceptor" />
			<ref bean="mybatisPrintSqlInterceptor" />
			<ref bean="pageInterceptor" />
		</array>
	</property>
</bean>
```
会报错: `There is no getter for property named ‘delegate‘ in ‘class com.sun.proxy.$Proxy`, 
原因: **`invocation.getTarget()`得到的StatementHandler是代理对象（在配置有多个mybatis拦截器的时候才会出现得到的是代理对象），而代理对象无法获取某些属性，所以才会提示如上错误**

#### 解决方法 1 修改拦截器顺序
> 其实这是不正确的, 因为打印 `sql` 插件应该最后执行

```xml
<bean id="sqlSessionFactory" class="com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean">
	<property name="dataSource" ref="dataSource" />
	<property name="configuration" ref="configuration" />
	<property name="mapperLocations" value="classpath:mybatis/**/mapping/**/*.xml" />
	<property name="globalConfig" ref="globalConfig" />
	<property name="plugins">
		<array>
			<ref bean="mybatisPrintSqlInterceptor" />
			<ref bean="mybatisPlusInterceptor" />
			<ref bean="pageInterceptor" />
		</array>
	</property>
</bean>
```

#### 解决方法 2 获取实际对象
```java
package com.laolang.jx.framework.mybatis.interceptor;

import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.mapping.ParameterMode;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.SystemMetaObject;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.type.TypeHandlerRegistry;
import org.springframework.core.Ordered;
import org.springframework.util.ReflectionUtils;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * 打印 sql 拦截器
 * 
 */
@Slf4j
@Intercepts({
		@Signature(type = StatementHandler.class, method = "query", args = { Statement.class, ResultHandler.class }),
		@Signature(type = StatementHandler.class, method = "update", args = { Statement.class }),
		@Signature(type = StatementHandler.class, method = "batch", args = { Statement.class }) })
public class MybatisPrintSqlInterceptor implements Interceptor, Ordered {

	/**
	 * mybatis 配置对象.
	 */
	private Configuration configuration = null;

	/**
	 * 时间格式化.
	 */
	private static final ThreadLocal<SimpleDateFormat> DATE_FORMAT_THREAD_LOCAL = ThreadLocal
			.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS"));

	/**
	 * 拦截器主方法.
	 *
	 * @param invocation
	 *            invocation
	 * @return sql 执行结果
	 * @throws Throwable
	 *             Throwable
	 */
	@SuppressWarnings("rawtypes")
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		long startTime = System.currentTimeMillis();
		Object result = null;
		try {
			result = invocation.proceed();
			return result;
		} finally {
			try {
				long endTime = System.currentTimeMillis();
				long sqlCost = endTime - startTime;
				StatementHandler statementHandler = getRealTarget(invocation.getTarget());
				BoundSql boundSql = statementHandler.getBoundSql();
				if (configuration == null) {
					// final DefaultParameterHandler parameterHandler = (DefaultParameterHandler)
					// statementHandler.getParameterHandler();
					final ParameterHandler parameterHandler = statementHandler.getParameterHandler();
					Field configurationField = ReflectionUtils.findField(parameterHandler.getClass(), "configuration");
					ReflectionUtils.makeAccessible(configurationField);
					this.configuration = (Configuration) configurationField.get(parameterHandler);
				}

				// 输出 mapper id
				MetaObject metaObject = SystemMetaObject.forObject(statementHandler);
				MappedStatement ms = (MappedStatement) metaObject.getValue("delegate.mappedStatement");
				String id = ms.getId();

				// 替换参数格式化Sql语句，去除换行符
				String sql = formatSql(boundSql, configuration).concat(";");
				String warning = "";
				// CHECKSTYLE:OFF
				if (sqlCost > 2000) {
					warning = "[耗时过长]";
				}
				// CHECKSTYLE:ON

				// 开始输出 sql
				log.info("map-id: {}", id);
				log.info("[ {} ] [ {} ] ms {}", sql, sqlCost, warning);

				if (result instanceof List) {
					log.info("Total: {}", ((List) result).size());
				} else {
					log.info("Updates: {}", result);
				}
			} catch (Exception e) {
				log.error("==> 打印sql 日志异常 {0}", e);
			}
		}
	}

	/**
	 * <p>
	 * 获取真正的对象（非代理对象）
	 * </p>
	 * 
	 * 解决报错:
	 * <code>There is no getter for property named 'delegate' in 'class com.sun.proxy.$Proxy199'</code>
	 *
	 * @param target
	 * @param <T>
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> T getRealTarget(Object target) {
		if (Proxy.isProxyClass(target.getClass())) {
			MetaObject metaObject = SystemMetaObject.forObject(target);
			return getRealTarget(metaObject.getValue("h.target"));
		}
		return (T) target;
	}

	/**
	 * plugin.
	 *
	 * @param target
	 *            target
	 * @return Object
	 */
	@Override
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}

	/**
	 * setProperties.
	 *
	 * @param properties
	 *            properties
	 */
	@Override
	public void setProperties(Properties properties) {

	}

	/**
	 * 获取完整的sql实体的信息.
	 *
	 * @param boundSql
	 *            boundSql
	 * @param configuration
	 *            configuration
	 * @return 格式化后的 sql
	 */
	private String formatSql(BoundSql boundSql, Configuration configuration) {
		String sql = boundSql.getSql();

		Object parameterObject = boundSql.getParameterObject();
		// 输入sql字符串空判断
		if (StrUtil.isBlank(sql)) {
			return "";
		}
		if (configuration == null) {
			return "";
		}
		TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry();
		sql = beautifySql(sql);
		List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
		// 参考mybatis 源码 DefaultParameterHandler
		if (parameterMappings != null) {
			for (ParameterMapping parameterMapping : parameterMappings) {
				if (parameterMapping.getMode() != ParameterMode.OUT) {
					Object value;
					String propertyName = parameterMapping.getProperty();
					if (boundSql.hasAdditionalParameter(propertyName)) {
						value = boundSql.getAdditionalParameter(propertyName);
					} else if (parameterObject == null) {
						value = null;
					} else if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
						value = parameterObject;
					} else {
						MetaObject metaObject = configuration.newMetaObject(parameterObject);
						value = metaObject.getValue(propertyName);
					}
					String paramValueStr = "";
					if (value instanceof String) {
						paramValueStr = "'" + value + "'";
					} else if (value instanceof Date) {
						paramValueStr = "'" + DATE_FORMAT_THREAD_LOCAL.get().format(value) + "'";
					} else {
						paramValueStr = value + "";
					}
					sql = sql.replaceFirst("\\?", paramValueStr);
				}
			}
		}
		return sql;
	}

	/**
	 * 美化 sql.
	 *
	 * @param sql
	 *            sql
	 * @return sql
	 */
	private String beautifySql(String sql) {
		sql = sql.replaceAll("[\\s\n ]+", " ");
		return sql;
	}

	/**
	 * 修改优先级.
	 *
	 * @return 优先级
	 */
	@Override
	public int getOrder() {
		return Ordered.HIGHEST_PRECEDENCE;
	}
}
```

#### 参考
[记录mybatis插件奇怪报错问题There is no getter for property named ‘delegate‘ in ‘class com.sun.proxy.$Proxy的排查](https://blog.csdn.net/u011602668/article/details/128735771)
[mybatis拦截器提示There is no getter for property named 'delegate' in 'class com.sun.proxy.$Proxy199'](http://www.asfx.xyz/p/72bec2d52df744e4bfbdb08b1d312daf)
