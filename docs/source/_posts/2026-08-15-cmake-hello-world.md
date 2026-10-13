---
title: cmake hello world
date: 2026-08-15 14:37:46
categories:
  - C++
  - Cmake
tags:
  - C++
  - Cmake
---

# 最简单的 Hello World

## CMakeLists.txt

```cmake
# 设置CMake所需的最低版本。如果使用的CMake版本低于该版本，则会发出致命错误
cmake_minimum_required(VERSION 3.23 FATAL_ERROR)

#[[
声明了项目名称、版本以及所使用的语言
该部分其实已经自动添加了一些变量
]]
project(cmake-01-minimal VERSION 1.0.0 LANGUAGES CXX)
# 代表当前作用域内最近一次调用的 project() 名称
message(STATUS "PROJECT_NAME = ${PROJECT_NAME}")
# 代表整个 CMake 工程最顶层的项目名称
message(STATUS "CMAKE_PROJECT_NAME = ${CMAKE_PROJECT_NAME}")
# 该项目对应的构建输出目录绝对路径
message(STATUS "CMAKE_CURRENT_BINARY_DIR = ${CMAKE_CURRENT_BINARY_DIR}")

# 版本相关
# 当前项目的完整版本号字符串
message(STATUS "PROJECT_VERSION = ${PROJECT_VERSION}")
# 主版本号（Major）
message(STATUS "PROJECT_VERSION_MAJOR = ${PROJECT_VERSION_MAJOR}")
# 次版本号（Minor）
message(STATUS "PROJECT_VERSION_MINOR = ${PROJECT_VERSION_MINOR}")
# 修订号（Patch）
message(STATUS "PROJECT_VERSION_PATCH = ${PROJECT_VERSION_PATCH}")
# 微调/构建号（Tweak，此处未指定第4位）
message(STATUS "PROJECT_VERSION_TWEAK = ${PROJECT_VERSION_TWEAK}")

# 编译器相关
# 检测到的 C++ 编译器绝对路径
message(STATUS "CMAKE_CXX_COMPILER = ${CMAKE_CXX_COMPILER}")
# 编译器的厂商标识符
message(STATUS "CMAKE_CXX_COMPILER_ID = ${CMAKE_CXX_COMPILER_ID}")
# 检测到的 C++ 编译器版本号
message(STATUS "CMAKE_CXX_COMPILER_VERSION = ${CMAKE_CXX_COMPILER_VERSION}")
# 默认传递给 C++ 编译器的全局标志（Flags）
message(STATUS "CMAKE_CXX_FLAGS = ${CMAKE_CXX_FLAGS}")


#[[
先声明一个目标, 然后再指定参与该目标的文件

PRIVATE : 表示这些源文件仅用于构建当前 target 本身, 不会传递给依赖它的其他 target
CMAKE_CURRENT_SOURCE_DIR : 表示当前 CMakeList.txt 所在路径
]]
add_executable(${PROJECT_NAME} "")
target_sources(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp)

message(STATUS "CMAKE_CURRENT_SOURCE_DIR = ${CMAKE_CURRENT_SOURCE_DIR}")
```


## main.cpp

```c++
#include <iostream>
#include <cstdlib>
int main(){
    std::cout << "Hello World!" << std::endl;
    return EXIT_SUCCESS;
}
```


## 运行

```bash
cmake -S . -B build
cmake --build build
```

### linux 运行

```bash
$ cmake -S . -B build
-- The CXX compiler identification is GNU 13.3.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- PROJECT_NAME = cmake-01-minimal
-- CMAKE_PROJECT_NAME = cmake-01-minimal
-- CMAKE_CURRENT_BINARY_DIR = /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build
-- PROJECT_VERSION = 1.0.0
-- PROJECT_VERSION_MAJOR = 1
-- PROJECT_VERSION_MINOR = 0
-- PROJECT_VERSION_PATCH = 0
-- PROJECT_VERSION_TWEAK = 
-- CMAKE_CXX_COMPILER = /usr/bin/c++
-- CMAKE_CXX_COMPILER_ID = GNU
-- CMAKE_CXX_COMPILER_VERSION = 13.3.0
-- CMAKE_CXX_FLAGS = 
-- CMAKE_CURRENT_SOURCE_DIR = /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal
-- Configuring done (0.2s)
-- Generating done (0.0s)
-- Build files have been written to: /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build

$ cmake --build build
[ 50%] Building CXX object CMakeFiles/cmake-01-minimal.dir/main.cpp.o
[100%] Linking CXX executable cmake-01-minimal
[100%] Built target cmake-01-minimal

$ 
```

