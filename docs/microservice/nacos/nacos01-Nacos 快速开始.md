文档参考 [Nacos 官网 快速开始](https://nacos.io/zh-cn/docs/quick-start.html)

# Nacos 快速开始

快速开始帮助你快速在下载、按照并使用 Nacos 。当前产出的 Nacos 服务为 2.5.2 版本的`单机模式`并且`开启鉴权`。

## Nacos 下载

[Nacos Github Releases 请选择稳定版本](https://github.com/alibaba/nacos/releases/)

[Nacos 官网直链 点我下载 nacos-server-2.5.2.tar.gz](https://download.nacos.io/nacos-server/nacos-server-2.5.2.zip?spm=5238cd80.6a33be36.0.0.6e211e5dBQfxGv&file=nacos-server-2.5.2.zip)

## 解压 Nacos 发行包

```shell
# 解压 nacos-server-2.5.2.zip
unzip nacos-server-$version.zip
# 解压 nacos-server-2.5.2.tar.gz
tar -xvf nacos-server-$version.tar.gz

```
## 启用 Nacos 鉴权
[鉴权配置请参考官网-点我直达](https://nacos.io/docs/v2/guide/user/auth/)
- Mac
```shell
cd ${nacos.home}
FILE_PATH="conf/application.properties"

# 1. 开启权限认证 (注意 -i 后面的 '')
sed -i '' 's/^nacos.core.auth.enabled=.*/nacos.core.auth.enabled=true/' $FILE_PATH

# 2. 修改身份标识 Key 和 Value
sed -i '' 's/^nacos.core.auth.server.identity.key=.*/nacos.core.auth.server.identity.key=xuebay_identity/' $FILE_PATH
sed -i '' 's/^nacos.core.auth.server.identity.value=.*/nacos.core.auth.server.identity.value=xuebay_value/' $FILE_PATH

# 3. 修改密钥
SECRET_KEY="VGhpcy1pcy1teS1jdXN0b20tc2VjcmV0LWtleS1mb3IteHVlYmF5LTIwMjY="
sed -i '' "s|^nacos.core.auth.plugin.nacos.token.secret.key=.*|nacos.core.auth.plugin.nacos.token.secret.key=$SECRET_KEY|" $FILE_PATH
```

- Linux/Unix
```shell
cd ${nacos.home}
FILE_PATH="conf/application.properties"

# 1. 开启权限认证
sed -i 's/^nacos.core.auth.enabled=.*/nacos.core.auth.enabled=true/' $FILE_PATH

# 2. 修改身份标识 Key 和 Value
sed -i 's/^nacos.core.auth.server.identity.key=.*/nacos.core.auth.server.identity.key=xuebay_identity/' $FILE_PATH
sed -i 's/^nacos.core.auth.server.identity.value=.*/nacos.core.auth.server.identity.value=xuebay_value/' $FILE_PATH

# 3. 修改自定义密钥 (示例使用一个自定义的 Base64 字符串)
SECRET_KEY="VGhpcy1pcy1teS1jdXN0b20tc2VjcmV0LWtleS1mb3IteHVlYmF5LTIwMjY="
sed -i "s|^nacos.core.auth.plugin.nacos.token.secret.key=.*|nacos.core.auth.plugin.nacos.token.secret.key=$SECRET_KEY|" $FILE_PATH
```

- Windows
由于 Windows 终端不支持 `sed` 命令，因此需要手动修改 `application.properties` 文件。
```properties
nacos.core.auth.system.type=nacos

nacos.core.auth.enabled=true

nacos.core.auth.server.identity.key=${nacos_username}

nacos.core.auth.server.identity.value=${nacos_password}
# 这个密钥需要足够长
nacos.core.auth.plugin.nacos.token.secret.key=${your_secret_key}
````

## 启动 Nacos 服务

注：Nacos的运行建议至少在`2C4G` `60G`的机器配置下运行。

```shell
# 进入 nacos/bin 目录
cd nacos/bin

# Linux/Unix/Mac
sh startup.sh -m standalone
# Windows
startup.cmd -m standalone
```

## 验证 Nacos 服务是否启动成功

进入`${nacos.home}/logs/` 目录下， 使用`tail -f start.out` 查看日志，如果看到如下日志，说明服务启动成功。

```text
Nacos started successfully in stand alone mode. use embedded storage
```

可以通过下列服务，快速检验Nacos的功能。

## 服务注册

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
```

## 服务发现

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
```

## 发布配置

```shell
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=HelloWorld"
```

## 获取配置

```shell
curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
```

## Nacos控制台页面

打开任意浏览器，输入地址：http://127.0.0.1:8848/nacos 即可进入Nacos控制台页面。

## 关闭服务器

```shell
# Linux/Unix/Mac
sh shutdown.sh

# Windows
shutdown.cmd
```
