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

其他服务按此模板添加配置类即可集成MybatisPlus。

## MybatisPlus代码生成器

### 引入依赖

```xml
    <dependencies>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.velocity</groupId>
            <artifactId>velocity-engine-core</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.zhc</groupId>
            <artifactId>xuebay-basic-mybatisplus-dependency</artifactId>
        </dependency>
    </dependencies>
```

### 代码生成类

```java
package com.zhc;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.builder.CustomFile;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.*;

/**
 * 生成代码的主类
 */
public class GeneratorCode {

    public static Map<String, String[]> tableColumns = new HashMap<>();

    static {
        String[] xuebayCart = {"t_course_cart"};
        String[] xuebayCommon = {"t_message_email", "t_message_sms", "t_message_station"};
        String[] xuebayCourse = {"t_course", "t_course_chapter", "t_course_collect", "t_course_detail", "t_course_market", "t_course_resource", "t_course_summary", "t_course_teacher", "t_course_type", "t_course_user_learn", "t_course_view_log", "t_teacher", "t_teacher"};
        String[] xuebayKill = {"t_kill_activity", "t_kill_course"};
        String[] xuebayMedia = {"t_media_file"};
        String[] xuebayOrder = {"t_course_order", "t_course_order_item"};
        String[] xuebayPay = {"t_alipay_info", "t_pay_flow", "t_pay_order"};
        String[] xuebaySystem = {"t_config", "t_department", "t_employee", "t_operation_log", "t_systemdictionary", "t_systemdictionaryitem"};
        String[] xuebayUaa = {"oauth_client_details", "oauth_code", "t_login", "t_login_log", "t_login_role", "t_menu", "t_permission", "t_role", "t_role_permission"};
        String[] xuebayUser = {"t_account_flow", "t_user", "t_user_account", "t_user_address", "t_user_base_info", "t_user_grow_log", "t_user_real_info"};
        String[] xuebayXxljob = {"xxl_job_group", "xxl_job_info", "xxl_job_lock", "xxl_job_log_report", "xxl_job_logglue", "xxl_job_registry", "xxl_job_user"};
        String xuebayCartConfig  = "mybatiesplus-config-cart";
        String xuebayCommonConfig  = "mybatiesplus-config-common";
        String xuebayCourseConfig  = "mybatiesplus-config-course";
        String xuebayKillConfig  = "mybatiesplus-config-kill";
        String xuebayMediaConfig  = "mybatiesplus-config-media";
        String xuebayOrderConfig  = "mybatiesplus-config-order";
        String xuebayPayConfig  = "mybatiesplus-config-pay";
        String xuebaySys  = "mybatiesplus-config-system";
        String xuebayUaaConfig  = "mybatiesplus-config-uaa";
        String xuebayUserConfig  = "mybatiesplus-config-user";
        String xuebayXxljobConfig  = "mybatiesplus-config-xxljob";

        tableColumns.put(xuebayCartConfig, xuebayCart);
        tableColumns.put(xuebayCommonConfig, xuebayCommon);
        tableColumns.put(xuebayCourseConfig, xuebayCourse);
        tableColumns.put(xuebayKillConfig, xuebayKill);
        tableColumns.put(xuebayMediaConfig, xuebayMedia);
        tableColumns.put(xuebayOrderConfig, xuebayOrder);
        tableColumns.put(xuebayPayConfig, xuebayPay);
        tableColumns.put(xuebaySys, xuebaySystem);
        tableColumns.put(xuebayUaaConfig, xuebayUaa);
        tableColumns.put(xuebayUserConfig, xuebayUser);
        tableColumns.put(xuebayXxljobConfig, xuebayXxljob);

    }

    public static void main(String[] args) {
        // 遍历生成代码
        for (Map.Entry<String, String[]> entry : tableColumns.entrySet()) {
            String config = entry.getKey();
            String[] tables = entry.getValue();
            gen(config, tables);
        }
    }

    public static void gen(String config, String[] tables) {
        ResourceBundle rb = ResourceBundle.getBundle(config);

        createH2TestTables();

        FastAutoGenerator.create(rb.getString("jdbc.url"), rb.getString("jdbc.user"), rb.getString("jdbc.pwd"))
                .globalConfig(builder -> builder
                        .author(rb.getString("author"))
                        .commentDate("yyyy-MM-dd")
                )
                .packageConfig(builder -> builder
                        .parent(rb.getString("parent"))
                        .controller("web.controller")
                        .entity("domain")
                        .mapper("mapper")
                        .service("service")
                        .serviceImpl("service.impl")
                        .xml("mappers")
                )
                .templateConfig(builder -> builder
                        .entity(null) 
                        .controller(null)
                        .service(null)
                        .serviceImpl(null)
                        .mapper(null)
                        .xml(null).build()
                )
                .injectionConfig(injectConfig -> {
                    Map<String, Object> customMap = new HashMap<>();
                    customMap.put("abc", rb.getString("author") + "-rb");
                    injectConfig.customMap(customMap);

                    injectConfig.customFile(new CustomFile.Builder()
                            .fileName("Query.java")
                            .filePath(rb.getString("OutputDirBase") + "/com/zhc/query/")
                            .templatePath("/templates/query.java.vm") 
                            .build());
                    injectConfig.customFile(new CustomFile.Builder()
                            .fileName("Controller.java")
                            .filePath(rb.getString("OutputDir") + "/com/zhc/web/controller/")
                            .templatePath("/templates/controller.java.vm") 
                            .build());
                    injectConfig.customFile(new CustomFile.Builder()
                            .fileName("Service.java")
                            .filePath(rb.getString("OutputDir") + "/com/zhc/service/")
                            .templatePath("/templates/service.java.vm") 
                            .build());
                    injectConfig.customFile(new CustomFile.Builder()
                            .fileName("ServiceImpl.java")
                            .filePath(rb.getString("OutputDir") + "/com/zhc/service/impl")
                            .templatePath("/templates/serviceImpl.java.vm") 
                            .build());
                    injectConfig.customFile(new CustomFile.Builder()
                            .fileName("Mapper.java")
                            .filePath(rb.getString("OutputDir") + "/com/zhc/mapper")
                            .templatePath("/templates/mapper.java.vm") 
                            .build());
                    injectConfig.customFile(new CustomFile.Builder()
                            .fileName(".java")
                            .filePath(rb.getString("OutputDirBase") + "/com/zhc/domain/")
                            .templatePath("/templates/entity.java.vm") 
                            .build());
                    injectConfig.customFile(new CustomFile.Builder()
                            .fileName("Mapper.xml")
                            .filePath(rb.getString("OutputDirXml") + "/com/zhc/mapper/")
                            .templatePath("/templates/mapper.xml.vm") 
                            .build());
                }).strategyConfig(builder -> builder
                        .addTablePrefix("t_")
                        .addInclude(tables)
                        .enableCapitalMode() 
                        .entityBuilder()
                        .enableTableFieldAnnotation()
                        .naming(NamingStrategy.underline_to_camel)
                        .columnNaming(NamingStrategy.underline_to_camel)
                        .serviceBuilder().formatServiceFileName("%sService")
                )
                .execute();

    }

    /**
     * 为H2数据库创建测试表结构
     */
    private static void createH2TestTables() {
        try {
            Class.forName("org.h2.Driver");
            Connection conn = DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");
            Statement stmt = conn.createStatement();

            // 创建测试表
            stmt.execute("CREATE TABLE IF NOT EXISTS oauth_client_details (" +
                    "client_id VARCHAR(255) PRIMARY KEY," +
                    "resource_ids VARCHAR(255)," +
                    "client_secret VARCHAR(255)," +
                    "scope VARCHAR(255)," +
                    "authorized_grant_types VARCHAR(255)," +
                    "web_server_redirect_uri VARCHAR(255)," +
                    "authorities VARCHAR(255)," +
                    "access_token_validity INT," +
                    "refresh_token_validity INT," +
                    "additional_information VARCHAR(4096)," +
                    "autoapprove VARCHAR(255)" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS oauth_code (" +
                    "code VARCHAR(255) PRIMARY KEY," +
                    "authentication BLOB" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS t_login (" +
                    "id BIGINT PRIMARY KEY," +
                    "username VARCHAR(50)," +
                    "password VARCHAR(255)," +
                    "email VARCHAR(100)," +
                    "phone VARCHAR(20)," +
                    "status INT," +
                    "create_time TIMESTAMP," +
                    "update_time TIMESTAMP" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS t_login_log (" +
                    "id BIGINT PRIMARY KEY," +
                    "user_id BIGINT," +
                    "login_time TIMESTAMP," +
                    "ip_address VARCHAR(50)," +
                    "user_agent VARCHAR(500)" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS t_login_role (" +
                    "login_id BIGINT," +
                    "role_id BIGINT," +
                    "PRIMARY KEY (login_id, role_id)" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS t_menu (" +
                    "id BIGINT PRIMARY KEY," +
                    "menu_name VARCHAR(100)," +
                    "menu_url VARCHAR(255)," +
                    "parent_id BIGINT," +
                    "sort_order INT," +
                    "icon VARCHAR(50)," +
                    "status INT" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS t_permission (" +
                    "id BIGINT PRIMARY KEY," +
                    "permission_name VARCHAR(100)," +
                    "permission_code VARCHAR(100)," +
                    "description VARCHAR(255)" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS t_role (" +
                    "id BIGINT PRIMARY KEY," +
                    "role_name VARCHAR(100)," +
                    "role_code VARCHAR(100)," +
                    "description VARCHAR(255)," +
                    "status INT" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS t_role_permission (" +
                    "role_id BIGINT," +
                    "permission_id BIGINT," +
                    "PRIMARY KEY (role_id, permission_id)" +
                    ")");

            stmt.close();
            conn.close();

            System.out.println("H2测试表创建成功");
        } catch (Exception e) {
            System.err.println("创建H2测试表失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### 代码生成配置信息

- resources/mybatiesplus-config-system.properties

```properties
# 按照实际项目结构调整
OutputDir=/Volumes/develop/xuebay/xuebay-service/xuebay-system-service/src/main/java
OutputDirXml=/Volumes/develop/xuebay/xuebay-service/xuebay-system-service/src/main/resources
OutputDirBase=/Volumes/develop/xuebay/xuebay-model/xuebay-system-model/src/main/java
author=${author}
parent=${package-name} # 父包名
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://${your-mysql-server-host}:${your-mysql-server-port}/xuebay-system?serverTimezone=UTC
jdbc.user=${your-mysql-server-username}
jdbc.pwd=${your-mysql-server-password}
```

### 模板文件

- resources/templates/controller.java.vm

```java
package ${package.Controller};

