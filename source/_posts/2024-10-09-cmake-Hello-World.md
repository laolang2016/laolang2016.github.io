---
title: cmake Hello World
date: 2024-10-09 02:22:23
categories:
- c++
- cmake
tags:
- c++
- cmake
---

# 源码

## 目录结构
```
laolang@laolang-mint:cmake-cpp-mini$ tree
.
├── CMakeLists.txt
└── main.cpp

1 directory, 2 files
laolang@laolang-mint:cmake-cpp-mini$ 
```

## cpp
```cpp
#include<iostream>
int main(){
    std::cout << "Hello World" << std::endl;
    return 0;
}
```

## cmake
```cmake
# 该项目所需 cmake 的最小版本, 如果 cmake 版本小于设置的版本,  cmake 将停止处理并报错
cmake_minimum_required(VERSION 3.0)

# 设置项目名称和语言
project(hello_cmake CXX)
set(CMAKE_BUILD_TYPE DEBUG)

# 指定 c++ 14
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 使用指定的源文件向项目添加可执行文件
add_executable(${PROJECT_NAME} main.cpp)
```


## 基本的编译

```shell
# 创建构建目录
mkdir build
# 进入构建目录
cd build
# 创建 unix 的 makefile
cmake .. -G "Unix Makefiles"
# 生成可执行程序
make
# 运行
./hello_cmake
```

上述命令可以合并为一条命令
```
cmake -S . -G "Unix Makefiles" -B build && cmake --build build
```




[详细教程：如何解决vs 2022 vc++项目 “warning C4819: 该文件包含不能在当前代码页(936)中表示的字符...](https://blog.csdn.net/u011775793/article/details/134760711)
[VS中如何编写和使用动态库--C++](https://blog.csdn.net/weixin_61196167/article/details/120958210)
[CMake Error: your RC compiler: "CMAKE_RC_COMPILER-NOTFOUND" was not found.](https://blog.csdn.net/wap1981314/article/details/12653545)
[关于使用vcvars32.bat，vcvarsall.bat配置VS编译环境配置的方法](https://www.cnblogs.com/Koomee/p/17158096.html)
[记录Windows下开发C/C++如何避免乱码](https://zhuanlan.zhihu.com/p/627531212?theme=light)