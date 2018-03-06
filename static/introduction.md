先来一张图看看：

![](https://pic2.zhimg.com/v2-be78772ecb385c15a93e1624582ef0e5_b.gif)

项目地址：[Github地址 (无耻求星！）](http://htmlpreview.github.io/?https://github.com/215566435/React-dragger-layout/blob/master/build/index.html)

在线观看（第一次加载需要等几秒）：[预览地址](http://link.zhihu.com/?target=http%3A//htmlpreview.github.io/%3Fhttps%3A//github.com/215566435/React-dragger-layout/blob/master/build/index.html)


说起来不容易，人在国外没有过年一说，但是毕竟也是中国年，虽然不放假，但是家里总会主内一顿丰盛的年夜饭。



说吧，人家在上班，我在家里过年，那肯定就不同步了。



不同步会发生什么？

![](https://pic2.zhimg.com/80/v2-b7d3c79ec4c1eac28c42af8d178a38e8_hd.jpg)

#拖拽组件

大概三四个月以前，我写了一篇[《「实战」React实现的拖拽组件》](https://zhuanlan.zhihu.com/p/29608094)，只不过，这个组件比较基础，仅仅支持电脑端的使用，而且不能支持拖拽排序，显然不是很符合要求。

也尝试找了几款组件，想改吧改吧就上了，但是一些组件都蛮老的了，还是jQ的，不是很符合我们的技术栈。



想想还是算了，自己造一个轮子吧，反正我那么爱造轮子，顺手写一个也无所谓。

#Typescript（TS）
最近一直在使用TS进行开发，Eggjs的Ts实践也写了一半。这玩意儿，真的是有毒的，因为能让你上瘾。



随便将一个项目迁移到TS之上，在强大的静态类型检测下，你就能轻松的发现一堆逻辑和边界错误。一番重构之后，顿时感觉代码神清气爽，头皮恢复了生机！



所以，这款组件完全是用Typescript进行开发，使得使用TS的小伙伴来说，更加方便快捷。其次，如果你想使用Javascript开发，也是完全没有问题的。

# 造轮子的一些思考
首先，我们的需求是用户能够方便的调整后台dash board的各种表盘位置。

![](https://pic2.zhimg.com/80/v2-04d984af261c8f0537736920e7c9f055_hd.jpg)
[图片来自：https://github.com/yezihaohao/react-admin](：https://github.com/yezihaohao/react-admin)

类似一个这样的界面，我们需要对其里面的组件进行各种各样的拖动（**不得不说一句，他妈的，老子都做好了后台系统你就用就可以了，拖你妹啊，不让人好好吃年夜饭。**）



那么首先，我们就要考虑几个点：

- 技术栈是React
- 固定范围(Container)内的所有挂件不能超出这个范围。
- 每个挂件可以设定大小，并且按一定的margin上下分割开。
- Container内的所有组件必须不能重叠，还要能自动排序
- 某些组件要可以设定静态的，也就是固定在那里，不被布局的任何变动而影响。
- 手机也可以操作

# 动手开始
得益于之前写过拖拽组件，避开了很多坑，也是写下[这款组件](https://github.com/215566435/Dragact)，主要有得特点是：

- React组件
- 自动布局的网格系统
- 手机上也可以操作
- 高度自适应
- 静态组件(Live Demo(预览地址))
- 可拖拽的组件(Live Demo(预览地址))

终于在大年初二早上，弄完了这款组件，基本可以满足客户需求，然而还有一些TODO LIST：

- 水平交换模式，目前移动的时候不是
- 用户动态调整每个挂件的大小，就像Windows窗口一样
- 挂件拖动把手
- 支持响应式
- 支持ssr，服务器渲染

# 如何开始？
```bash
npm install --save dragact
```
# 写一个例子
```tsx

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

#加点css
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

# 想要一个新的特色、功能？
 
如果你想添加一些新功能或者一些非常棒的点子，请发起issue告诉我，谢谢！
如果你已经阅读过源代码，并且添加了一些非常牛X🐂的点子，请发起你的PR.
# 有bug?

如果你发现了本项目的Bug，请务必马上告诉我。添加一个issue，并且帮忙给出最最简单重现的例子，这能让我快速定位到Bug帮你解决，谢谢！

#最后
这是2018年的[第二个轮子](https://github.com/215566435/Dragact)了。



造轮子训练的能力当然不是只有把轮子重新写一遍的能力，还有一个很重要的因素就是：心态。



为什么我说的是心态呢？我举一个生活中的例子，你去新买一台iPhone，假设以前根本没有用过iPhone，买到手的时候，肯定会小心翼翼的去使用其中的功能，基本上就是这个不敢设置，另外一个不敢设置，这个不敢按，那个不敢碰。但是随着时间久了，你熟悉了iPhone，每个角落都被你玩透了，你就不在乎了，随便玩，随便调，厉害的刷机越狱改主题。



这就是心态的变化，应用到编程之中也是如此。刚开始的时候，你拿到别人框架来用，非常的不熟练，跟着作者写的案例，设置成功，解决了你的问题，你就不敢再碰那一段代码了。随后，新的需求来了，你必须要在原有的基础上加新功能，然而作者这时候因为某些原因不再维护那个软件了，你要么找新的，要么就是深入看代码。



刚开始的时候，你可能只是调整框架代码里面的参数，随着越来越的需求，你改的越来越多，这个框架你开始熟悉，逐渐逐渐的，你就压根不怕需求来了，因为你太熟悉了。



这个过程相当的漫长，聪明的人几个月，比较笨的人或者懒惰的人，可能10年。为了快速获得这种心态的转变，你要做的就是「造轮子」。这是一个最快的办法，也是最土最笨的办法，但是确实是一个「必须有效的办法」。

