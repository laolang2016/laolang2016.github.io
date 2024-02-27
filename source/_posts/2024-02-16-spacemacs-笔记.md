---
title: spacemacs 笔记
date: 2024-02-16 13:09:54
tags:
---


spacemacs 笔记
<!--more-->

# 参考资料
官网: [https://www.spacemacs.org/](https://www.spacemacs.org/)
文档: [https://www.spacemacs.org/doc/DOCUMENTATION.html](https://www.spacemacs.org/doc/DOCUMENTATION.html)
Spacemacs 14 Days: [https://liuzhijun-source.github.io/spacemacs-14-days/#/](https://liuzhijun-source.github.io/spacemacs-14-days/#/)

# 安装

```
git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d
```

# 首次启动

修改镜像源
```lisp
(defun dotspacemacs/user-init ()
  "Initialization for user code:
This function is called immediately after `dotspacemacs/init', before layer
configuration.
It is mostly for variables that should be set before packages are loaded.
If you are unsure, try setting them in `dotspacemacs/user-config' first."
(setq configuration-layer-elpa-archives
    '(
        ("melpa-cn" . "http://mirrors.tuna.tsinghua.edu.cn/elpa/melpa/")
        ("org-cn"   . "http://mirrors.tuna.tsinghua.edu.cn/elpa/org/")
        ("gnu-cn"   . "http://mirrors.tuna.tsinghua.edu.cn/elpa/gnu/")
    )
)
)
```

# 基本配置

## 显示行号
```lisp
dotspacemacs-line-numbers t
```

### 设置主题
```lisp
; 默认主题
; 排在前面的就是默认主题
;dotspacemacs-themes '(spacemacs-light
;                      spacemacs-dark)

(defun dotspacemacs/user-config ()
  "Configuration for user code:
This function is called at the very end of Spacemacs startup, after layer
configuration.
Put your configuration code here, except for variables that should be set
before packages are loaded."
  ;; 主题
  (use-package gruvbox-theme
    :ensure t
    :init (load-theme 'gruvbox-light-soft t)
  )
)

```