### windows 运行

安装 vs 之后,可以打开 `x64 Native Tools Command Prompt for VS` , 也可以新开一个 cmd 然后运行如下文件

```
\vs2026\community\VC\Auxiliary\Build\vcvars64.bat
```

运行命令是一样的

```bash
E:\work\gitee\ghost-devstudio\cpp-study\cmake\cmake-01-minimal>cmake -S . -B build
-- Building for: NMake Makefiles
-- The CXX compiler identification is MSVC 19.51.36248.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: D:/program/microsoft/vs2026/community/VC/Tools/MSVC/14.51.36231/bin/Hostx64/x64/cl.exe - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- PROJECT_NAME = cmake-01-minimal
-- CMAKE_PROJECT_NAME = cmake-01-minimal
-- CMAKE_CURRENT_BINARY_DIR = E:/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build
-- PROJECT_VERSION = 1.0.0
-- PROJECT_VERSION_MAJOR = 1
-- PROJECT_VERSION_MINOR = 0
-- PROJECT_VERSION_PATCH = 0
-- PROJECT_VERSION_TWEAK =
-- CMAKE_CXX_COMPILER = D:/program/microsoft/vs2026/community/VC/Tools/MSVC/14.51.36231/bin/Hostx64/x64/cl.exe
-- CMAKE_CXX_COMPILER_ID = MSVC
-- CMAKE_CXX_COMPILER_VERSION = 19.51.36248.0
-- CMAKE_CXX_FLAGS = /DWIN32 /D_WINDOWS /EHsc
-- CMAKE_CURRENT_SOURCE_DIR = E:/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal
-- Configuring done (3.6s)
-- Generating done (0.0s)
-- Build files have been written to: E:/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build

E:\work\gitee\ghost-devstudio\cpp-study\cmake\cmake-01-minimal>cmake --build build
[ 50%] Building CXX object CMakeFiles/cmake-01-minimal.dir/main.cpp.obj
main.cpp
[100%] Linking CXX executable cmake-01-minimal.exe
[100%] Built target cmake-01-minimal

E:\work\gitee\ghost-devstudio\cpp-study\cmake\cmake-01-minimal>
```


# 使用 Ninja

默认 `linux` 使用 `Unix Makefiles` , `windows` 使用 `NMake Makefiles` , 但通常使用 Ninja 是更好的选择. 变量 `CMAKE_GENERATOR` 标识了当前的生成器

```bash
$ cmake -S . -B build -G Ninja
-- The CXX compiler identification is GNU 13.3.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- PROJECT_NAME = cmake-01-minimal
-- CMAKE_PROJECT_NAME = cmake-01-minimal
-- CMAKE_CURRENT_BINARY_DIR = /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build
-- PROJECT_VERSION = 1.0.0
-- PROJECT_VERSION_MAJOR = 1
-- PROJECT_VERSION_MINOR = 0
-- PROJECT_VERSION_PATCH = 0
-- PROJECT_VERSION_TWEAK = 
-- CMAKE_CXX_COMPILER = /usr/bin/c++
-- CMAKE_CXX_COMPILER_ID = GNU
-- CMAKE_CXX_COMPILER_VERSION = 13.3.0
-- CMAKE_CXX_FLAGS = 
-- CMAKE_GENERATOR = Ninja
-- CMAKE_CURRENT_SOURCE_DIR = /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal
-- Configuring done (0.2s)
-- Generating done (0.0s)
-- Build files have been written to: /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build

$ cmake --build build
[2/2] Linking CXX executable cmake-01-minimal
```

# 使用预设

所谓预设, 就是把一些项目中常用的配置、流程等固化到一个文件, 该文件名为 `CMakePresets.json` , 可以提交到版本控制. 同时有些个人本地的环境和流水线的不一致,此时可以添加一个 `CMakeUserPresets.json` , 用于继承公共预设,然后添加自己本地的个性化配置

