"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var utils_1 = require("../utils");
/// <reference path="react.d.ts" />
var doc = document;
var Dragger = /** @class */ (function (_super) {
    __extends(Dragger, _super);
    function Dragger(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            /** x轴位移，单位是px */
            x: 0,
            /** y轴位移，单位是px */
            y: 0,
            /**鼠标点击元素的原始位置，单位是px */
            originX: 0,
            originY: 0,
            isUserMove: true,
            /**已经移动的位移，单位是px */
            lastX: 0,
            lastY: 0,
            /**堆叠的层级 */
            zIndex: 1
        };
        _this.move = _this.move.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        _this.parent = null;
        _this.self = null;
        return _this;
    }
    Dragger.prototype.move = function (event) {
        var _a = this.state, lastX = _a.lastX, lastY = _a.lastY;
        /*  event.client - this.state.origin 表示的是移动的距离,
        *   elX表示的是原来已经有的位移
        */
        var deltaX, deltaY;
        if (event.type.indexOf('mouse') >= 0) {
            deltaX = event.clientX - this.state.originX + lastX;
            deltaY = event.clientY - this.state.originY + lastY;
        }
        else {
            deltaX = event.touches[0].clientX - this.state.originX + lastX;
            deltaY = event.touches[0].clientY - this.state.originY + lastY;
        }
        var bounds = this.props.bounds;
        if (bounds) {
            /**
            * 如果用户指定一个边界，那么在这里处理
            */
            var NewBounds = typeof bounds !== 'string' ? utils_1.parseBounds(bounds) : bounds;
            /**
             * 网格式移动范围设定，永远移动 n 的倍数
             * 注意:设定移动范围的时候，一定要在判断bounds之前，否则会造成bounds不对齐
             */
            var grid = this.props.grid;
            if (Array.isArray(grid) && grid.length === 2) {
                deltaX = Math.round(deltaX / grid[0]) * grid[0];
                deltaY = Math.round(deltaY / grid[1]) * grid[1];
            }
            if (this.props.bounds === 'parent') {
                NewBounds = {
                    left: utils_1.int(this.parent.style.paddingLeft) + utils_1.int(this.self.style.marginLeft) - this.self.offsetLeft,
                    top: utils_1.int(this.parent.style.paddingTop) + utils_1.int(this.self.style.marginTop) - this.self.offsetTop,
                    right: utils_1.innerWidth(this.parent) - utils_1.outerWidth(this.self) - this.self.offsetLeft +
                        utils_1.int(this.parent.style.paddingRight) - utils_1.int(this.self.style.marginRight),
                    bottom: utils_1.innerHeight(this.parent) - utils_1.outerHeight(this.self) - this.self.offsetTop +
                        utils_1.int(this.parent.style.paddingBottom) - utils_1.int(this.self.style.marginBottom)
                };
            }
            /**
             * 保证不超出右边界和底部
             * keep element right and bot can not cross the bounds
             */
            if (NewBounds !== 'parent')
                deltaX = Math.min(deltaX, NewBounds.right);
            if (NewBounds !== 'parent')
                deltaY = Math.min(deltaY, NewBounds.bottom);
            /**
             * 保证不超出左边和上边
             * keep element left and top can not cross the bounds
             */
            if (NewBounds !== 'parent')
                deltaX = Math.max(deltaX, NewBounds.left);
            if (NewBounds !== 'parent')
                deltaY = Math.max(deltaY, NewBounds.top);
        }
        /**如果设置了x,y限制 */
        deltaX = this.props.allowX ? deltaX : 0;
        deltaY = this.props.allowY ? deltaY : 0;
        /**移动时回调，用于外部控制 */
        if (this.props.onMove)
            this.props.onMove(event, deltaX, deltaY);
        this.setState({
            x: deltaX,
            y: deltaY
        });
    };
    Dragger.prototype.onDragStart = function (event) {
        /** 保证用户在移动元素的时候不会选择到元素内部的东西 */
        doc.body.style.userSelect = 'none';
        // if (this.props.hasDraggerHandle) {
        //     if (event.target.className !== 'handle') return
        // }
        /**
         * 把监听事件的回掉函数，绑定在document上
         * 当设置边界的时候，用户鼠标会离开元素的范围
         * 绑定在document上可以使得其依旧能够监听
         * 如果绑定在元素上，则鼠标离开元素，就不会再被监听了
         */
        if (event.type.indexOf('mouse') >= 0) {
            doc.addEventListener('mousemove', this.move);
            doc.addEventListener('mouseup', this.onDragEnd);
        }
        else {
            doc.addEventListener('touchmove', this.move);
            doc.addEventListener('touchend', this.onDragEnd);
        }
        if (this.props.bounds === 'parent' &&
            /**为了让 这段代码不会重复执行 */
            (typeof this.parent === 'undefined' || this.parent === null)) {
            /**
             * 在这里我们将父节点缓存下来，保证当用户鼠标离开拖拽区域时，我们仍然能获取到父节点
             * what we do here is
             * making sure that we still can retrieve our parent when user's mouse left this node.
             */
            this.parent = event.currentTarget.offsetParent; //todo
            /**
             * 我们自己
             * ourself
             */
            this.self = event.currentTarget;
        }
        this.props.onDragStart && this.props.onDragStart(this.state.x, this.state.y);
        var originX, originY;
        if (event.type.indexOf('mouse') >= 0) {
            originX = event.clientX;
            originY = event.clientY;
        }
        else {
            originX = event.touches[0].clientX;
            originY = event.touches[0].clientY;
        }
        this.setState({
            originX: originX,
            originY: originY,
            lastX: this.state.x,
            lastY: this.state.y,
            zIndex: 10
        });
    };
    Dragger.prototype.onDragEnd = function (event) {
        /** 取消用户选择限制，用户可以重新选择 */
        doc.body.style.userSelect = '';
        this.parent = null;
        this.self = null;
        if (event.type.indexOf('mouse') >= 0) {
            doc.removeEventListener('mousemove', this.move);
            doc.removeEventListener('mouseup', this.onDragEnd);
        }
        else {
            doc.removeEventListener('touchmove', this.move);
            doc.removeEventListener('touchend', this.onDragEnd);
        }
        this.setState({
            zIndex: 1
        });
        this.props.onDragEnd && this.props.onDragEnd(event);
    };
    Dragger.prototype.componentDidMount = function () {
        /**
         * 这个函数只会调用一次
         * 这个只是一个临时的解决方案，因为这样会使得元素进行两次刷新
        */
        if (typeof this.props.x === 'number' &&
            typeof this.props.y === 'number') {
            this.setState({
                x: this.props.x,
                y: this.props.y
            });
        }
    };
    Dragger.prototype.componentWillReceiveProps = function (nextProps) {
        /**
         * 外部props 改变的时候更新元素的内部位置
         * 这个api设计其实很不好
         * 以后可能会修改掉
         */
        var isUserMove = nextProps.isUserMove;
        if (!isUserMove) {
            if (typeof nextProps.x === 'number' &&
                typeof nextProps.y === 'number') {
                this.setState({
                    x: nextProps.x,
                    y: nextProps.y,
                    lastX: nextProps.x,
                    lastY: nextProps.y
                });
            }
        }
    };
    Dragger.prototype.render = function () {
        var _a = this.state, x = _a.x, y = _a.y, zIndex = _a.zIndex;
        var _b = this.props, style = _b.style, className = _b.className;
        if (!this.props.isUserMove) {
            /**当外部设置其props的x,y初始属性的时候，我们在这里设置元素的初始位移 */
            x = this.props.x ? this.props.x : 0;
            y = this.props.y ? this.props.y : 0;
        }
        /**主要是为了让用户定义自己的className去修改css */
        var fixedClassName = typeof className === 'undefined' ? '' : className + ' ';
        return (React.createElement("div", { className: fixedClassName + "WrapDragger", style: __assign({}, style, { zIndex: zIndex, touchAction: 'none!important', transform: "translate(" + x + "px," + y + "px)" }), onMouseDown: this.onDragStart.bind(this), onTouchStart: this.onDragStart.bind(this), onTouchEnd: this.onDragEnd.bind(this), onMouseUp: this.onDragEnd.bind(this) }, React.Children.only(this.props.children)));
    };
    /**
     * 初始变量设置
     */
    Dragger.defaultProps = {
        allowX: true,
        allowY: true,
        isUserMove: true
    };
    return Dragger;
}(React.Component));
exports.Dragger = Dragger;
