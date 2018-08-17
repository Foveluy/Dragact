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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var GridItem_1 = require("./GridItem");
var compact_1 = require("./util/compact");
var sort_1 = require("./util/sort");
var collison_1 = require("./util/collison");
var correction_1 = require("./util/correction");
var utils_1 = require("./utils");
var initiate_1 = require("./util/initiate");
require("./style.css");
var Dragact = /** @class */ (function (_super) {
    __extends(Dragact, _super);
    function Dragact(props) {
        var _this = _super.call(this, props) || this;
        _this.onResizeStart = function (layoutItem) {
            var GridX = layoutItem.GridX, GridY = layoutItem.GridY, w = layoutItem.w, h = layoutItem.h;
            if (_this.state.mapLayout) {
                var newlayout = initiate_1.syncLayout(_this.state.mapLayout, layoutItem);
                _this.setState({
                    GridXMoving: GridX,
                    GridYMoving: GridY,
                    wMoving: w,
                    hMoving: h,
                    placeholderShow: true,
                    placeholderMoving: true,
                    mapLayout: newlayout,
                    dragType: 'resize'
                });
            }
            _this.props.onDragStart &&
                _this.props.onDragStart(layoutItem, _this.state.layout);
        };
        _this.onResizing = function (layoutItem) {
            var newLayout = collison_1.layoutCheck(_this.state.layout, layoutItem, layoutItem.UniqueKey + '', layoutItem.UniqueKey + '', 0);
            var _a = compact_1.compactLayout(newLayout, layoutItem, _this.state.mapLayout), compacted = _a.compacted, mapLayout = _a.mapLayout;
            _this.setState({
                layout: compacted,
                wMoving: layoutItem.w,
                hMoving: layoutItem.h,
                mapLayout: mapLayout,
                containerHeight: sort_1.getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1], _this.state.containerHeight, false)
            });
        };
        _this.onResizeEnd = function (layoutItem) {
            var _a = compact_1.compactLayout(_this.state.layout, undefined, _this.state.mapLayout), compacted = _a.compacted, mapLayout = _a.mapLayout;
            _this.setState({
                placeholderShow: false,
                layout: compacted,
                mapLayout: mapLayout,
                containerHeight: sort_1.getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1], _this.state.containerHeight)
            });
            _this.props.onDragEnd && _this.props.onDragEnd(layoutItem, compacted);
        };
        _this.recalculateLayout = function (layout, col) {
            var corrected = correction_1.correctLayout(layout, col);
            var _a = compact_1.compactLayout(corrected, undefined, undefined), compacted = _a.compacted, mapLayout = _a.mapLayout;
            _this.setState({
                layout: compacted,
                mapLayout: mapLayout,
                containerHeight: sort_1.getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1], _this.state.containerHeight, false)
            });
        };
        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        var layout = props.layout;
        _this.state = {
            GridXMoving: 0,
            GridYMoving: 0,
            wMoving: 0,
            hMoving: 0,
            placeholderShow: false,
            placeholderMoving: false,
            layout: layout,
            containerHeight: 500,
            dragType: 'drag',
            mapLayout: undefined
        };
        return _this;
    }
    Dragact.prototype.onDragStart = function (bundles) {
        var GridX = bundles.GridX, GridY = bundles.GridY, w = bundles.w, h = bundles.h;
        if (this.state.mapLayout) {
            this.setState({
                GridXMoving: GridX,
                GridYMoving: GridY,
                wMoving: w,
                hMoving: h,
                placeholderShow: true,
                placeholderMoving: true,
                mapLayout: initiate_1.syncLayout(this.state.mapLayout, bundles),
                dragType: 'drag'
            });
        }
        this.props.onDragStart &&
            this.props.onDragStart(bundles, this.state.layout);
    };
    Dragact.prototype.onDrag = function (layoutItem) {
        var GridY = layoutItem.GridY, UniqueKey = layoutItem.UniqueKey;
        var moving = GridY - this.state.GridYMoving;
        var newLayout = collison_1.layoutCheck(this.state.layout, layoutItem, UniqueKey + '', UniqueKey + '' /*用户移动方块的key */, moving);
        var _a = compact_1.compactLayout(newLayout, layoutItem, this.state.mapLayout), compacted = _a.compacted, mapLayout = _a.mapLayout;
        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: sort_1.getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight)
        });
        this.props.onDrag && this.props.onDrag(layoutItem, compacted);
    };
    Dragact.prototype.onDragEnd = function (layoutItem) {
        var _a = compact_1.compactLayout(this.state.layout, undefined, this.state.mapLayout), compacted = _a.compacted, mapLayout = _a.mapLayout;
        this.setState({
            placeholderShow: false,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: sort_1.getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight)
        });
        this.props.onDragEnd && this.props.onDragEnd(layoutItem, compacted);
    };
    Dragact.prototype.renderPlaceholder = function () {
        if (!this.state.placeholderShow)
            return null;
        var _a = this.props, col = _a.col, padding = _a.padding, rowHeight = _a.rowHeight, margin = _a.margin, placeholder = _a.placeholder, width = _a.width;
        var _b = this.state, GridXMoving = _b.GridXMoving, GridYMoving = _b.GridYMoving, wMoving = _b.wMoving, hMoving = _b.hMoving, placeholderMoving = _b.placeholderMoving, dragType = _b.dragType;
        if (!placeholder)
            return null;
        if (!padding)
            padding = 0;
        return (React.createElement(GridItem_1.default, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, GridX: GridXMoving, GridY: GridYMoving, w: wMoving, h: hMoving, style: {
                background: 'rgba(15,15,15,0.3)',
                zIndex: dragType === 'drag' ? 1 : 10,
                transition: ' all .15s ease-out'
            }, isUserMove: !placeholderMoving, dragType: dragType, canDrag: false, canResize: false }, function (p, resizerProps) { return React.createElement("div", __assign({}, p)); }));
    };
    Dragact.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.layout.length > nextProps.layout.length) {
            //remove
            var mapLayoutCopy_1 = __assign({}, this.state.mapLayout);
            nextProps.layout.forEach(function (child) {
                if (mapLayoutCopy_1[child.key + ''] !== void 666)
                    delete mapLayoutCopy_1[child.key + ''];
            });
            var copyed_1 = __assign({}, this.state.mapLayout);
            var newLayout_1 = nextProps.layout.map(function (item) {
                var w = item.w, h = item.h, GridX = item.GridX, GridY = item.GridY, key = item.key, others = __rest(item, ["w", "h", "GridX", "GridY", "key"]);
                return __assign({}, copyed_1[item.key], { others: others });
            });
            var _a = compact_1.compactLayout(newLayout_1, undefined, this.state.mapLayout), compacted = _a.compacted, mapLayout = _a.mapLayout;
            this.setState({
                containerHeight: sort_1.getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight),
                layout: compacted,
                mapLayout: mapLayout
            });
        }
        else if (this.props.layout.length < nextProps.layout.length) {
            //add
            var copyed_2 = __assign({}, this.state.mapLayout);
            var newLayout = nextProps.layout.map(function (v) {
                if (copyed_2[v.key]) {
                    return __assign({}, v, { GridX: copyed_2[v.key].GridX, GridY: copyed_2[v.key].GridY, w: copyed_2[v.key].w, h: copyed_2[v.key].h, key: copyed_2[v.key].key });
                }
                return __assign({}, v, { isUserMove: false, key: v.key + '' });
            });
            var _b = compact_1.compactLayout(newLayout, undefined, this.state.mapLayout), compacted = _b.compacted, mapLayout = _b.mapLayout;
            this.setState({
                containerHeight: sort_1.getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight, false),
                layout: compacted,
                mapLayout: mapLayout
            });
        }
        else {
            this.recalculateLayout(nextProps.layout, nextProps.col);
        }
    };
    Dragact.prototype.componentDidMount = function () {
        var _this = this;
        setTimeout(function () {
            _this.recalculateLayout(_this.state.layout, _this.props.col);
        }, 1);
    };
    Dragact.prototype.getGridItem = function (child, index) {
        var _this = this;
        var _a = this.state, dragType = _a.dragType, mapLayout = _a.mapLayout;
        var _b = this.props, col = _b.col, padding = _b.padding, rowHeight = _b.rowHeight, margin = _b.margin, width = _b.width;
        if (mapLayout) {
            var renderItem_1 = initiate_1.layoutItemForkey(mapLayout, child.key + '');
            if (!padding)
                padding = 0;
            return (React.createElement(GridItem_1.default, __assign({}, renderItem_1, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, onDrag: this.onDrag, onDragStart: this.onDragStart, onDragEnd: this.onDragEnd, isUserMove: renderItem_1.isUserMove !== void 666
                    ? renderItem_1.isUserMove
                    : false, UniqueKey: child.key, onResizing: this.onResizing, onResizeStart: this.onResizeStart, onResizeEnd: this.onResizeEnd, dragType: dragType, key: child.key }), function (GridItemProvided, dragHandle, resizeHandle) {
                return _this.props.children(child, {
                    isDragging: renderItem_1.isUserMove !== void 666
                        ? renderItem_1.isUserMove
                        : false,
                    props: GridItemProvided,
                    dragHandle: dragHandle,
                    resizeHandle: resizeHandle
                });
            }));
        }
    };
    Dragact.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, layout = _a.layout, style = _a.style, width = _a.width;
        var containerHeight = this.state.containerHeight;
        return (React.createElement("div", { className: utils_1.stringJoin('DraggerLayout', className + ''), style: __assign({}, style, { left: 100, width: width, height: containerHeight, zIndex: 1 }) },
            layout.map(function (item, index) {
                return _this.getGridItem(item, index);
            }),
            this.renderPlaceholder()));
    };
    //api
    Dragact.prototype.getLayout = function () {
        return this.state.layout;
    };
    //api
    Dragact.prototype.deleteItem = function (key) { };
    return Dragact;
}(React.Component));
exports.Dragact = Dragact;
