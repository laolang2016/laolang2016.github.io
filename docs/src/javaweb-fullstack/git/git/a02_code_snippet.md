---
title: 代码片段
order: 102
icon: /assets/image/javaweb-fullstack/git/git/git_icon.png
---



## 1. git 基础配置

### 1.1. 关于 sshkey

#### 1.1.1. 全局用户配置

通常来讲, 安装 `git` 之后都建议执行如下命令

```
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

但是由于学习 `git` 通常需要多个用户, 所以建议使用如下命令删除全局用户配置

```
git config --global --unset user.name
git config --global --unset user.email
```

#### 1.1.2. 多用户配置

首先生成 `sshkey`

> 注意 `sskkey` 保存路径


```
user@DESKTOP-N02OLTJ MINGW64 ~
$ ssh-keygen -t rsa -C "java001@ghost.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/user/.ssh/id_rsa): /c/Users/user/.ssh/id_rsa_gitea_java001
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /c/Users/user/.ssh/id_rsa_gitea_java001
Your public key has been saved in /c/Users/user/.ssh/id_rsa_gitea_java001.pub
The key fingerprint is:
SHA256:1uTjj4PxGRzEBX5F6wn/AaCvZI3GaB9uAjj4pOgHQqQ java001@ghost.com
The key's randomart image is:
+---[RSA 3072]----+
|         ..+..o  |
| .       .+ .. . |
|o        oo o..  |
|E.. .   o+=. +.. |
|.. + . oSO++  +. |
|o.+ . o.B.=.   ..|
|o...   . O.o    .|
|.  .    + +o     |
| ..       ...    |
+----[SHA256]-----+

user@DESKTOP-N02OLTJ MINGW64 ~
$
```

然后编辑 `config`

> 文件路径 `~/.ssh/config`

```
Host localhost
    User java001
    Hostname localhost
    Port 3022
    PreferredAuthentications publickey
    IdentityFile /c/Users/user/.ssh/id_rsa_gitea_java001
```


然后执行如下命令

```
ssh-agent bash
ssh-add ~/.ssh/id_rsa_gitea_java001
```

### 1.2. TortoiseGit 结合 bcompare

#### 1.2.1. 参考

[TortoiseGit 文件比对工具使用 Beyond Compare 和 DiffMerge](https://www.cnblogs.com/xishuai/p/TortoiseGit-BeyondCompare-DiffMerge.html)

#### 1.2.2. 配置

diff: `C:\Program Files (x86)\Beyond Compare 3\BComp.exe %base %mine /title1=%bname /title2=%yname /leftreadonly`
merge: `C:\Program Files (x86)\Beyond Compare 3\BComp.exe” %mine %theirs %base %merged /title1=%yname /title2=%tname /title3=%bname /title4=%mname`


## 2. git 的四种忽略

### 2.1. 参考

[Git——忽略文件的4种方法](https://blog.csdn.net/mzl87/article/details/135981192)

### 2.2. 全局忽略(.gitignore)

`.gitignore` 通常用来忽略一些全局不跟踪的文件, 这一份忽略配置在所有开发人员的开发环境中是一致的. 比如下面的项目, 就可以忽略 `logs` 和 `target/` 目录

```
E:\code\gitea\java001\thresh-boot>tree /f
Folder PATH listing for volume 新加卷
Volume serial number is FA05-F6BD
E:.
│   .gitignore
│   LICENSE
│   pom.xml
│   README.md
│
├───logs
│       xxx.log
│
├───scripts
│       control.sh
│
├───src
│       xxx.java
│
└───target
        xxx.class


E:\code\gitea\java001\thresh-boot>
```

**`.gitignore`** 内容如下

```
target/
logs/
```

远程目录结构如下

![](/assets/image/javaweb-fullstack/git/git/a02_code_snippet/009.png)

### 2.3. 局部忽略(.git/info/exclude)

有些文件只有本地会有而远程没有, 例如只有开发本地有的某个测试子模块, 一些本地写的笔记等. 此时可以使用 `.git/info/exclude`. 例如下面的目录结构, 可以在 `.git/info/exclude` 中添加局部忽略

```
E:\code\gitea\java001\thresh-boot>tree /f
Folder PATH listing for volume 新加卷
Volume serial number is FA05-F6BD
E:.
│   .gitignore
│   LICENSE
│   pom.xml
│   README.md
│   xxx-note.txt
│
├───logs
│       xxx.log
│
├───scripts
│       control.sh
│
├───src
│       xxx.java
│
├───target
│       xxx.class
│
└───xxx-test-moudle
        xxx.java


E:\code\gitea\java001\thresh-boot>
```

**`.git/info/exclude`** 内容如下

```
# git ls-files --others --exclude-from=.git/info/exclude
# Lines that start with '#' are comments.
# For a project mostly in C, the following would be a good set of
# exclude patterns (uncomment them if you want to use them):
# *.[oa]
# *~


xxx-note.txt

xxx-test-moudle/
```


### 2.4. 假定不变(assume-unchanged)



### 2.5. 跳过工作目录(skip-worktree)

#### 2.5.1. 场景举例

有这样一种情况:

某些代码在本地必须修改, 例如某个第三方 sdk 不支持本地环境的调用, 此时就需要开发人员在本地做出特定的修改,例如手写一些返回值, 或者注释掉初始化过程以防止项目无法在本地启动. 为了防止将本地的修改误提交上去, 可以使用 `skip-worktree`. 例如下面的 `xxx-client.java` 文件

```
E:\code\gitea\java001\thresh-boot>tree /f
Folder PATH listing for volume 新加卷
Volume serial number is FA05-F6BD
E:.
│   .gitignore
│   LICENSE
│   pom.xml
│   README.md
│   xxx-note.txt
│
├───logs
│       xxx.log
│
├───scripts
│       control.sh
│
├───src
│       xxx-client.java
│       xxx.java
│
├───target
│       xxx.class
│
└───xxx-test-moudle
        xxx.java


