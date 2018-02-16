# 什么是 Dragact?

Dragact 是一款React组件，他能够使你简单、快速的构建出一款强大的 **拖拽式网格(grid)布局**.

![](https://github.com/215566435/React-dragger-layout/blob/master/example/image/NormalLayoutDemo.gif)

# Demo地址
[Live Demo(预览地址)](http://htmlpreview.github.io/?https://github.com/215566435/React-dragger-layout/blob/master/build/index.html)


# 快速开始
```
npm install --save dragact
```

### 写一个例子🌰
```javascript
//index.js
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dragact } from 'dragact';
import './index.css'

ReactDOM.render(
    <Dragact
        col={8}
        width={800}
        margin={[5, 5]}
        rowHeight={40}
        className='plant-layout'
    >
        <div key={0} data-set={{ GridX: 0, GridY: 0, w: 4, h: 2 }} className='layout-child'>0</div>
        <div key={1} data-set={{ GridX: 0, GridY: 0, w: 1, h: 2 }} className='layout-child'>1</div>
        <div key={2} data-set={{ GridX: 0, GridY: 0, w: 3, h: 2 }} className='layout-child'>2</div>
    </Dragact>,
    document.getElementById('root')
);
```

```css
/** index.css */
.plant-layout {
    border: 1px solid black;
}
.layout-child {
    height: 100%;
    background: #ef4;
    display: flex;
    justify-content: center;
    align-items: center;
}
```

# 特点
- [x] 自动布局的网格系统
- [x] 手机上也可以操作
- [x] 高度自适应
- [x] 静态组件([Live Demo(预览地址)](http://htmlpreview.github.io/?https://github.com/215566435/React-dragger-layout/blob/master/build/index.html))
- [x] Draggable component([Live Demo(预览地址)](http://htmlpreview.github.io/?https://github.com/215566435/React-dragger-layout/blob/master/build/index.html))


# Dragact 提供的属性
```ts
interface DragactProps {
    layout?: DragactLayout[] //暂时不推荐使用
    /** 
     * 宽度切分比 
     * 这个参数会把容器的宽度平均分为col等份
     * 于是容器内元素的最小宽度就等于 containerWidth/col
    */
    col: number,

    /** 
     * 容器的宽度
    */
    width: number,

    /**容器内每个元素的最小高度 */
    rowHeight: number,

    /**
     * 容器内部的padding
     */
    padding?: number,

    children: any[] | any


    // 
    // interface GridItemEvent {
    //     event: any //浏览器拖动事件
    //     GridX: number //在布局中的x格子  
    //     GridY: number //在布局中的y格子  
    //     w: number //元素的宽度
    //     h: number //元素的高度
    //     UniqueKey: string | number //元素的唯一key
    // }

    /**
     * 拖动开始的回调
     */
    onDragStart?: (event: GridItemEvent) => void

    /**
     * 拖动中的回调
     */
    onDrag?: (event: GridItemEvent) => void

    /**
     * 拖动结束的回调
     */
    onDragEnd?: (key: number | string) => void

    /**
     * 每个元素的margin,第一个参数是左右，第二个参数是上下
     */
    margin: [number, number]

    /** 
     * layout的名字
    */
    className: number | string
}

```



# 贡献

### 想要一个新的特色、功能？
1. 如果你想添加一些新功能或者一些非常棒的点子，请发起issue告诉我，谢谢！
2. 如果你已经阅读过源代码，并且添加了一些非常牛X🐂的点子，请发起你的PR.

### 有bug?
如果你发现了本项目的Bug，请务必马上告诉我。添加一个issue，并且帮忙给出最最简单重现的例子，这能让我快速定位到Bug帮你解决，谢谢！




# TODO-LIST
- [ ] horizontal swaping
- [ ] resizing
- [ ] touch handle
- [ ] responsive layout
- [ ] SSR/server rendering 
