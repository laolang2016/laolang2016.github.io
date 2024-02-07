---
title: cpp 库 - rapidjson
date: 2024-02-08 00:02:29
tags:
- C/C++

categories:
- C/C++
- 开源库
---

cpp 库 - rapidjson
<!--more-->

# 参考资料
[RapidJSON 文档](https://rapidjson.org/zh-cn/)
[JSON Schema 规范（中文版）](https://json-schema.apifox.cn/)

[json之JsonSchema教程](https://zhuanlan.zhihu.com/p/158424675)
[JSON Schema Validator 一个在线的 json schema 校验](https://www.jsonschemavalidator.net/)

# 项目地址

[https://gitcode.com/m0_53402432/cpp-guide/tree/main/opensource/json/rapidjson-guide](https://gitcode.com/m0_53402432/cpp-guide/tree/main/opensource/json/rapidjson-guide)

# 辅助类 TestHelper
```cpp
#pragma once

#include <fmt/core.h>
#include <rapidjson/document.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>
#include <spdlog/spdlog.h>

#include <fstream>
#include <memory>
#include <mutex>
#include <sstream>
#include <string>

#include "cppguide/util/log_util.h"

template <class T>
class R {
public:
    enum Status {
        OK,
        FAILED
    };
    R() = default;
    R(T dataValue, Status statusValue) : data(dataValue), status(statusValue) {}

public:
    bool ok() {
        return Status::OK == this->status;
    }

public:
    T      data;
    Status status{OK};
};

class TestHelper {
public:
    TestHelper() {
        this->log = cppguide::LogUtil::getLogger("testhelper");
    };
    ~TestHelper() = default;

public:
    static std::shared_ptr<TestHelper> getInstance() {
        static std::shared_ptr<TestHelper> singleton = nullptr;
        static std::mutex                  singletonMutex;

        if (singleton == nullptr) {
            std::unique_lock<std::mutex> lock(singletonMutex);
            if (singleton == nullptr) {
                singleton = std::make_shared<TestHelper>();
            }
        }

        return singleton;
    }

public:
    R<std::string> readTextFile(const std::string& path) {
        R<std::string> r;

        std::ifstream file;
        file.open(path, std::ios::in);
        if (!file) {
            SPDLOG_LOGGER_ERROR(log, fmt::format("文件:{} 打开失败", path));
            r.status = R<std::string>::Status::FAILED;
            file.close();
            return r;
        }

        std::stringstream ss;
        std::string       line;
        while (!file.eof()) {
            std::getline(file, line);
            ss << line << '\n';
        }
        r.data = ss.str();
        return r;
    }

    void printJson(rapidjson::Document& doc, bool pretty = false) {
        rapidjson::StringBuffer buffer;
        if (pretty) {
            rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
            doc.Accept(writer);
        } else {
            rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
            doc.Accept(writer);
        }

        SPDLOG_LOGGER_INFO(log, fmt::format("{}", buffer.GetString()));
    }

private:
    std::shared_ptr<spdlog::logger> log;
};
```

# json 文件
## plugins.json
```json
[
  {
    "id": "janna.core",
    "version": "1.0.0",
    "path": "janna.core-1.0.0",
    "enable": true
  }
]
```

## plugins.schema.json
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "janna 插件列表 schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "version", "path", "enable"],
    "properties": {
      "id": {
        "description": "插件id",
        "type": "string"
      },
      "version": {
        "description": "插件版本",
        "type": "string"
      },
      "path": {
        "description": "插件路径",
        "type": "string"
      },
      "enable": {
        "description": "是否启用该插件",
        "type": "boolean"
      }
    }
  }
}
```

## janna.taskbuttons.json
```json
{
  "id": "janna.taskbuttons:1.0.0",
  "version": "1.0.0",
  "author": "janna",
  "name": "taskbuttons",
  "subscribe": [
    {
      "source": "janna",
      "topic": "echo-taskbuttons",
      "publish": "taskbuttons-count"
    }
  ]
}
```

## plugin_desc.schema.json
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "janna 插件 schema",
  "type": "object",
  "required": ["id", "version", "author", "name", "subscribe"],
  "properties": {
    "id": {
      "description": "插件id",
      "type": "string"
    },
    "version": {
      "description": "插件版本",
      "type": "string"
    },
    "author": {
      "description": "插件作者",
      "type": "string"
    },
    "name": {
      "description": "插件名称",
      "type": "string"
    },
    "subscribe": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["source", "topic"],
        "properties": {
          "source": {
            "description": "消息来源",
            "type": "string"
          },
          "topic": {
            "description": "消息主题",
            "type": "string"
          },
          "publish": {
            "description": "响应后发送的消息",
            "type": "string"
          }
        }
      }
    }
  }
}
```

# 读取 json
```cpp
TEST_CASE("test_rapidjson_read") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_read start"));

    std::string jsonPath = "plugins.json";
    auto        r        = TestHelper::getInstance()->readTextFile(jsonPath);
    CHECK_MESSAGE(r.ok(), fmt::format("文件:{} 打开失败", jsonPath));
    CHECK_MESSAGE(!r.data.empty(), fmt::format("文件:{} 内容为空", jsonPath));

    rapidjson::Document doc;
    doc.Parse(r.data.c_str());
    CHECK_MESSAGE(!doc.HasParseError(), fmt::format("文件:{} 解析失败", jsonPath));
    TestHelper::getInstance()->printJson(doc, true);

    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_read end"));
}
```

# schema 校验
```cpp
TEST_CASE("test_rapidjson_schema") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_schema start"));

    // 解析 schema 文件
    std::string schemaPath = "plugin_desc.schema.json";
    auto        schemar    = TestHelper::getInstance()->readTextFile(schemaPath);
    CHECK_MESSAGE(schemar.ok(), fmt::format("文件:{} 打开失败", schemaPath));
    CHECK_MESSAGE(!schemar.data.empty(), fmt::format("文件:{} 内容为空", schemaPath));
    rapidjson::Document schemaDoc;
    schemaDoc.Parse(schemar.data.c_str());
    CHECK_MESSAGE(!schemaDoc.HasParseError(), fmt::format("文件:{} 解析失败", schemaPath));
    rapidjson::SchemaDocument schema(schemaDoc);

    // 解析 json 文件
    std::string jsonPath = "janna.taskbuttons.json";
    auto        jsonr    = TestHelper::getInstance()->readTextFile(jsonPath);
    CHECK_MESSAGE(jsonr.ok(), fmt::format("文件:{} 打开失败", jsonPath));
    CHECK_MESSAGE(!jsonr.data.empty(), fmt::format("文件:{} 内容为空", jsonPath));
    rapidjson::Document jsonDoc;
    jsonDoc.Parse(jsonr.data.c_str());
    CHECK_MESSAGE(!jsonDoc.HasParseError(), fmt::format("文件:{} 解析失败", jsonPath));

    // schema 校验
    rapidjson::SchemaValidator validator(schema);
    CHECK_MESSAGE(jsonDoc.Accept(validator), fmt::format("文件:{} 验证失败", jsonPath));

    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_schema end"));
}
```

# pointer 查询 json
```cpp
TEST_CASE("test_rapidjson_pointer") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_pointer start"));

    /* 解析 json 文件 */
    std::string jsonPath = "janna.taskbuttons.json";
    auto        jsonr    = TestHelper::getInstance()->readTextFile(jsonPath);
    CHECK_MESSAGE(jsonr.ok(), fmt::format("文件:{} 打开失败", jsonPath));
    CHECK_MESSAGE(!jsonr.data.empty(), fmt::format("文件:{} 内容为空", jsonPath));
    rapidjson::Document jsonDoc;
    jsonDoc.Parse(jsonr.data.c_str());
    CHECK_MESSAGE(!jsonDoc.HasParseError(), fmt::format("文件:{} 解析失败", jsonPath));

    /* pointer */
    // 获取id
    auto idValue = rapidjson::Pointer("/id").Get(jsonDoc);
    if (idValue && idValue->IsString()) {
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{}", idValue->GetString()));
    } else {
        SPDLOG_LOGGER_ERROR(log, fmt::format("获取id失败"));
    }

    // 获取 subscribe
    auto subscribeValue = rapidjson::Pointer("/subscribe").Get(jsonDoc);
    if (!subscribeValue || !subscribeValue->IsArray()) {
        SPDLOG_LOGGER_ERROR(log, fmt::format("获取 subscribe 失败"));
    }
    // 循环输出
    if (!subscribeValue->Empty()) {
        auto subscribeList = subscribeValue->GetArray();
        for (rapidjson::SizeType i = 0; i < subscribeList.Size(); i++) {
            auto& el          = subscribeList[i];
            auto  sourceValue = rapidjson::Pointer("/source").Get(el);
            if (sourceValue && sourceValue->IsString()) {
                SPDLOG_LOGGER_INFO(log, fmt::format("source:{}", sourceValue->GetString()));
            }
        }
    }

    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_pointer end"));
}
```

# 修改
```cpp
TEST_CASE("test_rapidjson_edit") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_edit start"));

    /* 解析 json 文件 */
    std::string jsonPath = "janna.taskbuttons.json";
    auto        jsonr    = TestHelper::getInstance()->readTextFile(jsonPath);
    CHECK_MESSAGE(jsonr.ok(), fmt::format("文件:{} 打开失败", jsonPath));
    CHECK_MESSAGE(!jsonr.data.empty(), fmt::format("文件:{} 内容为空", jsonPath));
    rapidjson::Document jsonDoc;
    jsonDoc.Parse(jsonr.data.c_str());
    CHECK_MESSAGE(!jsonDoc.HasParseError(), fmt::format("文件:{} 解析失败", jsonPath));

    /* pointer */
    // 获取 id
    auto idValue = rapidjson::Pointer("/id").Get(jsonDoc);
    if (idValue && idValue->IsString()) {
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{}", idValue->GetString()));
    } else {
        SPDLOG_LOGGER_ERROR(log, fmt::format("获取id失败"));
    }

    // 修改 id
    idValue->SetString("janna.core:1.0.0");

    // subscribe 添加一项
    // 获取 subscribe
    auto subscribeValue = rapidjson::Pointer("/subscribe").Get(jsonDoc);
    if (!subscribeValue || !subscribeValue->IsArray()) {
        SPDLOG_LOGGER_ERROR(log, fmt::format("获取 subscribe 失败"));
    }

    // 创建 subscribe 子项
    rapidjson::Value anotherSubscribe(rapidjson::kObjectType);
    anotherSubscribe.AddMember("source", "janna", jsonDoc.GetAllocator());
    anotherSubscribe.AddMember("topic", "echo-core", jsonDoc.GetAllocator());
    subscribeValue->GetArray().PushBack(anotherSubscribe, jsonDoc.GetAllocator());

    // 输出
    TestHelper::getInstance()->printJson(jsonDoc, true);

    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_edit end"));
}
```

# 输出
> **注意:rapidjson 提供了 `std::basic_istream` 和 `std::basic_ostream`,但是性能大大低于 ` FileWriteStream`**

```cpp
TEST_CASE("test_rapidjson_write") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_write start"));

    /* 解析 json 文件 */
    std::string jsonPath = "janna.taskbuttons.json";
    auto        jsonr    = TestHelper::getInstance()->readTextFile(jsonPath);
    CHECK_MESSAGE(jsonr.ok(), fmt::format("文件:{} 打开失败", jsonPath));
    CHECK_MESSAGE(!jsonr.data.empty(), fmt::format("文件:{} 内容为空", jsonPath));
    rapidjson::Document jsonDoc;
    jsonDoc.Parse(jsonr.data.c_str());
    CHECK_MESSAGE(!jsonDoc.HasParseError(), fmt::format("文件:{} 解析失败", jsonPath));

    /* pointer */
    // 获取 id
    auto idValue = rapidjson::Pointer("/id").Get(jsonDoc);
    if (idValue && idValue->IsString()) {
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{}", idValue->GetString()));
    } else {
        SPDLOG_LOGGER_ERROR(log, fmt::format("获取id失败"));
    }

    // 修改 id
    idValue->SetString("janna.core:1.0.0");

    // subscribe 添加一项
    // 获取 subscribe
    auto subscribeValue = rapidjson::Pointer("/subscribe").Get(jsonDoc);
    if (!subscribeValue || !subscribeValue->IsArray()) {
        SPDLOG_LOGGER_ERROR(log, fmt::format("获取 subscribe 失败"));
    }

    // 创建 subscribe 子项
    rapidjson::Value anotherSubscribe(rapidjson::kObjectType);
    anotherSubscribe.AddMember("source", "janna", jsonDoc.GetAllocator());
    anotherSubscribe.AddMember("topic", "echo-core", jsonDoc.GetAllocator());
    subscribeValue->GetArray().PushBack(anotherSubscribe, jsonDoc.GetAllocator());

    // 输出
    FILE* fp = fopen(jsonPath.c_str(), "w");  // 非 windows 平台使用 "w", windows 平台使用 "wb"
    CHECK_MESSAGE(fp, fmt::format("文件:{} 创建失败", jsonPath));
    char                                                writeBuffer[65536];
    rapidjson::FileWriteStream                          os(fp, writeBuffer, sizeof(writeBuffer));
    rapidjson::PrettyWriter<rapidjson::FileWriteStream> writer(os);
    jsonDoc.Accept(writer);
    fclose(fp);

    SPDLOG_LOGGER_INFO(log, fmt::format("test_rapidjson_write end"));
}
```
