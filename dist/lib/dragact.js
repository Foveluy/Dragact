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
            var GridX = layoutItem.GridX, GridY = layoutItem.GridY, w = layoutItem.w, h = layoutItem.h, UniqueKey = layoutItem.UniqueKey;
            var sync = syncLayout(_this.state.layout, UniqueKey, GridX, GridY, true);
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
            var compacted = compactLayout(newLayout);
            for (var i = 0; i < compacted.length; i++) {
                var compactedItem = compacted[i];
                if (layoutItem.UniqueKey === compactedItem.key) {
                    /**
                     * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
                     * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
                     * 但是实际layout中的位置还是会改变
                     * (isUserMove=true用于解除placeholder和元素的绑定)
                     */
                    compactedItem.isUserMove = true;
                    break;
                }
            }
            _this.setState({
                layout: compacted,
                wMoving: layoutItem.w,
                hMoving: layoutItem.h,
                containerHeight: getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1])
            });
        };
        _this.onResizeEnd = function (layoutItem) {
            var compactedLayout = compactLayout(_this.state.layout);
            _this.setState({
                placeholderShow: false,
                layout: compactedLayout,
                containerHeight: getMaxContainerHeight(compactedLayout, _this.props.rowHeight, _this.props.margin[1])
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
            dragType: 'drag'
        };
        return _this;
    }
    Dragact.prototype.onDragStart = function (bundles) {
        var GridX = bundles.GridX, GridY = bundles.GridY, w = bundles.w, h = bundles.h, UniqueKey = bundles.UniqueKey;
        var newlayout = syncLayout(this.state.layout, UniqueKey, GridX, GridY, true);
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
        var compactedLayout = compactLayout(newLayout);
        for (var i = 0; i < compactedLayout.length; i++) {
            var compactedItem = compactedLayout[i];
            if (UniqueKey === compactedItem.key) {
                /**
                 * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
                 * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
                 * 但是实际layout中的位置还是会改变
                 * (isUserMove=true用于解除placeholder和元素的绑定)
                 */
                compactedItem.isUserMove = true;
                layoutItem.GridX = compactedItem.GridX;
                layoutItem.GridY = compactedItem.GridY;
                break;
            }
        }
        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        });
        this.props.onDrag && this.props.onDrag(layoutItem);
    };
    Dragact.prototype.onDragEnd = function (layoutItem) {
        var compactedLayout = compactLayout(this.state.layout);
        this.setState({
            placeholderShow: false,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
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
        return (React.createElement(GridItem, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, GridX: GridXMoving, GridY: GridYMoving, w: wMoving, h: hMoving, style: { background: 'rgba(15,15,15,0.3)', zIndex: dragType === 'drag' ? 1 : 10, transition: ' all .15s' }, isUserMove: !placeholderMoving, dragType: dragType }));
    };
    Dragact.prototype.componentDidMount = function () {
        var _this = this;
        setTimeout(function () {
            var layout = correctLayout(_this.state.layout, _this.props.col);
            var compacted = compactLayout(layout);
            _this.setState({
                layout: compacted,
                containerHeight: getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1])
            });
        }, 1);
    };
    Dragact.prototype.getGridItem = function (child, index) {
        var _a = this.state, layout = _a.layout, dragType = _a.dragType;
        var _b = this.props, col = _b.col, width = _b.width, padding = _b.padding, rowHeight = _b.rowHeight, margin = _b.margin;
        var renderItem = layoutItemForkey(layout, child.key); //TODO:可以优化速度，这一步不是必须;
        if (renderItem) {
            if (!padding)
                padding = 0;
            return (React.createElement(GridItem, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, GridX: renderItem.GridX, GridY: renderItem.GridY, w: renderItem.w, h: renderItem.h, onDrag: this.onDrag, onDragStart: this.onDragStart, onDragEnd: this.onDragEnd, isUserMove: renderItem.isUserMove !== void 666 ? renderItem.isUserMove : false, UniqueKey: child.key, static: renderItem.static, onResizing: this.onResizing, onResizeStart: this.onResizeStart, onResizeEnd: this.onResizeEnd, dragType: dragType }, child));
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
    return Dragact;
}(React.Component));
export { Dragact };
