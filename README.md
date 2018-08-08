# Dragact 👋

[![npm version](https://img.shields.io/npm/v/dragact.svg)](https://www.npmjs.com/package/dragact) [![npm downloads](https://img.shields.io/npm/dm/dragact.svg)](https://www.npmjs.com/package/dragact)

Dragact 是一款 React 组件，他能够使你简单、快速的构建出一款强大的 **拖拽式网格(grid)布局**.

![](https://github.com/215566435/Dragact/blob/master/static/image/dashboard.gif?raw=true)

# Demo 地址 ✌️

[Live Demo(预览地址)](http://htmlpreview.github.io/?https://github.com/215566435/React-dragger-layout/blob/master/build/index.html)

# 特点

-   [x] 自动布局的网格系统
-   [x] 手机上也可以操作
-   [x] 高度自适应
-   [x] 静态组件
-   [x] 拖拽组件
-   [x] 自动缩放组件
-   [x] 自定义拖拽把手
-   [x] 自定义缩放把手
-   [x] 响应式布局

# 快速开始

[官方文档](https://github.com/Foveluy/Dragact/tree/master/docs)

# ChangeLog

v0.2.8

-   版本跳跃
-   添加增加 add/remove 布局
-   新增记忆布局 demo
-   更新 col,width,rowHeight 以后，会动态进行更新
-   [fix]修复更新数据视图内部不更新的 bug

v0.1.7

-   优化性能-使用 reselect 的原理
-   拖拽手感优化
-   优化 dom 的层级
-   自定义拖拽把手和 resize 把手
-   拓展了 child 的渲染方式

v0.1.6

-   修正 zIndex 的错误
-   新增拖拽把手
-   自由选择拖拽和 resize
-   添加删除逻辑
-   修改成 child 渲染方式
-   placeholder 选择

v0.1.3

-   新增组件 api:`getLayout`，用于获取当前的 layout.
-   新增组件的 resize

# 测试

```
git clone https://github.com/215566435/Dragact.git
cd Dragact
npm install
npm run test
```

# 贡献

### 想要一个新的特色、功能？

1.  如果你想添加一些新功能或者一些非常棒的点子，请发起 issue 告诉我，谢谢！
2.  如果你已经阅读过源代码，并且添加了一些非常牛 X🐂 的点子，请发起你的 PR.

### 有 bug?

如果你发现了本项目的 Bug，请务必马上告诉我。添加一个 issue，并且帮忙给出最最简单重现的例子，这能让我快速定位到 Bug 帮你解决，谢谢！

# LICENSE

MIT
