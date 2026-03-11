# 全局异常处理

为了不在 `controller层` 编写大量的 try-catch 代码，需要进行统一异常处理，同时要进行错误信息以及错误码的统一管理，建议使用枚举进行错误码封装。


## 定义异常

在开发中，为了保证业务的正确性我们会对业务参数进行校验，不满足要求的参数采用throw new XxxException 来抛出异常，阻止程序继续执行，比如：用户名不可为空，密码错误等。这类异常是需要展示给用户看的，还有一类是程序抛出来的一些未知的异常，如：SQL异常，空指针异常等等，这类异常不能直接抛给用户，而是应该统一捕获后，封装成统一的错误提示返回给用户，如“系统内部异常啦”。

为了把我们手动抛出的异常和系统内部出现的异常区分开，我们需要抛出自定义的异常。通过继承RuntimeException自定义异常。

```java
package com.zhc.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BusinessException extends RuntimeException{
    private String message;

    public BusinessException(String msg) {
        this.message = msg;
    }
}

```


## 统一捕获异常

统一捕获异常，使用AOP的思想，解决在controller中大量try-catch重复代码。

在 `xuebay-basic-common` 公共模块，创建全局异常捕获类，通过两个注解来实现异常统一处理

- @RestControllerAdvice ： 作用在类上，@RestControllerAdvice的增强，同时可以在controller执行前后做一些额外逻辑。
- @ExceptionHandler(异常类.class) ：作用在方法上，可捕获指定类型的异常

```java
package com.zhc.exception;

import com.zhc.enums.ErrorCode;
import com.zhc.result.JSONResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public JSONResult handlerBusinessException(BusinessException e) {
        return JSONResult.error(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public JSONResult handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        Map<String,String> datas=new HashMap<>();
        for (FieldError fieldError : fieldErrors) {
            String field = fieldError.getField();
            String defaultMessage = fieldError.getDefaultMessage();
            datas.put(field,defaultMessage);
        }
        return JSONResult.error(datas, ErrorCode.FAIL);
    }

    @ExceptionHandler(Exception.class)
    public JSONResult handleException(Exception e) {
        e.printStackTrace();
        return JSONResult.error(e.getMessage());
    }
}
```

### 2.断言工具抽取

大量的if(条件)throw new Exception("异常") 代码太过冗余，通过断言工具进行抽取,仿照Spring的Assert。

#### 2.1.定义工具

```java
package com.zhc.util;

import java.util.Collection;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AssertUtil {

    //手机的正则表达式
    private static final Pattern CHINA_PATTERN_PHONE = Pattern.compile("^((13[0-9])|(14[0,1,4-9])|(15[0-3,5-9])|(16[2,5,6,7])|(17[0-8])|(18[0-9])|(19[0-3,5-9]))\\d{8}$");


    /**
     * --------------------------------------------------------
     * 手机号断言
     * --------------------------------------------------------
     **/
    public static void isPhone(String phone, String message) {
        Matcher m = CHINA_PATTERN_PHONE.matcher(phone);
        if (!m.matches()) {
            throw new RuntimeException(message);
        }
    }


    /**
     * --------------------------------------------------------
     * 断言 不为空，如果为空，抛异常
     * --------------------------------------------------------
     **/
    public static void isNotEmpty(String text, String message) {
        if (text == null || text.trim().length() == 0) {
            throw new RuntimeException(message);
        }
    }

    public static void isNotEmpty(Collection<?> collection, String message) {
        if (collection == null || collection.isEmpty()) {
            throw new RuntimeException(message);
        }
    }

    public static void isNotEmpty(Map<?, ?> map, String message) {
        if (map == null || map.isEmpty()) {
            throw new RuntimeException(message);
        }
    }


    /**
     * --------------------------------------------------------
     * 断言对象为空
     * --------------------------------------------------------
     **/
    public static void isNull(Object obj, String message) {
        if (obj != null) {
            throw new RuntimeException(message);
        }
    }

    public static void isNotNull(Object obj, String message) {
        if (obj == null) {
            throw new RuntimeException(message);
        }
    }

    /**
     * --------------------------------------------------------
     * 断言false,如果为true,我报错
     * --------------------------------------------------------
     **/
    public static void isFalse(boolean isFalse, String message) {
        if (isFalse) {
            throw new RuntimeException(message);
        }
    }

    public static void isTrue(boolean isTrue, String message) {
        if (!isTrue) {
            throw new RuntimeException(message);
        }
    }


    /**
     * --------------------------------------------------------
     * 断言两个字符串一致
     * --------------------------------------------------------
     **/
    public static void isEquals(String s1, String s2, String message) {
        isNotEmpty(s1, "不可为空");
        isNotEmpty(s2, "不可为空");
        if (!s1.equals(s2)) {
            throw new RuntimeException(message);
        }
    }

    public static void isEqualsTrim(String s1, String s2, String message) {
        isNotEmpty(s1, "不可为空");
        isNotEmpty(s2, "不可为空");
        if (!s1.trim().equals(s2.trim())) {
            throw new RuntimeException(message);
        }
    }

    public static void isEqualsIgnoreCase(String s1, String s2, String message) {
        isNotEmpty(s1, "不可为空");
        isNotEmpty(s2, "不可为空");
        if (!s1.trim().equalsIgnoreCase(s2.trim())) {
            throw new RuntimeException(message);
        }
    }

}
```

