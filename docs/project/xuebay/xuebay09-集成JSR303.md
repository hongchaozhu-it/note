
# JSR303 参数校验

参数校验是程序开发中必不可少的过程。后端校验能有效防止恶意操作，保持程序的健壮性。相比于在业务逻辑中编写冗余的 `if-else`，使用 JSR303 规范能实现代码的解耦与优雅。

## 1. 环境准备

在 Spring Boot 项目中，若使用 2.3.0 及以上版本，需手动引入以下 Starter：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

```

---

## 2. 核心注解概览

### Bean Validation 内置约束

| Constraint | 详细信息 |
| --- | --- |
| `@Null` / `@NotNull` | 必须为 `null` / 必须不为 `null` |
| `@NotEmpty` | 用于集合或字符串，长度必须大于 0 且不全为空格 |
| `@NotBlank` | 只能用于字符串，且必须包含非空白字符 |
| `@Min` / `@Max` | 数值类型的最小值/最大值 |
| `@Size(max, min)` | 容器（如 List、Map、数组）或字符串的大小范围 |
| `@Past` / `@Future` | 必须是过去的日期 / 将来的日期 |
| `@Pattern(regexp)` | 必须符合指定的正则表达式 |

### Hibernate Validator 扩展约束

| Constraint | 详细信息 |
| --- | --- |
| `@Email` | 必须是合法的电子邮箱地址 |
| `@Length(min, max)` | 字符串长度必须在指定范围内 |
| `@Range(min, max)` | 数值必须在合适的范围内 |

---

## 3. 对象与参数校验

### 3.1 实体类配置

在 DTO/POJO 的字段上添加注解。

```java
public class RegisterParamDto {
    @NotEmpty(message = "手机号不可为空")
    @Length(min = 11, max = 11, message = "手机号长度必须为11位")
    private String phone;

    @NotBlank(message = "用户名不能为空")
    private String username;
}
```

### 3.2 级联校验（嵌套校验）

若对象中包含其他对象，必须在子对象属性上加 `@Valid`，否则子对象内部的校验规则不会生效。

```java
public class UserDto {
    @NotNull
    private String name;

    @Valid // 必须加此注解，级联校验 Address 内部字段
    @NotNull
    private AddressDto address;
}
```

### 3.3 Controller 启用校验

在参数前添加 `@Valid`（标准 JSR）或 `@Validated`（Spring 增强）。

```java
@PostMapping("/register")
public JSONResult register(@RequestBody @Valid RegisterParamDto dto) {
    // 业务逻辑
    return JSONResult.ok();
}
```

---

## 5. 自定义校验注解

### 5.1 定义注解

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
public @interface Phone {
    String message() default "无效的手机格式";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

### 5.2 定义校验器实现

```java
public class PhoneValidator implements ConstraintValidator<Phone, String> {
    private static final String REGEX = "^1[3-9]\\d{9}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true; // 通常交给@NotNull处理
        return value.matches(REGEX);
    }
}
```

---

## 6. 分组校验

同一实体类在不同场景（如“新增”需校验 ID 为空，“修改”需校验 ID 不为空）下，校验规则不同。

### 6.1 定义分组接口

```java
public interface AddGroup {}
public interface UpdateGroup {}
```

### 6.2 Model 指明分组

```java
public class Person {
    @Null(groups = AddGroup.class, message = "新增时ID必须为空")
    @NotNull(groups = UpdateGroup.class, message = "更新时ID不能为空")
    private Long id;

    @NotEmpty(groups = {AddGroup.class, UpdateGroup.class})
    private String name;
}
```

### 6.3 启用分组校验

注意：**必须使用 `@Validated**`，`@Valid` 不支持分组。

```java
@PostMapping("/save")
public void add(@RequestBody @Validated(AddGroup.class) Person person) {
    // ... 
}
```

---

## 7. 高级进阶：快速失败

默认情况下，Hibernate Validator 会校验完所有参数才返回。开启“快速失败”模式后，只要发现一个错误就会立即停止校验并返回，提升效率。

```java
@Configuration
public class ValidatorConfig {
    @Bean
    public Validator validator() {
        return Validation.byProvider(HibernateValidator.class)
                .configure()
                 // 开启快速失败
                .failFast(true)
                .buildValidatorFactory()
                .getValidator();
    }
}
```
