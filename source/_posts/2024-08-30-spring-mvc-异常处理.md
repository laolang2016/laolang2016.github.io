---
title: spring mvc 异常处理
date: 2024-08-30 14:19:31
categories:
- java
- spring
tags:
- java
- spring
---


# 添加一个异常
## controller
```java
package com.laolang.jx.module.system.dict.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.laolang.jx.framework.common.domain.R;
import com.laolang.jx.module.system.dict.logic.SysDictLogic;
import com.laolang.jx.module.system.dict.req.SysDictTypeListReq;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("system/dict")
@RestController
public class SysDictController {
	
	private final SysDictLogic sysDictLogic;

	@PostMapping("list")
	public R<SysDictTypeListRsp> list(@RequestBody SysDictTypeListReq req){
		return R.ok(sysDictLogic.list(req));
	}
}
```
## logic
```java
package com.laolang.jx.module.system.dict.logic;

import java.util.List;

import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.laolang.jx.framework.common.consts.DefaultStatusCode;
import com.laolang.jx.framework.common.exception.BusinessException;
import com.laolang.jx.module.system.dict.req.SysDictTypeListReq;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp.SysDictTypeListRspBean;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SysDictLogic {
	public SysDictTypeListRsp list(SysDictTypeListReq req) {

		if (StrUtil.equals("1", req.getGroupCode())) {
			throw new BusinessException(DefaultStatusCode.FAILED.getCode(), "查询异常");
		}

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


# 自定义异常处理
```java
package com.laolang.jx.framework.web.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laolang.jx.framework.common.domain.R;
import com.laolang.jx.framework.common.exception.BusinessException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.core.Ordered;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

@RequiredArgsConstructor
@Slf4j
public class CustomHandlerExceptionResolver extends AbstractHandlerExceptionResolver {
	private static final String APPLICATION_JSON_UTF8 = "application/json; charset=utf-8";

	private final ObjectMapper objectMapper;
	
	
	/**
	 * 参考: DefaultHandlerExceptionResolver#doResolveException
	 */
	@SuppressWarnings("unchecked")
	@Nullable
	@Override
	protected ModelAndView doResolveException(@Nonnull HttpServletRequest request,
			@Nonnull HttpServletResponse response, Object handler, @Nonnull Exception ex) {
		try {
			log.info("请求出错. url:{}, error:{}", request.getRequestURI(), ExceptionUtils.getMessage(ex));
			response.setCharacterEncoding(StandardCharsets.UTF_8.name());
			response.setContentType(APPLICATION_JSON_UTF8);
			R<?> r = R.error();
			if (ex instanceof NoHandlerFoundException) {
				r = handleNoHandlerFoundException(request, response);
			} else if (ex instanceof BusinessException) {
				r = handleBusinessException(response, (BusinessException) ex);
			} else {
				log.error("未知异常. error class:{}", ex.getClass());
			}

			ModelAndView mv = new ModelAndView(new MappingJackson2JsonView());
			mv.addAllObjects(objectMapper.readValue(objectMapper.writeValueAsString(r), Map.class));
			return mv;
		} catch (Exception e) {
			log.error("异常处理出错. e:{}", ExceptionUtils.getMessage(e));
		}
		return null;
	}

	/**
	 * 404
	 */
	private R<?> handleNoHandlerFoundException(HttpServletRequest request, HttpServletResponse response) {
		R<?> r = R.notFound();
		response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		log.info("请求地址不存在. url:{}", request.getRequestURI());
		return r;
	}

	/**
	 * 业务异常
	 */
	private R<?> handleBusinessException(HttpServletResponse response, BusinessException ex) {
		R<?> r = R.failed();
		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		r.setPropFromBusinessException(ex);
		log.error("code:{},msg:{}", ex.getCode(), ex.getMsg());
		return r;
	}

	@Override
	public int getOrder() {
		return Ordered.HIGHEST_PRECEDENCE;
	}
}
```

# spring mvc 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
		http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">


	<!-- TODO 添加 接口包的扫描 -->
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

	<!-- Jackson ObjectMapper 配置 -->
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

	<!-- 自定义 HandlerExceptionResolver -->
	<bean id="defaultServletHttpRequestHandler"
		class="com.laolang.jx.framework.web.web.CustomHandlerExceptionResolver">
		<constructor-arg ref="objectMapper" />
	</bean>
	
	<!-- 静态资源过虑 -->
	<!-- <mvc:default-servlet-handler /> -->

	<mvc:resources mapping="/favicon.ico"
		location="favicon.ico" />
</beans>
```

# 关于 404 拦截
## 未配置 mvc:default-servlet-handler


异常处理和上面的一样, 主要是 `web.xml` 需要添加一个配置
```xml
<!-- spring servlet -->
<servlet>
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring/spring-mvc.xml</param-value>
    </init-param>
    <!-- 注意这里 -->
    <init-param>
        <param-name>throwExceptionIfNoHandlerFound</param-name>
        <param-value>true</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
```

> 这种情况就是 `spring mvc` 项目是一个纯粹的后端项目, 即前后端分离, 后端没有任何静态资源

## 已配置 mvc:default-servlet-handler
由于配置了 `mvc:default-servlet-handler`, `spring mvc` 将 `404` 的处理交给了 `SimpleUrlHandlerMapping`
> 这种情况就是后端既有静态资源(例如`jsp`), 又有接口, 此时需要接管`spring mvc` 中 `SimpleUrlHandlerMapping` 对 `404` 的处理, 既要适应页面 `404` 也要适应接口 `404`

