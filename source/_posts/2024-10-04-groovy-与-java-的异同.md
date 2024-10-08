---
title: groovy 与 java 的异同
date: 2024-10-04 00:26:12
categories:
- java
- groovy
tags:
- java
- groovy
---

# 参考

[groovy 中文文档 · 语法](https://groovy-lang.cn/syntax.html)
[groovy 中文文档 · 与 java 的区别](https://groovy-lang.cn/differences.html)

# 字符串

## 单引号字符串
```groovy
package com.laolang.jx


import org.slf4j.LoggerFactory
import org.testng.annotations.Test

class CommonTest {
    def logger = LoggerFactory.getLogger(CommonTest.class)

    @Test
    void commonTest() {
        // 字符串可以使用单引号
        def str1 = 'hello world'
        logger.info str1

        // 字符串可以使用三个单引号
        def str2 = '''package com.laolang.jx

import org.slf4j.LoggerFactory

class GroovyHelloApplication {
    static def logger = LoggerFactory.getLogger(GroovyHelloApplication.class)

    static void main(String[] args) {
        logger.info "Hello Groovy"
    }
}
'''
        logger.info str2

        // 单引号的字符串, 其实都是 java.lang.String 的实例
        Assert.assertEquals(str1.getClass().toString(),'class java.lang.String')
        Assert.assertEquals(str2.getClass().toString(),'class java.lang.String')
    }
}
```

## 双引号
```groovy
package com.laolang.jx


import org.slf4j.LoggerFactory
import org.testng.Assert
import org.testng.annotations.Test

class CommonTest {
    def logger = LoggerFactory.getLogger(CommonTest.class)

    @Test
    void commonTest() {
        // 字符串可以使用双引号
        def msg = "Hello World"
        logger.info msg

        // 双引号字符串可以插值
        def str = "I said : ${msg}"
        logger.info str

        // 如果没有插值,则是 java.lang.String 的实例
        Assert.assertEquals(msg.getClass().toString(),'class java.lang.String')

        // 如果使用了插值, 是 groovy.lang.GString 的实例
        Assert.assertEquals(str.getClass().toString(),'class org.codehaus.groovy.runtime.GStringImpl')

        // 插值可以使用前缀为点号表达式的单个 $ 符号
        def person = [name:'laolang',age:23]
        def str2 = "My name is $person.name , my age is $person.age"
        logger.info str2

        // 插值还可以调用方法
        def p = new Person()
        def str3 = "msg is : ${p.sayHello()}"
        logger.info str3
    }

    static class Person{
        def name = 'xiaodaima'
        def age = 36

        def sayHello(){
            return "My name is $name , my age is $age"
        }
    }
}
```

# 列表和数组

```groovy
package com.laolang.jx


import org.slf4j.LoggerFactory
import org.testng.Assert
import org.testng.annotations.Test

class CommonTest {
    def logger = LoggerFactory.getLogger(CommonTest.class)

    @Test
    void commonTest() {
        // 一般的列表是 java.util.ArrayList 的实例
        def list1 = [1,2,3]
        Assert.assertTrue(list1 instanceof ArrayList)

        // 可以指定列表类型
        def list2 = [1,2,3] as LinkedList
        Assert.assertTrue(list2 instanceof LinkedList)
    }
}
```

# 面向对象

```groovy
package com.laolang.jx

import org.slf4j.LoggerFactory
import org.testng.annotations.Test

class CommonTest {
    def logger = LoggerFactory.getLogger(CommonTest.class)

    @Test
    void commonTest() {
        // 可以使用命名参数
        def person = new Person(name: 'laolang', age: 12)
        logger.info person.name
        logger.info person.age as String

        // 方法也可以使用命名参数
        person.sayHello(name: 'laolang')

        // 方法参数可以有默认值
        person.sayHi('laolang')
        person.sayHi('laolang', 34)
    }

    class Person {
        String name
        Integer age

        def sayHello(Map args) {
            logger.info "${args.name}"
        }

        void sayHi(String name, Integer age = 23) {
            logger.info "My name is ${name}, I'm ${age} years old."
        }
    }
}
```

# 闭包
```groovy
package com.laolang.jx

import org.slf4j.LoggerFactory
import org.testng.annotations.Test

class CommonTest {
    def logger = LoggerFactory.getLogger(CommonTest.class)

    @Test
    void commonTest() {
        ajax('url', 'method', str -> {
            logger.info str as String
        }, str -> {
            logger.info str as String
        })
        ajax('url', 'method', str -> {
            logger.info str as String
        })
    }

    void ajax(String url, String method, Closure<String> onSuccess, Closure<String> onError = null) {
        logger.info "url:${url} , method:${method}"
        onSuccess('success')
        if (Objects.nonNull(onError)) {
            onError('error')
        }
    }

}
```

# dsl
```groovy
class DatabaseConfig {
    String url
    String username
    String password
    int maxConnections

    void url(String url) {
        this.url = url
    }

    void username(String username) {
        this.username = username
    }

    void password(String password) {
        this.password = password
    }

    void maxConnections(int maxConnections) {
        this.maxConnections = maxConnections
    }

    String toString() {
        return "DatabaseConfig(url: $url, username: $username, password: $password, maxConnections: $maxConnections)"
    }
}

// 使用DSL配置数据库连接
def config = new DatabaseConfig()
config {
    url "jdbc:mysql://localhost:3306/mydb"
    username "root"
    password "secret"
    maxConnections 10
}

println config.toString()
```
