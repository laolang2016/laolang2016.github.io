---
title: 总览
order: 101
---

## 参考资料

Emacs Lisp 简明教程: https://smacs.github.io/elisp/

Elisp: Lisp Basics: http://xahlee.info/emacs/emacs/elisp.html

emacs 官方手册: https://www.gnu.org/software/emacs/manual/


Emacs高手修炼手册

合集·完结 Emacs高手修炼手册: https://www.bilibili.com/video/BV13g4y167Zn

Emacs高手修炼手册(v1.0，2022): https://juejin.cn/post/7085254713595133960

Emacs高手修炼手册 （2.0版，2023年，针对Emacs 29）: https://zhuanlan.zhihu.com/p/655059463


21 天学会 Emacs（2022 Edition）: https://book.emacs-china.org/

emacs 折腾日记: https://www.zhihu.com/column/c_1848125401097986050

专业 Emacs 入门: https://pavinberg.github.io/emacs-book/zh/intro/

EMACS-CHINA: https://emacs-china.github.io/

## 基本配置

```lisp
;; 通用配置 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; 确保 Emacs 能找到 ~/.local/bin 下的 程序
(add-to-list 'exec-path (expand-file-name "~/.local/bin"))
(with-eval-after-load 'tramp
  (add-to-list 'tramp-remote-path 'tramp-own-remote-path)
  (add-to-list 'tramp-remote-path "~/.local/bin"))


;; 关闭菜单栏
(menu-bar-mode -1)
;; 关闭工具栏
(tool-bar-mode -1)
;; 关闭滚动条
(scroll-bar-mode -1)
;; 关闭启动界面
(setq inhibit-startup-screen t)
;; 关闭主题加载的安全确认
(setq custom-safe-themes t)

;; 用y/n来代替yes/no
(defalias 'yes-or-no-p 'y-or-n-p)

;; 关闭备份功能
;; 关闭备份文件（不生成 ~ 结尾的文件）
(setq make-backup-files nil)
;; 关闭自动保存文件（不生成 # 开头 # 结尾的文件）
(setq auto-save-default nil)
;; 关闭文件版本保存 .#xxx 这类
(setq create-lockfiles nil)
;; 不询问是否保存新版本
(setq backup-by-copying-when-linked nil)

;; melpa ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; 1. 初始化包管理（必须先配置 MELPA）
(require 'package)
(setq package-archives
      '(("gnu" . "https://elpa.gnu.org/packages/")
        ("melpa" . "https://melpa.org/packages/")    ; 官方源
        ("melpa-stable" . "https://stable.melpa.org/packages/"))) ; 稳定版

;; 2. 初始化包管理器
(package-initialize)

;; 3. 启用内置 use-package（Emacs 29+ 已内置）
(require 'use-package)

;; 4. 全局自动确保包安装（推荐）
(setq use-package-always-ensure t)

;; 5. 可选：自动刷新包列表（首次启动）
(unless package-archive-contents
  (package-refresh-contents))

;; 编程相关 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; 显示行号
;; 全局开启行号
;; (global-display-line-numbers-mode 1)
;; 仅编程模式下开启行号
(add-hook 'prog-mode-hook 'display-line-numbers-mode)
;; 使用绝对行号
(setq display-line-numbers-type t)
;; 使用相对行号
;; (setq display-line-numbers-type 'relative)

;; 在ModeLine显示列号
(add-hook 'prog-mode-hook 'column-number-mode) 
;; 括号的配对
(add-hook 'prog-mode-hook 'electric-pair-mode)
;; 代码的折叠
(add-hook 'prog-mode-hook 'hs-minor-mode) 
;; 错误的提示
(add-hook 'prog-mode-hook 'flymake-mode) 

;; 文件树
(use-package treemacs
    :ensure t
    :defer t
    :config
      ;; 禁止标签跟随功能
      (treemacs-tag-follow-mode -1)
    :bind
      (:map global-map
        ("M-0"    . treemacs-select-window)
        ("C-x t 1"  . treemacs-delete-other-windows)
        ("C-x t t"  . treemacs)
        ("C-x t B"  . treemacs-bookmark)
        ;; ("C-x t C-t" . treemacs-find-file)
        ("C-x t M-t" . treemacs-find-tag)
      )
)
;; projectile
(use-package projectile
    :ensure t
    :pin melpa-stable
    :init
    (projectile-mode +1)
    :bind (:map projectile-mode-map
        ("C-c p" . projectile-command-map)))

;; undotree
(use-package undo-tree
    :ensure t
    :init (global-undo-tree-mode)
    :custom
        (undo-tree-auto-save-history nil) ;; 默认会为每个文件生成一个隐藏文件用来保存之前的历史记录, 该配置可关闭该特性
)

;; smart mode line
(use-package smart-mode-line
    :ensure t
    :init 
        (sml/setup)
)

;; 将最常用的命令放到前面
(use-package amx
    :ensure t
    :init (amx-mode)
)

;; C-a 在代码开头和行首之间切换
;; C-e 在代码结尾和行尾之间切换
(use-package mwim
    :ensure t
    :bind
        ("C-a" . mwim-beginning-of-code-or-line)
        ("C-e" . mwim-end-of-code-or-line)
)

;; ivy
(use-package ivy
  :ensure t
  :defer 1
  :demand
  :hook (after-init . ivy-mode)
  :config
  (ivy-mode 1)
  (setq ivy-use-virtual-buffers t
        ivy-initial-inputs-alist nil
        ivy-count-format "%d/%d "
        enable-recursive-minibuffers t
        ivy-re-builders-alist '((t . ivy--regex-ignore-order))))

(use-package counsel
  :ensure t
  :ensure t
  :after (ivy)
  :bind (("M-x" . counsel-M-x)
         ("C-x C-f" . counsel-find-file)
         ("C-c f" . counsel-recentf)
         ("C-c g" . counsel-git)))

(use-package swiper
  :after ivy
  :bind (("C-s" . swiper)
         ("C-r" . swiper-isearch-backward))
  :config (setq swiper-action-recenter t
                swiper-include-line-number-in-search t))



;; treesit
;; 首次使用需执行: M-x treesit-install-language-grammar -> 选择需要的语言
(use-package treesit
  :ensure nil
  :when (and (fboundp 'treesit-available-p)
         (treesit-available-p))
  :config (setq treesit-font-lock-level 4)
  :init
  (setq treesit-language-source-alist
    '(
      (c          . ("https://github.com/tree-sitter/tree-sitter-c" "v0.23.0"))
      (cpp        . ("https://github.com/tree-sitter/tree-sitter-cpp" "v0.23.0"))
      (cmake      . ("https://github.com/uyha/tree-sitter-cmake"))
    )
  )
  (add-to-list 'major-mode-remap-alist '(c-mode . c-ts-mode))
  (add-to-list 'major-mode-remap-alist '(c++-mode . c++-ts-mode))
  (add-to-list 'major-mode-remap-alist '(cmake-mode . cmake-ts-mode))
)




(use-package cmake-mode
  :ensure t
  :mode ("CMakeLists\\.txt\\'" "\\.cmake\\'"))

;; eglot

(use-package eglot
  :ensure nil ;; 内置插件
  :hook
  ((c-ts-mode . eglot-ensure)
   (c++-ts-mode . eglot-ensure)
   (cmake-ts-mode . eglot-ensure)
  )
  :config
  ;; 提高同步频率
  (setq eglot-send-changes-idle-time 0.1)
  ;; 强制指定 CMake 的 LSP 服务器为 neocmakelsp
  ;; 注意：使用 setf 配合 alist-get 是为了全局修改配置表，而非 local 局部变量
  (let ((cmake-server '("/home/laolang/.local/bin/neocmakelsp" "stdio")))
  (setf (alist-get 'cmake-mode eglot-server-programs) cmake-server)
  (setf (alist-get 'cmake-ts-mode eglot-server-programs) cmake-server))
)


;; 提示UI
(use-package corfu
  :ensure t
  :init
  (global-corfu-mode)
  :custom
  (corfu-auto t)                 ;; 开启自动补全
  (corfu-auto-delay 0.1)         ;; 延迟 0.1 秒触发
  (corfu-auto-prefix 1)          ;; 输入 1 个字符就开始提示
  (corfu-cycle t)                ;; 循环选择
  :config
  ;; 配合 TRAMP 远程开发时，建议关闭部分耗时功能
  (setq tab-always-indent 'complete))

;; corfu 在终端环境下不可用, 需要使用 corfu-terminal
;; 1. 路径设置
(add-to-list 'load-path "~/.emacs.d/local/emacs-popon")
(add-to-list 'load-path "~/.emacs.d/local/emacs-corfu-terminal")

;; 2. 基础 Corfu 配置 (必须先于 corfu-terminal)
(require 'corfu)
(setq corfu-auto t)
(global-corfu-mode)

;; 3. 解决 Warning 的关键：显式声明变量与函数
(defvar corfu-terminal-mode nil)
(declare-function corfu-terminal-mode "corfu-terminal")

;; 4. 加载并启用
(unless (display-graphic-p)
  ;; 使用 require 的三个参数版本：(名称 文件 即使失败也不报错)
  (when (require 'corfu-terminal nil 'noerror)
    (corfu-terminal-mode +1)))


;; 关闭自动触发 eldoc
;; 使用 eldoc 手动开启
(setq eldoc-idle-delay 3600)


(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   '("45631691477ddee3df12013e718689dafa607771e7fd37ebc6c6eb9529a8ede5" default))
 '(package-selected-packages '(undo-tree)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )

```