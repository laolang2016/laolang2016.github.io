---
title: spring jdbc template 基本使用
date: 2024-09-22 06:27:58
categories:
- java
- spring
tags:
- java
- spring
---


# 环境搭建

## 数据库脚本
```sql
drop table if exists sys_dict_type;
CREATE TABLE `sys_dict_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '字典名称',
  `type` varchar(100) DEFAULT NULL COMMENT '字典类型编码',
  `group_code` varchar(100) DEFAULT NULL COMMENT '字典分组 (system: 系统字典)',
  `status` char(1) DEFAULT NULL COMMENT '状态 (0:正常 1:停用)',
  `create_by` varchar(150) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(150) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统字典类型表';

drop table if exists sys_dict_type_after;
CREATE TABLE `sys_dict_type_after` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '字典名称',
  `type` varchar(100) DEFAULT NULL COMMENT '字典类型编码',
  `group_code` varchar(100) DEFAULT NULL COMMENT '字典分组 (system: 系统字典)',
  `status` char(1) DEFAULT NULL COMMENT '状态 (0:正常 1:停用)',
  `create_by` varchar(150) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(150) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统字典类型表';
```


## pom
```xml linenums="1"
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.laolang.sshschema</groupId>
    <artifactId>spring-jdbc-hello</artifactId>
    <version>0.0.1</version>

    <description>spring jdbc 使用</description>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <maven-compiler-plugin.version>3.11.0</maven-compiler-plugin.version>
        <maven-surefire-plugin.version>3.2.3</maven-surefire-plugin.version>

        <!-- spring -->
        <spring.version>5.3.31</spring.version>

        <!-- 数据库 -->
        <mysql-connector-j.version>8.0.33</mysql-connector-j.version>
        <druid.version>1.2.4</druid.version>

        <!-- 日志 -->
        <logback.version>1.2.12</logback.version>

        <!-- 工具类库 -->
        <lombok.version>1.18.30</lombok.version>
        <hutool.version>5.8.11</hutool.version>
        <guava.version>23.0</guava.version>
        <commons-lang3.version>3.12.0</commons-lang3.version>

        <!-- 测试相关 -->
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

        <!-- 数据库 -->
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
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>${project.artifactId}</finalName>
        <resources>
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
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>${maven-surefire-plugin.version}</version>
                <configuration>
                    <testFailureIgnore>true</testFailureIgnore>
                    <argLine>-Dfile.encoding=UTF-8</argLine>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
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

## spring 配置

**spring-context.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:c="http://www.springframework.org/schema/c"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:tx="http://www.springframework.org/schema/tx"
    xmlns:util="http://www.springframework.org/schema/util"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">

    <context:component-scan base-package="com.laolang"></context:component-scan>
    
    <import resource="classpath:spring-public.xml" />
    <import resource="classpath:spring-jdbc.xml" />
</beans>
```

**spring-public.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:c="http://www.springframework.org/schema/c"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:tx="http://www.springframework.org/schema/tx"
    xmlns:util="http://www.springframework.org/schema/util"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">


    <!-- 导入配置文件 -->
    <bean class="org.springframework.context.support.PropertySourcesPlaceholderConfigurer">
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
</beans>
```

**spring-jdbc.xml**

```xml linenums="1"
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:c="http://www.springframework.org/schema/c"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:tx="http://www.springframework.org/schema/tx"
    xmlns:util="http://www.springframework.org/schema/util"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">
        
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

    <!-- 配置 jdbcTemplate -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource" />
    </bean>
    
    <!-- 定义事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>

    <!-- 声明式事务 -->
    <tx:annotation-driven transaction-manager="transactionManager" />
</beans>
```

## 实体类
```java linenums="1"
package com.laolang.jx.module.system.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SysDictType {

    private Long id;
    private String name;
    private String type;
    private String groupCode;
    private String status;
    private String createBy;
    private LocalDateTime createTime;
    private String updateBy;
    private LocalDateTime updateTime;
}
```

## dao
```java linenums="1"
package com.laolang.jx.module.system.dao;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.laolang.jx.module.system.entity.SysDictType;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class SysDictTypeDao {

    private final JdbcTemplate jdbcTemplate;

    public SysDictType getById(Long id) {
        String sql = "select * from sys_dict_type where id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(SysDictType.class), id);
    }

    @Transactional(rollbackFor = Exception.class)
    public int updateStatus(Long id, String status) {
        String sql = "update sys_dict_type set status = ? where id = ?";
        return jdbcTemplate.update(sql, status, id);
    }
}
```

