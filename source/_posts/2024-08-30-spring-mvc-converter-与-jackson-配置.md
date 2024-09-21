---
title: spring mvc converter 与 jackson 配置
date: 2024-08-30 13:39:11
categories:
- java
- spring
tags:
- java
- spring
---

# 参考资料
[【Spring MVC学习笔记 五】SpringMVC框架整合Jackson工具](https://developer.aliyun.com/article/1254245)
[Spring之坑：自定义Jackson的ObjectMapper，实现@ResponseBody的自定义渲染](https://blog.csdn.net/qq_32331073/article/details/80394949)
[尚硅谷SpringMVC实战教程完整版(spring mvc框架源码解析)](https://www.bilibili.com/video/BV1mW411M7YA)

# 抛出问题

## 统一返回结果
```java
package com.laolang.jx.framework.common.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.slf4j.MDC;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.laolang.jx.framework.common.consts.DefaultStatusCode;
import com.laolang.jx.framework.common.exception.BusinessException;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 通用返回结构
 *
 * @param <T>
 */
@Accessors(chain = true)
@Data
public class R<T> {

	/**
	 * 接口请求结果的业务状态吗.
	 */
	private String code;

	/**
	 * 判断接口请求是否成功的唯一标识.
	 */
	private Boolean success;

	/**
	 * 提示信息.
	 */
	private String msg;

	/**
	 * 数据体.
	 */
	private T body;

	/**
	 * 扩充字段,正常情况下此字段为空，当此字段有值时，意味着当前接口结构不稳定，以后会修改,即保持 extra 为空.
	 */
	private Map<String, Object> extra;

	/**
	 * traceId
	 */
	private String tid;

	/**
	 * 接口返回时间
	 */
	private LocalDateTime time;

	public static <T> R<T> build(String code, boolean success, String msg, T body) {
		R<T> ajax = new R<>();
		ajax.setCode(code);
		ajax.setSuccess(success);
		ajax.setMsg(msg);
		ajax.setBody(body);
		ajax.setExtra(null);
		ajax.setTid(getTraceId());
		ajax.time = LocalDateTime.now();

		return ajax;
	}

	private static String getTraceId() {
		String tl = MDC.get("tl");
		if (StrUtil.isBlank(tl)) {
			return "";
		}

		List<String> split = StrUtil.split(tl, '<');
		if (CollUtil.isEmpty(split) || 3 != split.size()) {
			return "";
		}

		String tid = split.get(2);
		return tid.substring(0, tid.length() - 1);
	}

	@JsonIgnore
	public void setPropFromBusinessException(BusinessException e) {
		setMsg(e.getMsg());
		setCode(e.getCode());
		setSuccess(false);
	}

	public static <T> R<T> ok() {
		return ok(DefaultStatusCode.OK.getCode(), DefaultStatusCode.OK.getMsg());
	}

	public static <T> R<T> ok(String code, String msg) {
		return ok(code, msg, null);
	}

	public static <T> R<T> ok(String code, String msg, T body) {
		return build(code, true, msg, body);
	}

	public static <T> R<T> ok(T body) {
		return build(DefaultStatusCode.OK.getCode(), true, DefaultStatusCode.OK.getMsg(), body);
	}

	public static <T> R<T> failed() {
		return failed(DefaultStatusCode.FAILED.getMsg());
	}

	public static <T> R<T> failed(String msg) {
		return build(DefaultStatusCode.FAILED.getCode(), false, msg, null);
	}

	public static <T> R<T> error() {
		return error(DefaultStatusCode.ERROR.getMsg());
	}

	public static <T> R<T> error(String msg) {
		return error(DefaultStatusCode.ERROR.getCode(), msg);
	}

	public static <T> R<T> error(String code, String msg) {
		return build(code, false, msg, null);
	}

	public static <T> R<T> notFound() {
		return notFound(DefaultStatusCode.NOT_FOUND.getMsg());
	}

	public static <T> R<T> notFound(String msg) {
		return build(DefaultStatusCode.NOT_FOUND.getCode(), false, msg, null);
	}

	public static <T> R<T> unauthorized() {
		return build(DefaultStatusCode.UNAUTHORIZED.getCode(), false, DefaultStatusCode.UNAUTHORIZED.getMsg(), null);
	}
}
```

## 接口

### controller

```java
package com.laolang.jx.module.system.dict.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.laolang.jx.framework.common.domain.R;
import com.laolang.jx.module.system.dict.logic.SysDictLogic;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("system/dict")
@RestController
public class SysDictController {
	
	private final SysDictLogic sysDictLogic;

	@GetMapping("list")
	public R<SysDictTypeListRsp> list(){
		return R.ok(sysDictLogic.list());
	}
}
```

### logic
```java
package com.laolang.jx.module.system.dict.logic;

import java.util.List;

import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp.SysDictTypeListRspBean;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SysDictLogic {
	public SysDictTypeListRsp list() {
		SysDictTypeListRsp rsp = new SysDictTypeListRsp();
		List<SysDictTypeListRsp.SysDictTypeListRspBean> list = Lists.newArrayList();
		rsp.setList(list);
		SysDictTypeListRspBean bean = new SysDictTypeListRsp.SysDictTypeListRspBean();
		bean.setId(1001L);
		bean.setGroupCode("system");
		list.add(bean);

		return rsp;
	}
}
```

## VO
```java
package com.laolang.jx.module.system.dict.rsp;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class SysDictTypeListRsp {
	
	private List<SysDictTypeListRspBean> list;

	@Data
	public static class SysDictTypeListRspBean {
		/**
		 * id
		 */
		private Long id;

		/**
		 * 名称
		 */
		private String name;

		/**
		 * 类型编码
		 */
		private String type;

		/**
		 * 类型
		 */
		private String typeDesc;

		/**
		 * 分组编码
		 */
		private String groupCode;

		/**
		 * 分组
		 */
		private String groupDesc;

		/**
		 * 状态编码
		 */
		private String status;

		/**
		 * 状态
		 */
		private String statusDesc;
		
		private BigDecimal amount = new BigDecimal("1.246");
	}
}
```

## 问题所在
此时接口返回结果如下
```json
{
	"code": "200",
	"success": true,
	"msg": "操作成功",
	"body": {
		"list": [
			{
				"id": 1001,
				"name": null,
				"type": null,
				"typeDesc": null,
				"groupCode": "system",
				"groupDesc": null,
				"status": null,
				"statusDesc": null,
				"amount": 1.246
			}
		]
	},
	"extra": null,
	"tid": "",
	"time": [
		2024,
		8,
		30,
		13,
		51,
		41,
		147000000
	]
}
```

问题如下
1. `Long` 需要转换为 `String`, 否则前段可能会溢出
2. `LocalDateTime` 没有格式化
3. `BigDecimal` 没有控制精度

# 解决方案

## 添加 ObjectMapper Module

> 这三个 `SimpleModule` 其实可以合并为一个

### BigDecimalModule
```java
package com.laolang.jx.framework.web.jackson;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class BigDecimalModule extends SimpleModule{

	private static final long serialVersionUID = 1L;

	public BigDecimalModule() {
		super();
		addSerializer(BigDecimal.class, new JsonSerializer<BigDecimal>() {
            @Override
            public void serialize(BigDecimal value, JsonGenerator gen,
                                  SerializerProvider serializers)
                    throws IOException {
                DecimalFormat format = new DecimalFormat("0.00");
                gen.writeString(format.format(value));
            }
        });
	}
}
```

### Jdk8TimeModule
```java
package com.laolang.jx.framework.web.jackson;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;

import cn.hutool.core.date.DatePattern;

public class Jdk8TimeModule extends SimpleModule {

	private static final long serialVersionUID = 1L;

	public Jdk8TimeModule() {
		super();
		addSerializer(LocalDateTime.class,
				new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
		addSerializer(LocalDate.class,
				new LocalDateSerializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATE_PATTERN)));
		addSerializer(LocalTime.class,
				new LocalTimeSerializer(DateTimeFormatter.ofPattern(DatePattern.NORM_TIME_PATTERN)));
		addDeserializer(LocalDateTime.class,
				new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
		addDeserializer(LocalDate.class,
				new LocalDateDeserializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATE_PATTERN)));
		addDeserializer(LocalTime.class,
				new LocalTimeDeserializer(DateTimeFormatter.ofPattern(DatePattern.NORM_TIME_PATTERN)));
	}
}
```

### BigDecimalModule
```java
package com.laolang.jx.framework.web.jackson;

import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public class LongModule extends SimpleModule{

	private static final long serialVersionUID = 1L;

	public LongModule() {
		super();
		addSerializer(Long.class, ToStringSerializer.instance);
		addSerializer(Long.TYPE, ToStringSerializer.instance);
	}
}
```

## spring mvc 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
		http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">


	<!-- Spring容器中注册@controller注解的Bean -->
	<context:component-scan
		base-package="com.laolang.jx.**.controller"
		use-default-filters="false">
		<context:include-filter type="annotation"
			expression="org.springframework.stereotype.Controller" />
	</context:component-scan>


	<!-- 注解驱动 -->
	<mvc:annotation-driven>
		<mvc:message-converters>
			<bean
				class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
				<property name="objectMapper" ref="objectMapper" />
			</bean>
		</mvc:message-converters>
	</mvc:annotation-driven>

	<bean id="objectMapper"
		class="org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean">
		<property name="modulesToInstall">
			<array>
				<value>com.laolang.jx.framework.web.jackson.LongModule</value>
				<value>com.laolang.jx.framework.web.jackson.Jdk8TimeModule</value>
				<value>com.laolang.jx.framework.web.jackson.BigDecimalModule</value>
			</array>
		</property>
	</bean>

	<!-- 静态资源过虑 -->
	<mvc:default-servlet-handler />

	<mvc:resources mapping="/favicon.ico" location="favicon.ico" />
</beans>
```

## 效果
> 可以看到三个问题全部解决
```
{
	"code": "200",
	"success": true,
	"msg": "操作成功",
	"body": {
		"list": [
			{
				"id": "1001",
				"name": null,
				"type": null,
				"typeDesc": null,
				"groupCode": "system",
				"groupDesc": null,
				"status": null,
				"statusDesc": null,
				"amount": "1.25"
			}
		]
	},
	"extra": null,
	"tid": "",
	"time": "2024-08-30 14:00:39"
}
```

# 解释

所有的输入输出都会经过 `HttpMessageConverter`

![](/images/2024-08-30-spring-mvc-converter-与-jackson-配置/003.png)

该 `Converter` 默认有 6 个实现类
![](/images/2024-08-30-spring-mvc-converter-与-jackson-配置/001.png)


添加 `jackson` 相关的包之后会自动添加一个 `MappingJackson2HttpMessageConverter`. `MappingJackson2HttpMessageConverter` 通过 `Jackson2ObjectMapperFactoryBean` 实例化一个 `ObjectMapper` 的实例, 在该工厂中, 可以注册自定义 `SimpleModule`. 具体可参考其 `JavaDoc`

![](/images/2024-08-30-spring-mvc-converter-与-jackson-配置/002.png)




