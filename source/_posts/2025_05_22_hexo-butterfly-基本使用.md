---
title: hexo butterfly 基本使用
date: 2025-05-22 13:09:10
description: hexo butterfly 基本使用
categories:
- hexo
tags:
- hexo
---


# 基本使用

## 图片
![](/images/2025_05_22_hexo-butterfly-基本使用/003.jpg)

# 标签外挂

## 代码

```java
package com.laolang.bible.designpattern.simplefactory;

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
```

## mermaid

```mermaid
pie
title Key elements in Product X
"Calcium" : 42.96
"Potassium" : 50.05
"Magnesium" : 10.01
"Iron" : 5
```


## tabs

{% tabs test1 %}

<!-- tab -->

**This is Tab 1.**

<!-- endtab -->

<!-- tab -->

**This is Tab 2.**

<!-- endtab -->

<!-- tab -->

**This is Tab 3.**

<!-- endtab -->

{% endtabs %}


## label

臣亮言：{% label 先帝 %}创业未半，而{% label 中道崩殂 blue %}。今天下三分，{% label 益州疲敝 pink %}，此诚{% label 危急存亡之秋 red %}也！然侍衞之臣，不懈于内；{% label 忠志之士 purple %}，忘身于外者，盖追先帝之殊遇，欲报之于陛下也。诚宜开张圣听，以光先帝遗德，恢弘志士之气；不宜妄自菲薄，引喻失义，以塞忠谏之路也。
宫中、府中，俱为一体；陟罚臧否，不宜异同。若有{% label 作奸 orange %}、{% label 犯科 green %}，及为忠善者，宜付有司，论其刑赏，以昭陛下平明之治；不宜偏私，使内外异法也。


## chartjs

{% chartjs 70 %}

<!-- chart -->
{
    "type": "line",
    "data": {
        "labels": ["January", "February", "March", "April", "May", "June", "July"],
        "datasets": [{
            "label": "My First dataset",
            "backgroundColor": "rgb(255, 99, 132)",
            "borderColor": "rgb(255, 99, 132)",
            "data": [0, 10, 5, 2, 20, 30, 45]
        }]
    },
    "options": {
        "responsive": true,
        "title": {
            "display": true,
            "text": "Chart.js Line Chart"
        }
    }
}
<!-- endchart -->

{% endchartjs %}



