# 项目后端搭建

## 服务划分

### 后端服务规划

---

| 服务名称                       | 端口号     | 功能描述     | 核心分类  |
|----------------------------|---------|----------|-------|
| **xuebay-gateway-service** | `10010` | 服务网关     | 基础设施  |
| **xuebay-uaa-service**     | `10040` | 认证授权服务   | 安全/认证 |
| **xuebay-system-service**  | `10020` | 系统管理服务   | 系统管理  |
| **xuebay-user-service**    | `10030` | 用户中心服务   | 核心业务  |
| **xuebay-course-service**  | `10050` | 课程内容服务   | 核心业务  |
| **xuebay-order-service**   | `10100` | 订单处理服务   | 交易业务  |
| **xuebay-pay-service**     | `10110` | 支付平台服务   | 交易业务  |
| **xuebay-cart-service**    | `10140` | 购物车服务    | 交易业务  |
| **xuebay-kill-service**    | `10120` | 秒杀/限时购服务 | 促销业务  |
| **xuebay-search-service**  | `10080` | 全文搜索服务   | 功能支撑  |
| **xuebay-message-service** | `10090` | 消息通知服务   | 功能支撑  |
| **xuebay-file-service**    | `10060` | 资源文件服务   | 资源管理  |
| **xuebay-media-service**   | `10070` | 视频/多媒体服务 | 资源管理  |
| **xuebay-xxljob-service**  | `10150` | 分布式定时任务  | 任务调度  |
| **xuebay-common-service**  | `10130` | 公共基础服务   | 基础设施  |

---

### 前端站点规划

| 服务名              | 端口   | 备注     |
|------------------|------|--------|
| xuebay-system-ui | 6001 | 系统管理前端 |
| xuebay-course-ui | 6002 | 门户课程站点 |
| xuebay-user-ui   | 6003 | 门户用户站点 |

## 项目结构

项目使用SpringBoot父子聚合工程，项目结构如下：

```Plaintext
xuebay
├── project-basic                    // 项目基础通用组件 (二方库)
│   ├── project-basic-common         // 跨项目通用的工具类、基础定义
│   └── project-code-gen             // 通用的代码生成器模块
├── xuebay-basic                     // 当前项目的基础支撑
│   ├── xuebay-basic-cache           // 缓存统一处理模块 (Redis等)
│   ├── xuebay-basic-common          // 本项目特有的公共代码、工具类
│   └── xuebay-basic-dependency      // 项目公共依赖管理
│       ├── xuebay-basic-mybatisplus-dependency
│       ├── xuebay-basic-openfeign-dependency
│       └── xuebay-basic-web-dependency
├── xuebay-model                     // 对象模型模块
│   ├── xuebay-cart-model            // 购物车模块数据模型
│   ├── xuebay-common-model          // 公共模块数据模型
│   ├── xuebay-course-model          // 课程模块数据模型
│   ├── xuebay-kill-model            // 秒杀模块数据模型
│   ├── xuebay-media-model           // 媒体模块数据模型
│   ├── xuebay-order-model           // 订单模块数据模型
│   ├── xuebay-pay-model             // 支付模块数据模型
│   ├── xuebay-search-model          // 搜索模块数据模型
│   ├── xuebay-system-model          // 系统模块数据模型
│   ├── xuebay-uaa-model             // 认证模块数据模型
│   ├── xuebay-user-model            // 用户模块数据模型
│   └── xuebay-xxljob-model          // 定时任务模块数据模型
├── xuebay-api                       // 服务间调用接口 (Feign Client)
│   ├── xuebay-course-api            // 课程服务对外暴露的 Feign 接口
│   ├── xuebay-media-api             // 媒体服务对外暴露的 Feign 接口
│   ├── xuebay-order-api             // 订单服务对外暴露的 Feign 接口
│   ├── xuebay-search-api            // 搜索服务对外暴露的 Feign 接口
│   └── xuebay-uaa-api               // 认证服务对外暴露的 Feign 接口
├── xuebay-service                   // 微服务业务实现层 (Controller/Service/Mapper)
│   ├── xuebay-cart-service          // 购物车微服务
│   ├── xuebay-common-service        // 公共微服务
│   ├── xuebay-course-service        // 课程微服务
│   ├── xuebay-file-service          // 文件微服务
│   ├── xuebay-kill-service          // 秒杀微服务
│   ├── xuebay-media-service         // 媒体微服务
│   ├── xuebay-message-service       // 消息微服务
│   ├── xuebay-order-service         // 订单微服务
│   ├── xuebay-pay-service           // 支付微服务
│   ├── xuebay-search-service        // 搜索微服务
│   ├── xuebay-system-service        // 系统管理微服务
│   ├── xuebay-uaa-service           // 认证授权微服务
│   ├── xuebay-user-service          // 用户中心微服务
│   └── xuebay-xxljob-service        // 分布式定时任务服务
├── xuebay-support                   // 系统支撑服务
│   └── xuebay-gateway-service       // 微服务统一网关
├── xuebay-ui                        // 前端站点项目
│   ├── xuebay-course-ui             // 课程门户前端
│   ├── xuebay-system-ui             // 后台管理系统前端
│   └── xuebay-user-ui               // 用户中心前端
└── pom.xml                          // 父工程 Maven 配置
```

