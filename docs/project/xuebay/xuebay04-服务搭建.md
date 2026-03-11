## 服务搭建

本小节我们将完成所有服务的基本搭建，创建本地、 nacos 配置文件，引入基础 web 依赖，并启动服务。这里以 `xuebay-system-service`
为例进行说明。

由于所有服务都需要使用 web 、 db 相关依赖，这里我们吧依赖统一引入到`xuebay-basic-web-dependency`内进行统一管理。

- xuebay/xuebay-basic/xuebay-basic-dependency/xuebay-basic-web-dependency/pom.xml

```xml

<dependencies>
    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
    <!-- mybatis-plus -->
    <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-mybatisplus-dependency</artifactId>
    </dependency>
</dependencies>
```

其中 `xuebay-basic-mybatisplus-dependency` 为数据库相关依赖。也是对依赖的统一管理。

- xuebay/xuebay-basic/xuebay-basic-dependency/xuebay-basic-mybatisplus-dependency/pom.xml

```xml

<dependencies>
    <!-- mybatis-plus -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    </dependency>
    <!-- mysql -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
    <!-- jsqlparser -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-jsqlparser</artifactId>
    </dependency>
    <!-- druid -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
    </dependency>
</dependencies>
```

## 引入依赖

我们只需要在 xuebay/xuebay-basic/xuebay-basic-dependency/xuebay-basic-web-dependency/pom.xml 中引入
`xuebay-basic-web-dependency` 即可。

```xml

<dependencies>
    <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-web-dependency</artifactId>
    </dependency>
</dependencies>
```

## 本地配置

- application.yml

```yml
server:
  port: 10020
spring:
  application:
    name: xuebay-system-service
  config:
    import:
      - nacos:${spring.application.name}.yml
  cloud:
    nacos:
      username: nacos
      password: nacos
      server-addr: ${your-nacos-server-host}:${your-nacos-server-port}
      discovery:
        namespace: ${your-xuebay-namespace}
      config:
        namespace: ${your-xuebay-namespace}
```

## 远程配置

在 nacos 中 \${your-xuebay-namespace} 下创建 data id 为 \${spring.application.name}.yml 的配置文件,配置数据源。

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root
    url: jdbc:mysql://${your-mysql-server-host}:${your-mysql-server-port}/xuebay-system?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true&useSSL=false
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      initial-size: 2

mybatis-plus:
  mapper-locations: classpath:com/zhc/mapper/*Mapper.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

```

## 启动类

```java
package com.zhc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class XuebaySystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(XuebaySystemApplication.class, args);
    }
}
```

其他服务按此模板搭建设即可。

