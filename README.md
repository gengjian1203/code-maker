# Code Maker (代码助手)

一款致力于可以工程化生成模板代码片段的 VSCode 开源插件。  
如果有觉得还可以的同学帮忙点个小星星~  
[https://github.com/gengjian1203/code-maker](https://github.com/gengjian1203/code-maker)

目前支持以下框架。（可通过插件设置页`settings.json`调整开关对应脚本）

### 一、Taro(QM)

1.  资源管理器目录右键生成 Taro(QM)组件模板。
2.  资源管理器目录右键生成 Taro(QM)页面模板，并且自动插入路由子包注册文件。(保留注释内容)
3.  资源管理器目录右键更新 Taro(QM)Iconfont 引用样式。
4.  支持命令“编辑 Taro(QM)组件模板”。
5.  支持命令“编辑 Taro(QM)页面模板”。
6.  代码片段

```
// cm.mapx
{items.map((item, index) => (
  <View key={index}>
    item
  </View>
))}
```

### 开发插件附录

> 自动化生成 VSCode 插件命令的 CLI 工具。
> 优化新建插件命令的体验。

```bash
node ./cli.js
```

> 输出项目结构

```bash
tree -L 3 -I "node_modules|dist|build|out" > tree.md
```

**Enjoy!**
