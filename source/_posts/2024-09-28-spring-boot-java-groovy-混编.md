---
title: spring boot java groovy 混编
date: 2024-09-28 09:04:00
categories:
- java
- ssm
- spring boot
tags:
- java
- ssm
- spring boot
---

# 参考

[Groovy 中文文档](https://groovy-lang.cn/documentation.html)

[Groovy脚本基础全攻略](https://www.cnblogs.com/chenxibobo/p/6402768.html)

[Groovy系列三 Java SpringBoot 整合 Groovy](https://blog.csdn.net/lly576403061/article/details/131505699)
[SpringBoot+Groovy运行动态脚本](https://blog.csdn.net/sleetdream/article/details/88791861)
[Java 调用 Groovy脚本的五种方式](https://blog.csdn.net/weixin_46488959/article/details/141107469)

# 环境搭建
## pom

{% note info no-icon simple %}
`type` 必须是 `pom`
{% endnote %}

```xml
<dependency>
    <groupId>org.codehaus.groovy</groupId>
    <artifactId>groovy-all</artifactId>
    <version>3.0.22</version>
    <type>pom</type>
</dependency>
```

## 使用 groovy 定义一个 bean
```groovy
package com.laolang.jx.groovy

import org.springframework.stereotype.Component

@Component
class HelloService {

    String sayHello() {
        return 'hello world'
    }
}
```

## 使用该 bean
```java
package com.laolang.jx.module.system.dict.controller;

import com.laolang.jx.groovy.HelloService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("admin/system/dict")
@RestController
public class SysDictController {

    private final HelloService helloService;

    @GetMapping("typeList")
    public Map<String, Object> typeList() {
        log.info("say:{}",helloService.sayHello());
        Map<String, Object> map = new HashMap<>();
        map.put("group", "system");
        return map;
    }
}
```

## 输出如下
```
2024-09-28 09:54:50.752 [http-nio-8092-exec-1] INFO  c.l.j.m.s.d.c.SysDictController - say:hello world
```

# GroovyScriptEngine 方式调用脚本
## groovy 脚本
```groovy
package groovy

String hello(String name) {
    return "hello " + name
}
```

## 调用
```java
package com.laolang.jx.module.system.dict.controller;

import com.laolang.jx.groovy.HelloService;
import groovy.lang.Binding;
import groovy.lang.Script;
import groovy.util.GroovyScriptEngine;
import groovy.util.ResourceException;
import groovy.util.ScriptException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("admin/system/dict")
@RestController
public class SysDictController {

    private final HelloService helloService;

    @GetMapping("typeList")
    public Map<String, Object> typeList() {
        // 使用 groovy 定义 bean
        log.info("say:{}", helloService.sayHello());

        // 加载 groovy 脚本
        GroovyScriptEngine engine = null;
        try {
            engine = new GroovyScriptEngine("E:/github/ghost-hello-project/ssm-study/spring-boot-groovy/src/main/resources/groovy");
            Script script = engine.createScript("HelloGroovy.groovy", new Binding());
            log.info("groovy result:{}", script.invokeMethod("hello", "laolang"));
        } catch (IOException | ResourceException | ScriptException e) {
            log.error("script error:{}", ExceptionUtils.getMessage(e));
        }

        Map<String, Object> map = new HashMap<>();
        map.put("group", "system");
        return map;
    }
}
```

## 输出
```
2024-09-28 10:11:57.306 [http-nio-8092-exec-1] INFO  c.l.j.m.s.d.c.SysDictController - say:hello world
2024-09-28 10:11:57.440 [http-nio-8092-exec-1] INFO  c.l.j.m.s.d.c.SysDictController - groovy result:hello laolang
```