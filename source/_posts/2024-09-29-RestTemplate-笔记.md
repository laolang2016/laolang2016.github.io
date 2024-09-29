---
title: RestTemplate 笔记
date: 2024-09-29 08:01:34
categories:
- java
- request
- RestTemplate
tags:
- java
- request
- RestTemplate
---

# 参考资料

[spring 中文文档 · REST 客户端](https://docs.springjava.cn/spring-framework/reference/integration/rest-clients.html)
[spring 中文网 · 1.2. RestTemplate](https://springdoc.cn/spring/integration.html#rest-resttemplate)

# 基本使用

## 接口准备

### controller
```java
package com.laolang.jx.module.system.dict.controller;

import com.laolang.jx.framework.common.domain.R;
import com.laolang.jx.module.system.dict.logic.SysDictLogic;
import com.laolang.jx.module.system.dict.req.SysDictTypeListReq;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("admin/system/dict")
@RestController
public class SydDictController {

    private final SysDictLogic sysDictLogic;

    @GetMapping("getMethod")
    public R<SysDictTypeListRsp> getMethod() {
        return R.ok(sysDictLogic.getMethod());
    }

    @GetMapping("getMethodWithParam")
    public R<SysDictTypeListRsp> getMethodWithParam(@RequestParam(value = "id") Long id,
                                                    @RequestParam(value = "name", defaultValue = "laolang") String name) {
        return R.ok(sysDictLogic.getMethodWithParam(id, name));
    }

    @PostMapping("postMethod")
    public R<SysDictTypeListRsp> postMethod() {
        return R.ok(sysDictLogic.postMethod());
    }

    @PostMapping("postMethodWithFormData")
    public R<SysDictTypeListRsp> postMethodWithFormData(SysDictTypeListReq req) {
        return R.ok(sysDictLogic.postMethodWithFormData(req));
    }

    @PostMapping("postMethodWithRequestBody")
    public R<SysDictTypeListRsp> postMethodWithRequestBody(@RequestBody SysDictTypeListReq req) {
        return R.ok(sysDictLogic.postMethodWithRequestBody(req));
    }
}
```

### logic
```java
package com.laolang.jx.module.system.dict.logic;

import com.laolang.jx.framework.common.util.JsonUtil;
import com.laolang.jx.module.system.dict.req.SysDictTypeListReq;
import com.laolang.jx.module.system.dict.rsp.SysDictTypeListRsp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class SysDictLogic {

    public SysDictTypeListRsp getMethod() {
        log.info("getMethod");
        return buildRsp();
    }

    public SysDictTypeListRsp getMethodWithParam(Long id, String name) {
        log.info("getMethodWithParam");
        log.info("id:{}, name:{}", id, name);
        return buildRsp();
    }

    public SysDictTypeListRsp postMethod() {
        log.info("postMethod");
        return buildRsp();
    }

    public SysDictTypeListRsp postMethodWithFormData(SysDictTypeListReq req) {
        log.info("postMethodWithFormData. req:{}", JsonUtil.toJson(req));
        return buildRsp();
    }

    public SysDictTypeListRsp postMethodWithRequestBody(SysDictTypeListReq req) {
        log.info("postMethodWithRequestBody. req:{}", JsonUtil.toJson(req));
        return buildRsp();
    }

    private SysDictTypeListRsp buildRsp() {
        SysDictTypeListRsp rsp = new SysDictTypeListRsp();
        rsp.setId(1L);
        rsp.setName("性别");
        rsp.setType("gender");
        rsp.setTypeDesc("性别");
        rsp.setGroupCode("system");
        return rsp;
    }
}
```

## restTemplate 简单使用

### 配置
```java
package com.laolang.jx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

### 测试
```java
package com.laolang.jx;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.testng.annotations.Test;

@Slf4j
@SpringBootTest(classes = RestTemplateStudyApplication.class)
public class RestTemplateSimpleTest extends AbstractTestNGSpringContextTests {

    private static final String BASE_URL = "http://localhost:8092/admin/system/dict";

    @Autowired
    private RestTemplate restTemplate;

    /**
     * 无参 get 请求
     */
    @Test
    public void testGetMethod() {
        String url = BASE_URL + "/getMethod";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        log.info("code:{}", response.getStatusCode().value());
        log.info("body:{}", response.getBody());
    }

    /**
     * get 请求带参数
     */
    @Test
    public void testGetMethodWithParam() {
        String url = BASE_URL + "/getMethodWithParam?id=1";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        log.info("code:{}", response.getStatusCode().value());
        log.info("body:{}", response.getBody());
    }

    /**
     * 无参 post 请求
     */
    @Test
    public void testPostMethod() throws IOException {
        String url = BASE_URL + "/postMethod";
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>();
        ResponseEntity<String> response = restTemplate.postForEntity(url, param, String.class);

        log.info("code:{}", response.getStatusCode().value());
        log.info("body:{}", response.getBody());
    }

    /**
     * post form 表单请求
     */
    @Test
    public void testPostMethodWithFormData() {
        String url = BASE_URL + "/postMethodWithFormData";
        MultiValueMap<String, Object> param = new LinkedMultiValueMap<>();
        param.set("id", 1);
        ResponseEntity<String> response = restTemplate.postForEntity(url, param, String.class);

        log.info("code:{}", response.getStatusCode().value());
        log.info("body:{}", response.getBody());
    }

    /**
     * post json 请求
     */
    @Test
    public void testPostMethodWithRequestBody() throws IOException {
        String url = BASE_URL + "/postMethodWithRequestBody";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        Map<String, Object> param = new HashMap<>();
        param.put("id", 1);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(param, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        log.info("code:{}", response.getStatusCode().value());
        log.info("body:{}", response.getBody());
    }
}
```