E:\code\gitea\java001\thresh-boot>
```

此文件内容如下

```java
// 这是一个第三方 sdk 的调用代码
// 只保证测试环境和生产环境
```

此时做出一些修改

```java
user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$ git diff
warning: in the working copy of 'src/xxx-client.java', LF will be replaced by CRLF the next time Git touches it
diff --git a/src/xxx-client.java b/src/xxx-client.java
index bf5f3da..1cd5123 100644
--- a/src/xxx-client.java
+++ b/src/xxx-client.java
@@ -1,2 +1,4 @@
 // 这是一个第三方 sdk 的调用代码
 // 只保证测试环境和生产环境
+
+// 某些本地修改, 主要是为了能够启动项目

user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$
```

#### 2.5.2. 如何使用

执行如下命令即可忽略 `src/xxx-client.java` 的修改

```
git update-index --skip-worktree src/xxx-client.java
```

执行如下命令可查看忽略的文件

```
git ls-files -v | grep ^S
```

效果如下

```
user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$ git ls-files -v | grep ^S
S src/xxx-client.java

user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$
```

执行如下命令可以撤销

```
git update-index --no-skip-worktree src/xxx-client.java
```

效果如下

```
user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$ git update-index --no-skip-worktree src/xxx-client.java

user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/xxx-client.java

no changes added to commit (use "git add" and/or "git commit -a")

user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$ git diff
warning: in the working copy of 'src/xxx-client.java', LF will be replaced by CRLF the next time Git touches it
diff --git a/src/xxx-client.java b/src/xxx-client.java
index bf5f3da..1cd5123 100644
--- a/src/xxx-client.java
+++ b/src/xxx-client.java
@@ -1,2 +1,4 @@
 // 这是一个第三方 sdk 的调用代码
 // 只保证测试环境和生产环境
+
+// 某些本地修改, 主要是为了能够启动项目

user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$
```


#### 2.5.3. 总结

```
# 忽略
git update-index --skip-worktree /path/to/file
# 查看忽略的文件
git ls-files -v | grep ^S
# 撤销
git update-index --no-skip-worktree /path/to/file
```

## 3. diff

### 3.1. 参考

[读懂diff · 阮一峰](https://www.ruanyifeng.com/blog/2012/08/how_to_read_diff.html)

[[git] 看懂git diff，及其输出信息](https://www.cnblogs.com/Vayne-N/p/9086103.html)

[Git Diff详解：带有示例的完整指南](https://www.techsyncer.com/zh-hans/git-diff-guide.html)



## 4. 修改 commit 信息

### 4.1. 参考

[git修改历史提交(commit)信息（超详细，图文并茂）](https://blog.csdn.net/qq_17011423/article/details/104648075)

### 4.2. 修改最近一次的 commit 信息

直接运行如下命令, 即可修改最近一次的 commit 信息

```
git commit --amend
```

### 4.3. 修改最近两个或以上的

```
git rebase -i HEAD~2
```

显示如下. A 是较老的提交, BBB 是较新的提交,

```
pick e30ef67 A
pick f096dfc BBB

# Rebase 3b45723..f096dfc onto 3b45723 (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
#         create a merge commit using the original merge commit's
#         message (or the oneline, if no original merge commit was
#         specified); use -c <commit> to reword the commit message
# u, update-ref <ref> = track a placeholder for the <ref> to be updated
#                       to this position in the new commits. The <ref> is
#                       updated at the end of the rebase
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

将需要修改的 commit 的前缀修改为 e

```
e e30ef67 A
pick f096dfc BBB

# Rebase 3b45723..f096dfc onto 3b45723 (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
#         create a merge commit using the original merge commit's
#         message (or the oneline, if no original merge commit was
#         specified); use -c <commit> to reword the commit message
# u, update-ref <ref> = track a placeholder for the <ref> to be updated
#                       to this position in the new commits. The <ref> is
#                       updated at the end of the rebase
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

保存并退出即可根据提示操作

```
user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main)
$ git rebase -i HEAD~2
Stopped at e30ef67...  A
You can amend the commit now, with

  git commit --amend

Once you are satisfied with your changes, run

  git rebase --continue

user@DESKTOP-N02OLTJ MINGW64 /e/code/gitea/java001/thresh-boot (main|REBASE 1/2)
$
```

### 4.4. idea

其实最简单快速的方式通过 idea 修改

![](/assets/image/javaweb-fullstack/git/git/a02_code_snippet/010.png)


## 5. git submodule

### 5.1. 参考

[【Git】第十八节：Submodule 与子模块管理 —— 引入外部仓库作为 Submodule，构建模块化项目结构](https://blog.csdn.net/qq_38060125/article/details/148853388)

[Git Submodules 介绍（通俗易懂，总结了工作完全够用的 submodule 命令](https://cloud.tencent.com/developer/article/2136829)

[一文带你彻底搞懂 git submodule 原理和用法](https://zhuanlan.zhihu.com/p/687142557)

