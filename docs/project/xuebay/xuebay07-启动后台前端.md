# 管理系统前端启动


## 代码准备

下载[前端代码](https://github.com/hongchaozhu-it/note/tree/main/docs/project/xuebay/resources/xuebay-ui)到 xuebay-ui 模块

## 启动项目

执行：npm run dev 启动项目。


# MacOS ARM64 下 Vue 项目 `node-sass` `兼容性问题`解决方案

## 问题描述
在 macOS ARM64 架构上，`node-sass` 不支持，导致项目无法启动。

## 解决步骤

### 卸载 node-sass
```bash
npm uninstall node-sass
```

### 安装 sass (dart-sass) 替代
```bash
npm install sass --save-dev
```

### 升级 sass-loader 到兼容版本

```bash
npm install sass-loader@^7.3.1 --save-dev
```

> **注意**：sass-loader 版本需要与 webpack 版本匹配
> - webpack 2.x → sass-loader 7.x
> - webpack 3.x/4.x → sass-loader 7.x-8.x
> - webpack 5.x → sass-loader 10.x+

### 修复代码中的导入问题

**修改 `src/main.js`：**

```javascript
// 修复 main.css 导入路径
// 原代码：
import 'main.css'

// 修改为：
import 'element-ui/lib/theme-chalk/main.css'
```

如果缺失 upload.vue 组件，可以从 [upload.vue](https://github.com/hongchaozhu-it/note/tree/main/docs/project/xuebay/resources/xuebay-ui/xuebay-system-ui/node_modules/upload.vue) 复制获取。

### 启动项目
```bash
npm run dev
```
