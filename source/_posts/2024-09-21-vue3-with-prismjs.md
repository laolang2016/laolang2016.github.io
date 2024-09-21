---
title: vue3 使用 prismjs
date: 2024-09-21 10:28:42
categories:
- 前端
- vue
tags:
- 前端
- vue
---

# 安装依赖
```
# prismjs 
npm i prismjs -S

# prismjs 类型
npm i -D @types/prismjs

# vite plugin
npm install vite-plugin-prismjs -D
```

# 下载主题

[https://github.com/PrismJS/prism-themes](https://github.com/PrismJS/prism-themes)

将 `themes` 目录放到项目中

# vite.config.ts

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { prismjsPlugin } from 'vite-plugin-prismjs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    console.log(mode)
    console.log(env)
    const plugins = [
        vue(),
        prismjsPlugin({
            // ['json', 'css'] 按需引入，'all' 所有语言
            languages: 'all',
            // 配置行号插件
            plugins: [
                'line-numbers',
                'copy-to-clipboard',
                'show-language',
                'line-highlight',
                'toolbar'
            ],
            // 主题名
            // theme: 'default',
            css: true
        })
    ]
    return {
        plugins: plugins,
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },

        server: {
            port: 12016,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },

        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/style/global.scss";'
                }
            }
        }
    }
})
```

# main.ts 引入主题
```
import '@/assets/prism-theme/prism-coldark-cold.css'
```

# 使用

```html
<template>
    <div>
        <div class="red">
            hello world
            <i class="fas fa-heart"></i>
        </div>
        <pre class="line-numbers" data-line="1,13-15"><code class="language-java">{{ code }}</code></pre>

        <lay-button type="primary">原始按钮</lay-button>
    </div>
</template>

<script lang="ts">
import Prism from 'prismjs'
import { onMounted } from "vue"
export default {

    setup() {
        const code = `package com.laolang.jx;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JucHelloApplication {
    public static void main(String[] args) {
        log.info("juc hello is running...");

        FutureTask<Integer> futureTask = new FutureTask<>(new SimpleCallable());
        Thread t1 = new Thread(futureTask, "t1");
        t1.start();

        int i = 0;
        while( i < 5 ){
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            log.info("主线程的某些任务");
            i++;
        }

        try {
            Integer ret = futureTask.get();
            log.info("线程计算结果:{}",ret);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }

        i = 0;
        while( i < 5 ){
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            log.info("主线程的某些任务2");
            i++;
        }

        log.info("程序结束");
    }
}`
        onMounted(() => {
            Prism.highlightAll()
        })

        return {
            code
        }
    }
}
</script>

<style lang="scss">
.red {
    color: $baseColor;
}

code {
    border-left-width: 0 !important;
}
</style>
```

# 效果

![](/images/2024-09-21-vue3-with-prismjs/001.png)

# 注意事项

如果想使用 `prismjs` 自带的主题, 则在 `vite.config.ts` 中引入, 并注释 `main.ts` 中引入的主题

**main.ts**

```
// import '@/assets/prism-theme/prism-coldark-cold.css'
```

**vite.config.ts**
```ts
prismjsPlugin({
    // ['json', 'css'] 按需引入，'all' 所有语言
    languages: 'all',
    // 配置行号插件
    plugins: [
        'line-numbers',
        'copy-to-clipboard',
        'show-language',
        'line-highlight',
        'toolbar'
    ],
    // 主题名
    // theme: 'default',
    css: true
})
```

# 参考
[prismjs 高亮在vite中使用](https://juejin.cn/post/7078607581194747934)
[vue3、vite，正确安装 Prismjs](https://blog.csdn.net/weixin_45389633/article/details/128638368)
[Vue3(Vite) 通过 prism.js 实现代码高亮并实现Mac风格](https://cloud.tencent.com/developer/article/2283575)