可以查看如下路径的帮助文档, 该文档给出了一个基本的模板

```
/doc/cmake/html/manual/cmake-presets.7.html
```

`json schema` 可从如下路径找到

```
/share/cmake-4.4/Help/manual/presets/schema.json
```

## 基本使用

### 预设模板

一个基本的 `CMakePresets.json` 如下

> 注意: 为了让 vs 打开时不报错, 这里调低了 `version` 字段

```json
{
    "version": 6,
    "cmakeMinimumRequired": {
        "major": 3,
        "minor": 23,
        "patch": 0
    },
    "configurePresets": [
        {
            "name": "gnu-base",
            "description": "gnu 通用预设",
            "hidden": true,
            "generator": "Ninja",
            "cacheVariables": {
                "CMAKE_CXX_FLAGS": "-Wall -Wextra",
                "CMAKE_CXX_COMPILER": "/usr/bin/g++"
            }
        },
        {
            "name": "gnu-debug",
            "description": "gnu debug",
            "inherits": "gnu-base",
            "binaryDir": "${sourceDir}/build/ninja-debug",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        },
        {
            "name": "gnu-release",
            "description": "gnu release",
            "inherits": "gnu-base",
            "binaryDir": "${sourceDir}/build/ninja-release",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        },
        {
            "name": "msvc-base",
            "description": "Ninja + VS2026 通用预设",
            "hidden": true,
            "generator": "Ninja",
            "architecture": {
                "value": "x64",
                "strategy": "external"
            },
            "toolset": {
                "value": "host=x64",
                "strategy": "external"
            },
            "cacheVariables": {
                "CMAKE_CXX_COMPILER": "cl.exe",
                "CMAKE_CXX_FLAGS": "/W4 /EHsc"
            }
        },
        {
            "name": "msvc-debug",
            "description": "MSVC VS2026 Ninja Debug",
            "inherits": "msvc-base",
            "binaryDir": "${sourceDir}/build/msvc-debug",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        },
        {
            "name": "msvc-release",
            "description": "MSVC VS2026 Ninja Release",
            "inherits": "msvc-base",
            "binaryDir": "${sourceDir}/build/msvc-release",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        }
    ],
    "buildPresets": [
        {
            "name": "gnu-debug",
            "configurePreset": "gnu-debug"
        },
        {
            "name": "gnu-release",
            "configurePreset": "gnu-release"
        },
        {
            "name": "msvc-debug",
            "configurePreset": "msvc-debug"
        },
        {
            "name": "msvc-release",
            "configurePreset": "msvc-release"
        }
    ],
    "workflowPresets": [
        {
            "name": "gnu-debug",
            "steps": [
                {
                    "type": "configure",
                    "name": "gnu-debug"
                },
                {
                    "type": "build",
                    "name": "gnu-debug"
                }
            ]
        },
        {
            "name": "msvc-debug",
            "steps": [
                {
                    "type": "configure",
                    "name": "msvc-debug"
                },
                {
                    "type": "build",
                    "name": "msvc-debug"
                }
            ]
        }
    ]
}
```


### linux 

然后使用如下命令即可一键构建和编译

```bash
cmake --workflow --preset gnu-debug
```

```bash
$ cmake --workflow --preset gnu-debug
Executing workflow step 1 of 2: configure preset "gnu-debug"

-- The CXX compiler identification is GNU 13.3.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/g++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- PROJECT_NAME = cmake-01-minimal
-- CMAKE_PROJECT_NAME = cmake-01-minimal
-- CMAKE_CURRENT_BINARY_DIR = /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build/ninja-debug
-- PROJECT_VERSION = 1.0.0
-- PROJECT_VERSION_MAJOR = 1
-- PROJECT_VERSION_MINOR = 0
-- PROJECT_VERSION_PATCH = 0
-- PROJECT_VERSION_TWEAK = 
-- CMAKE_CXX_COMPILER = /usr/bin/g++
-- CMAKE_CXX_COMPILER_ID = GNU
-- CMAKE_CXX_COMPILER_VERSION = 13.3.0
-- CMAKE_CXX_FLAGS = -Wall -Wextra
-- CMAKE_GENERATOR = Ninja
-- CMAKE_CURRENT_SOURCE_DIR = /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal
-- Configuring done (0.2s)
-- Generating done (0.0s)
-- Build files have been written to: /home/laolang/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build/ninja-debug

Executing workflow step 2 of 2: build preset "gnu-debug"

[2/2] Linking CXX executable cmake-01-minimal
```


