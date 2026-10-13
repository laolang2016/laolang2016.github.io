---
title: nodejs hello world
date: 2026-08-16 11:12:03
categories:
  - web
  - nodejs
tags:
  - web
  - nodejs
---



# 参考资料


# pnpm

中文文档: https://pnpm.io/zh/

常用命令

**安装与升级**

| 命令 | 说明 |
| :--- | :--- |
| `npm install -g pnpm` | 通过 npm 全局安装 pnpm |
| `pnpm self-update` | 升级 pnpm 到最新版 |
| `corepack enable pnpm` | 通过 Corepack 启用 pnpm（Node.js 16.9+） |

**项目初始化**

| 命令 | 说明 |
| :--- | :--- |
| `pnpm init` | 初始化项目（生成 `package.json`） |

**依赖管理**

| 命令 | 简写 | 说明 |
| :--- | :--- | :--- |
| `pnpm install` | `pnpm i` | 安装所有依赖 |
| `pnpm install --frozen-lockfile` | - | CI 环境严格安装（不修改 lock 文件） |
| `pnpm add <pkg>` | `pnpm a <pkg>` | 添加到 `dependencies` |
| `pnpm add -D <pkg>` | `pnpm add --save-dev <pkg>` | 添加到 `devDependencies` |
| `pnpm add -g <pkg>` | - | 全局安装 |
| `pnpm remove <pkg>` | `pnpm rm <pkg>` | 移除依赖 |
| `pnpm link` | - | 链接本地包 |
| `pnpm unlink` | - | 取消链接 |

**更新依赖**

| 命令 | 简写 | 说明 |
| :--- | :--- | :--- |
| `pnpm update` | `pnpm up` | 按 semver 范围更新 |
| `pnpm update --latest` | - | 直接更新到最新版 |
| `pnpm update -i` | - | 交互式选择更新 |
| `pnpm outdated` | - | 查看可更新的包 |

**运行脚本**

| 命令 | 简写 | 说明 |
| :--- | :--- | :--- |
| `pnpm run <script>` | `pnpm <script>` | 运行 `package.json` 中的脚本 |
| `pnpm exec <cmd>` | `pnpm x <cmd>` | 执行项目本地安装的命令 |
| `pnpm dlx <pkg>` | - | 临时下载并运行包（类似 `npx`） |

**查询与检查**

| 命令 | 简写 | 说明 |
| :--- | :--- | :--- |
| `pnpm list` | `pnpm ls` | 查看依赖树 |
| `pnpm list --depth 0` | - | 仅查看顶层依赖 |
| `pnpm list -g --depth 0` | - | 查看全局安装的包 |
| `pnpm why <pkg>` | - | 查看某个包为什么被安装 |
| `pnpm info <pkg>` | - | 查看包的信息 |
| `pnpm audit` | - | 安全漏洞审计 |

**清理与优化**

| 命令 | 说明 |
| :--- | :--- |
| `pnpm prune` | 移除无关的包 |
| `pnpm dedupe` | 去重依赖 |
| `pnpm store prune` | 清理全局存储中未使用的包，释放磁盘空间 |
| `pnpm store path` | 查看全局缓存路径 |
| `pnpm cache list` | 查看缓存 |
| `pnpm cache rm <pkg>` | 清理指定包的缓存 |

**工作空间(`Monorepo`)**

| 命令 | 简写 | 说明 |
| :--- | :--- | :--- |
| `pnpm -F <pkg> <cmd>` | `pnpm --filter <pkg> <cmd>` | 在指定工作区运行命令 |
| `pnpm -r <cmd>` | `pnpm --recursive <cmd>` | 在所有工作区递归执行 |
| `pnpm -r --parallel <cmd>` | - | 并行递归执行 |
| `pnpm -w <cmd>` | `pnpm --workspace-root <cmd>` | 在工作区根目录执行 |
| `pnpm add -D <pkg> -w` | - | 给工作区根目录添加开发依赖 |
| `pnpm import` | - | 从其他包管理器的 lock 文件导入，生成 `pnpm-lock.yaml` |


**环境与配置**

| 命令 | 说明 |
| :--- | :--- |
| `pnpm env use <version>` | 切换 Node.js 版本 |
| `pnpm env list` | 列出已安装的 Node.js 版本 |
| `pnpm config set registry <url>` | 配置镜像源 |
| `pnpm config set store-dir <path>` | 配置全局存储路径 |



# cli

## cli hello world

### 常用命令

|命令|说明|
|:--:|:--:|
|`npm list -g --depth=0`|列出全局包, `--depth=0` 表示只显示一级包，不展示依赖树|



