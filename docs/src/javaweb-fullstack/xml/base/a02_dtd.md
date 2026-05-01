---
title: dtd
order: 102
---

## dtd 类型

### 内部 dtd

#### 示例

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE mapper [
    <!ELEMENT mapper (resultMap)*>
    <!ELEMENT resultMap (#PCDATA)>
]>

<mapper>
    <resultMap>this is a reultMap</resultMap>
</mapper>
```

#### 格式说明

```xml :no-line-numbers
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE 根元素名 [
    元素描述
]>

xml 文档主体
```


### 外部 dtd

#### 示例

**dtd**
```xml
<?xml version="1.0" encoding="utf-8" ?>
<!ELEMENT mapper (resultMap)*>
<!ELEMENT resultMap (#PCDATA)>
```


**xml**
```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE mapper SYSTEM "one.dtd" >
<mapper>
    <resultMap>xxx</resultMap>
</mapper>
```

#### 格式说明

**dtd**

```xml :no-line-numbers
<?xml version="1.0" encoding="utf-8" ?>
元素描述
```

**xml**

```xml :no-line-numbers
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE 根元素 SYSTEM "外部 dtd uri" >

xml 文档主体
```

注意: 

1. 如果 `dtd` 如果是 `uri` , 则在验证 `xml` 时必须可访问
2. `dtd` 可以使用相对路径
3. `dtd` 文件声明的第一个元素并不一定是根元素. 因为 `dtd` 中只要生命元素, 解析器就能找到, 只是习惯上将根元素的生命放在最前面

### 公用 dtd

#### 例子

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.laolang.jx.module.system.mapper.SysDictTypeMapper">

    <resultMap id="BaseResultMap" type="com.laolang.jx.module.system.entity.SysDictType">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="type" property="type"/>
        <result column="group_code" property="groupCode"/>
        <result column="status" property="status"/>
        <result column="create_by" property="createBy"/>
        <result column="create_date" property="createDate"/>
        <result column="update_by" property="updateBy"/>
        <result column="update_date" property="updateDate"/>
        <result column="remark" property="remark"/>
        <result column="deleted" property="deleted"/>
    </resultMap>

    <select id="listTypeGroupCode" resultType="java.lang.String">
        select
            distinct group_code
        from
            sys_dict_type
        where
            deleted = 0
    </select>


</mapper>
```


#### 格式

```xml :no-line-numbers
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "dtd 标识名" "通用 dtd uri">

xml 文档主体
```

#### 标识名

标识名遵循国际标准 —— **`FPI(Formal Public Identifier，正式公开标识符)`** , 分为如下四个部分, 但实际使用中, 经常忽略第四部分

```:no-line-numbers
注册所有者 // 描述 // 语言 // 类型
```

标识名的作用:

1. 唯一性. `FPI` 永远指代同一个 `dtd` 版本
2. 缓存. 以比如 IDE 可以根据 `FPI` 在本地匹配对应的 `dtd` 文件


## dtd 内容

* 元素
* 属性
* 实体
* PCDATA
* CDATA

