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
var index_1 = require("./dragger/index");
var correction_1 = require("./util/correction");
var checkWidthHeight = function (GridX, w, h, col) {
    var newW = w;
    var newH = h;
    if (GridX + w > col - 1)
        newW = col - GridX; //右边界
    if (w < 1)
        newW = 1;
    if (h < 1)
        newH = 1;
    return {
        w: newW, h: newH
    };
};
var GridItem = /** @class */ (function (_super) {
    __extends(GridItem, _super);
    function GridItem(props) {
        var _this = _super.call(this, props) || this;
        _this.onResizeStart = function (event, wPx, hPx) {
            var _a = _this.props, GridX = _a.GridX, GridY = _a.GridY, UniqueKey = _a.UniqueKey, w = _a.w, h = _a.h;
            _this.props.onResizeStart && _this.props.onResizeStart({ GridX: GridX, GridY: GridY, w: w, h: h, UniqueKey: UniqueKey + '', event: event });
        };
        _this.onResizing = function (event, wPx, hPx) {
            var _a = _this.calPxToWH(wPx, hPx), w = _a.w, h = _a.h;
            var _b = _this.props, GridX = _b.GridX, GridY = _b.GridY, UniqueKey = _b.UniqueKey;
            _this.props.onResizing && _this.props.onResizing({ GridX: GridX, GridY: GridY, w: w, h: h, UniqueKey: UniqueKey + '', event: event });
        };
        _this.onResizeEnd = function (event, wPx, hPx) {
            var _a = _this.calPxToWH(wPx, hPx), w = _a.w, h = _a.h;
            var _b = _this.props, GridX = _b.GridX, GridY = _b.GridY, UniqueKey = _b.UniqueKey;
            _this.props.onResizeEnd && _this.props.onResizeEnd({ GridX: GridX, GridY: GridY, w: w, h: h, UniqueKey: UniqueKey + '', event: event });
        };
        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        _this.calGridXY = _this.calGridXY.bind(_this);
        _this.calColWidth = _this.calColWidth.bind(_this);
        return _this;
    }
    /** 计算容器的每一个格子多大 */
    GridItem.prototype.calColWidth = function () {
        var _a = this.props, containerWidth = _a.containerWidth, col = _a.col, containerPadding = _a.containerPadding, margin = _a.margin;
        if (margin) {
            return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col;
        }
        return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col;
    };
    /**转化，计算网格的GridX,GridY值 */
    GridItem.prototype.calGridXY = function (x, y) {
        var _a = this.props, margin = _a.margin, containerWidth = _a.containerWidth, col = _a.col, w = _a.w, rowHeight = _a.rowHeight;
        /**坐标转换成格子的时候，无须计算margin */
        var GridX = Math.round(x / containerWidth * col);
        var GridY = Math.round(y / (rowHeight + (margin ? margin[1] : 0)));
        // /**防止元素出container */
        return correction_1.checkInContainer(GridX, GridY, col, w);
    };
    /**给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px */
    GridItem.prototype.calGridItemPosition = function (GridX, GridY) {
        var _a = this.props, margin = _a.margin, rowHeight = _a.rowHeight;
        if (!margin)
            margin = [0, 0];
        var x = Math.round(GridX * this.calColWidth() + (GridX + 1) * margin[0]);
        var y = Math.round(GridY * rowHeight + margin[1] * (GridY + 1));
        return {
            x: x,
            y: y
        };
    };
    GridItem.prototype.shouldComponentUpdate = function (props, state) {
        var _this = this;
        var isUpdate = false;
        Object.keys(props).forEach(function (key) {
            if (props[key] !== _this.props[key]) {
                isUpdate = true;
            }
        });
        return isUpdate;
        // return this.props.GridX !== props.GridX ||
        //     this.props.GridY !== props.GridY ||
        //     this.props.isUserMove !== props.isUserMove ||
        //     this.props.w !== props.w ||
        //     this.props.h !== props.h ||
        //     this.props.containerWidth !== props.containerWidth ||
        //     this.props.col !== props.col ||
        //     this.props.rowHeight !== props.rowHeight
    };
    /**宽和高计算成为px */
    GridItem.prototype.calWHtoPx = function (w, h) {
        var margin = this.props.margin;
        if (!margin)
            margin = [0, 0];
        var wPx = Math.round(w * this.calColWidth() + (w - 1) * margin[0]);
        var hPx = Math.round(h * this.props.rowHeight + (h - 1) * margin[1]);
        return { wPx: wPx, hPx: hPx };
    };
    GridItem.prototype.calPxToWH = function (wPx, hPx) {
        var calWidth = this.calColWidth();
        var w = Math.round((wPx - calWidth * 0.5) / calWidth);
        var h = Math.round((hPx - this.props.rowHeight * 0.5) / this.props.rowHeight);
        return checkWidthHeight(this.props.GridX, w, h, this.props.col);
    };
    GridItem.prototype.onDragStart = function (x, y) {
        var _a = this.props, w = _a.w, h = _a.h, UniqueKey = _a.UniqueKey;
        if (this.props.static)
            return;
        var _b = this.calGridXY(x, y), GridX = _b.GridX, GridY = _b.GridY;
        this.props.onDragStart && this.props.onDragStart({
            event: null, GridX: GridX, GridY: GridY, w: w, h: h, UniqueKey: UniqueKey + ''
        });
    };
    GridItem.prototype.onDrag = function (event, x, y) {
        if (this.props.static)
            return;
        var _a = this.calGridXY(x, y), GridX = _a.GridX, GridY = _a.GridY;
        var _b = this.props, w = _b.w, h = _b.h, UniqueKey = _b.UniqueKey;
        this.props.onDrag && this.props.onDrag({ GridX: GridX, GridY: GridY, w: w, h: h, UniqueKey: UniqueKey + '', event: event });
    };
    GridItem.prototype.onDragEnd = function (event, x, y) {
        if (this.props.static)
            return;
        var _a = this.calGridXY(x, y), GridX = _a.GridX, GridY = _a.GridY;
        var _b = this.props, w = _b.w, h = _b.h, UniqueKey = _b.UniqueKey;
        if (this.props.onDragEnd)
            this.props.onDragEnd({ GridX: GridX, GridY: GridY, w: w, h: h, UniqueKey: UniqueKey + '', event: event });
    };
    GridItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, w = _a.w, h = _a.h, style = _a.style, bounds = _a.bounds, GridX = _a.GridX, GridY = _a.GridY, handle = _a.handle, canDrag = _a.canDrag, canResize = _a.canResize;
        var _b = this.calGridItemPosition(GridX, GridY), x = _b.x, y = _b.y;
        var _c = this.calWHtoPx(w, h), wPx = _c.wPx, hPx = _c.hPx;
        return (React.createElement(index_1.Dragger, { style: __assign({}, style, { width: wPx, height: hPx, position: 'absolute', transition: this.props.isUserMove ? '' : 'all .2s ease-out', zIndex: this.props.isUserMove ? (this.props.dragType === 'drag' ? 10 : 2) : 2 }), onDragStart: this.onDragStart, onMove: this.onDrag, onDragEnd: this.onDragEnd, onResizeStart: this.onResizeStart, onResizing: this.onResizing, onResizeEnd: this.onResizeEnd, x: x, y: y, w: wPx, h: hPx, isUserMove: this.props.isUserMove, bounds: bounds, handle: handle, canDrag: canDrag, canResize: canResize }, function (provided, draggerProps, resizerProps) { return _this.props.children(provided, draggerProps, resizerProps); }));
    };
    GridItem.defaultProps = {
        col: 12,
        containerWidth: 500,
        containerPadding: [0, 0],
        margin: [10, 10],
        rowHeight: 30,
        w: 1,
        h: 1
    };
    return GridItem;
}(React.Component));
exports.default = GridItem;