## 错误码封装

系统中有大量的异常信息分散在代码各处，为了方便管理和维护我们可以使用枚举类方便的统一管理起来如

```java
package com.zhc.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // ========== 通用错误 (10000-19999) ==========
    SUCCESS(200, "操作成功"),
    FAIL(500, "操作失败"),

    // 通用错误
    BAD_REQUEST(10000, "请求参数错误"),
    UNAUTHORIZED(10001, "未授权访问"),
    FORBIDDEN(10002, "禁止访问"),
    NOT_FOUND(10003, "资源不存在"),
    METHOD_NOT_ALLOWED(10004, "请求方法不允许"),
    MEDIA_TYPE_NOT_SUPPORTED(10005, "不支持的媒体类型"),
    REQUEST_TIMEOUT(10006, "请求超时"),
    TOO_MANY_REQUESTS(10007, "请求过于频繁"),

    // ========== 用户认证/权限错误 (20000-29999) ==========
    USER_NOT_LOGIN(20000, "用户未登录"),
    USER_LOGIN_EXPIRED(20001, "登录已过期"),
    USER_NOT_FOUND(20002, "用户不存在"),
    USER_PASSWORD_ERROR(20003, "密码错误"),
    USER_DISABLED(20004, "用户已被禁用"),
    USER_LOCKED(20005, "用户已被锁定"),
    USER_ALREADY_EXISTS(20006, "用户已存在"),
    USER_UNAUTHORIZED(20007, "用户无权限"),
    TOKEN_INVALID(20008, "无效的Token"),
    TOKEN_EXPIRED(20009, "Token已过期"),
    TOKEN_MISSING(20010, "Token缺失"),

    // ========== 业务逻辑错误 (30000-39999) ==========
    // 课程相关
    COURSE_NOT_FOUND(30000, "课程不存在"),
    COURSE_ALREADY_EXISTS(30001, "课程已存在"),
    COURSE_NOT_PUBLISHED(30002, "课程未发布"),
    COURSE_CHAPTER_NOT_FOUND(30010, "课程章节不存在"),
    COURSE_MEDIA_NOT_FOUND(30020, "课程媒体不存在"),

    // 订单相关
    ORDER_NOT_FOUND(30100, "订单不存在"),
    ORDER_STATUS_ERROR(30101, "订单状态错误"),
    ORDER_PAYMENT_FAILED(30102, "支付失败"),
    ORDER_REFUND_FAILED(30103, "退款失败"),

    // 购物车相关
    CART_EMPTY(30200, "购物车为空"),
    CART_ITEM_NOT_FOUND(30201, "购物车项不存在"),
    CART_ITEM_EXCEED_LIMIT(30202, "购物车项数量超限"),

    // 秒杀相关
    KILL_NOT_STARTED(30300, "秒杀未开始"),
    KILL_ENDED(30301, "秒杀已结束"),
    KILL_STOCK_EMPTY(30302, "秒杀库存不足"),
    KILL_REPEAT(30303, "重复秒杀"),

    // ========== 数据/参数错误 (40000-49999) ==========
    PARAM_ERROR(40000, "参数错误"),
    PARAM_MISSING(40001, "缺少必要参数"),
    PARAM_TYPE_ERROR(40002, "参数类型错误"),
    PARAM_VALIDATION_FAILED(40003, "参数校验失败"),

    DATA_NOT_FOUND(40100, "数据不存在"),
    DATA_ALREADY_EXISTS(40101, "数据已存在"),
    DATA_SAVE_FAILED(40102, "数据保存失败"),
    DATA_UPDATE_FAILED(40103, "数据更新失败"),
    DATA_DELETE_FAILED(40104, "数据删除失败"),

    // ========== 系统/服务器错误 (50000-59999) ==========
    SYSTEM_ERROR(50000, "系统错误"),
    SYSTEM_BUSY(50001, "系统繁忙"),
    DATABASE_ERROR(50002, "数据库错误"),
    CACHE_ERROR(50003, "缓存错误"),
    IO_ERROR(50004, "IO错误"),
    FILE_UPLOAD_ERROR(50010, "文件上传失败"),
    FILE_DOWNLOAD_ERROR(50011, "文件下载失败"),
    FILE_TOO_LARGE(50012, "文件过大"),
    FILE_TYPE_NOT_ALLOWED(50013, "文件类型不允许"),

    // ========== 第三方服务错误 (60000-69999) ==========
    SMS_SEND_FAILED(60000, "短信发送失败"),
    EMAIL_SEND_FAILED(60001, "邮件发送失败"),
    PAYMENT_SERVICE_ERROR(60010, "支付服务异常"),
    STORAGE_SERVICE_ERROR(60020, "存储服务异常"),
    VIDEO_SERVICE_ERROR(60030, "视频服务异常"),
    AI_SERVICE_ERROR(60040, "AI服务异常"),
    ;

    private final int code;
    private final String message;

    /**
     * 根据code获取枚举
     */
    public static ErrorCode getByCode(int code) {
        for (ErrorCode errorCode : ErrorCode.values()) {
            if (errorCode.getCode() == code) {
                return errorCode;
            }
        }
        return SYSTEM_ERROR;
    }

    /**
     * 判断是否成功
     */
    public static boolean isSuccess(int code) {
        return SUCCESS.getCode() == code;
    }
}
```