### windows

```bash
E:\work\gitee\ghost-devstudio\cpp-study\cmake\cmake-01-minimal>cmake --workflow --preset msvc-debug
Executing workflow step 1 of 2: configure preset "msvc-debug"

-- The CXX compiler identification is MSVC 19.51.36248.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: D:/program/microsoft/vs2026/community/VC/Tools/MSVC/14.51.36231/bin/Hostx64/x64/cl.exe - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- PROJECT_NAME = cmake-01-minimal
-- CMAKE_PROJECT_NAME = cmake-01-minimal
-- CMAKE_CURRENT_BINARY_DIR = E:/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build/msvc-debug
-- PROJECT_VERSION = 1.0.0
-- PROJECT_VERSION_MAJOR = 1
-- PROJECT_VERSION_MINOR = 0
-- PROJECT_VERSION_PATCH = 0
-- PROJECT_VERSION_TWEAK =
-- CMAKE_CXX_COMPILER = D:/program/microsoft/vs2026/community/VC/Tools/MSVC/14.51.36231/bin/Hostx64/x64/cl.exe
-- CMAKE_CXX_COMPILER_ID = MSVC
-- CMAKE_CXX_COMPILER_VERSION = 19.51.36248.0
-- CMAKE_CXX_FLAGS = /W4 /EHsc
-- CMAKE_GENERATOR = Ninja
-- CMAKE_CURRENT_SOURCE_DIR = E:/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal
-- Configuring done (0.7s)
-- Generating done (0.0s)
-- Build files have been written to: E:/work/gitee/ghost-devstudio/cpp-study/cmake/cmake-01-minimal/build/msvc-debug

Executing workflow step 2 of 2: build preset "msvc-debug"

[2/2] Linking CXX executable cmake-01-minimal.exe

E:\work\gitee\ghost-devstudio\cpp-study\cmake\cmake-01-minimal>
```

使用 vs 打开时, 选择正确的配置即可

![](/images/2026-08-15-cmake-hello-world/001.png)



## 预设文件说明

> 列出来的都是常用的

```json
{
  // 【常用】Presets 语法版本。写 6 能兼顾 Visual Studio, CLion, VS Code 等绝大多数 IDE
  "version": 6,

  // 【常用】最低需要的 CMake 版本要求
  "cmakeMinimumRequired": {
    "major": 3,
    "minor": 23,
    "patch": 0
  },

  // 【常用】配置预设列表：定义包含编译器、生成器、构建变量的核心环境
  "configurePresets": [
    {
      "name": "default",               // 【常用】预设的唯一标识名，命令行 --preset default 调用的名称
      "displayName": "Default Config", // 【常用】在 IDE 下拉列表中显示的友好名称
      "description": "Default build",  // 【常用】对该预设的简短文字描述
      "generator": "Ninja",            // 【常用】指定 CMake 生成器（如 Ninja, "Visual Studio 17 2022", Unix Makefiles）
      "binaryDir": "${sourceDir}/build/default", // 【常用】编译产物/中间文件的输出路径

      // 【常用】传给 CMake 的 -D 变量（如 CMAKE_BUILD_TYPE, CMAKE_CXX_COMPILER 等）
      "cacheVariables": {
        "FIRST_CACHE_VARIABLE": {
          "type": "BOOL",
          "value": "OFF"               // 完整写法：显式指定类型（BOOL/STRING/PATH）
        },
        "SECOND_CACHE_VARIABLE": "ON"  // 简化写法：字符串/开关直接赋值
      },

      // 【常用】控制环境变量。可在调用 CMake 时注入或修改 PATH、CC、CXX 等
      "environment": {
        "MY_ENVIRONMENT_VARIABLE": "Test",
        "PATH": "$env{HOME}/ninja/bin:$penv{PATH}" // 支持引用当前/父级环境变量
      }
    },
    {
      "name": "ninja-multi",
      "inherits": "default",           // 【常用】预设继承。继承 default 的所有配置，减少重复代码
      "displayName": "Ninja Multi-Config",
      "generator": "Ninja Multi-Config"
    }
  ],

  // 【常用】构建预设列表：定义 cmake --build --preset <name> 时的参数（如并行编译线程数、目标名称）
  "buildPresets": [
    {
      "name": "default",
      "configurePreset": "default"     // 【常用】关联到上面配置好的 configurePreset 名称
    }
  ],

  // 【常用】测试预设列表：定义 ctest --preset <name> 单元测试时的行为
  "testPresets": [
    {
      "name": "default",
      "configurePreset": "default",
      "output": {"outputOnFailure": true}, // 【常用】测试失败时自动打印详细日志
      "execution": {"noTestsAction": "error", "stopOnFailure": true} // 【常用】遇到错误立即停止
    }
  ]
}
```


