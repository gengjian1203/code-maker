# Code Maker (代码助手)

一款致力于可以工程化生成模板代码片段的 VSCode 开源插件。  
如果有觉得还可以的同学帮忙点个小星星~  
[https://github.com/gengjian1203/code-maker](https://github.com/gengjian1203/code-maker)

> 目前支持以下框架。（可通过插件设置页`settings.json`，搜索`code-maker`，调整本插件功能开关。）

## 一、Taro

### a) 左侧资源管理器

1.  资源管理器目录右键生成 Taro 组件模板。
2.  资源管理器目录右键生成 Taro 页面模板。
3.  资源管理器目录右键快速打开工作区，以此目录为根路径新建 VSCode window。

### b) 编译器右键弹出菜单

1. 自动构建 className 模板，当前 React、Taro 的样式类名进行自动声明。

### c) 编译器面板右上角 icon，自定义 Web 页面

1. 常用工具页面。

### d) 手动输入命令（Command + P）

1. 编辑 Taro 组件模板。
2. 编辑 Taro 页面模板。
3. 常用工具页面。

### e) 代码片段

1. cm.mapx

```
{items.map((item, index) => (
  <View key={index}>
    item
  </View>
))}
```

### f) 左侧自定义面板

1. Code Maker 助手。

## 开发插件附录

> 自动化生成 VSCode 插件命令的 CLI 工具。
> 优化新建插件命令的体验。

```bash
node ./cli.js
```

> 输出项目结构

```bash
tree -L 3 -I "node_modules|dist|build|out" > tree.md
```

> 开发顺序

```bash
1. yarn install
2. Run -> Run Without Debugging -> Debug AnyWay
```

**Enjoy!**
