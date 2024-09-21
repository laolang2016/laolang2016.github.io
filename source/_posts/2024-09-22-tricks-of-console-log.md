---
title: console.log 的技巧
date: 2024-09-22 02:56:22
categories:
- 前端
tags:
- 前端
---

# 基本打印
## 5 个级别
```js
console.log('log')
console.info('info')
console.warn('warn')
console.error('error')
console.debug('debug')
```

效果如下

![](/images/2024-09-22-tricks-of-console-log/001.png)

`debug` 的显示需要设置级别

![](/images/2024-09-22-tricks-of-console-log/002.png)


## 占位符

```
console.log('str:%s,int:%d,float:%f,object:%o','str',1,1.1,{name:'laolang',age:12})
```

![](/images/2024-09-22-tricks-of-console-log/003.png)

占位符还可以输出 `CSS` 样式, 每一个 `%c` 后的内容都可以定义一个 `CSS` 样式

```js

// 使用样式
let name = "CUGGZ";
console.log('My Name is %cCUGGZ', 'color: skyblue; font-size: 30px;')

// 胶囊
let a = 'background: #606060; color: #fff; border-radius: 3px 0 0 3px;'
let b = 'background: #1475B2; color: #fff; border-radius: 0 3px 3px 0;'
console.log(`%c Maven %c 1.2.3`, a, b)


// 打印字符图片
const res = `
    __  __     ____         _       __           __    __
   / / / /__  / / /___     | |     / /___  _____/ /___/ /
  / /_/ / _ \\/ / / __ \\    | | /| / / __ \\/ ___/ / __  / 
 / __  /  __/ / / /_/ /    | |/ |/ / /_/ / /  / / /_/ /  
/_/ /_/\\___/_/_/\\____/     |__/|__/\\____/_/  /_/\\__,_/   
`
console.log(res)
```
![](/images/2024-09-22-tricks-of-console-log/004.png)


# 打印时间

## time 和 timeEnd
```js
console.time("timer1");
console.time("timer2");

setTimeout(() => {
    console.timeEnd("timer1");
}, 1000);

setTimeout(() => {
    console.timeEnd("timer2");
}, 2000);

// timer1: 1004.666259765625 ms
// timer2: 2004.654052734375 ms
```

![](/images/2024-09-22-tricks-of-console-log/005.png)


## timeLog

这里的 `console.timeLog()` 上面的 `console.timeEnd()` 类似，但是也有一定的差别。他们都需要使用 `console.time()` 来启动一个计时器。然后 `console.timeLog()` 就是打印计时器当前的时间，而`console.timeEnd()` 是打印计时器，直到结束的时间

```js
console.time("timer");
 
setTimeout(() => {
    console.timeLog("timer")
  setTimeout(() => {
     console.timeLog("timer");
    }, 2000);
}, 1000);
 
// timer: 1002.80224609375 ms
// timer: 3008.044189453125 ms
```
而使用console.timeEnd()时
```
console.time("timer");
 
setTimeout(() => {
  console.timeEnd("timer")
 setTimeout(() => {
     console.timeLog("timer");
    }, 2000);
}, 1000);
```

![](/images/2024-09-22-tricks-of-console-log/006.png)

可以看到，它会终止当前的计时器，所以里面的timeLog就无法在找到timer计数器了。所以两者的区别就在于，是否会终止当前的计时。

# 分组打印

> `groupCollapsed()` 会默认折叠

```js
console.group("Alphabet")
  console.log("A");
  console.log("B");
  console.log("C");
  console.group("Numbers");
    console.log("One");
    console.log("Two");
  console.groupEnd("Numbers");
console.groupEnd("Alphabet");
```

![](/images/2024-09-22-tricks-of-console-log/007.png)

# 打印次数

```js
for (let i = 1; i <= 10; i++) {
    console.count('count')
    if( 5 === i ){
        console.countReset('count') // 重置
    }
}
```

![](/images/2024-09-22-tricks-of-console-log/008.png)

# 打印表格

{% note info no-icon simple %}
`console.table()` 最多只能处理 **1000** 行
{% endnote %}

```js
const users = [ 
   { 
      "first_name":"Harcourt",
      "last_name":"Huckerbe",
      "gender":"Male",
      "city":"Linchen",
      "birth_country":"China"
   },
   { 
      "first_name":"Allyn",
      "last_name":"McEttigen",
      "gender":"Male",
      "city":"Ambelókipoi",
      "birth_country":"Greece"
   },
   { 
      "first_name":"Sandor",
      "last_name":"Degg",
      "gender":"Male",
      "city":"Mthatha",
      "birth_country":"South Africa"
   }
]
 
console.table(users, ['first_name', 'last_name', 'city']);
```

![](/images/2024-09-22-tricks-of-console-log/009.png)

# assert
console.assert()方法用于语句断言，当断言为 false时，则在信息到控制台输出错误信息。它的语法如下：
```js
console.assert(expression, message)
```

它有两个参数：

* expression: 条件语句，语句会被解析成 Boolean，且为 false 的时候会触发message语句输出；
* message: 输出语句，可以是任意类型。

该方法会在expression条件语句为false时，就会打印message信息。当在特定情况下才输出语句时，就可以使用console.assert()方法。
比如，当列表元素的子节点数量大于等于100时，打印错误信息：

```js
console.assert(2 < 1, "2 is > 1");
```

![](/images/2024-09-22-tricks-of-console-log/010.png)

# trace
```
function a() {
  b();
}
function b() {
  console.trace();
}
function c() {
  a();
}
c();
```

![](/images/2024-09-22-tricks-of-console-log/011.png)

# dir
```js
const user = {
    username: 'laolang',
    age: 12
}

console.dir(user)
```

![](/images/2024-09-22-tricks-of-console-log/012.png)

# dirxml
```js
console.dirxml(document)
```

![](/images/2024-09-22-tricks-of-console-log/013.png)

# 参考
[你需要知道的 19 个 console 实用调试技巧！](https://blog.csdn.net/lsq191690/article/details/141498385)
[玩转控制台，看看那些你不知道的Console用法](https://zhuanlan.zhihu.com/p/54204778)