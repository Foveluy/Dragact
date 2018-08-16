import * as React from "react";
import { int, innerHeight, innerWidth, outerHeight, outerWidth, parseBounds } from '../utils';
import { DraggerProps } from "./type";

const doc = document

type ListenType = 'drag' | 'resize';

var speed = 0;
var timer: any = 0;
var autoScrolling = false;
var autoY = 0;
var currentHeight = 0;

const ScollPostion = () => {
    var t = 0, l = 0, w = 0, h = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;
    } else if (document.body) {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }
    return {
        top: t,
        left: l,
        width: w,
        height: h
    };
}

export class Dragger extends React.Component<DraggerProps, {}> {
    parent: any;
    self: any;

    ListenMove = (type: ListenType) => {
        /** 保证用户在移动元素的时候不会选择到元素内部的东西 */
        doc.body.style.userSelect = 'none'
        if (type === 'resize') {
            doc.addEventListener('mouseup', this.onResizeEnd);
            doc.addEventListener('mousemove', this.onResizing);
            return
        }
        doc.addEventListener('mousemove', this.move);
        doc.addEventListener('mouseup', this.onDragEnd);
    }
    unListenMove = (type: ListenType) => {
        doc.body.style.userSelect = ''
        if (type === 'resize') {
            doc.removeEventListener('mousemove', this.onResizing)
            doc.removeEventListener('mouseup', this.onResizeEnd)
            return
        }
        doc.removeEventListener('mousemove', this.move)
        doc.removeEventListener('mouseup', this.onDragEnd)
    }

    constructor(props: DraggerProps) {
        super(props)
        this.parent = null;
        this.self = null;
    }
    /**
     * 初始变量设置
     */
    static defaultProps = {
        allowX: true,
        allowY: true,
        isUserMove: true
    }

    state = {
        /** x轴位移，单位是px */
        x: this.props.x || 0,

        /** y轴位移，单位是px */
        y: this.props.y || 0,

        /**鼠标点击元素的原始位置，单位是px */
        originX: 0,
        originY: 0,

        isUserMove: true,

        /**已经移动的位移，单位是px */
        lastX: 0,
        lastY: 0,

        /**堆叠的层级 */
        zIndex: 1,

        w: this.props.w || 0,
        h: this.props.h || 0,

        lastW: 0,
        lastH: 0
    }