# 构建静态库和动态库

## 构建动态库

### 目录结构

```bash
 tree 
.
├── CMakeLists.txt
├── CMakePresets.json
├── include
│   └── cmake-01-minimal
│       └── person
│           └── person.h
└── src
    ├── CMakeLists.txt
    ├── main
    │   ├── CMakeLists.txt
    │   └── main.cpp
    └── person
        ├── CMakeLists.txt
        └── person.cpp

7 directories, 8 files
```

### CMakePresets.json

```json
{
    "version": 6,
    "cmakeMinimumRequired": {
        "major": 3,
        "minor": 23,
        "patch": 0
    },
    "configurePresets": [
        {
            "name": "gnu-base",
            "description": "gnu 通用预设",
            "hidden": true,
            "generator": "Ninja",
            "cacheVariables": {
                "CMAKE_CXX_FLAGS": "-Wall -Wextra",
                "CMAKE_CXX_COMPILER": "/usr/bin/g++"
            }
        },
        {
            "name": "gnu-debug",
            "description": "gnu debug",
            "inherits": "gnu-base",
            "binaryDir": "${sourceDir}/build/gnu-debug",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        },
        {
            "name": "gnu-release",
            "description": "gnu release",
            "inherits": "gnu-base",
            "binaryDir": "${sourceDir}/build/gnu-release",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        },
        {
            "name": "msvc-base",
            "description": "Ninja + VS2026 通用预设",
            "hidden": true,
            "generator": "Ninja",
            "architecture": {
                "value": "x64",
                "strategy": "external"
            },
            "toolset": {
                "value": "host=x64",
                "strategy": "external"
            },
            "cacheVariables": {
                "CMAKE_CXX_COMPILER": "cl.exe",
                "CMAKE_CXX_FLAGS": "/W4 /EHsc"
            }
        },
        {
            "name": "msvc-debug",
            "description": "MSVC VS2026 Ninja Debug",
            "inherits": "msvc-base",
            "binaryDir": "${sourceDir}/build/msvc-debug",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        },
        {
            "name": "msvc-release",
            "description": "MSVC VS2026 Ninja Release",
            "inherits": "msvc-base",
            "binaryDir": "${sourceDir}/build/msvc-release",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        }
    ],
    "buildPresets": [
        {
            "name": "gnu-debug",
            "configurePreset": "gnu-debug"
        },
        {
            "name": "gnu-release",
            "configurePreset": "gnu-release"
        },
        {
            "name": "msvc-debug",
            "configurePreset": "msvc-debug"
        },
        {
            "name": "msvc-release",
            "configurePreset": "msvc-release"
        }
    ],
    "workflowPresets": [
        {
            "name": "gnu-debug",
            "steps": [
                {
                    "type": "configure",
                    "name": "gnu-debug"
                },
                {
                    "type": "build",
                    "name": "gnu-debug"
                }
            ]
        },
        {
            "name": "msvc-debug",
            "steps": [
                {
                    "type": "configure",
                    "name": "msvc-debug"
                },
                {
                    "type": "build",
                    "name": "msvc-debug"
                }
            ]
        }
    ]
}
```

### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.23 FATAL_ERROR)

project(cmake-01-minimal VERSION 1.0.0 LANGUAGES CXX)

# 将 install_rpath 的设置应用在 build_rpath 上
# 避免在开发期间出现动态库找不到的问题
set(CMAKE_BUILD_WITH_INSTALL_RPATH True)

