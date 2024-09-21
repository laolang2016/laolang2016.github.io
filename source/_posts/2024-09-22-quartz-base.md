---
title: quartz 基础
date: 2024-09-22 05:11:06
categories:
- java
- 任务调度
- quartz
tags:
- java
- 任务调度
- quartz
---

# 参考资料

[java教程之精品详解Quartz，企业中热门实用的技能【黑马程序员】](https://www.bilibili.com/video/BV19t41127de)
[中文文档](https://xuzongbao.gitbooks.io/quartz/content/)

[Quartz快速入门指南](https://www.bootwiki.com/quartz/quartz-intro.html)

[Cron在线表达式生成器](https://cron.ciding.cc/)

[springboot2.x+quartz+mysql持久化集成](https://blog.csdn.net/yaomingyang/article/details/108348891)

# Hello World

## pom 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.laolang.jx</groupId>
    <artifactId>quartz-hello</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>

        <!-- test -->
        <testng.version>6.14.3</testng.version>

        <!-- logback -->
        <logback.version>1.2.12</logback.version>

        <quartz.version>2.3.0</quartz.version>

        <!-- tool -->
        <hutool.version>5.8.11</hutool.version>
        <lombok.version>1.18.16</lombok.version>
    </properties>

    <dependencies>
        <!-- testng -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>${testng.version}</version>
        </dependency>

        <!-- logback -->
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${logback.version}</version>
        </dependency>

        <!-- quartz -->
        <dependency>
            <groupId>org.quartz-scheduler</groupId>
            <artifactId>quartz</artifactId>
            <version>${quartz.version}</version>
        </dependency>
        <dependency>
            <groupId>org.quartz-scheduler</groupId>
            <artifactId>quartz-jobs</artifactId>
            <version>${quartz.version}</version>
        </dependency>

        <!-- tool -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>${hutool.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
        </dependency>

    </dependencies>

    <repositories>
        <repository>
            <id>public</id>
            <name>aliyun nexus</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
        </repository>
    </repositories>

    <pluginRepositories>
        <pluginRepository>
            <id>public</id>
            <name>aliyun nexus</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>
</project>
```

## job
```job
package com.laolang.jx.job;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@Slf4j
public class HelloJob implements Job {


    public HelloJob() {
        log.info("初始化 job");
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        log.info("job 过程:{}", DateUtil.format(new Date(), DatePattern.NORM_DATETIME_PATTERN));
    }
}

```

## 启动类

```java
package com.laolang.jx;

import com.laolang.jx.job.HelloJob;
import lombok.extern.slf4j.Slf4j;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

@Slf4j
public class QuartzHelloApp {
    public static void main(String[] args) throws SchedulerException {
        // 调度器
        Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();
        // 任务实例
        // 加载任务类, 要求 HelloJob 实现 Job 接口
        // 每次调度执行 job 时, 都会创建一个新的 job 实例, 调用完成后 job 实例释放, 被垃圾回收机制回收
        JobDetail jobDetail = JobBuilder.newJob(HelloJob.class)
                // 任务名称(唯一), 组名称
                .withIdentity("job-hello", "job-group-hello")
                .build();
        // 触发器
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger-hello", "trigger-group-hello")
                .startNow()
                .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
        scheduler.start();
    }
}
```

## 运行效果
```
D:\program\java\jdk8\jdk\bin\java.exe "-javaagent:D:\program\java\idea\IntelliJ IDEA Community Edition 2024.1.4\lib\idea_rt.jar=14248:D:\program\java\idea\IntelliJ IDEA Community Edition 2024.1.4\bin" -Dfile.encoding=UTF-8 -classpath D:\program\java\jdk8\jdk\jre\lib\charsets.jar;D:\program\java\jdk8\jdk\jre\lib\deploy.jar;D:\program\java\jdk8\jdk\jre\lib\ext\access-bridge-64.jar;D:\program\java\jdk8\jdk\jre\lib\ext\cldrdata.jar;D:\program\java\jdk8\jdk\jre\lib\ext\dnsns.jar;D:\program\java\jdk8\jdk\jre\lib\ext\jaccess.jar;D:\program\java\jdk8\jdk\jre\lib\ext\jfxrt.jar;D:\program\java\jdk8\jdk\jre\lib\ext\localedata.jar;D:\program\java\jdk8\jdk\jre\lib\ext\nashorn.jar;D:\program\java\jdk8\jdk\jre\lib\ext\sunec.jar;D:\program\java\jdk8\jdk\jre\lib\ext\sunjce_provider.jar;D:\program\java\jdk8\jdk\jre\lib\ext\sunmscapi.jar;D:\program\java\jdk8\jdk\jre\lib\ext\sunpkcs11.jar;D:\program\java\jdk8\jdk\jre\lib\ext\zipfs.jar;D:\program\java\jdk8\jdk\jre\lib\javaws.jar;D:\program\java\jdk8\jdk\jre\lib\jce.jar;D:\program\java\jdk8\jdk\jre\lib\jfr.jar;D:\program\java\jdk8\jdk\jre\lib\jfxswt.jar;D:\program\java\jdk8\jdk\jre\lib\jsse.jar;D:\program\java\jdk8\jdk\jre\lib\management-agent.jar;D:\program\java\jdk8\jdk\jre\lib\plugin.jar;D:\program\java\jdk8\jdk\jre\lib\resources.jar;D:\program\java\jdk8\jdk\jre\lib\rt.jar;E:\code\idea\quartz-study\quartz-hello\target\classes;D:\program\java\repo\org\testng\testng\6.14.3\testng-6.14.3.jar;D:\program\java\repo\com\beust\jcommander\1.72\jcommander-1.72.jar;D:\program\java\repo\org\apache-extras\beanshell\bsh\2.0b6\bsh-2.0b6.jar;D:\program\java\repo\ch\qos\logback\logback-classic\1.2.12\logback-classic-1.2.12.jar;D:\program\java\repo\ch\qos\logback\logback-core\1.2.12\logback-core-1.2.12.jar;D:\program\java\repo\org\slf4j\slf4j-api\1.7.32\slf4j-api-1.7.32.jar;D:\program\java\repo\org\quartz-scheduler\quartz\2.3.0\quartz-2.3.0.jar;D:\program\java\repo\com\mchange\c3p0\0.9.5.2\c3p0-0.9.5.2.jar;D:\program\java\repo\com\mchange\mchange-commons-java\0.2.11\mchange-commons-java-0.2.11.jar;D:\program\java\repo\com\zaxxer\HikariCP-java6\2.3.13\HikariCP-java6-2.3.13.jar;D:\program\java\repo\org\quartz-scheduler\quartz-jobs\2.3.0\quartz-jobs-2.3.0.jar;D:\program\java\repo\cn\hutool\hutool-all\5.8.11\hutool-all-5.8.11.jar;D:\program\java\repo\org\projectlombok\lombok\1.18.16\lombok-1.18.16.jar com.laolang.jx.QuartzHelloApp
04:23:05.236 [main] INFO org.quartz.impl.StdSchedulerFactory - Using default implementation for ThreadExecutor
04:23:05.239 [main] INFO org.quartz.simpl.SimpleThreadPool - Job execution threads will use class loader of thread: main
04:23:05.246 [main] INFO org.quartz.core.SchedulerSignalerImpl - Initialized Scheduler Signaller of type: class org.quartz.core.SchedulerSignalerImpl
04:23:05.246 [main] INFO org.quartz.core.QuartzScheduler - Quartz Scheduler v.2.3.0 created.
04:23:05.246 [main] INFO org.quartz.simpl.RAMJobStore - RAMJobStore initialized.
04:23:05.246 [main] INFO org.quartz.core.QuartzScheduler - Scheduler meta-data: Quartz Scheduler (v2.3.0) 'DefaultQuartzScheduler' with instanceId 'NON_CLUSTERED'
  Scheduler class: 'org.quartz.core.QuartzScheduler' - running locally.
  NOT STARTED.
  Currently in standby mode.
  Number of jobs executed: 0
  Using thread pool 'org.quartz.simpl.SimpleThreadPool' - with 10 threads.
  Using job-store 'org.quartz.simpl.RAMJobStore' - which does not support persistence. and is not clustered.

04:23:05.246 [main] INFO org.quartz.impl.StdSchedulerFactory - Quartz scheduler 'DefaultQuartzScheduler' initialized from default resource file in Quartz package: 'quartz.properties'
04:23:05.246 [main] INFO org.quartz.impl.StdSchedulerFactory - Quartz scheduler version: 2.3.0
04:23:05.252 [main] INFO org.quartz.core.QuartzScheduler - Scheduler DefaultQuartzScheduler_$_NON_CLUSTERED started.
04:23:05.252 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
04:23:05.254 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.simpl.PropertySettingJobFactory - Producing instance of Job 'job-group-hello.job-hello', class=com.laolang.jx.job.HelloJob
04:23:05.254 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
04:23:05.256 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
04:23:05.256 [DefaultQuartzScheduler_Worker-1] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
04:23:05.286 [DefaultQuartzScheduler_Worker-1] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 04:23:05
04:23:10.011 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.simpl.PropertySettingJobFactory - Producing instance of Job 'job-group-hello.job-hello', class=com.laolang.jx.job.HelloJob
04:23:10.011 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
04:23:10.011 [DefaultQuartzScheduler_Worker-2] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
04:23:10.012 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
04:23:10.012 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 04:23:10
04:23:15.016 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.simpl.PropertySettingJobFactory - Producing instance of Job 'job-group-hello.job-hello', class=com.laolang.jx.job.HelloJob
04:23:15.016 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
04:23:15.016 [DefaultQuartzScheduler_Worker-3] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
04:23:15.016 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
04:23:15.017 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 04:23:15
04:23:20.016 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.simpl.PropertySettingJobFactory - Producing instance of Job 'job-group-hello.job-hello', class=com.laolang.jx.job.HelloJob
04:23:20.016 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
04:23:20.016 [DefaultQuartzScheduler_Worker-4] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
04:23:20.016 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
04:23:20.016 [DefaultQuartzScheduler_Worker-4] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 04:23:20

Process finished with exit code 130
```

# jobDetail
```java
log.info("jobDetail 信息:名称:{}",jobDetail.getKey().getName());
log.info("jobDetail 信息:组名称:{}",jobDetail.getKey().getGroup()); // 没有指定, 则为 DEFAULT
log.info("jobDetail 信息:任务类{}",jobDetail.getJobClass().getName());
```

```
04:27:14.131 [main] INFO com.laolang.jx.QuartzHelloApp - jobDetail 信息:名称:job-hello
04:27:14.132 [main] INFO com.laolang.jx.QuartzHelloApp - jobDetail 信息:组名称:job-group-hello
04:27:14.132 [main] INFO com.laolang.jx.QuartzHelloApp - jobDetail 信息:任务类com.laolang.jx.job.HelloJob
```

# JobExecutionContext

> * 当 `Scheduler` 调用一个 `Job` , 就会将 `JobExecutionContext` 传递给 `Job` 的 `execute()` 方法
> * `Job` 能通过 `JobExecutionContext` 对象访问到 `Quartz` 运行时的环境以及 `Job` 本身的明细数据

```java
public void execute(JobExecutionContext context) throws JobExecutionException {
    // 获取 JobDetail 内容
    JobKey jobKey = context.getJobDetail().getKey();
    log.info("jobDetail 信息:名称:{}",jobKey.getName());
    log.info("jobDetail 信息:组名称:{}",jobKey.getGroup()); // 没有指定, 则为 DEFAULT
    log.info("jobDetail 信息:任务类{}",context.getJobDetail().getJobClass().getName());

    // 获取 Trigger 内容
    Trigger trigger = context.getTrigger();

    log.info("job 过程:{}", DateUtil.format(new Date(), DatePattern.NORM_DATETIME_PATTERN));
}
```

# JobDataMap

> * 在进行任务调度时, `JobDataMap` 存储在 `JobExecutionContext` 中
> * `JobDataMap` 可以用来装载任何可序列化的数据对象, 当 `Job` 实例对象被在执行时这些参数对象会传递给它
> * `JobDataMap` 实现了 JDK 的 Map 接口, 并且添加了获取基本数据类型的方法
> * 同名的 `key` , `Trigger` 会覆盖 `JobDetail`

```java
package com.laolang.jx;

import com.laolang.jx.job.HelloJob;
import com.laolang.jx.job.HelloJobData;
import lombok.extern.slf4j.Slf4j;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

@Slf4j
public class QuartzHelloApp {
    public static void main(String[] args) throws SchedulerException {
        Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

        // 任务参数
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("msg", "hello job");
        jobDataMap.put("data", HelloJobData.builder().username("laolang").role("admin").build());

        JobDetail jobDetail = JobBuilder.newJob(HelloJob.class)
                // 任务参数
                .usingJobData(jobDataMap)
                .withIdentity("job-hello", "job-group-hello")
                .build();
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger-hello", "trigger-group-hello")
                .startNow()
                .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
                // 任务参数
                .usingJobData(jobDataMap)
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
        scheduler.start();
    }
}
```

```java
package com.laolang.jx.job;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class HelloJobData implements Serializable {

    private static final long serialVersionUID = 5204237110609663577L;

    private String username;
    private String role;

}
```

```java
package com.laolang.jx.job;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.json.JSONUtil;
import java.util.Date;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.TriggerKey;

@Slf4j
public class HelloJob implements Job {


    public HelloJob() {
        log.info("初始化 job");
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDetail jobDetail = context.getJobDetail();
        // 获取 JobDetail 内容
        JobKey jobKey = jobDetail.getKey();
        log.info("jobDetail info start");
        log.info("jobDetail 信息:名称:{}", jobKey.getName());
        log.info("jobDetail 信息:组名称:{}", jobKey.getGroup()); // 没有指定, 则为 DEFAULT
        log.info("jobDetail 信息:任务类{}", jobDetail.getJobClass().getName());

        // JobDataMap
        printJobDataMap(jobDetail.getJobDataMap());

        log.info("jobDetail info end\n");


        // 获取 Trigger 内容
        log.info("trigger info start");
        TriggerKey triggerKey = context.getTrigger().getKey();
        log.info("trigger name:{}", triggerKey.getName());
        log.info("trigger group:{}", triggerKey.getGroup());

        // JobDataMap
        printJobDataMap(context.getTrigger().getJobDataMap());

        log.info("trigger info end\n");

        // 其他内容
        log.info("other info start");
        log.info("当前任务执行时间:{}", DateUtil.format(context.getFireTime(), DatePattern.NORM_DATETIME_PATTERN));
        log.info("下一次任务执行时间:{}", DateUtil.format(context.getNextFireTime(), DatePattern.NORM_DATETIME_PATTERN));
        log.info("other info end\n");

        log.info("job 过程:{}", DateUtil.format(new Date(), DatePattern.NORM_DATETIME_PATTERN));
    }

    private void printJobDataMap(JobDataMap jobDataMap) {
        log.info("JobData=>msg:{}", jobDataMap.getString("msg"));
        Object data = jobDataMap.get("data");
        if (Objects.nonNull(data) && data instanceof HelloJobData) {
            HelloJobData jobData = (HelloJobData) data;
            log.info("JobData=>data:{}", JSONUtil.toJsonStr(jobData));
        }
    }
}

```

```
05:00:20.002 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
05:00:20.003 [DefaultQuartzScheduler_Worker-2] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
05:00:20.003 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - jobDetail info start
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - jobDetail 信息:名称:job-hello
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - jobDetail 信息:组名称:job-group-hello
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - jobDetail 信息:任务类com.laolang.jx.job.HelloJob
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - JobData=>msg:hello job
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - JobData=>data:{"username":"laolang","role":"admin"}
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - jobDetail info end

05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - trigger info start
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - trigger name:trigger-hello
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - trigger group:trigger-group-hello
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - JobData=>msg:hello job
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - JobData=>data:{"username":"laolang","role":"admin"}
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - trigger info end

05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - other info start
05:00:20.003 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - 当前任务执行时间:2024-08-17 05:00:20
05:00:20.004 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - 下一次任务执行时间:2024-08-17 05:00:25
05:00:20.004 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - other info end

05:00:20.004 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 05:00:20
```

# Job 状态

有状态的 Job 可以理解为多次 Job 调用期间, 可以持有一些状态信息, 这些状态信息村粗在 `JobDataMap` 中, 有状态的 Job 可以添加 `@PersistJobDataAfterExecution` 注解
默认 Job 无状态, 每次调用都会创建一个新的 `JobDataMap`


```java
package com.laolang.jx;

import com.laolang.jx.job.HelloJob;
import com.laolang.jx.job.HelloJobData;
import lombok.extern.slf4j.Slf4j;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

@Slf4j
public class QuartzHelloApp {
    public static void main(String[] args) throws SchedulerException {
        Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

        // 任务参数
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("count", 0);

        JobDetail jobDetail = JobBuilder.newJob(HelloJob.class)
                // 任务参数
                .usingJobData(jobDataMap)
                .withIdentity("job-hello", "job-group-hello")
                .build();
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger-hello", "trigger-group-hello")
                .startNow()
                .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
        scheduler.start();
    }
}
```

```java
package com.laolang.jx.job;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.PersistJobDataAfterExecution;

@PersistJobDataAfterExecution
@Slf4j
public class HelloJob implements Job {


    public HelloJob() {
        log.info("初始化 job");
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDetail jobDetail = context.getJobDetail();
        // JobDataMap
        JobDataMap jobDataMap = jobDetail.getJobDataMap();
        int count = jobDataMap.getInt("count");

        log.info("jobDetail info end\n");

        log.info("job 过程:{}", DateUtil.format(new Date(), DatePattern.NORM_DATETIME_PATTERN));
        log.info("job count:{}", count);

        jobDataMap.put("count", count + 1);
    }
}
```

```
05:10:10.070 [DefaultQuartzScheduler_Worker-1] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 05:10:10
05:10:10.070 [DefaultQuartzScheduler_Worker-1] INFO com.laolang.jx.job.HelloJob - job count:0
05:10:15.012 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.simpl.PropertySettingJobFactory - Producing instance of Job 'job-group-hello.job-hello', class=com.laolang.jx.job.HelloJob
05:10:15.012 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
05:10:15.012 [DefaultQuartzScheduler_Worker-2] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
05:10:15.012 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - jobDetail info end

05:10:15.012 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
05:10:15.013 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 05:10:15
05:10:15.013 [DefaultQuartzScheduler_Worker-2] INFO com.laolang.jx.job.HelloJob - job count:1
05:10:20.014 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.simpl.PropertySettingJobFactory - Producing instance of Job 'job-group-hello.job-hello', class=com.laolang.jx.job.HelloJob
05:10:20.014 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
05:10:20.014 [DefaultQuartzScheduler_Worker-3] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
05:10:20.014 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJob - jobDetail info end

05:10:20.015 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
05:10:20.015 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 05:10:20
05:10:20.015 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJob - job count:2
```

# trigger

![](/images/2024-09-22-quartz-base/001.png)

# cron 表达式

## 语法格式

1. 秒 
2. 分钟 
3. 小时 
4. 月中的天 
5. 月
6. 周中的天
7. 年

## 各部分取值范围
|字段|是否必填|允许值|运行的特殊字符|
|--|--|--|--|
|秒|是|0-59|`,` `-` `*`  `/`|
|分|是|0-59|`,` `-` `*`  `/`|
|小时|是|0-23|`,` `-` `*`  `/`|
|日|是|1-31|`,` `-` `*`  `/` `?` `L` `W` `C`|
|月|是|1-12或者 JAN-DEC|`,` `*`  `/`|
|周|是|1-7或者 SUN-SAT|`,` `-` `*`  `/` `L` `#` `C`|
|年|否|不写或者 1970-2099|`,` `-` `*` `/`|

## 特殊符号含义

|特殊符号 | 含义 | 解释说明
|:--:|:--:|:--:|
|*|表示匹配该域的任意值|如果在 Minutes 域使用 * , 则表示每分钟都会触发事件。|
|,|表示列出枚举值 |如果在Hours 域中使用 9,10 则表示上午9点和10点会出发事件。|
|-|表示范围 |如果在 Seconds 域中使用 5-8 ，则表示 5秒、6秒、7秒、8秒 时间点会触发事件|
|/|表示起始时间开始触发，然后每隔固定时间触发一次 |如果在 Seconds 域中使用 6/10 ，则表示从06秒开始，每10秒执行一次，即：会在 06,16,26,36,56时间点触发事件，也就是说：在 Seconds 域中配置 6/10 和 配置 06,16,26,36,56 效果一样|
|?|只能用在DayofMonth和DayofWeek两个域。它也匹配域的任意值，但实际不会。因为DayofMonth和DayofWeek会相互影响。（可以理解成是 * 的第二种特殊写法）|例如：15 30 12 9 * ? ，表示的是每月9号的中午12:30:15发工资，此时 DayofWeek 这个域就要用 ? 而不能用 *（表示每周每天，而我们只要9号一天）|
|L|表示最后Last，只能出现在 DayofWeek 和 DayofMonth 域。|① 用在DayofMonth 域中（直接写L），可以指定一个月的最后一天；② 用在 DayofWeek 域中指定当月最后一个星期X（比如：2L指本月最后一个星期二）|
|W|表示有效工作日(周一到周五),只能出现在DayofMonth域，系统将在离指定日期的最近的有效工作日触发事件 |例如：在 DayofMonth 使用5W，如果5日是星期六，则将在最近的工作日：星期五，即4日触发。如果5日是星期天，则在6日(周一)触发；如果5日在星期一到星期五中的一天，则就在5日触发。另外一点，W的最近寻找不会跨过月份 。|
|LW|这两个字符可以连用，表示在某个月最后一个工作日，即当月最后一个星期五。||
|C|代表“Calendar”的意思。但是没发现加C和不加C的区别。|例如：15 30 12 9 * ?，用9和9C的效果一样。|
|#|用于确定每个月第几个星期几，只能出现在DayofWeek域。|比如，4#2，表示某月的第二个星期三（4代表星期三，2代表第几个）。例如：15 30 12 ? * 4#2表示：每月第二个星期三的12:30:15秒执行


# quartz.properties
## 默认配置
```properties
#============================================================================
# Configure Main Scheduler Properties 调度器属性
#============================================================================
# 在集群中每个实例都必须有一个唯一的instanceId，但是应该有一个相同的instanceName【非必须】
org.quartz.scheduler.instanceName: DefaultQuartzScheduler
# Scheduler实例ID，全局唯一，【默认值NON_CLUSTERED】，或者可以使用“SYS_PROP”通过系统属性设置id。【非必须】
org.quartz.scheduler.instanceId = AUTO

org.quartz.scheduler.rmi.export: false
org.quartz.scheduler.rmi.proxy: false
org.quartz.scheduler.wrapJobExecutionInUserTransaction: false

#============================================================================
# 线程池属性
#============================================================================
# 自带的线程池
org.quartz.threadPool.class: org.quartz.simpl.SimpleThreadPool
# 处理 job 线程的个数
org.quartz.threadPool.threadCount: 10
# 线程优先级
org.quartz.threadPool.threadPriority: 5
org.quartz.threadPool.threadsInheritContextClassLoaderOfInitializingThread: true


org.quartz.jobStore.misfireThreshold: 60000

# 作业存储设置
org.quartz.jobStore.class: org.quartz.simpl.RAMJobStore
```

## 一个示例

```properties
# Default Properties file for use by StdSchedulerFactory
# to create a Quartz Scheduler Instance, if a different
# properties file is not explicitly specified.
#
# ===========================================================================
# Configure Main Scheduler Properties 调度器属性
# ===========================================================================
org.quartz.scheduler.instanceName: DefaultQuartzScheduler
#org.quartz.scheduler.instanceid:AUTO
org.quartz.scheduler.rmi.export: false
org.quartz.scheduler.rmi.proxy: false
org.quartz.scheduler.wrapJobExecutionInUserTransaction: false
# ===========================================================================  
# Configure ThreadPool 线程池属性  
# ===========================================================================
#线程池的实现类（一般使用SimpleThreadPool即可满足几乎所有用户的需求）
org.quartz.threadPool.class: org.quartz.simpl.SimpleThreadPool
#指定线程数，至少为1（无默认值）(一般设置为1-100直接的整数合适)
org.quartz.threadPool.threadCount: 10
#设置线程的优先级（最大为java.lang.Thread.MAX_PRIORITY 10，最小为Thread.MIN_PRIORITY 1，默认为5）
org.quartz.threadPool.threadPriority: 5
#设置SimpleThreadPool的一些属性
#设置是否为守护线程
#org.quartz.threadpool.makethreadsdaemons = false
#org.quartz.threadPool.threadsInheritContextClassLoaderOfInitializingThread: true
#org.quartz.threadpool.threadsinheritgroupofinitializingthread=false
#线程前缀默认值是：[Scheduler Name]_Worker
#org.quartz.threadpool.threadnameprefix=swhJobThead;
# 配置全局监听(TriggerListener,JobListener) 则应用程序可以接收和执行 预定的事件通知
# ===========================================================================
# Configuring a Global TriggerListener 配置全局的Trigger监听器
# MyTriggerListenerClass 类必须有一个无参数的构造函数，和 属性的set方法，目前2.2.x只支持原始数据类型的值（包括字符串）
# ===========================================================================
#org.quartz.triggerListener.NAME.class = com.swh.MyTriggerListenerClass
#org.quartz.triggerListener.NAME.propName = propValue
#org.quartz.triggerListener.NAME.prop2Name = prop2Value
# ===========================================================================
# Configuring a Global JobListener 配置全局的Job监听器
# MyJobListenerClass 类必须有一个无参数的构造函数，和 属性的set方法，目前2.2.x只支持原始数据类型的值（包括字符串）
# ===========================================================================
#org.quartz.jobListener.NAME.class = com.swh.MyJobListenerClass
#org.quartz.jobListener.NAME.propName = propValue
#org.quartz.jobListener.NAME.prop2Name = prop2Value
# ===========================================================================  
# Configure JobStore 存储调度信息（工作，触发器和日历等）
# ===========================================================================
# 信息保存时间 默认值60秒
org.quartz.jobStore.misfireThreshold: 60000
#保存job和Trigger的状态信息到内存中的类
org.quartz.jobStore.class: org.quartz.simpl.RAMJobStore
# ===========================================================================  
# Configure SchedulerPlugins 插件属性 配置
# ===========================================================================
# 自定义插件  
#org.quartz.plugin.NAME.class = com.swh.MyPluginClass
#org.quartz.plugin.NAME.propName = propValue
#org.quartz.plugin.NAME.prop2Name = prop2Value
#配置trigger执行历史日志（可以看到类的文档和参数列表）
org.quartz.plugin.triggHistory.class = org.quartz.plugins.history.LoggingTriggerHistoryPlugin  
org.quartz.plugin.triggHistory.triggerFiredMessage = Trigger {1}.{0} fired job {6}.{5} at: {4, date, HH:mm:ss MM/dd/yyyy}  
org.quartz.plugin.triggHistory.triggerCompleteMessage = Trigger {1}.{0} completed firing job {6}.{5} at {4, date, HH:mm:ss MM/dd/yyyy} with resulting trigger instruction code: {9}  
#配置job调度插件  quartz_jobs(jobs and triggers内容)的XML文档  
#加载 Job 和 Trigger 信息的类   （1.8之前用：org.quartz.plugins.xml.JobInitializationPlugin）
org.quartz.plugin.jobInitializer.class = org.quartz.plugins.xml.XMLSchedulingDataProcessorPlugin
#指定存放调度器(Job 和 Trigger)信息的xml文件，默认是classpath下quartz_jobs.xml
org.quartz.plugin.jobInitializer.fileNames = my_quartz_job2.xml  
#org.quartz.plugin.jobInitializer.overWriteExistingJobs = false  
org.quartz.plugin.jobInitializer.failOnFileNotFound = true  
#自动扫描任务单并发现改动的时间间隔,单位为秒
org.quartz.plugin.jobInitializer.scanInterval = 10
#覆盖任务调度器中同名的jobDetail,避免只修改了CronExpression所造成的不能重新生效情况
org.quartz.plugin.jobInitializer.wrapInUserTransaction = false
# ===========================================================================  
# Sample configuration of ShutdownHookPlugin  ShutdownHookPlugin插件的配置样例
# ===========================================================================
#org.quartz.plugin.shutdownhook.class = \org.quartz.plugins.management.ShutdownHookPlugin
#org.quartz.plugin.shutdownhook.cleanShutdown = true
#
# Configure RMI Settings 远程服务调用配置
#
#如果你想quartz-scheduler出口本身通过RMI作为服务器，然后设置“出口”标志true(默认值为false)。
#org.quartz.scheduler.rmi.export = false
#主机上rmi注册表(默认值localhost)
#org.quartz.scheduler.rmi.registryhost = localhost
#注册监听端口号（默认值1099）
#org.quartz.scheduler.rmi.registryport = 1099
#创建rmi注册，false/never：如果你已经有一个在运行或不想进行创建注册
# true/as_needed:第一次尝试使用现有的注册，然后再回来进行创建
# always:先进行创建一个注册，然后再使用回来使用注册
#org.quartz.scheduler.rmi.createregistry = never
#Quartz Scheduler服务端端口，默认是随机分配RMI注册表
#org.quartz.scheduler.rmi.serverport = 1098
#true:链接远程服务调度(客户端),这个也要指定registryhost和registryport，默认为false
# 如果export和proxy同时指定为true，则export的设置将被忽略
#org.quartz.scheduler.rmi.proxy = false
```


# 监听器

全局监听器与非全局监听器的区别: 全局监听器能否接受所有的 job/trigger 的事件通知, 非全局监听器只能接受到在其上注册的 job 或 trigger 事件

## JobListener
### 接口含义
```java
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public interface JobListener {

    /**
     * 获取该 JobListener 名称
     */
    String getName();

    /**
     * Scheduler 在 JobDetail 将要被执行时调用这个方法
     */
    void jobToBeExecuted(JobExecutionContext context);

    /**
     * Scheduler在 JobDetail 即将被执行, 但又被 TriggerListener 否决时调用该方法
     */
    void jobExecutionVetoed(JobExecutionContext context);

    /**
     * Scheduler 在 JobDetail 被执行后调用这个方法
     */
    void jobWasExecuted(JobExecutionContext context,
                        JobExecutionException jobException);

}
```

### 示例
#### JobListener
```java
package com.laolang.jx.job;

import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;

@Slf4j
public class HelloJobListener implements JobListener {
    @Override
    public String getName() {
        return "HelloJobListener";
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
        log.info("HelloJobListener jobToBeExecuted");
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
        log.info("HelloJobListener jobExecutionVetoed");
    }

    @Override
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
        log.info("HelloJobListener jobWasExecuted");
    }
}

```
#### 定义 job
```java
package com.laolang.jx;

import com.laolang.jx.job.HelloJob;
import com.laolang.jx.job.HelloJobListener;
import lombok.extern.slf4j.Slf4j;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.impl.matchers.KeyMatcher;

@Slf4j
public class QuartzHelloApp {
    public static void main(String[] args) throws SchedulerException {
        Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

        // 任务参数
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("count", 0);

        JobDetail jobDetail = JobBuilder.newJob(HelloJob.class)
                // 任务参数
                .usingJobData(jobDataMap)
                .withIdentity("job-hello", "job-group-hello")
                .build();
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger-hello", "trigger-group-hello")
                .startNow()
                .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
                .build();

        scheduler.scheduleJob(jobDetail, trigger);

        // 全局监听
        // scheduler.getListenerManager().addJobListener(new HelloJobListener(), EverythingMatcher.allJobs());
        scheduler.getListenerManager().addJobListener(new HelloJobListener(), KeyMatcher.keyEquals(JobKey.jobKey("job-hello", "job-group-hello")));

        scheduler.start();
    }
}
```

#### 运行效果
```
07:35:05.007 [DefaultQuartzScheduler_QuartzSchedulerThread] INFO com.laolang.jx.job.HelloJob - 初始化 job
07:35:05.007 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJobListener - HelloJobListener jobToBeExecuted
07:35:05.008 [DefaultQuartzScheduler_Worker-3] DEBUG org.quartz.core.JobRunShell - Calling execute on job job-group-hello.job-hello
07:35:05.008 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJob - jobDetail info end

07:35:05.008 [DefaultQuartzScheduler_QuartzSchedulerThread] DEBUG org.quartz.core.QuartzSchedulerThread - batch acquisition of 1 triggers
07:35:05.008 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJob - job 过程:2024-08-17 07:35:05
07:35:05.008 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJob - job count:2
07:35:05.008 [DefaultQuartzScheduler_Worker-3] INFO com.laolang.jx.job.HelloJobListener - HelloJobListener jobWasExecuted
```

## TriggerListener

### 接口含义
```java
package com.laolang.jx.job;

import org.quartz.Trigger.CompletedExecutionInstruction;

public interface TriggerListener {

    /**
     * 获取触发器的名称
     */
    String getName();

    /**
     * 当与监听器相关联的Trigger被触发，Job上的execute()方法将被执行时，Scheduler就调用该方法
     */
    void triggerFired(Trigger trigger, JobExecutionContext context);

    /**
     * 在 Trigger 触发后，Job 将要被执行时由 Scheduler 调用这个方法。
     * TriggerListener 给了一个选择去否决 Job 的执行。假如这个方法返回 true，
     * 这个 Job 将不会为此次 Trigger 触发而得到执行
     */
    boolean vetoJobExecution(Trigger trigger, JobExecutionContext context);

    /**
     * Scheduler 调用这个方法是在 Trigger 错过触发时。
     * 你应该关注此方法中持续时间长的逻辑：
     * 在出现许多错过触发的 Trigger 时，长逻辑会导致骨牌效应。你应当保持这上方法尽量的小
     */
    void triggerMisfired(Trigger trigger);

    /**
     * Trigger 被触发并且完成了 Job 的执行时，Scheduler 调用这个方法
     */
    void triggerComplete(Trigger trigger, JobExecutionContext context,
                         CompletedExecutionInstruction triggerInstructionCode);

}
```


## SchedulerListener

### 接口含义
```java
package com.laolang.jx.job;


public interface SchedulerListener {

    /**
     * 用于部署JobDetail时调用
     */
    void jobScheduled(Trigger trigger);

    /**
     * 用于卸载JobDetail时调用
     */
    void jobUnscheduled(TriggerKey triggerKey);

    /**
     * 当一个 Trigger 来到了再也不会触发的状态时调用这个方法。
     * 除非这个 Job 已设置成了持久性，否则它就会从 Scheduler 中移除。
     */
    void triggerFinalized(Trigger trigger);

    /**
     * Scheduler 调用这个方法是发生在一个 Trigger 或 Trigger 组被暂停时。
     * 假如是 Trigger 组的话，triggerName 参数将为 null。
     */
    void triggerPaused(TriggerKey triggerKey);

    /**
     *
     */
    void triggersPaused(String triggerGroup);

    /**
     * Scheduler 调用这个方法是发生成一个 Trigger 或 Trigger 组从暂停中恢复时。
     * 假如是 Trigger 组的话，假如是 Trigger 组的话，triggerName 参数将为 null。参数将为 null。
     */
    void triggerResumed(TriggerKey triggerKey);

    /**
     *
     */
    void triggersResumed(String triggerGroup);

    /**
     *
     */
    void jobAdded(JobDetail jobDetail);

    /**
     *
     */
    void jobDeleted(JobKey jobKey);

    /**
     * 当一个或一组 JobDetail 暂停时调用这个方法。
     */
    void jobPaused(JobKey jobKey);

    /**
     *
     */
    void jobsPaused(String jobGroup);

    /**
     * 当一个或一组 Job 从暂停上恢复时调用这个方法。假如是一个 Job 组，jobName 参数将为 null。
     */
    void jobResumed(JobKey jobKey);

    /**
     *
     */
    void jobsResumed(String jobGroup);

    /**
     * 在 Scheduler 的正常运行期间产生一个严重错误时调用这个方法。
     */
    void schedulerError(String msg, SchedulerException cause);

    /**
     * 当Scheduler处于StandBy模式时，调用该方法
     */
    void schedulerInStandbyMode();

    /**
     * 当Scheduler 开启时，调用该方法
     */
    void schedulerStarted();

    /**
     *
     */
    void schedulerStarting();

    /**
     * 当Scheduler停止时，调用该方法
     */
    void schedulerShutdown();

    /**
     *
     */
    void schedulerShuttingdown();

    /**
     * 当Scheduler中的数据被清除时，调用该方法。
     */
    void schedulingDataCleared();
}
```

# spring boot 整合 quartz

## pom.xml
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```

## 基本配置

### job
```java
package com.laolang.jx.modules.system.job;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import com.laolang.jx.modules.system.logic.SysDictLogic;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
@Slf4j
public class SystemJob extends QuartzJobBean {

    private final SysDictLogic sysDictLogic;

    public static final String JOB_NAME = "quartz_jobdetail_system";
    public static final String JOB_GROUP = "quartz_jobdetail_system_group";

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        log.info("job 过程:{}", DateUtil.format(new Date(), DatePattern.NORM_DATETIME_PATTERN));
        sysDictLogic.save();
    }
}
```

### quartz 配置
```java
package com.laolang.jx.config.quartz;

import com.laolang.jx.modules.system.job.SystemJob;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JxQuartzConfiguration {

    @Bean
    public JobDetail systemJobDetail() {
        return JobBuilder.newJob(SystemJob.class)
                .withIdentity(SystemJob.JOB_NAME, SystemJob.JOB_GROUP)
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger systemJobTrigger() {
        return TriggerBuilder.newTrigger().forJob(systemJobDetail())
                .withIdentity("quartz_jobdetail_system_trigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
                .build();
    }
}
```

### 运行效果
```
12:29:40.009 [ quartzScheduler_Worker-2] INFO  com.laolang.jx.modules.system.job.SystemJob.executeInternal(SystemJob.java:26) - job 过程:2024-08-17 12:29:40
12:29:40.011 [ quartzScheduler_Worker-2] INFO  com.laolang.jx.modules.system.logic.SysDictLogic.save(SysDictLogic.java:11) - sysdict save
12:29:45.008 [ quartzScheduler_Worker-3] INFO  com.laolang.jx.modules.system.job.SystemJob.executeInternal(SystemJob.java:26) - job 过程:2024-08-17 12:29:45
12:29:45.008 [ quartzScheduler_Worker-3] INFO  com.laolang.jx.modules.system.logic.SysDictLogic.save(SysDictLogic.java:11) - sysdict save
12:29:50.018 [ quartzScheduler_Worker-4] INFO  com.laolang.jx.modules.system.job.SystemJob.executeInternal(SystemJob.java:26) - job 过程:2024-08-17 12:29:50
12:29:50.018 [ quartzScheduler_Worker-4] INFO  com.laolang.jx.modules.system.logic.SysDictLogic.save(SysDictLogic.java:11) - sysdict save
```


## 数据库持久化

### 数据库脚本

查看 `quartz` 版本,我的版本是 `2.3.2`

![](/images/2024-09-22-quartz-base/002.png)

可以在 jar 包中获取脚本: org/quartz/impl/jdbcjobstore/tables_mysql_innodb.sql

### application.yml
```yaml
server:
  port: 8092
  servlet:
    context-path: /

spring:
  application:
    name: jx-boot
  datasource:
    driverClassName: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/quartz_study?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
    username: root
    password: root
    # 初始连接数
    initialSize: 5
    # 最小连接池数量
    minIdle: 10
    # 最大连接池数量
    maxActive: 20
    # 配置获取连接等待超时的时间
    maxWait: 60000
    # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
    timeBetweenEvictionRunsMillis: 60000
    # 配置一个连接在池中最小生存的时间，单位是毫秒
    minEvictableIdleTimeMillis: 300000
    # 配置一个连接在池中最大生存的时间，单位是毫秒
    maxEvictableIdleTimeMillis: 900000
    # 配置检测连接是否有效
    validationQuery: SELECT 1 FROM DUAL
    testWhileIdle: true
    testOnBorrow: false
    testOnReturn: false
    webStatFilter:
      enabled: true
    statViewServlet:
      enabled: true
      # 设置白名单，不填则允许所有访问
      allow:
      url-pattern: /druid/*
      # 控制台管理用户名和密码
      login-username: ruoyi
      login-password: 123456
    filter:
      stat:
        enabled: true
        # 慢SQL记录
        log-slow-sql: true
        slow-sql-millis: 1000
        merge-sql: true
      wall:
        config:
          multi-statement-allow: true
  #属性配置文档 https://github.com/quartz-scheduler/quartz/blob/master/docs/configuration.adoc
  quartz:
    #持久化到数据库方式, 另一种是 memory, 即内存
    job-store-type: jdbc
    #quartz调度程序属性
    properties:
      org:
        quartz:
          scheduler:
            #调度任务实例名称，如果是集群则每个实例必须是相同的名字
            instanceName: SmallGrainScheduler
            #实例ID，对于集群中工作的所有调度器必须是唯一的，如果值是AUTO则会自动生成，如果希望值来自系统属性则设置为SYS_PROP
            instanceId: AUTO
          jobStore:
            #job、traggers、calendars持久化实现类，默认：org.quartz.simpl.RAMJobStore
            class: org.quartz.impl.jdbcjobstore.JobStoreTX
            #调度程序下次触发时间的毫秒数，默认是60000（60 seconds）
            misfireThreshold: 60000
            #驱动程序代理类
            driverDelegateClass: org.quartz.impl.jdbcjobstore.StdJDBCDelegate
            #表名前缀，默认：QRTZ_
            tablePrefix: qrtz_
            #默认：false，设置JDBCJobStore的JobDataMaps中存储的是字符串类型的key-value,否则为 true
            useProperties: false
            #设置为true以启用集群功能，如果Quartz的多个实例使用同一组数据库表，则必须将此属性设置为true,否则将遇到严重的破话，默认：false
            isClustered: true
            #设置此实例与集群的其它实例"checks-in"的频率（毫秒），影响实例的检测失败速率，默认：15000
            clusterCheckinInterval: 10000
          #配置线程池
          threadPool:
            #要使用的线程池实心名称，与Quartz自带的线程池应该可以满足几乎每个用户的需求，它的行为非常简单，而且已经过很好的测试，它提供了一个固定大小的线程池，这些线程在调度程序的生存期内"生存"
            class: org.quartz.simpl.SimpleThreadPool
            #线程数
            threadCount: 10
            #线程优先级，可以是Thread.MIN_PRIORITY（1）和Thread.MAX_PRIORITY（10）之间的数据，默认是：Thread.NORM_PRIORITY (5)
            threadPriority: 5
            #可以设置为true以将线程池中的线程创建为守护程序线程。默认：false
            makeThreadsDaemons: false
            #线程池中线程名的前缀,默认：MyScheduler_Worker
            threadNamePrefix: MyScheduler_Worker
            #默认true
            threadsInheritGroupOfInitializingThread: true
            #默认true
            threadsInheritContextClassLoaderOfInitializingThread: true
    jdbc:
      # always 会清空数据并重新建表
      initialize-schema: never
      #初始化数据库脚本路径，默认使用classpath:org/quartz/impl/jdbcjobstore/tables_@@platform@@.sql路径下的脚本
      # schema: classpath:tables_mysql.sql




logging:
  config: classpath:log4j2.xml

mybatis-plus:
  mapper-locations: classpath*:mapping/**/*Mapper.xml
  type-aliases-package: com.laolang.jx.**.entity
  global-config:
    db-config:
      id-type: auto
      select-strategy: not_empty
      insert-strategy: not_empty
      update-strategy: not_empty
      refresh-mapper: true
      db-type: mysql
      logic-delete-field: deleted
      logic-delete-value: 1 # 逻辑已删除值(默认为 1)
      logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: false
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### job 配置
```java
package com.laolang.jx.config.quartz;

import com.laolang.jx.modules.system.job.SystemJob;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JxQuartzConfiguration {

    @Bean
    public JobDetail systemJobDetail() {
        return JobBuilder.newJob(SystemJob.class)
                // 任务名称和任务分组, 组成任务唯一标识
                .withIdentity(SystemJob.JOB_NAME, SystemJob.JOB_GROUP)
                // 是否持久化
                .storeDurably()
                // 任务描述
                .withDescription("一个测试任务")
                .build();
    }

    @Bean
    public Trigger systemJobTrigger() {
        return TriggerBuilder.newTrigger().forJob(systemJobDetail())
                .withIdentity("quartz_jobdetail_system_trigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
                .build();
    }
}
```

### 数据库内容

![](/images/2024-09-22-quartz-base/003.png)
![](/images/2024-09-22-quartz-base/004.png)
![](/images/2024-09-22-quartz-base/005.png)
