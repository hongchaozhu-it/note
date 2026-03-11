# 集成MybatisPlus


## 引入依赖

我们在[服务搭建](https://hongchaozhu-it.github.io/note/#/./project/xuebay/xuebay04-%E6%9C%8D%E5%8A%A1%E6%90%AD%E5%BB%BA)中已经整合了相关依赖并在 xuebay-basic-web-dependency 中引入,所以这里无需单独引入。 

## 添加配置类

```java
package com.zhc.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.zhc.mapper")
public class MybatisPlusConfig {

    /**
     * 添加分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```