# 发布目录
set(dist_dir ${CMAKE_BINARY_DIR}/dist)

# 二进制文件目录
set(bin_dir ${dist_dir}/bin)

# 库文件目录
set(lib_dir ${dist_dir}/lib)

# 生成 compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 添加子目录
add_subdirectory(src)
```

### person.h

```c++
#pragma once

#include <string>

#if defined(_WIN32) || defined(__CYGWIN__)
    #ifdef CMAKE01MINIMAL_PERSON_EXPORTS  // 唯一定义
        #define CMAKE01MINIMAL_PERSON_API __declspec(dllexport)
    #else
        #define CMAKE01MINIMAL_PERSON_API __declspec(dllimport)
    #endif
#else
    #define CMAKE01MINIMAL_PERSON_API __attribute__((visibility("default")))
#endif

/**
 * @brief 一个测试类
 */
class CMAKE01MINIMAL_PERSON_API Person {
public:
    Person() = default;
    Person(int age, std::string name) : m_age(age), m_name(std::move(name)) {}
    ~Person() = default;

    std::string sayHello();

    inline void age(int age) {
        this->m_age = age;
    }
    [[nodiscard]] inline int age() const {
        return this->m_age;
    }

    inline void name(std::string&& name) {
        this->m_name = std::move(name);
    }
    inline std::string name() {
        return this->m_name;
    }

private:
    int         m_age{0};
    std::string m_name;
};
```

### person.cpp

```c++
#include "cmake-01-minimal/person/person.h"

std::string Person::sayHello() {
    std::string age_str = std::to_string(m_age);

    std::string result;
    result.reserve(21 + m_name.size() + 18 + age_str.size() + 12);

    result += "Hello, my name is ";
    result += m_name;
    result += ", and I'm ";
    result += age_str;
    result += " years old.";

    return result;
}
```

### person/CMakeLists.txt

```cmake
# 声明动态库目标
add_library(person SHARED ${CMAKE_CURRENT_SOURCE_DIR}/person.cpp)
# 声明一个别名
add_library(cmake01minimal::person ALIAS person)

# 添加宏定义
target_compile_definitions(
    person 
    PRIVATE 
        CMAKE01MINIMAL_PERSON_EXPORTS
)

# 声明依赖的头文件
# 暴露 include 根目录，PUBLIC 属性会自动传递给依赖它的主模块
target_include_directories(
    person
    PUBLIC
        # 指向 include 根目录
        $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}/include>)

set_target_properties(
    person
    PROPERTIES
        # 设置库的完整版本号
        VERSION 1.0.0
        # 设置共享对象的 API 版本号（Shared Object Version），也叫「主版本号」
        SOVERSION 1
        # windows dll 输出目录
        RUNTIME_OUTPUT_DIRECTORY "${lib_dir}"
        # linux 库文件目录位置
        LIBRARY_OUTPUT_DIRECTORY "${lib_dir}"
        # 指定归档产物的输出目录
        # msvc 指 .lib 文件(导入库和静态库)放哪儿
        # linux/macos 指 .a 静态库放哪儿
        ARCHIVE_OUTPUT_DIRECTORY "${lib_dir}")
```

### main.cpp

```c++
#include <cstdlib>
#include <iostream>
#include <memory>

#include "cmake-01-minimal/person/person.h"

int main() {
    std::unique_ptr<Person> person = std::make_unique<Person>(23, "laolang");
    std::cout << person->sayHello() << std::endl;
    return EXIT_SUCCESS;
}
```

### main/CMakeLists.txt

```cmake
add_executable(${PROJECT_NAME} "")
target_sources(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp)

target_link_libraries(${PROJECT_NAME} PRIVATE cmake01minimal::person)

set_target_properties(
    ${PROJECT_NAME}
    PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${bin_dir} INSTALL_RPATH "\${ORIGIN}/../lib")

# windows 平台需要将依赖库复制到 exe 所在目录
if(WIN32)
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy
                $<TARGET_RUNTIME_DLLS:${PROJECT_NAME}>
                $<TARGET_FILE_DIR:${PROJECT_NAME}>
        COMMAND_EXPAND_LISTS
    )
endif()
```



