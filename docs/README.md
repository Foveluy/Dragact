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

<br/>

# 快速开始

```bash
npm install --save dragact
```

### 最简单的例子 🌰

```javascript
//index.js
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Dragact } from 'dragact'

const fakeData = [
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '0' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '1' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '2' }
]

const getblockStyle = isDragging => {
    return {
        background: isDragging ? '#1890ff' : 'white'
    }
}

ReactDOM.render(
    <Dragact
        layout={fakeData} //必填项
        col={16} //必填项
        width={800} //必填项
        rowHeight={40} //必填项
        margin={[5, 5]} //必填项
        className="plant-layout" //必填项
        style={{ background: '#333' }} //非必填项
        placeholder={true}
    >
        //非必填项
        {(item, provided) => {
            return (
                <div
                    {...provided.props}
                    {...provided.dragHandle}
                    style={{
                        ...provided.props.style,
                        ...getblockStyle(provided.isDragging)
                    }}
                >
                    {provided.isDragging ? '正在抓取' : '停放'}
                </div>
            )
        }}
    </Dragact>,
    document.getElementById('root')
)
```

# 组件设计哲学

### 1.依赖注入式的挂件(widget)

可以从最简单的例子看出，我们渲染子组件的方式和以往有些不同。以往的 React 组件书写方式，采用的是类似以下写法：

```jsx
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
```

这么做当然可以，但是有几个问题：

-   子组件非常的丑，需要我们定义一大堆东西
-   很难监听到子组件的事件，比如是否拖拽等
-   如果有大量的数据时，就必须写对数组写一个 map 函数，类似:`layout.map(item=>item);` 来帮助渲染数组

为了解决这个问题，我将子组件的渲染方式进行高度抽象成为一个**构造器**，简单来说就是以下的形式：

```jsx
    <Dragact
        layout={fakeData}//必填项
        {...something}
    >
        {(item, provided) => {
            return (
                <div
                    {...provided.props}
                    {...provided.dragHandle}
                    style={{
                        ...provided.props.style,
                        ...getblockStyle(provided.isDragging)
                    }}
                >
                    {provided.isDragging ? '正在抓取' : '停放'}
                </div>
            )
        }}
    </Dragact>,
```

现在，我们子元素渲染变成一个小小的**构造函数**，第一个入参是您输入数据的每一项，第二个参数就是**provided**，提供了所有的拖拽属性。

这么做，轻易的实现了，减少组件层级，组件漂亮，不用写 map 函数，不用写 key，同时更容易监听每一个组件的拖拽状态**provided.isDragging**.

更多的依赖注入思想以及好处，请看我的知乎问答：[知乎，方正的回答：如何设计一款组件库](https://www.zhihu.com/question/266745124/answer/322998960)

### 2.流畅的组件滑动

为了保证拖拽时候的手感舒适，我通过设置元素的 translate(x,y)来进行实现，并且配合 CSS 动画，使得每一步的移动都是那么的顺畅。

你能够很轻易的看到每一个组件到底滑向哪里，到底坐落在哪里。

### 3.数据驱动的模式

> 视图的改变就是数据的改变

这是 React 给我们的一个启示，Dragact 组件通过对数据的处理，达到了数据变化即视图变化。

这么做的好处就是我们可以轻松的**将布局信息记录在服务器的数据库中**，下一次拿到数据的时候，就可以轻松的**恢复原来的视图位置**。

通过获取 dragact 组件的实例，我提供了一个 api `getLayout():DragactLayout;`，用于获取当前的**布局信息**。

### 4.滑动中心

经过不断的努力和尝试，现在所有的 widget 移动都是依赖重力中心去移动的。

这意味着当我们拖动一个 widget 的时候更加得心应手和自然。

看看`dragact`优化前是怎样的

![非常长的一条块，已经拖动超出了屏幕很多才会交换方块](https://pic2.zhimg.com/v2-9180ee016a4d01834565de5c126263c1_b.gif)

再看看优化以后的`dragact`是怎样的体验

![当长方条的中心，超过下面方块的中心的时候，就会发生移动](https://pic3.zhimg.com/v2-0f6ac6fe7b7980ad07b9af78625fca4d_b.gif)

这样的一种优化，带来的是拖动手感的差异，我们向下拖动物块的目的，很大程度上是因为想和下方的某一物块交换位置。

通过这种趋势的判断和大量实验，`dragact`选择了重力中心为移动点，更自然，手感更顺滑.

### 5.性能优异

让我们用直观的动图来观看性能吧！

![](https://pic3.zhimg.com/v2-3a9a1c2894ccbf4bbf791b9aa82912b2_b.gif)

这是一条超过 300 行的大量数据，在优化前，我们可以看到，会有明显的卡顿。

![](https://pic3.zhimg.com/v2-4d11298ef72730d686172a149f1f135d_b.gif)

用过 react 组件的优化后，依旧是一条超过 300 行的大量数据。

可以看到组件插入速度的明显的变化。

# Dragact 提供的属性

### 数据属性

数据属性指的是我们每一个组件所拥有的属性,类似以下的一组数据

```ts
const layout = [
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '0' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '1' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '2' }
]

GridX: number //必填，挂件布局中的横坐标
GridY: number //必填，挂件布局中的纵坐标
w: number //必填，挂件布局中宽度，整数
h: number //必填，挂件布局中高度，整数
key: number | string //必填，挂件在布局中的唯一id
```

<br/>
### 组件属性
```ts
export interface DragactProps {
    layout: DragactLayoutItem[]
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

    children: (Item: DragactLayoutItem, provided: GridItemProvided) => any,


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
    onDragEnd?: (event: GridItemEvent) => void

    /**
     * 每个元素的margin,第一个参数是左右，第二个参数是上下
     */
    margin: [number, number]

    /**
     * layout的名字
    */
    className: number | string

    /**是否有placeholder */
    placeholder?: Boolean

    style?: React.CSSProperties

}

````
# Ref Api

获取到组件的 ref，就可以使用其 api

```ts
/*
返回当前的layout.
*/
getLayout():DragactLayout;
```

# 测试

```bash
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
````
