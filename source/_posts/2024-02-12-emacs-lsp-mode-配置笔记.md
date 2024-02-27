---
title: emacs lsp mode 配置笔记
date: 2024-02-12 05:25:14
tags:
- emacs

categories:
- 序猿的基操
- emacs
---

emacs lsp mode 配置笔记
<!--more-->
# 官网
[https://emacs-lsp.github.io/lsp-mode/](https://emacs-lsp.github.io/lsp-mode/)

# 参考
[专业 Emacs 入门（七）：插件篇——编程开发类](https://zhuanlan.zhihu.com/p/467681146)

## .emacs

```lisp
;;; emacs 原生配置

; 关闭菜单栏
(menu-bar-mode -1)
; 关闭工具栏
(tool-bar-mode -1)
; 关闭滚动条
(scroll-bar-mode -1)
; 关闭启动界面
(setq inhibit-startup-screen t)

;;; 防止页面滚动时跳动，
; scroll-margin 3 可以在靠近屏幕边沿3行时就开始滚动
; scroll-step 1 设置为每次翻滚一行，可以使页面更连续
(setq scroll-step 1 scroll-margin 3 scroll-conservatively 10000)

;;; 关闭出错量的提示音
(setq visible-bell t)

;;; ---禁止备份
(setq make-backup-files nil)

;;; 不生成临时文件
(setq-default make-backup-files nil)

;;; 允许emacs和外部其他程序的粘贴
(setq x-select-enable-clipboard t)

;;; ido的配置
; 这个可以使你在用C-x C-f打开文件的时候在后面有提示;
; 这里是直接打开了ido的支持，在emacs23中这个是自带的.
(ido-mode t)
; ido模式中不保存目录列表,解决退出Emacs时ido要询问编码的问题。
(setq ido-save-directory-list-file nil)

;;; 括号匹配
; 打开括号匹配显示模式
(show-paren-mode t)
; 括号匹配时可以高亮显示另外一边的括号，但光标不会烦人的跳到另一个括号处
(setq show-paren-style 'parenthesis)

;;; 设置字体
;;; 设置字体
(set-face-attribute 'default nil
                    :family "JetBrains Mono"
                    :height 100
                    :weight 'normal
                    :width 'normal)


;;; 在行首 C-k 时，同时删除该行
(setq-default kill-whole-line t)

;;; 启动时全屏
(add-to-list 'default-frame-alist '(fullscreen . maximized))

;;; 右侧基准线
(setq-default fill-column 120)
(global-display-fill-column-indicator-mode t)


;;; 自定义快捷键
; Ctrl+Home
; 跳到文件开头
(defun my/goto-beginning-of-buffer ()
  "Move cursor to the beginning of the buffer."
  (interactive)
  (beginning-of-buffer))
(global-set-key (kbd "C-<home>") 'my/goto-beginning-of-buffer)

; Ctrl+ENd
; 跳到文件末尾
(defun my/goto-end-of-buffer ()
  "Move cursor to the end of the buffer."
  (interactive)
  (end-of-buffer))
(global-set-key (kbd "C-<end>") 'my/goto-end-of-buffer)


;;; 国内源
(setq package-archives '(
        ("gnu"    . "http://mirrors.tuna.tsinghua.edu.cn/elpa/gnu/")
        ("nongnu" . "http://mirrors.tuna.tsinghua.edu.cn/elpa/nongnu/")
        ("melpa"  . "https://melpa.org/packages/")
        ("melpa-tsinghua"  . "http://mirrors.tuna.tsinghua.edu.cn/elpa/melpa/")
    )
)

;;; 刷新软件源索引
; 不检查签名
; 个别时候会出现签名校验失败
(setq package-check-signature nil)

(require 'package)

; 初始化包管理器
(unless (bound-and-true-p package--initialized)
    (package-initialize)
)

; 刷新软件源索引
(unless package-archive-contents
    (package-refresh-contents)
)

; use package
(unless
    (package-installed-p 'use-package)
    (package-refresh-contents)
    (package-install 'use-package)
)

;;; crux
(use-package crux
    :ensure t
    ; 删除当前行
    :bind ("C-c k" . crux-smart-kill-line)
)

;;; 上下移动行
(use-package drag-stuff
    :ensure t
    :bind (
        ("<M-up>". drag-stuff-up)
        ("<M-down>" . drag-stuff-down)
    )
)

;;; 显示行号
(use-package emacs
    :config
        (setq display-line-numbers-type 't)
        (global-display-line-numbers-mode t)
)

;;; 用y/n来代替yes/no
(use-package emacs
    :config (defalias 'yes-or-no-p 'y-or-n-p)
)

;;; 主题
(use-package gruvbox-theme
    :ensure t
    :init (load-theme 'gruvbox-light-soft t)
)
;(use-package solarized-theme
;    :ensure t
;    :config
;        (load-theme 'solarized-dark t)
;)

;;; 终端模拟器
(use-package vterm
    :ensure t)


; mode line
(use-package smart-mode-line
    :ensure t
    :init
        (setq
            sml/no-confirm-load-theme t
            sml/theme 'respectful
        )
        (sml/setup)
)

;;; ivy-counsel-swiper 三剑客
(use-package ivy
    :ensure t
    :defer 1
    :demand
    :hook (after-init . ivy-mode)
    :config
        (ivy-mode 1)
        (setq
            ivy-use-virtual-buffers t
            ivy-initial-inputs-alist nil
            ivy-count-format "%d/%d "
            enable-recursive-minibuffers t
            ivy-re-builders-alist '(
                (t . ivy--regex-ignore-order)
            )
        )
)

; 优化控制栏显示方式
(use-package counsel
    :ensure t
    :after (ivy)
    :bind(
        ("M-x" . counsel-M-x)
        ("C-x C-f" . counsel-find-file)
        ("C-c f" . counsel-recentf)
        ("C-c g" . counsel-git)
    )
)

; 更方便的搜索
(use-package swiper
    :ensure t
    :after ivy
    :bind(
        ("C-s" . swiper)
        ("C-r" . swiper-isearch-backward)
    )

    :config (
        setq
            swiper-action-recenter t
            swiper-include-line-number-in-search t
    )
)

;;; 快速切换窗口
(use-package ace-window
    :ensure t
    :bind (
        ("M-o" . 'ace-window)
    )
)

(setq exec-path (append '("/home/laolang/.nvm/versions/node/v18.19.0/bin/node") exec-path))

;;; 设置 c/c++ tag 宽度
(setq-default c-basic-offset 4)
;;; 启动 .dir-locals.el
(setq enable-local-variables t)

;;; lsp-mode
(use-package lsp-mode
    :ensure t
    :init
        (setq lsp-clangd-binary-path "/usr/bin/clangd")
    :config
        (setq lsp-prefer-flymake nil)
    :hook (;; replace XXX-mode with concrete major-mode(e. g. python-mode)
            (c-mode . lsp)
            (c++-mode . lsp)
            ;; if you want which-key integration
            (lsp-mode . lsp-enable-which-key-integration)
        )
    :commands lsp
)

(use-package treemacs
    :ensure t
    :commands treemacs
)
(use-package lsp-treemacs
    :ensure t
    :commands lsp-treemacs-errors-list
    :after (lsp treemacs)
)


(use-package company
    :ensure t
    :config
        (setq company-minimum-prefix-length 1) ; 只需敲 1 个字母就开始进行自动补全
        (setq company-tooltip-align-annotations t)
        (setq company-idle-delay 0.0)
        (setq company-show-numbers t) ;; 给选项编号 (按快捷键 M-1、M-2 等等来进行选择).
        (setq company-selection-wrap-around t)
        ;(setq company-transformers '(company-sort-by-occurrence)) ; 根据选择的频率进行排序，读者如果不喜欢可以去掉
)

(use-package company-box
    :ensure t
    :hook (company-mode . company-box-mode)
)

(add-hook 'c++-mode-hook
    (lambda ()
        (company-mode 1)))

(add-hook 'c-mode-hook
    (lambda ()
        (company-mode 1)))

(use-package lsp-ui
    :ensure t
    :commands lsp-ui-mode
    :config
        (setq   lsp-ui-sideline-enable nil ; 禁用lsp-ui的侧边栏提示
                lsp-ui-doc-enable t ; 启用lsp-ui的文档显示功能
                lsp-ui-doc-position 'at-point ; 将文档显示在光标所在位置
                lsp-ui-doc-header t ; 显示文档的标题
                lsp-ui-doc-include-signature t ; 显示文档的函数签名信息
                lsp-ui-peek-enable t ; 启用lsp-ui的Peek功能, 即查看定义和引用
                lsp-ui-peek-always-show t ; 始终显示Peek结果
        )
)

(add-hook 'before-save-hook #'lsp-format-buffer) ; 保存文件之前对缓冲区进行格式化
(add-hook 'c-mode-hook #'lsp-deferred)
(add-hook 'c++-mode-hook #'lsp-deferred)

(use-package flycheck
    :ensure t
    :config
        (setq truncate-lines nil) ; 如果单行信息很长会自动换行
    :hook
        (prog-mode . flycheck-mode)
)

(use-package flycheck-clang-tidy
    :ensure t
    :after flycheck
    :hook
        (flycheck-mode . flycheck-clang-tidy-setup)
    :config
        (setq flycheck-clang-tidy-executable "/usr/bin/clang-tidy")
)

(use-package projectile
    :ensure t
    :bind (("C-c p" . projectile-command-map))
    :config
        (setq projectile-mode-line "Projectile")
        (setq projectile-track-known-projects-automatically nil)
)
(projectile-mode +1)
(setq projectile-startup-screen 'projectile)

(use-package counsel-projectile
    :ensure t
    :after (projectile)
    :init (counsel-projectile-mode)
)

(use-package dap-mode
    :ensure t
    :hook
        (lsp-mode . dap-mode)
        (lsp-mode . dap-ui-mode)
    :custom
        (dap-auto-configure-features (list 'sessions 'locals 'controls 'tooltip))
    :config
        (dap-auto-configure-mode)
        ; (require 'dap-lldb)
        (require 'dap-gdb-lldb)
        ; (dap-gdb-lldb-setup)
)


;;; 设置启动页
(use-package dashboard
    :ensure t
    :config
        (dashboard-setup-startup-hook)
)
(setq dashboard-banner-logo-title "潼关路上始终是黑暗的")
(setq dashboard-startup-banner "~/dashboard.png")
(setq projectile-startup-screen 'projectile)
(setq dashboard-items '((recents  . 10)
                        (projects . 10)
                        ))




(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
   '(doom-themes lsp-treemacs use-package smart-mode-line lsp-mode gruvbox-theme drag-stuff crux counsel ace-window)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )

```

## .dir-locals.el
```lisp
;;; clangd 配置
((c++-mode . ((clangd-args . ("-std=c++17"
                             "--background-index"
                            "--compile-commands-dir=build/ninja-release"
                             "-j=12"
                             "--clang-tidy"
                             "--completion-parse=auto"
                             "--completion-style=detailed"
                             "--function-arg-placeholders"
                             "--fallback-style=Webkit"
                             "--pch-storage=disk"
                             "--log=verbose"
                             "--pretty"
                             "--header-insertion-decorators"
                             "--header-insertion=iwyu"
                             "--all-scopes-completion"
                             "--ranking-model=decision_forest")))))
```
