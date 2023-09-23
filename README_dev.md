# Code Maker (代码助手)

### 启动项目

1. 安装依赖

```
npm i
```

2. 生成 dist 目录，并且实现热更新

```
npm run dev
```

3. 进行调试

通过 VSCode 顶部菜单的 Run -> Start Debugging 进行调试
Debug AnyWay
会打开一个新的继承了本项目插件的 VSCode，对其进行功能调试。

4. 本地打包

```
npm run vsce
```

5. 发布

参考官方文档

> 输出项目结构

```bash
tree -L 3 -I "node_modules|dist|build|out" > tree.md
```

> 安装工具

```bash
npm install -g vsce
```

> 令牌失效

```bash
1. vsce login username
2. Y
3. Input Personal Access Tokens

https://marketplace.visualstudio.com/manage/publishers/

https://dev.azure.com/gengjian1203/_usersSettings/tokens
```

> 打包发布

```bash
vsce publish 2.0.0
```

**Enjoy!**
