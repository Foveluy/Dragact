# Whath is Dragact?

Dragact is a react component, which allows you to build your own **dragable grid layout** easily.

![](https://github.com/215566435/React-dragger-layout/blob/master/example/image/NormalLayoutDemo.gif)

### 快速安装
```
npm install --save dragact
```

### 写一个例子🌰
```javascript
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

# Demo
[Live Demo](http://htmlpreview.github.io/?https://github.com/215566435/React-dragger-layout/blob/master/build/index.html)


# Feature
- [x] auto sorted layout
- [x] mobile device supported
- [x] auto height fixed
- [x] static component
- [x] Draggable component


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



# Contribute

### Want a new feature?
1. If you have a feature request, please add it as an issue or make a pull request.
2. After adding some awesome feature, please run the test and make sure it will pass all tests before you make a PR.

### A bug?
If you have a bug to report, please reproduce the bug in Github issue with a sample code to help us easily isolate it.




# TODO-LIST
- [ ] horizontal swaping
- [ ] resizing
- [ ] touch handle
- [ ] responsive layout
- [ ] SSR/server rendering 
