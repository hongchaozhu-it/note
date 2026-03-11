# 集成Swagger

## 系统服务集成Swagger

这里同样使用 `xuebay-system-service` 服务作为示例，其他服务类似。

### 引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    </dependency>
</dependencies>
```

### 配置类

```java
package com.zhc.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Swagger2Config {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("系统管理")
                        .description("系统管理接口文档")
                        .version("v1.0.0")
                        .contact(new Contact().name("zhc").email("hongchaozhu.it@gmail.com"))
                );
    }
}
```

### 测试

访问： http://${your-service-host}:{your-service-port}/swagger-ui.html 即可

## 网关聚合Swagger

### 引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
    </dependency>
</dependencies>
```

### 配置类

- Swagger资源处理器

```java
package com.zhc.config;

import jakarta.annotation.PostConstruct;
import org.springdoc.core.properties.AbstractSwaggerUiConfigProperties;
import org.springdoc.core.properties.SwaggerUiConfigParameters;
import org.springdoc.core.properties.SwaggerUiConfigProperties;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class GatewaySwaggerConfig {
    private final DiscoveryClient discoveryClient;
    private final SwaggerUiConfigProperties swaggerUiConfig;
    private final SwaggerUiConfigParameters swaggerUiConfigParameters;

    public GatewaySwaggerConfig(DiscoveryClient discoveryClient,
                                SwaggerUiConfigProperties swaggerUiConfig,
                                SwaggerUiConfigParameters swaggerUiConfigParameters) {
        this.discoveryClient = discoveryClient;
        this.swaggerUiConfig = swaggerUiConfig;
        this.swaggerUiConfigParameters = swaggerUiConfigParameters;
    }

    // 容器初始化完成后执行（确保服务发现已加载微服务列表）
    @PostConstruct
    public void dynamicAddSwaggerUrls() {
        // 1. 从注册中心获取所有微服务（排除 Gateway 自身）
        List<String> serviceIds = discoveryClient.getServices().stream()
                .filter(serviceId -> !"xuebay-gateway-service".equals(serviceId)) // 替换为你的 Gateway 服务名
                .collect(Collectors.toList());
        Set<AbstractSwaggerUiConfigProperties.SwaggerUrl> swaggerUrls = new HashSet<>();
        // 2. 动态添加每个微服务的文档地址（与通用路由路径 /v3/api-docs/{serviceId} 对应）
        for (String serviceId : serviceIds) {
            SwaggerUiConfigProperties.SwaggerUrl url = new SwaggerUiConfigProperties.SwaggerUrl();
            url.setName(serviceId); // 下拉框显示的微服务名称（可改为中文，如 "订单服务"）
            url.setUrl("/swagger-doc/" + serviceId + "/v3/api-docs"); // 对应通用文档路由的路径
            swaggerUrls.add(url);
        }
        swaggerUiConfig.setUrls(swaggerUrls);
        swaggerUiConfigParameters.setUrls(swaggerUrls);
    }
}
```

- 动态路由配置

```java
package com.zhc.config;

import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class GatewayRouteConfig {

    private final DiscoveryClient discoveryClient;

    public GatewayRouteConfig(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        RouteLocatorBuilder.Builder routes = builder.routes();
        // 1. 获取所有微服务ID（排除网关）
        List<String> serviceIds = discoveryClient.
                getServices().
                stream().
                filter(serviceId -> !"xuebay-gateway-service".
                        equals(serviceId)).
                collect(Collectors.toList());

        // 2. 为每个微服务生成单独的路由
        for (String serviceId : serviceIds) {
            routes.
                    route("openapi-docs-" + serviceId, r -> r
                            .path("/swagger-doc/" + serviceId + "/v3/api-docs/**")// 匹配该微服务的文档路径
                            .filters(f -> f.
                                    rewritePath("/swagger-doc/" + serviceId + "/v3/api-docs", "/v3/api-docs"))
                            .uri("lb://" + serviceId)); // 静态URI，启动时解析
        }
        return routes.build();
    }
}
```

### 测试

访问 http://\${your-gateway-host}:\${your-gateway-port}/swagger-ui.html