    move = (event: any) => {

        let { lastX, lastY } = this.state;
        /*  event.client - this.state.origin 表示的是移动的距离,
        *   elX表示的是原来已经有的位移
        */
        let deltaX, deltaY;
        if (event.type.indexOf('mouse') >= 0) {
            deltaX = (event as MouseEvent).clientX - this.state.originX + lastX
            deltaY = (event as MouseEvent).clientY - this.state.originY + lastY
        } else {
            deltaX = (event as TouchEvent).touches[0].clientX - this.state.originX + lastX
            deltaY = (event as TouchEvent).touches[0].clientY - this.state.originY + lastY
        }

        const { bounds } = this.props
        if (bounds) {
            /**
            * 如果用户指定一个边界，那么在这里处理
            */
            let NewBounds = typeof bounds !== 'string' ? parseBounds(bounds) : bounds;

            /**
             * 网格式移动范围设定，永远移动 n 的倍数
             * 注意:设定移动范围的时候，一定要在判断bounds之前，否则会造成bounds不对齐
             */
            const { grid } = this.props
            if (Array.isArray(grid) && grid.length === 2) {
                deltaX = Math.round(deltaX / grid[0]) * grid[0]
                deltaY = Math.round(deltaY / grid[1]) * grid[1]
            }

            if (this.props.bounds === 'parent') {
                NewBounds = {
                    left: int(this.parent.style.paddingLeft) + int(this.self.style.marginLeft) - this.self.offsetLeft,
                    top: int(this.parent.style.paddingTop) + int(this.self.style.marginTop) - this.self.offsetTop,
                    right: innerWidth(this.parent) - outerWidth(this.self) - this.self.offsetLeft +
                        int(this.parent.style.paddingRight) - int(this.self.style.marginRight),
                    bottom: innerHeight(this.parent) - outerHeight(this.self) - this.self.offsetTop +
                        int(this.parent.style.paddingBottom) - int(this.self.style.marginBottom)
                }
            }

            /**
             * 保证不超出右边界和底部
             * keep element right and bot can not cross the bounds
             */
            if (NewBounds !== 'parent') deltaX = Math.min(deltaX, NewBounds.right)
            if (NewBounds !== 'parent') deltaY = Math.min(deltaY, NewBounds.bottom)


            /**
             * 保证不超出左边和上边
             * keep element left and top can not cross the bounds
             */
            if (NewBounds !== 'parent') deltaX = Math.max(deltaX, NewBounds.left)
            if (NewBounds !== 'parent') deltaY = Math.max(deltaY, NewBounds.top)
        }


        /**如果设置了x,y限制 */
        deltaX = this.props.allowX ? deltaX : 0
        deltaY = this.props.allowY ? deltaY : 0

        /**
         * 调整手感 
         * 无论是向上移动还是向下移动，全部都是根据重力中心
         * */
        const height = (this.refs['dragger'] as HTMLDivElement).getClientRects()[0].height;
        const upNdown = this.state.y - deltaY;
        const fixY = deltaY + (upNdown >= 0 ? 0 : height / 2);
        if (!autoScrolling) {
            /**移动时回调，用于外部控制 */

            if (this.props.onMove) this.props.onMove(event, deltaX, fixY)

            // console.log('del', deltaY);
            this.setState({
                x: deltaX,
                y: deltaY,
            })
        }
        if (autoScrolling && speed < 0) {
            clearInterval(timer);
            timer = 0;
            this.setState({//恢复的时候，要设定所有数据是当前的数据
                y: this.state.y,
                lastY: this.state.y,
                originY: event.clientY,
                originX: event.clientX
            })
            if (this.props.onMove) this.props.onMove(event, this.state.x, this.state.y)
            window.scrollTo(0, ScollPostion().top);
            autoScrolling = false;
            speed = 0;
            autoY = 0;
        }
        if (autoScrolling) {

            const check = event.clientY - this.state.originY;
            speed = check / 3;

            this.setState({
                x: deltaX,
                lastY: this.state.y,
                originY: event.clientY,
                originX: event.clientX
            })
        }

        if (!autoScrolling && event.clientY > 650) {
            const totalHeight = document.body.clientHeight - window.innerHeight
            console.log(totalHeight)
            autoScrolling = true;
            currentHeight = ScollPostion().top;
            timer = setInterval(() => {
                autoY += speed;
                if (this.state.y > document.body.clientHeight - 200) clearInterval(timer);
                window.scrollTo(0, currentHeight + autoY);

                this.setState({
                    y: this.state.y + speed,
                    lastY: this.state.y + speed,
                    originY: event.clientY,
                    originX: event.clientX
                })
                if (this.props.onMove) this.props.onMove(event, this.state.x, this.state.y + speed)
            })
        }

    }

    onDragStart = (event: any) => {


        if (this.props.handle) {
            if (event.target.id !== 'dragact-handle') return
        }

        /**
         * 把监听事件的回掉函数，绑定在document上
         * 当设置边界的时候，用户鼠标会离开元素的范围
         * 绑定在document上可以使得其依旧能够监听
         * 如果绑定在元素上，则鼠标离开元素，就不会再被监听了
         */
        if (event.type.indexOf('mouse') >= 0) {
            this.ListenMove('drag');
        } else {
            doc.addEventListener('touchmove', this.move)
            doc.addEventListener('touchend', this.onDragEnd)
        }

        if (this.props.bounds === 'parent' &&
            /**为了让 这段代码不会重复执行 */
            (typeof this.parent === 'undefined' || this.parent === null)) {
            /**
             * 在这里我们将父节点缓存下来，保证当用户鼠标离开拖拽区域时，我们仍然能获取到父节点
             * what we do here is 
             * making sure that we still can retrieve our parent when user's mouse left this node.
             */

            this.parent = (event as any).currentTarget.offsetParent //todo

            /**
             * 我们自己
             * ourself
             */
            this.self = event.currentTarget
        }

        this.props.onDragStart && this.props.onDragStart(this.state.x, this.state.y)


        let originX, originY;
        if (event.type.indexOf('mouse') >= 0) {
            originX = (event as MouseEvent).clientX
            originY = (event as MouseEvent).clientY
        } else {
            originX = (event as TouchEvent).touches[0].clientX
            originY = (event as TouchEvent).touches[0].clientY
        }

        // console.log(originY, this.state.y)


        this.setState({
            originX: originX,
            originY: originY,
            lastX: this.state.x,
            lastY: this.state.y,
            zIndex: 10
        })
    }

    onDragEnd = (event: any) => {
        /** 取消用户选择限制，用户可以重新选择 */
        clearInterval(timer);
        speed = 0;
        autoScrolling = false;
        autoY = 0;
        currentHeight = 0;


        this.parent = null
        this.self = null

        if (event.type.indexOf('mouse') >= 0) {
            this.unListenMove('drag');
        } else {
            doc.removeEventListener('touchmove', this.move)
            doc.removeEventListener('touchend', this.onDragEnd)
        }

        this.setState({
            zIndex: 1
        })

        this.props.onDragEnd && this.props.onDragEnd(event, this.state.x, this.state.y)
    }

