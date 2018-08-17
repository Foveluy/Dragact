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
var doc = null;
var Dragger = /** @class */ (function (_super) {
    __extends(Dragger, _super);
    function Dragger(props) {
        var _this = _super.call(this, props) || this;
        _this.mQue = 0;
        _this._ismounted = false;
        _this.state = {
            /** x轴位移，单位是px */
            x: _this.props.x || 0,
            /** y轴位移，单位是px */
            y: _this.props.y || 0,
            /**鼠标点击元素的原始位置，单位是px */
            originX: 0,
            originY: 0,
            isUserMove: true,
            /**已经移动的位移，单位是px */
            lastX: 0,
            lastY: 0,
            /**堆叠的层级 */
            zIndex: 1,
            w: _this.props.w || 0,
            h: _this.props.h || 0,
            lastW: 0,
            lastH: 0
        };
        _this.move = function (event) {
            var _a = _this.state, lastX = _a.lastX, lastY = _a.lastY;
            /*  event.client - this.state.origin 表示的是移动的距离,
            *   elX表示的是原来已经有的位移
            */
            var deltaX, deltaY;
            if (event.type.indexOf('mouse') >= 0) {
                deltaX = event.clientX - _this.state.originX + lastX;
                deltaY = event.clientY - _this.state.originY + lastY;
            }
            else {
                deltaX =
                    event.touches[0].clientX -
                        _this.state.originX +
                        lastX;
                deltaY =
                    event.touches[0].clientY -
                        _this.state.originY +
                        lastY;
            }
            var bounds = _this.props.bounds;
            if (bounds) {
                /**
                 * 如果用户指定一个边界，那么在这里处理
                 */
                var NewBounds = typeof bounds !== 'string' ? utils_1.parseBounds(bounds) : bounds;
                /**
                 * 网格式移动范围设定，永远移动 n 的倍数
                 * 注意:设定移动范围的时候，一定要在判断bounds之前，否则会造成bounds不对齐
                 */
                var grid = _this.props.grid;
                if (Array.isArray(grid) && grid.length === 2) {
                    deltaX = Math.round(deltaX / grid[0]) * grid[0];
                    deltaY = Math.round(deltaY / grid[1]) * grid[1];
                }
                if (_this.props.bounds === 'parent') {
                    NewBounds = {
                        left: utils_1.int(_this.parent.style.paddingLeft) +
                            utils_1.int(_this.self.style.marginLeft) -
                            _this.self.offsetLeft,
                        top: utils_1.int(_this.parent.style.paddingTop) +
                            utils_1.int(_this.self.style.marginTop) -
                            _this.self.offsetTop,
                        right: utils_1.innerWidth(_this.parent) -
                            utils_1.outerWidth(_this.self) -
                            _this.self.offsetLeft +
                            utils_1.int(_this.parent.style.paddingRight) -
                            utils_1.int(_this.self.style.marginRight),
                        bottom: utils_1.innerHeight(_this.parent) -
                            utils_1.outerHeight(_this.self) -
                            _this.self.offsetTop +
                            utils_1.int(_this.parent.style.paddingBottom) -
                            utils_1.int(_this.self.style.marginBottom)
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
            deltaX = _this.props.allowX ? deltaX : 0;
            deltaY = _this.props.allowY ? deltaY : 0;
            /**
             * 调整手感
             * 无论是向上移动还是向下移动，全部都是根据重力中心
             * */
            var height = _this.Ref.getClientRects()[0].height;
            var upNdown = _this.state.y - deltaY;
            var fixY = deltaY + (upNdown >= 0 ? 0 : height / 2);
            /**移动时回调，用于外部控制 */
            if (_this.props.onMove)
                _this.props.onMove(event, deltaX, fixY);
            _this.setState({
                x: deltaX,
                y: deltaY
            });
        };
        _this.onDragStart = function (event) {
            /** 保证用户在移动元素的时候不会选择到元素内部的东西 */
            doc.body.style.userSelect = 'none';
            // if (event.target.id !== 'dragact-handle') return
            /**
             * 把监听事件的回掉函数，绑定在document上
             * 当设置边界的时候，用户鼠标会离开元素的范围
             * 绑定在document上可以使得其依旧能够监听
             * 如果绑定在元素上，则鼠标离开元素，就不会再被监听了
             */
            if (event.type.indexOf('mouse') >= 0) {
                doc.addEventListener('mousemove', _this.move);
                doc.addEventListener('mouseup', _this.onDragEnd);
            }
            else {
                doc.addEventListener('touchmove', _this.move);
                doc.addEventListener('touchend', _this.onDragEnd);
            }
            if (_this.props.bounds === 'parent' &&
                /**为了让 这段代码不会重复执行 */
                (typeof _this.parent === 'undefined' || _this.parent === null)) {
                /**
                 * 在这里我们将父节点缓存下来，保证当用户鼠标离开拖拽区域时，我们仍然能获取到父节点
                 * what we do here is
                 * making sure that we still can retrieve our parent when user's mouse left this node.
                 */
                _this.parent = event.currentTarget.offsetParent; //todo
                /**
                 * 我们自己
                 * ourself
                 */
                _this.self = event.currentTarget;
            }
            _this.props.onDragStart &&
                _this.props.onDragStart(_this.state.x, _this.state.y);
            var originX, originY;
            if (event.type.indexOf('mouse') >= 0) {
                originX = event.clientX;
                originY = event.clientY;
            }
            else {
                originX = event.touches[0].clientX;
                originY = event.touches[0].clientY;
            }
            _this.setState({
                originX: originX,
                originY: originY,
                lastX: _this.state.x,
                lastY: _this.state.y,
                zIndex: 10
            });
        };
        _this.onDragEnd = function (event) {
            /** 取消用户选择限制，用户可以重新选择 */
            doc.body.style.userSelect = '';
            _this.parent = null;
            _this.self = null;
            if (event.type.indexOf('mouse') >= 0) {
                doc.removeEventListener('mousemove', _this.move);
                doc.removeEventListener('mouseup', _this.onDragEnd);
            }
            else {
                doc.removeEventListener('touchmove', _this.move);
                doc.removeEventListener('touchend', _this.onDragEnd);
            }
            if (_this._ismounted) {
                _this.setState({
                    zIndex: 1
                });
            }
            _this.props.onDragEnd &&
                _this.props.onDragEnd(event, _this.state.x, _this.state.y);
        };
        _this.onResizeStart = function (event) {
            /** 保证用户在移动元素的时候不会选择到元素内部的东西 */
            doc.body.style.userSelect = 'none';
            doc.addEventListener('mouseup', _this.onResizeEnd);
            doc.addEventListener('mousemove', _this.onResizing);
            var originX, originY;
            originX = event.clientX;
            originY = event.clientY;
            _this.props.onResizeStart &&
                _this.props.onResizeStart(event, _this.state.w, _this.state.h);
            _this.setState({
                originX: originX,
                originY: originY,
                zIndex: 2,
                lastW: _this.state.w,
                lastH: _this.state.h
            });
            event.stopPropagation();
        };
        _this.onResizing = function (event) {
            /*  event.client - this.state.origin 表示的是移动的距离,
            *   elX表示的是原来已经有的位移
            */
            var deltaX, deltaY;
            if (event.type.indexOf('mouse') >= 0) {
                deltaX = event.clientX - _this.state.originX;
                deltaY = event.clientY - _this.state.originY;
            }
            else {
                deltaX =
                    event.touches[0].clientX - _this.state.originX;
                deltaY =
                    event.touches[0].clientY - _this.state.originY;
            }
            /**移动时回调，用于外部控制 */
            _this.props.onResizing &&
                _this.props.onResizing(event, _this.state.w, _this.state.h);
            _this.setState({
                w: deltaX + _this.state.lastW,
                h: deltaY + _this.state.lastH
            });
        };
        _this.onResizeEnd = function (event) {
            doc.body.style.userSelect = '';
            doc.removeEventListener('mousemove', _this.onResizing);
            doc.removeEventListener('mouseup', _this.onResizeEnd);
            _this.props.onResizeEnd &&
                _this.props.onResizeEnd(event, _this.state.w, _this.state.h);
        };
        _this.movePerFrame = function (delt) {
            _this.setState({
                y: _this.state.y + delt
            });
            _this.mQue++;
            if (_this.mQue >= 10) {
                _this.mQue = 0;
                return;
            }
            requestAnimationFrame(function () { return _this.movePerFrame(delt); });
        };
        _this.mixin = function () {
            var dragMix = {
                onMouseDown: _this.onDragStart,
                onTouchStart: _this.onDragStart,
                onTouchEnd: _this.onDragEnd,
                onMouseUp: _this.onDragEnd
            };
            var resizeMix = {
                onMouseDown: _this.onResizeStart,
                onMouseUp: _this.onResizeEnd
            };
            return {
                dragMix: dragMix,
                resizeMix: resizeMix
            };
        };
        // this.move = this.move.bind(this)
        // this.onDragEnd = this.onDragEnd.bind(this)
        _this.parent = null;
        _this.self = null;
        return _this;
    }
    Dragger.prototype.componentDidMount = function () {
        doc = typeof document === 'undefined' ? {} : document;
        this._ismounted = true;
    };
    Dragger.prototype.componentWillUnmount = function () {
        this._ismounted = false;
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
                    y: nextProps.y,
                    x: nextProps.x,
                    lastX: nextProps.x,
                    lastY: nextProps.y,
                    w: nextProps.w,
                    h: nextProps.h
                });
            }
        }
    };
    Dragger.prototype.render = function () {
        var _this = this;
        var _a = this.state, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        var style = this.props.style;
        if (!this.props.isUserMove) {
            /**当外部设置其props的x,y初始属性的时候，我们在这里设置元素的初始位移 */
            x = this.props.x ? this.props.x : 0;
            y = this.props.y ? this.props.y : 0;
            if (style) {
                w = style.width ? style.width : w;
                h = style.height ? style.height : h;
            }
        }
        if (style) {
            //使得初始化的时候，不会有从0-1缩放动画
            w = w === 0 ? style.width : w;
            h = h === 0 ? style.height : h;
        }
        var _b = this.mixin(), dragMix = _b.dragMix, resizeMix = _b.resizeMix;
        var provided = {
            style: __assign({}, style, { touchAction: 'none!important', transform: "translate3d(" + x + "px," + y + "px,0px)", width: w, height: h }),
            ref: function (node) { return (_this.Ref = node); }
        };
        return this.props.children(provided, dragMix, resizeMix);
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
