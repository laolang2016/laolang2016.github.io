---
title: cpp 库 - pugixml
date: 2024-01-30 18:55:53
tags:
- C/C++

categories:
- C/C++
- 开源库
---

cpp 库 - pugixml
<!--more-->

# 参考资料
官网: [https://pugixml.org/](https://pugixml.org/)

中文文: [pugixml 1.10 快速入门指南](https://www.cnblogs.com/Gale-Tech/p/16089326.html)

# 仓库地址
[https://gitcode.com/m0_53402432/cpp-guide/tree/main/opensource/xml/pugixml-guide](https://gitcode.com/m0_53402432/cpp-guide/tree/main/opensource/xml/pugixml-guide)

可参考文件: [https://gitcode.com/m0_53402432/cpp-guide/blob/main/opensource/xml/pugixml-guide/test/test_pugixml.cpp](https://gitcode.com/m0_53402432/cpp-guide/blob/main/opensource/xml/pugixml-guide/test/test_pugixml.cpp)

# xml 文件内容
```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
    <students>
        <student id="1001">
            <name>张三</name>
            <sex>男</sex>
        </student>
        <student id="1002">
            <name>李四</name>
            <sex>男</sex>
        </student>
        <student id="1003">
            <name>王五</name>
            <sex>女</sex>
        </student>
    </students>
</root>
```

# 加载文档
## 从文件加载
```cpp
TEST_CASE("test_pugixml_load_from_file") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_pugixml_load_from_file"));
    pugi::xml_document doc;
    auto               result = doc.load_file("students.xml", pugi::parse_default, pugi::encoding_utf8);
    CHECK_MESSAGE(pugi::xml_parse_status::status_ok == result.status, fmt::format("文件:【{}】打开失败 ", "student.xml"));
    pugi::xml_node root_node     = doc.child("root");
    pugi::xml_node students_node = root_node.child("students");
    // 分别读取每个学生信息
    for (pugi::xml_node student_node = students_node.child("student"); student_node;
            student_node                = student_node.next_sibling("student")) {
        pugi::xml_node name_node = student_node.child("name");
        pugi::xml_node sex_node  = student_node.child("sex");
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                            name_node.first_child().value(), sex_node.first_child().value()));
    }
}
```

## 从内存加载
```cpp
TEST_CASE("test_pugixml_load_from_buffer") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_pugixml_load_from_file"));
    pugi::xml_document doc;
    std::string        xmlContent =
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?><root><students><student "
        "id=\"1001\"><name>张三</name><sex>男</sex></student><student id=\"1002\"><name>李四</name><sex>男</sex></student><student "
        "id=\"1003\"><name>王五</name><sex>女</sex></student></students></root>";

    auto result = doc.load_buffer(xmlContent.c_str(), xmlContent.size(), pugi::parse_default, pugi::encoding_utf8);
    CHECK_MESSAGE(pugi::xml_parse_status::status_ok == result.status, fmt::format("文件:【{}】打开失败 ", "student.xml"));
    pugi::xml_node root_node     = doc.child("root");
    pugi::xml_node students_node = root_node.child("students");
    // 分别读取每个学生信息
    for (pugi::xml_node student_node = students_node.child("student"); student_node;
            student_node                = student_node.next_sibling("student")) {
        pugi::xml_node name_node = student_node.child("name");
        pugi::xml_node sex_node  = student_node.child("sex");
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                            name_node.first_child().value(), sex_node.first_child().value()));
    }
}
```

## 从 C++ IOstreams 加载
```cpp
TEST_CASE("test_pugixml_load_from_ifstream") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_pugixml_load_from_ifstream"));

    std::ifstream file("students.xml", std::ios::in);
    CHECK_MESSAGE(file.good(), fmt::format("文件:【{}】打开失败 ", "student.xml"));

    pugi::xml_document doc;
    auto               result = doc.load(file);
    CHECK_MESSAGE(pugi::xml_parse_status::status_ok == result.status, fmt::format("文件:【{}】打开失败 ", "student.xml"));
    pugi::xml_node root_node     = doc.child("root");
    pugi::xml_node students_node = root_node.child("students");
    // 分别读取每个学生信息
    for (pugi::xml_node student_node = students_node.child("student"); student_node;
            student_node                = student_node.next_sibling("student")) {
        pugi::xml_node name_node = student_node.child("name");
        pugi::xml_node sex_node  = student_node.child("sex");
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                            name_node.first_child().value(), sex_node.first_child().value()));
    }
}
```

# 遍历
```cpp
TEST_CASE("test_pugixml_traversal") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_pugixml_traversal"));

    pugi::xml_document doc;
    auto               result = doc.load_file("students.xml", pugi::parse_default, pugi::encoding_utf8);
    CHECK_MESSAGE(pugi::xml_parse_status::status_ok == result.status, fmt::format("文件:【{}】打开失败 ", "student.xml"));
    pugi::xml_node root_node     = doc.child("root");
    pugi::xml_node students_node = root_node.child("students");

    // 基于内容遍历
    for (pugi::xml_node student_node = students_node.child("student"); student_node;
            student_node                = student_node.next_sibling("student")) {
        pugi::xml_node name_node = student_node.child("name");
        pugi::xml_node sex_node  = student_node.child("sex");
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                            name_node.first_child().value(), sex_node.first_child().value()));
    }

    // for-loop 遍历
    for (pugi::xml_node student_node : students_node) {
        pugi::xml_node name_node = student_node.child("name");
        pugi::xml_node sex_node  = student_node.child("sex");
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                            name_node.first_child().value(), sex_node.first_child().value()));
    }

    // 迭代器遍历
    for (pugi::xml_node_iterator it = students_node.begin(); it != students_node.end(); ++it) {  // NOLINT
        pugi::xml_node student_node = *it;
        pugi::xml_node name_node    = student_node.child("name");
        pugi::xml_node sex_node     = student_node.child("sex");
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                            name_node.first_child().value(), sex_node.first_child().value()));
    }
}
```

# xpath
```cpp
TEST_CASE("test_pugixml_xpath") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_pugixml_xpath"));

    pugi::xml_document doc;
    auto               result = doc.load_file("students.xml", pugi::parse_default, pugi::encoding_utf8);
    CHECK_MESSAGE(pugi::xml_parse_status::status_ok == result.status, fmt::format("文件:【{}】打开失败 ", "student.xml"));
    // 查询集合
    pugi::xpath_node_set students_node = doc.select_nodes("/root/students/student");
    SPDLOG_LOGGER_INFO(log, fmt::format("size:{}", students_node.size()));
    for (const auto &xpathNde : students_node) {
        auto           student_node = xpathNde.node();
        pugi::xml_node name_node    = student_node.child("name");
        pugi::xml_node sex_node     = student_node.child("sex");
        SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                            name_node.first_child().value(), sex_node.first_child().value()));
    }

    // 查询单个
    pugi::xpath_node stu1002      = doc.select_node("/root/students/student[@id='1002']");
    auto             student_node = stu1002.node();
    pugi::xml_node   name_node    = student_node.child("name");
    pugi::xml_node   sex_node     = student_node.child("sex");
    SPDLOG_LOGGER_INFO(log, fmt::format("id:{},name:{},sex:{}", student_node.attribute("id").as_string(),
                                        name_node.first_child().value(), sex_node.first_child().value()));
}
```

# 修改
```cpp
TEST_CASE("test_pugixml_edit") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_pugixml_edit"));

    pugi::xml_document doc;
    auto               result = doc.load_file("students.xml", pugi::parse_default, pugi::encoding_utf8);
    CHECK_MESSAGE(pugi::xml_parse_status::status_ok == result.status, fmt::format("文件:【{}】打开失败 ", "student.xml"));

    auto stu01 = doc.select_node("/root/students/student[@id='1002']");
    // 修改属性
    stu01.node().attribute("id").set_value("10021002");
    // 追加属性
    stu01.node().append_attribute("gender").set_value("男");
    // 修改内容
    stu01.node().child("name").first_child().set_value("李四02");

    // 添加同级节点
    // 内部追加节点可用 stu01.node().append_child("student")
    auto stu05 = stu01.node().parent().insert_child_after("student", stu01.node());
    stu05.append_attribute("id").set_value("1005");
    stu05.append_child("name").text().set("锤石");
    stu05.append_child("sex").text().set("男");

    doc.save(std::cout);
}
```

# 保存
```cpp
TEST_CASE("test_pugixml_save") {
    std::shared_ptr<spdlog::logger> log = cppguide::LogUtil::getLogger("test");
    SPDLOG_LOGGER_INFO(log, fmt::format("test_pugixml_save"));

    pugi::xml_document doc;
    auto               result = doc.load_file("students.xml", pugi::parse_default, pugi::encoding_utf8);
    CHECK_MESSAGE(pugi::xml_parse_status::status_ok == result.status, fmt::format("文件:【{}】打开失败 ", "student.xml"));

    // 格式化输出
    doc.save(std::cout, "\t", pugi::format_default & pugi::format_indent);
    // 输出为一行
    doc.save(std::cout, "", pugi::format_raw);

    // 输出到文件
    doc.save_file("student02.xml", "\t", pugi::format_default & pugi::format_indent);
    doc.save_file("student03.xml", "", pugi::format_raw);
}
```
