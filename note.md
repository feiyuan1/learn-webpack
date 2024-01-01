```
// 防止意外发布代码，指的是发包？
private: true
```

> 安装一个被用于生产环境的依赖时，使用 --save，安装仅本地使用的依赖时，使用 --save-dev

# manifest

管理模块间的交互.

### Qs

- 动态生成的 bundle 名称，如何在 index.html 内引用的呢？
- 当使用 content-hash 作为 bundle 文件的名称时：
  - 为何有些内容没有被修改，但是生成的 bundle 文件名称依旧被更新了？
  - 应该怎么避免更新呢？
- manifest 普通开发者可以看到么？是什么结构呢？
  - WebpackManifestPlugin 插件可以提取 manifest 数据为一个 json 文件

# entry

### Qs

- 如何使用多个导入的单入口？

# 动态引入文件

### 未添加提示
子模块在执行时进行加载

### prefetch 预获取
父模块加载完毕后，加载子模块

### preload 预加载
父模块与子模块并行加载

### Qs
- 为什么入口文件添加 预加载/预获取提示无效？