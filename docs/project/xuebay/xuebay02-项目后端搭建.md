
## 三.项目架构搭建

### 1.项目规划

#### 1.1.服务划分

后端服务规划
---
| 服务名称 | 端口号 | 功能描述 | 核心分类 |
| --- | --- | --- | --- |
| **xuebay-gateway-service** | `10010` | 服务网关 | 基础设施 |
| **xuebay-uaa-service** | `10040` | 认证授权服务 | 安全/认证 |
| **xuebay-system-service** | `10020` | 系统管理服务 | 系统管理 |
| **xuebay-user-service** | `10030` | 用户中心服务 | 核心业务 |
| **xuebay-course-service** | `10050` | 课程内容服务 | 核心业务 |
| **xuebay-order-service** | `10100` | 订单处理服务 | 交易业务 |
| **xuebay-pay-service** | `10110` | 支付平台服务 | 交易业务 |
| **xuebay-cart-service** | `10140` | 购物车服务 | 交易业务 |
| **xuebay-kill-service** | `10120` | 秒杀/限时购服务 | 促销业务 |
| **xuebay-search-service** | `10080` | 全文搜索服务 | 功能支撑 |
| **xuebay-message-service** | `10090` | 消息通知服务 | 功能支撑 |
| **xuebay-file-service** | `10060` | 资源文件服务 | 资源管理 |
| **xuebay-media-service** | `10070` | 视频/多媒体服务 | 资源管理 |
| **xuebay-xxljob-service** | `10150` | 分布式定时任务 | 任务调度 |
| **xuebay-common-service** | `10130` | 公共基础服务 | 基础设施 |
---

前端站点规划如下

| 服务名            | 端口 | 备注         |
|----------------| ---- | ------------ |
| xuebay-system-ui | 6001 | 系统管理前端 |
| xuebay-course-ui | 6002 | 门户课程站点 |
| xuebay-user-ui  | 6003 | 门户用户站点 |

#### 1.2.项目结构

项目使用SpringBoot父子聚合工程，效果如下：

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