【`特别注意`】项目搭建完成之后做如下检查

- 项目采用 pom 父子模块进行构建

    - 在一级 pom 中管理 SpringBoot 和 SpringCloud 依赖以及公共依赖

    - 二级不管理 pom，不导入任何依赖

    - 三级导入项目本身需要的依赖

    - 一级和二级的 pom 中 `<packaging>pom</packaging>`

    - 三级的 packaging 应该是 `<packaging>jar</packaging>`

## 父工程搭建 ( Root POM)

父工程 xuebay 主要负责`版本统一管理`、`依赖聚合`以及`全局环境配置`。其打包方式必须为 pom，同时移除 src 目录。

### 基础配置

继承 SpringBoot 官方父工程，锁定基础框架版本。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <!-- 项目基本信息 -->
    <groupId>com.zhc</groupId>
    <artifactId>xuebay</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 打包方式 -->
    <packaging>pom</packaging>

    <!-- 继承父工程 -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <!-- 项目核心版本号确定 -->
        <version>3.0.2</version>
    </parent>

</project>
```
### 版本号管理

- 父工程继承 spring-boot-starter-parent

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.zhc</groupId>
  <artifactId>xuebay</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>pom</packaging>

  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

    <!-- 内部版本号维护 -->
    <project-basic.version>1.0-SNAPSHOP</project-basic.version>
    <project-basic-code-gen.version>1.0-SNAPSHOT</project-basic-code-gen.version>
    <project-basic-common.version>1.0-SNAPSHOT</project-basic-common.version>

    <xuebay-api.version>1.0-SNAPSHOT</xuebay-api.version>
    <xuebay-course-api.version>1.0-SNAPSHOT</xuebay-course-api.version>
    <xuebay-media-api.version>1.0-SNAPSHOT</xuebay-media-api.version>
    <xuebay-search-api.version>1.0-SNAPSHOT</xuebay-search-api.version>
    <xuebay-uaa-api.version>1.0-SNAPSHOT</xuebay-uaa-api.version>

    <xuebay-basic.version>1.0-SNAPSHOT</xuebay-basic.version>
    <xuebay-basic-cache.version>1.0-SNAPSHOT</xuebay-basic-cache.version>
    <xuebay-basic-common.version>1.0-SNAPSHOT</xuebay-basic-common.version>
    <xuabay-basic-dependency.version>1.0-SNAPSHOT</xuabay-basic-dependency.version>
    <xuabay-basic-dependency-web.version>1.0-SNAPSHOT</xuabay-basic-dependency-web.version>
    <xuabay-basic-dependency-mybatisplus.version>1.0-SNAPSHOT</xuabay-basic-dependency-mybatisplus.version>
    <xuabay-basic-dependency-openfeign.version>1.0-SNAPSHOT</xuabay-basic-dependency-openfeign.version>

    <xuebay-model.version>1.0-SNAPSHOT</xuebay-model.version>
    <xuebay-cart-model.version>1.0-SNAPSHOT</xuebay-cart-model.version>
    <xuebay-common-model.version>1.0-SNAPSHOT</xuebay-common-model.version>
    <xuebay-course-model.version>1.0-SNAPSHOT</xuebay-course-model.version>
    <xuebay-kill-model.version>1.0-SNAPSHOT</xuebay-kill-model.version>
    <xuebay-media-model.version>1.0-SNAPSHOT</xuebay-media-model.version>
    <xuebay-order-model.version>1.0-SNAPSHOT</xuebay-order-model.version>
    <xuebay-pay-model.version>1.0-SNAPSHOT</xuebay-pay-model.version>
    <xuebay-search-model.version>1.0-SNAPSHOT</xuebay-search-model.version>
    <xuebay-system-model.version>1.0-SNAPSHOT</xuebay-system-model.version>
    <xuebay-uaa-model.version>1.0-SNAPSHOT</xuebay-uaa-model.version>
    <xuebay-user-model.version>1.0-SNAPSHOT</xuebay-user-model.version>
    <xuebay-xxljob-model.version>1.0-SNAPSHOT</xuebay-xxljob-model.version>

    <xuebay-service.version>1.0-SNAPSHOT</xuebay-service.version>
    <xuebay-course-service.version>1.0-SNAPSHOT</xuebay-course-service.version>
    <xuebay-file-service.version>1.0-SNAPSHOT</xuebay-file-service.version>
    <xuebay-kill-service.version>1.0-SNAPSHOT</xuebay-kill-service.version>
    <xuebay-media-service.version>1.0-SNAPSHOT</xuebay-media-service.version>
    <xuebay-message-service.version>1.0-SNAPSHOT</xuebay-message-service.version>
    <xuebay-order-service.version>1.0-SNAPSHOT</xuebay-order-service.version>
    <xuebay-pay-service.version>1.0-SNAPSHOT</xuebay-pay-service.version>
    <xuebay-search-service.version>1.0-SNAPSHOT</xuebay-search-service.version>
    <xuebay-system-service.version>1.0-SNAPSHOT</xuebay-system-service.version>
    <xuebay-uaa-service.version>1.0-SNAPSHOT</xuebay-uaa-service.version>
    <xuebay-user-service.version>1.0-SNAPSHOT</xuebay-user-service.version>

    <xuebay-support.version>1.0-SNAPSHOT</xuebay-support.version>
    <xuebay-gateway-service.version>1.0-SNAPSHOT</xuebay-gateway-service.version>

    <!-- 依赖版本维护 -->
    <spring-cloud.version>2022.0.0</spring-cloud.version>
    <spring-cloud-alibaba.version>2022.0.0.0-RC2</spring-cloud-alibaba.version>
    <rocketmq-spring-boot-starter.version>2.3.0</rocketmq-spring-boot-starter.version>
    <spring-cloud-starter-loadbalancer.version>3.1.5</spring-cloud-starter-loadbalancer.version>

    <lombok.version>1.18.34</lombok.version>
    <fastjson.version>1.2.83</fastjson.version>
    <fastjson2.version>2.0.57</fastjson2.version>
    <hutool-all.version>5.8.40</hutool-all.version>

    <alipay-sdk-java.version>4.34.0.ALL</alipay-sdk-java.version>
    <druid.version>1.2.8</druid.version>
    <mysql.version>8.0.33</mysql.version>
    <mybatis-plus-jsqlparser.version>3.5.14</mybatis-plus-jsqlparser.version>
    <mybatis-plus-generator.version>3.5.14</mybatis-plus-generator.version>
    <mybatis-plus-annotation.version>3.5.14</mybatis-plus-annotation.version>
    <mybatis-plus-spring-boot3-starter.version>3.5.13</mybatis-plus-spring-boot3-starter.version>
    <velocity-engine-core.version>2.3</velocity-engine-core.version>

    <springdoc-openapi-starter-webmvc-ui.version>2.1.0</springdoc-openapi-starter-webmvc-ui.version>
    <springdoc-openapi-starter-webflux-ui.version>2.1.0</springdoc-openapi-starter-webflux-ui.version>

    <netty-resolver-dns-native-macos.version>4.1.75.Final</netty-resolver-dns-native-macos.version>
  </properties>
</project>
```
### 依赖预管理

