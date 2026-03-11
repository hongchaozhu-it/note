# 集成 Gateway 网关

## 1.导入依赖

[`注意`] 一定不能导入spring-boot-start-web包，会和gateway冲突

```xml

<dependencies>
    <!-- 基础启动器 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <!-- 网关 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <!-- 服务注册与发现中心 -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <!-- 配置中心 -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
    <!-- 负载均衡 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>
</dependencies>
```

## nacos 远程配置

- namespace: xuebay (命名空间)
- dataId: xuebay-gateway-service.yml

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: application-user
          uri: lb://xuebay-user-service
          predicates:
            - Path=/xuebay/user/**
          filters:
            - StripPrefix=2
        - id: application-uaa
          uri: lb://xuebay-uaa-service
          predicates:
            - Path=/xuebay/uaa/**
          filters:
            - StripPrefix=2
        - id: application-course
          uri: lb://xuebay-course-service
          predicates:
            - Path=/xuebay/course/**
          filters:
            - StripPrefix=2
        - id: application-system
          uri: lb://xuebay-system-service
          predicates:
            - Path=/xuebay/system/**
          filters:
            - StripPrefix=2
        - id: application-search
          uri: lb://xuebay-search-service
          predicates:
            - Path=/xuebay/search/**
          filters:
            - StripPrefix=2
        - id: application-pay
          uri: lb://xuebay-pay-service
          predicates:
            - Path=/xuebay/pay/**
          filters:
            - StripPrefix=2
        - id: application-order
          uri: lb://xuebay-order-service
          predicates:
            - Path=/xuebay/order/**
          filters:
            - StripPrefix=2
        - id: application-media
          uri: lb://xuebay-media-service
          predicates:
            - Path=/xuebay/media/**
          filters:
            - StripPrefix=2
        - id: application-kill
          uri: lb://xuebay-kill-service
          predicates:
            - Path=/xuebay/kill/**
          filters:
            - StripPrefix=2
        - id: application-common
          uri: lb://xuebay-common-service
          predicates:
            - Path=/xuebay/common/**
          filters:
            - StripPrefix=2
      #跨域配置      
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - "http://127.0.0.1:6001"
              - "http://localhost:6001"
              - "http://127.0.0.1:6002"
              - "http://localhost:6002"
              - "http://127.0.0.1:6003"
              - "http://localhost:6003"
            allow-credentials: true
            allowed-headers: "*"
            allowedMethods: "*"
```

## 创建application.yml

```yml
server:
  port: 10010
spring:
  application:
    name: xuebay-gateway-service
  config:
    import:
      - nacos:${spring.application.name}.yml
  cloud:
    nacos:
      server-addr: ${your-nacos-server-host}:${your-nacos-server-port}
      discovery:
        namespace: ${your-xuebay-namespace}
      config:
        namespace: ${your-xuebay-namespace}
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
```