### 自定义 DefaultServletHttpRequestHandler
```java
package com.laolang.jx.framework.web.handler;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.util.Assert;
import org.springframework.util.PatternMatchUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomServletHttpRequestHandler extends DefaultServletHttpRequestHandler {

	@Autowired
	private RequestMappingHandlerMapping requestMappingHandlerMapping;

	/** Default Servlet name used by Tomcat, Jetty, JBoss, and GlassFish. */
	private static final String COMMON_DEFAULT_SERVLET_NAME = "default";

	/** Default Servlet name used by Google App Engine. */
	private static final String GAE_DEFAULT_SERVLET_NAME = "_ah_default";

	/** Default Servlet name used by Resin. */
	private static final String RESIN_DEFAULT_SERVLET_NAME = "resin-file";

	/** Default Servlet name used by WebLogic. */
	private static final String WEBLOGIC_DEFAULT_SERVLET_NAME = "FileServlet";

	/** Default Servlet name used by WebSphere. */
	private static final String WEBSPHERE_DEFAULT_SERVLET_NAME = "SimpleFileServlet";

	@Nullable
	private String defaultServletName;

	@Nullable
	private ServletContext servletContext;

	/**
	 * Set the name of the default Servlet to be forwarded to for static resource
	 * requests.
	 */
	public void setDefaultServletName(String defaultServletName) {
		this.defaultServletName = defaultServletName;
	}

	/**
	 * If the {@code defaultServletName} property has not been explicitly set,
	 * attempts to locate the default Servlet using the known common
	 * container-specific names.
	 */
	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
		if (!StringUtils.hasText(this.defaultServletName)) {
			if (this.servletContext.getNamedDispatcher(COMMON_DEFAULT_SERVLET_NAME) != null) {
				this.defaultServletName = COMMON_DEFAULT_SERVLET_NAME;
			} else if (this.servletContext.getNamedDispatcher(GAE_DEFAULT_SERVLET_NAME) != null) {
				this.defaultServletName = GAE_DEFAULT_SERVLET_NAME;
			} else if (this.servletContext.getNamedDispatcher(RESIN_DEFAULT_SERVLET_NAME) != null) {
				this.defaultServletName = RESIN_DEFAULT_SERVLET_NAME;
			} else if (this.servletContext.getNamedDispatcher(WEBLOGIC_DEFAULT_SERVLET_NAME) != null) {
				this.defaultServletName = WEBLOGIC_DEFAULT_SERVLET_NAME;
			} else if (this.servletContext.getNamedDispatcher(WEBSPHERE_DEFAULT_SERVLET_NAME) != null) {
				this.defaultServletName = WEBSPHERE_DEFAULT_SERVLET_NAME;
			} else {
				throw new IllegalStateException("Unable to locate the default servlet for serving static content. "
						+ "Please set the 'defaultServletName' property explicitly.");
			}
		}
	}

	@Override
	public void handleRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		handleException(request, response);

		origionHandleRequest(request, response);
	}

	/**
	 * 原处理方法
	 */
	private void origionHandleRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Assert.state(this.servletContext != null, "No ServletContext set");
		RequestDispatcher rd = this.servletContext.getNamedDispatcher(this.defaultServletName);
		if (rd == null) {
			throw new IllegalStateException("A RequestDispatcher could not be located for the default servlet '"
					+ this.defaultServletName + "'");
		}
		rd.forward(request, response);
	}

	/**
	 * 处理异常
	 */
	private void handleException(HttpServletRequest request, HttpServletResponse response)
			throws IOException, NoHandlerFoundException {
		String requestURI = request.getRequestURI();
		HandlerMethod handlerMethod = findHandlerMethod(requestURI);
		if (Objects.isNull(handlerMethod)) {
			if (StrUtil.startWith(requestURI, "/api")) {
				log.info("接口 404");
				throw new NoHandlerFoundException(request.getMethod(), requestURI, null);
			} else {
				log.info("页面 404");
				response.sendRedirect("/error/404");
				return;
			}
		}
	}

	/**
	 * 根据请求地址获取 HandlerMethod
	 */
	private HandlerMethod findHandlerMethod(String requestURI) {
		return requestMappingHandlerMapping.getHandlerMethods().entrySet().stream()
				.filter(entry -> entry.getKey().getPatternsCondition().getPatterns().stream()
						.anyMatch(pattern -> PatternMatchUtils.simpleMatch(pattern, requestURI)))
				.map(Map.Entry::getValue).findFirst().orElse(null);
	}
}
```

### 添加 404 页面
```java
package com.laolang.jx.framework.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("error")
@Controller
public class ErrorController {
	
	@GetMapping("404")
	public String handler404() {
		return "error/404";
	}
}
```

### spring mvc 配置

> 需要删除 `<mvc:default-servlet-handler />`

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

	<!-- Jackson ObjectMapper 配置 -->
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

	<!-- 自定义 HandlerExceptionResolver -->
	<bean id="defaultServletHttpRequestHandler"
		class="com.laolang.jx.framework.web.web.CustomHandlerExceptionResolver">
		<constructor-arg ref="objectMapper" />
	</bean>

	<!-- 自定义静态资源处理 -->
	<bean id="customServletHttpRequestHandler"
		class="com.laolang.jx.framework.web.handler.CustomServletHttpRequestHandler" />

	<!-- 自定义的 HandlerMapping -->
	<bean
		class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
		<property name="defaultHandler"
			ref="customServletHttpRequestHandler" />
	</bean>
	
	<!-- jsp -->
	<bean
		class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="prefix" value="/WEB-INF/jsp/" />
		<property name="suffix" value=".jsp" />
	</bean>

	<!-- 静态资源配置 -->
	<mvc:resources location="/assets/**" mapping="/assets/"/>
	<mvc:resources mapping="/favicon.ico"
		location="favicon.ico" />
</beans>
```



## 更好的办法
[【Java Web开发学习】Spring MVC异常统一处理](https://www.cnblogs.com/yangchongxing/p/9271900.html)



