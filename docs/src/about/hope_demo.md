---
title: hope 示例
order: 102
---


## 一级标题

### 二级标题

#### 三级标题

##### 四级标题

###### 五级标题


## 任务列表

- [ ] 计划 A
- [x] 计划 B

## 图片

普通使用

![](/assets/image/about/hope_demo/avatar.jpg)

指定大小(不起作用)

![XX =192×108](/assets/image/about/hope_demo/bg.jpg)

## 导入文件

<!-- @include: ./hope_demo.snippet.md -->

## 脚注

脚注 1 链接[^first]。

脚注 2 链接[^second]

## 选项卡

::: tabs

@tab 标题 1

aaa

@tab 标题 2

bbb

@tab:active 标题 3

ccc

:::

## 提示容器

### 基本使用

::: important
重要容器。
:::

::: info
信息容器。
:::

::: note
注释容器。
:::

::: tip
提示容器
:::

::: warning
警告容器
:::

::: caution
危险容器
:::

::: details
详情容器
:::

### 自定义标题

::: important 自定义标题

一个有 `代码` 和 [链接](#演示) 的重要容器。

```js
const a = 1;
```

:::

::: info 自定义标题

一个有 `代码` 和 [链接](#演示) 的信息容器。

```js
const a = 1;
```

:::

::: note 自定义标题

一个有 `代码` 和 [链接](#演示) 的注释容器。

```js
const a = 1;
```

:::

::: tip 自定义标题

一个有 `代码` 和 [链接](#演示) 的提示容器。

```js
const a = 1;
```

:::

::: warning 自定义标题

一个有 `代码` 和 [链接](#演示) 的警告容器。

```js
const a = 1;
```

:::

::: caution 自定义标题

一个有 `代码` 和 [链接](#演示) 的危险容器。

```js
const a = 1;
```

:::

::: details 自定义标题

一个有 `代码` 和 [链接](#演示) 的详情容器。

```js
const a = 1;
```

:::


### 不含容器

::: important 自定义重要
:::

::: info 自定义信息
:::

::: note 自定义注释
:::

::: tip 自定义提示
:::

::: warning 自定义注意
:::

::: caution 自定义警告
:::

## GFM

> [!important]
> 重要文字

> [!info]
> 信息文字

> [!tip]
> 提示文字

> [!warning]
> 注意文字

> [!caution]
> 警告文字

> [!note]
> 注释文字


## 图表

### plantuml

::: preview 序列图

@startuml
:Main Admin: as Admin
(Use the application) as (Use)

User -> (Start)
User --> (Use)

Admin ---> (Use)

note right of Admin : This is an example.

note right of (Use)
A note can also
be on several lines
end note

note "This note is connected\nto several objects." as N2
(Start) .. N2
N2 .. (Use)
@enduml

:::

### 流程图

::: preview vue 主题

```flow
st=>start: 开始|past:>http://www.google.com[blank]
e=>end: 结束|future:>http://www.google.com
op1=>operation: 操作1|past
op2=>operation: 操作2|current
sub1=>subroutine: 子程序|invalid
cond=>condition: 是/否?|approved:>http://www.google.com
c2=>condition: 判断2|rejected
io=>inputoutput: 进行反思...|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```

:::


### mermaid

::: preview git 图标

```git-graph
commit
branch hotfix
checkout hotfix
commit
branch develop
checkout develop
commit id:"ash" tag:"abc"
branch featureB
checkout featureB
commit type:HIGHLIGHT
checkout main
checkout hotfix
commit type:NORMAL
checkout develop
commit type:REVERSE
checkout featureB
commit
checkout main
merge hotfix
checkout featureB
commit
checkout develop
branch featureA
commit
checkout develop
merge hotfix
checkout featureA
commit
checkout featureB
commit
checkout develop
merge featureA
branch release
checkout release
commit
checkout main
commit
checkout release
merge main
checkout develop
merge release
```

:::


## 代码块

### 代码块

```java title="Constant.java" :line-numbers {3,10-13}
package com.laolang.lightserver;

import java.io.File;

public class Constant {

    private Constant() {
    }

    /**
     * <code>user.dir</code> 指 <code>JVM</code> 的启动路径
     */
    public static final String WEB_ROOT = System.getProperty("user.dir") + File.separator + "webroot";
}
```


### 代码块分组

::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress
```

@tab yarn

```bash
yarn add -D vuepress
```

@tab:active npm

```bash
npm i -D vuepress
```

:::

### 预览

::: preview 可选标题

这里是一些内容。

:::

<VPPreview>

<template #code>

```js
document.innerHTML = "你好，世界！";
```

</template>
<template #content>

你好，世界！

</template>

</VPPreview>


[^first]: 脚注 **可以包含特殊标记**

    也可以由多个段落组成

[^second]: 脚注文字。