`dependencyManagement` 仅声明版本，子模块在引用时无需写版本号，从而保证全项目依赖一致性。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.zhc</groupId>
  <artifactId>xuebay</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>pom</packaging>

  <dependencyManagement>
    <dependencies>
      <!-- ========================================= -->
      <!-- 基础模块 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>project-basic</artifactId>
        <version>${project-basic.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>project-basic-code-gen</artifactId>
        <version>${project-basic-code-gen.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>project-basic-common</artifactId>
        <version>${project-basic-common.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- API 模块 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-api</artifactId>
        <version>${xuebay-api.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-course-api</artifactId>
        <version>${xuebay-course-api.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-media-api</artifactId>
        <version>${xuebay-media-api.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-search-api</artifactId>
        <version>${xuebay-search-api.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-uaa-api</artifactId>
        <version>${xuebay-uaa-api.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- 基础组件模块 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic</artifactId>
        <version>${xuebay-basic.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-cache</artifactId>
        <version>${xuebay-basic-cache.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-common</artifactId>
        <version>${xuebay-basic-common.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-dependency</artifactId>
        <version>${xuabay-basic-dependency.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-mybatisplus-dependency</artifactId>
        <version>${xuabay-basic-dependency-mybatisplus.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-web-dependency</artifactId>
        <version>${xuabay-basic-dependency-web.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- Model 模块 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-model</artifactId>
        <version>${xuebay-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-cart-model</artifactId>
        <version>${xuebay-cart-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-common-model</artifactId>
        <version>${xuebay-common-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-course-model</artifactId>
        <version>${xuebay-course-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-kill-model</artifactId>
        <version>${xuebay-kill-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-media-model</artifactId>
        <version>${xuebay-media-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-order-model</artifactId>
        <version>${xuebay-order-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-pay-model</artifactId>
        <version>${xuebay-pay-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-search-model</artifactId>
        <version>${xuebay-search-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-system-model</artifactId>
        <version>${xuebay-system-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-uaa-model</artifactId>
        <version>${xuebay-uaa-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-user-model</artifactId>
        <version>${xuebay-user-model.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-xxljob-model</artifactId>
        <version>${xuebay-xxljob-model.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- Service 模块 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-service</artifactId>
        <version>${xuebay-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-course-service</artifactId>
        <version>${xuebay-course-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-file-service</artifactId>
        <version>${xuebay-file-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-kill-service</artifactId>
        <version>${xuebay-kill-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-media-service</artifactId>
        <version>${xuebay-media-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-message-service</artifactId>
        <version>${xuebay-message-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-order-service</artifactId>
        <version>${xuebay-order-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-pay-service</artifactId>
        <version>${xuebay-pay-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-search-service</artifactId>
        <version>${xuebay-search-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-system-service</artifactId>
        <version>${xuebay-system-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-uaa-service</artifactId>
        <version>${xuebay-uaa-service.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-user-service</artifactId>
        <version>${xuebay-user-service.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- Support 模块 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-support</artifactId>
        <version>${xuebay-support.version}</version>
      </dependency>
      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-gateway-service</artifactId>
        <version>${xuebay-gateway-service.version}</version>
      </dependency>
      <!-- ========================================= -->
      <!-- Spring Cloud 系列 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>${spring-cloud.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>

      <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-alibaba-dependencies</artifactId>
        <version>${spring-cloud-alibaba.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>

      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
        <version>${spring-cloud-starter-loadbalancer.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- 数据库 & ORM 框架 -->
      <!-- ========================================= -->
      <!-- MyBatis Plus -->
      <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-annotation</artifactId>
        <version>${mybatis-plus-annotation.version}</version>
      </dependency>
      <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-generator</artifactId>
        <version>${mybatis-plus-generator.version}</version>
      </dependency>
      <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-jsqlparser</artifactId>
        <version>${mybatis-plus-jsqlparser.version}</version>
      </dependency>
      <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
        <version>${mybatis-plus-spring-boot3-starter.version}</version>
      </dependency>
      <dependency>
        <groupId>org.apache.velocity</groupId>
        <artifactId>velocity-engine-core</artifactId>
        <version>${velocity-engine-core.version}</version>
      </dependency>
      <!-- Druid 连接池 -->
      <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>${druid.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- JSON 处理工具 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.alibaba.fastjson2</groupId>
        <artifactId>fastjson2</artifactId>
        <version>${fastjson2.version}</version>
      </dependency>

      <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>${fastjson.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- 工具类库 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
        <version>${hutool-all.version}</version>
      </dependency>

      <!-- Lombok -->
      <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
        <scope>provided</scope>
      </dependency>

      <!-- ========================================= -->
      <!-- API 文档工具 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>${springdoc-openapi-starter-webmvc-ui.version}</version>
      </dependency>
      <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
        <version>${springdoc-openapi-starter-webflux-ui.version}</version>
      </dependency>

      <!-- ========================================= -->
      <!-- 数据库驱动 -->
      <!-- ========================================= -->
      <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>${mysql.version}</version>
        <scope>runtime</scope>
      </dependency>
      <!-- Netty DNS 解析器 macOS 原生库 -->
      <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty-resolver-dns-native-macos</artifactId>
        <version>${netty-resolver-dns-native-macos.version}</version>
        <!-- 用于 Apple Silicon M1/M2 -->
        <classifier>osx-aarch_64</classifier>
        <!-- 如果是 Intel Mac，使用 osx-x86_64 -->
        <!-- <classifier>osx-x86_64</classifier> -->
        <optional>true</optional>
      </dependency>

      <dependency>
        <groupId>org.apache.rocketmq</groupId>
        <artifactId>rocketmq-spring-boot-starter</artifactId>
        <version>${rocketmq-spring-boot-starter.version}</version>
      </dependency>

      <dependency>
        <groupId>com.zhc</groupId>
        <artifactId>xuebay-basic-openfeign-dependency</artifactId>
        <version>${xuabay-basic-dependency-openfeign.version}</version>
      </dependency>
      <dependency>
        <groupId>com.alipay.sdk</groupId>
        <artifactId>alipay-sdk-java</artifactId>
        <version>${alipay-sdk-java.version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
      <groupId>com.alibaba.fastjson2</groupId>
      <artifactId>fastjson2</artifactId>
    </dependency>
    <dependency>
      <groupId>cn.hutool</groupId>
      <artifactId>hutool-all</artifactId>
      <scope>compile</scope>
    </dependency>
  </dependencies>
</project>
```

### 全局公共依赖

此处定义的依赖会被所有子模块强制继承。

```xml
<dependencies>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
  </dependency>
  <dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
  </dependency>
  <dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <scope>compile</scope>
  </dependency>
</dependencies>
```