import ${package.Service}.${table.serviceName};
import ${package.Entity}.${entity};
import com.zhc.query.${entity}Query;
import com.zhc.result.JSONResult;
import com.zhc.query.PageList;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/${table.entityPath}")
public class ${entity}Controller {

    @Autowired
    public ${table.serviceName} ${table.entityPath}Service;

    /**
    * 保存和修改公用的
    */
    @RequestMapping(value="/save",method= RequestMethod.POST)
    public JSONResult saveOrUpdate(@RequestBody ${entity} ${table.entityPath}){
        if(${table.entityPath}.getId()!=null){
            ${table.entityPath}Service.updateById(${table.entityPath});
        }else{
            ${table.entityPath}Service.save(${table.entityPath});
        }
        return JSONResult.success();
    }

    /**
    * 删除对象
    */
    @RequestMapping(value="/{id}",method=RequestMethod.DELETE)
    public JSONResult delete(@PathVariable("id") Long id){
        ${table.entityPath}Service.removeById(id);
        return JSONResult.success();
    }

    /**
   * 获取对象
   */
    @RequestMapping(value = "/{id}",method = RequestMethod.GET)
    public JSONResult get(@PathVariable("id")Long id){
        return JSONResult.success(${table.entityPath}Service.getById(id));
    }


    /**
    * 查询所有对象
    */
    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public JSONResult list(){
        return JSONResult.success(${table.entityPath}Service.list());
    }


    /**
    * 带条件分页查询数据
    */
    @RequestMapping(value = "/pagelist",method = RequestMethod.POST)
    public JSONResult page(@RequestBody ${entity}Query query){
        Page<${entity}> page = new Page<${entity}>(query.getPage(),query.getRows());
        page = ${table.entityPath}Service.page(page);
        return JSONResult.success(new PageList<${entity}>(page.getTotal(),page.getRecords()));
    }
}
```

- resources/templates/query.java.vm

```java
package com.zhc.query;


/**
 *
 * @author ${author}
 * @since ${date}
 */
public class ${table.entityName}Query extends BaseQuery{
}
```
### 执行代码

允许 GeneratorCode 类,一次性生成所有模块的代码,检查生成结果是否符合预期
- model
- controller
- service
- mapper
- xml

配置文件和模板文件可以到 [docs/project/xuebay/resources](https://github.com/hongchaozhu-it/note/blob/main/docs/project/xuebay/resources) 下获取。