## 测试基类
```java linenums="1"
package com.laolang.jx.test.base;

import static org.testng.Assert.fail;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.Assert;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * <p>基于 <code>spring-test</code> 实现的测试基类</p>
 */
@Slf4j
@ContextConfiguration(locations = { "classpath:spring-context.xml" })
public abstract class AbstractSpringTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Predicate<String> sqlPredicate = t -> {
        if (StrUtil.isBlank(t)) {
            return false;
        }
        if (StrUtil.startWith(t, "--")) {
            return false;
        }
        return true;
    };

    /**
     * 执行初始化 sql
     */
    protected void executeInitSqls(String initSqlPath) {
        try {
            List<String> initSqls = FileUtil.readUtf8Lines(initSqlPath).stream().filter(sqlPredicate)
                    .collect(Collectors.toList());
            for (int i = 0; i < initSqls.size(); i++) {
                jdbcTemplate.execute(initSqls.get(i));
            }
        } catch (Throwable throwable) {
            throwable.printStackTrace();
            fail("execute init sql failed");
        }
    }

    /**
     * 对比两个表的数据
     * 
     * @param acture         实际操作的表
     * @param except         对比的表
     * @param compareColumns 对比的字段列表
     */
    protected void validTableData(String acture, String except, List<String> compareColumns) {
        String columns = String.join(",", compareColumns);
        StringBuilder sb = new StringBuilder();
        sb.append("select count(*) from ( select * from ( select ");
        sb.append(columns);
        sb.append(" from sys_dict_type union all select ");
        sb.append(columns);
        sb.append(" from sys_dict_type_after ) tbl group by ");
        sb.append(columns);
        sb.append(" having count(*) = 1 order by id ) t");
        Integer count = jdbcTemplate.queryForObject(sb.toString(), Integer.class);
        Assert.assertEquals(count.intValue(), 0);
    }
}
```

## 测试类
```java linenums="1"
package com.laolang.jx.module.system.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.google.common.collect.Lists;
import com.laolang.jx.framework.common.util.JsonUtil;
import com.laolang.jx.module.system.entity.SysDictType;
import com.laolang.jx.test.base.AbstractSpringTest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SysDictTypeDaoTest extends AbstractSpringTest {

    @Autowired
    private SysDictTypeDao sysDictTypeDao;

    private static final String TABLE_NAME = "sys_dict_type";
    private static final String TABLE_AFTER_NAME = "sys_dict_type_after";

    /**
     * 对比字段列表
     */
    private static final List<String> COMPARECOLUMNS = Lists.newArrayList("id", "name", "type", "group_code", "status");

    @Test
    public void testGetById() {
        executeInitSqls("data/sysdict/test_get_by_id.sql");

        SysDictType dictType = sysDictTypeDao.getById(1L);
        Assert.assertNotNull(dictType);
        log.info("dictType:{}", JsonUtil.toJson(dictType));
    }

    @Test
    public void testUpdateStatus() {
        executeInitSqls("data/sysdict/test_update_status.sql");

        Long id = 1L;
        String statusValue = "1";
        int count = sysDictTypeDao.updateStatus(id, statusValue);
        Assert.assertEquals(count, 1);
        SysDictType dictType = sysDictTypeDao.getById(id);
        Assert.assertEquals(dictType.getStatus(), statusValue);

        validTableData(TABLE_NAME, TABLE_AFTER_NAME, COMPARECOLUMNS);
    }
}
```

## 测试脚本
**test_get_by_id.sql**

```sql
truncate sys_dict_type ;
INSERT INTO sys_dict_type (id, name, `type`, group_code, status, create_by, create_time, update_by, update_time, remark) VALUES(1, '用户性别', 'gender', 'system', '0', 'superAdmin', '2023-12-19 02:47:48', 'superAdmin', '2023-12-19 02:47:48', NULL);
```

**test_update_status.sql**

```sql
truncate sys_dict_type ;
INSERT INTO sys_dict_type (id, name, `type`, group_code, status, create_by, create_time, update_by, update_time, remark) VALUES(1, '用户性别', 'gender', 'system', '0', 'superAdmin', '2023-12-19 02:47:48', 'superAdmin', '2023-12-19 02:47:48', NULL);

truncate sys_dict_type_after ;
INSERT INTO sys_dict_type_after (id, name, `type`, group_code, status, create_by, create_time, update_by, update_time, remark) VALUES(1, '用户性别', 'gender', 'system', '1', 'superAdmin', '2023-12-19 02:47:48', 'superAdmin', '2023-12-19 02:47:48', NULL);
```

## 测试说明

`AbstractSpringTest` 主要实现了两个功能

- 运行初始化 sql
- 对比两个表的数据

{% note info no-icon simple %}
后续的 `jdbc` 测试都是以上面的代码为模板修改的
只会贴出关键部分的代码和配置
{% endnote %}



## 参考
[mysql使用技巧之比较两个表是否有不同的数据](https://blog.csdn.net/luyaran/article/details/80928666)


