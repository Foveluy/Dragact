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
import * as React from "react";
import GridItem from './GridItem';
import { compactLayout } from './util/compact';
import { getMaxContainerHeight } from './util/sort';
import { layoutCheck } from './util/collison';
import { correctLayout } from './util/correction';
import { getDataSet, stringJoin } from './utils';
import { layoutItemForkey, syncLayout, MapLayoutTostate } from './util/initiate';
import './style.css';
var Dragact = /** @class */ (function (_super) {
    __extends(Dragact, _super);
    function Dragact(props) {
        var _this = _super.call(this, props) || this;
        _this.onResizeStart = function (layoutItem) {
            var GridX = layoutItem.GridX, GridY = layoutItem.GridY, w = layoutItem.w, h = layoutItem.h;
            var sync = syncLayout(_this.state.layout, layoutItem);
            _this.setState({
                GridXMoving: GridX,
                GridYMoving: GridY,
                wMoving: w,
                hMoving: h,
                placeholderShow: true,
                placeholderMoving: true,
                layout: sync,
                dragType: 'resize'
            });
        };
        _this.onResizing = function (layoutItem) {
            var newLayout = layoutCheck(_this.state.layout, layoutItem, layoutItem.UniqueKey, layoutItem.UniqueKey, 0);
            var _a = compactLayout(newLayout, layoutItem), compacted = _a.compacted, mapLayout = _a.mapLayout;
            _this.setState({
                layout: compacted,
                wMoving: layoutItem.w,
                hMoving: layoutItem.h,
                mapLayout: mapLayout,
                containerHeight: getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1])
            });
        };
        _this.onResizeEnd = function (layoutItem) {
            var _a = compactLayout(_this.state.layout, undefined), compacted = _a.compacted, mapLayout = _a.mapLayout;
            _this.setState({
                placeholderShow: false,
                layout: compacted,
                mapLayout: mapLayout,
                containerHeight: getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1])
            });
            _this.props.onDragEnd && _this.props.onDragEnd(layoutItem);
        };
        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        var layout = props.layout ?
            MapLayoutTostate(props.layout, props.children)
            :
                getDataSet(props.children);
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
        var newlayout = syncLayout(this.state.layout, bundles);
        this.setState({
            GridXMoving: GridX,
            GridYMoving: GridY,
            wMoving: w,
            hMoving: h,
            placeholderShow: true,
            placeholderMoving: true,
            layout: newlayout,
            dragType: 'drag'
        });
        this.props.onDragStart && this.props.onDragStart(bundles);
    };
    Dragact.prototype.onDrag = function (layoutItem) {
        var GridY = layoutItem.GridY, UniqueKey = layoutItem.UniqueKey;
        var moving = GridY - this.state.GridYMoving;
        var newLayout = layoutCheck(this.state.layout, layoutItem, UniqueKey, UniqueKey /*用户移动方块的key */, moving);
        var _a = compactLayout(newLayout, layoutItem), compacted = _a.compacted, mapLayout = _a.mapLayout;
        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
        });
        this.props.onDrag && this.props.onDrag(layoutItem);
    };
    Dragact.prototype.onDragEnd = function (layoutItem) {
        var _a = compactLayout(this.state.layout, undefined), compacted = _a.compacted, mapLayout = _a.mapLayout;
        this.setState({
            placeholderShow: false,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
        });
        this.props.onDragEnd && this.props.onDragEnd(layoutItem);
    };
    Dragact.prototype.renderPlaceholder = function () {
        if (!this.state.placeholderShow)
            return null;
        var _a = this.props, col = _a.col, width = _a.width, padding = _a.padding, rowHeight = _a.rowHeight, margin = _a.margin;
        var _b = this.state, GridXMoving = _b.GridXMoving, GridYMoving = _b.GridYMoving, wMoving = _b.wMoving, hMoving = _b.hMoving, placeholderMoving = _b.placeholderMoving, dragType = _b.dragType;
        if (!padding)
            padding = 0;
        return (React.createElement(GridItem, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, GridX: GridXMoving, GridY: GridYMoving, w: wMoving, h: hMoving, style: { background: 'rgba(15,15,15,0.3)', zIndex: dragType === 'drag' ? 1 : 10, transition: ' all .15s' }, isUserMove: !placeholderMoving, dragType: dragType, canDrag: false, canResize: false }));
    };
    Dragact.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.children.length > nextProps.children.length) {
            var mapLayoutCopy_1 = __assign({}, this.state.mapLayout);
            nextProps.children.forEach(function (child) {
                if (mapLayoutCopy_1[child.key] !== void 666)
                    delete mapLayoutCopy_1[child.key];
            });
            var _loop_1 = function (key) {
                var newLayout_1 = this_1.state.layout.filter(function (child) {
                    if (child.key !== key)
                        return child;
                });
                var _a = compactLayout(newLayout_1, undefined), compacted = _a.compacted, mapLayout = _a.mapLayout;
                this_1.setState({
                    containerHeight: getMaxContainerHeight(compacted, this_1.props.rowHeight, this_1.props.margin[1]),
                    layout: compacted,
                    mapLayout: mapLayout
                });
            };
            var this_1 = this;
            for (var key in mapLayoutCopy_1) {
                _loop_1(key);
            }
        }
        if (this.props.children.length < nextProps.children.length) {
            var item;
            for (var idx in nextProps.children) {
                var i = nextProps.children[idx];
                if (this.state.mapLayout && !this.state.mapLayout[i.key]) {
                    item = i;
                    break;
                }
            }
            if (item !== void 666) {
                var dataSet = __assign({}, item.props['data-set'], { isUserMove: false, key: item.key });
                var newLayout = this.state.layout.concat([dataSet]);
                newLayout = correctLayout(newLayout, this.props.col);
                var _a = compactLayout(newLayout, undefined), compacted = _a.compacted, mapLayout = _a.mapLayout;
                console.log(mapLayout);
                // console.log(layout)
                this.setState({
                    containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1]),
                    layout: compacted,
                    mapLayout: mapLayout
                });
            }
        }
    };
    Dragact.prototype.componentDidMount = function () {
        var _this = this;
        setTimeout(function () {
            var layout = correctLayout(_this.state.layout, _this.props.col);
            var _a = compactLayout(layout, undefined), compacted = _a.compacted, mapLayout = _a.mapLayout;
            _this.setState({
                layout: compacted,
                mapLayout: mapLayout,
                containerHeight: getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1])
            });
        }, 1);
    };
    Dragact.prototype.getGridItem = function (child, index) {
        var _a = this.state, dragType = _a.dragType, mapLayout = _a.mapLayout;
        var _b = this.props, col = _b.col, width = _b.width, padding = _b.padding, rowHeight = _b.rowHeight, margin = _b.margin;
        if (mapLayout) {
            var renderItem = layoutItemForkey(mapLayout, child.key);
            if (!padding)
                padding = 0;
            return (React.createElement(GridItem, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, GridX: renderItem.GridX, GridY: renderItem.GridY, w: renderItem.w, h: renderItem.h, onDrag: this.onDrag, onDragStart: this.onDragStart, onDragEnd: this.onDragEnd, isUserMove: renderItem.isUserMove !== void 666 ? renderItem.isUserMove : false, UniqueKey: child.key, static: renderItem.static, onResizing: this.onResizing, onResizeStart: this.onResizeStart, onResizeEnd: this.onResizeEnd, dragType: dragType, handle: renderItem.handle, canDrag: renderItem.canDrag, canResize: renderItem.canResize }, child));
        }
    };
    Dragact.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, className = _a.className;
        var containerHeight = this.state.containerHeight;
        return (React.createElement("div", { className: stringJoin('DraggerLayout', className + ''), style: { left: 100, width: width, height: containerHeight, zIndex: 1 } },
            React.Children.map(this.props.children, function (child, index) { return _this.getGridItem(child, index); }),
            this.renderPlaceholder()));
    };
    //api
    Dragact.prototype.getLayout = function () {
        return this.state.layout;
    };
    //api
    Dragact.prototype.deleteItem = function (key) {
    };
    return Dragact;
}(React.Component));
export { Dragact };
