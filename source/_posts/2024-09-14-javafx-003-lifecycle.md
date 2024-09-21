---
title: javafx 003 生命周期
date: 2024-09-14 05:51:21
categories:
- java
- javafx
tags:
- java
- javafx
---

# 生命周期的三个方法
```java
package com.laolang.fx;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FxHelloLaunch extends Application {

    @Override
    public void init() throws Exception {
        log.info("init");
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        log.info("start");
        StackPane root = new StackPane();

        Scene scene = new Scene(root, 300, 250);

        primaryStage.setTitle("Hello World!");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    @Override
    public void stop() throws Exception {
        log.info("stop");
    }
}
```