    onResizeStart = (event: React.MouseEvent<HTMLSpanElement>) => {
        /** 保证用户在移动元素的时候不会选择到元素内部的东西 */

        this.ListenMove('resize');

        let originX, originY;
        originX = event.clientX
        originY = event.clientY

        this.props.onResizeStart && this.props.onResizeStart(event, this.state.w, this.state.h);

        this.setState({
            originX: originX,
            originY: originY,
            zIndex: 2,
            lastW: this.state.w,
            lastH: this.state.h
        })
        event.stopPropagation();
    }
    onResizing = (event: any) => {
        /*  event.client - this.state.origin 表示的是移动的距离,
        *   elX表示的是原来已经有的位移
        */

        let deltaX, deltaY;
        if (event.type.indexOf('mouse') >= 0) {
            deltaX = (event as MouseEvent).clientX - this.state.originX
            deltaY = (event as MouseEvent).clientY - this.state.originY
        } else {
            deltaX = (event as TouchEvent).touches[0].clientX - this.state.originX
            deltaY = (event as TouchEvent).touches[0].clientY - this.state.originY
        }
        /**移动时回调，用于外部控制 */

        this.props.onResizing && this.props.onResizing(event, this.state.w, this.state.h);

        this.setState({
            w: deltaX + this.state.lastW,
            h: deltaY + this.state.lastH
        })

    }
    onResizeEnd = (event: any) => {
        this.unListenMove('resize');
        this.props.onResizeEnd && this.props.onResizeEnd(event, this.state.w, this.state.h);
    }
    componentWillReceiveProps(nextProps: DraggerProps) {
        /**
         * 外部props 改变的时候更新元素的内部位置
         * 这个api设计其实很不好
         * 以后可能会修改掉
         */
        const { isUserMove } = nextProps
        if (!isUserMove) {

            if (typeof nextProps.x === 'number' &&
                typeof nextProps.y === 'number') {
                this.setState({
                    x: nextProps.x,
                    y: nextProps.y,
                    lastX: nextProps.x,
                    lastY: nextProps.y,
                    w: nextProps.w,
                    h: nextProps.h
                })
            }
        }
    }

    mixin = () => {
        var dragMix = {};
        if (this.props.canDrag === void 666 || this.props.canDrag === true) {
            dragMix = {
                onMouseDown: this.onDragStart,
                onTouchStart: this.onDragStart,
                onTouchEnd: this.onDragEnd,
                onMouseUp: this.onDragEnd
            }
        }

        var resizeMix = {}
        if (this.props.canResize === void 666 || this.props.canDrag === true) {
            resizeMix = {
                onMouseDown: this.onResizeStart,
                onMouseUp: this.onResizeEnd
            }
        }

        return {
            dragMix, resizeMix
        };
    }

    render() {

        var { x, y, w, h } = this.state
        var { style, className, canResize } = this.props
        if (!this.props.isUserMove) {
            /**当外部设置其props的x,y初始属性的时候，我们在这里设置元素的初始位移 */
            x = this.props.x ? this.props.x : 0;
            y = this.props.y ? this.props.y : 0;
            if (style) {
                w = (style as any).width ? (style as any).width : w;
                h = (style as any).height ? (style as any).height : h;
            }
        }
        if (style) {
            //使得初始化的时候，不会有从0-1缩放动画
            w = w === 0 ? (style as any).width : w;
            h = h === 0 ? (style as any).height : h;
        }
        const { dragMix, resizeMix } = this.mixin();

        /**主要是为了让用户定义自己的className去修改css */
        const fixedClassName = typeof className === 'undefined' ? '' : className + ' '
        return (
            <div className={`${fixedClassName}WrapDragger`}
                ref={'dragger'}
                style={{
                    ...style,
                    touchAction: 'none!important',
                    transform: `translate3d(${x}px,${y}px,0px)`,
                    width: w,
                    height: h,
                }}
                {...dragMix}
            >
                {this.props.children ? React.Children.only(this.props.children) : null}
                {canResize !== false ?
                    <span
                        {...resizeMix}
                        style={{
                            position: 'absolute',
                            width: 10, height: 10, right: 2, bottom: 2, cursor: 'se-resize',
                            borderRight: '2px solid rgba(15,15,15,0.2)',
                            borderBottom: '2px solid rgba(15,15,15,0.2)'
                        }}
                    /> : null}
            </div>
        )
    }
}
