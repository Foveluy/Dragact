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
        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        var layout = props.layout ?
            initiate_1.MapLayoutTostate(props.layout, props.children)
            :
                utils_1.getDataSet(props.children);
        _this.state = {
            GridXMoving: 0,
            GridYMoving: 0,
            wMoving: 0,
            hMoving: 0,
            placeholderShow: false,
            placeholderMoving: false,
            layout: layout,
            containerHeight: 500
        };
        return _this;
    }
    Dragact.prototype.onDragStart = function (bundles) {
        var GridX = bundles.GridX, GridY = bundles.GridY, w = bundles.w, h = bundles.h, UniqueKey = bundles.UniqueKey;
        var newlayout = initiate_1.syncLayout(this.state.layout, UniqueKey, GridX, GridY, true);
        this.setState({
            GridXMoving: GridX,
            GridYMoving: GridY,
            wMoving: w,
            hMoving: h,
            placeholderShow: true,
            placeholderMoving: true,
            layout: newlayout,
        });
        this.props.onDragStart && this.props.onDragStart(bundles);
    };
    Dragact.prototype.onDrag = function (layoutItem) {
        var GridY = layoutItem.GridY, UniqueKey = layoutItem.UniqueKey;
        var moving = GridY - this.state.GridYMoving;
        var newLayout = collison_1.layoutCheck(this.state.layout, layoutItem, UniqueKey, UniqueKey /*用户移动方块的key */, moving);
        var compactedLayout = compact_1.compactLayout(newLayout);
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
            containerHeight: sort_1.getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        });
        this.props.onDrag && this.props.onDrag(layoutItem);
    };
    Dragact.prototype.onDragEnd = function (key) {
        var compactedLayout = compact_1.compactLayout(this.state.layout);
        this.setState({
            placeholderShow: false,
            layout: compactedLayout,
            containerHeight: sort_1.getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        });
        this.props.onDragEnd && this.props.onDragEnd(key);
    };
    Dragact.prototype.renderPlaceholder = function () {
        if (!this.state.placeholderShow)
            return null;
        var _a = this.props, col = _a.col, width = _a.width, padding = _a.padding, rowHeight = _a.rowHeight, margin = _a.margin;
        var _b = this.state, GridXMoving = _b.GridXMoving, GridYMoving = _b.GridYMoving, wMoving = _b.wMoving, hMoving = _b.hMoving, placeholderMoving = _b.placeholderMoving;
        if (!padding)
            padding = 0;
        return (React.createElement(GridItem_1.default, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, GridX: GridXMoving, GridY: GridYMoving, w: wMoving, h: hMoving, style: { background: '#d6e4ff', zIndex: 1, transition: ' all .15s' }, isUserMove: !placeholderMoving }));
    };
    Dragact.prototype.componentDidMount = function () {
        var _this = this;
        setTimeout(function () {
            var layout = correction_1.correctLayout(_this.state.layout, _this.props.col);
            var compacted = compact_1.compactLayout(layout);
            _this.setState({
                layout: compacted,
                containerHeight: sort_1.getMaxContainerHeight(compacted, _this.props.rowHeight, _this.props.margin[1])
            });
        }, 1);
    };
    Dragact.prototype.getGridItem = function (child, index) {
        var layout = this.state.layout;
        var _a = this.props, col = _a.col, width = _a.width, padding = _a.padding, rowHeight = _a.rowHeight, margin = _a.margin;
        var renderItem = initiate_1.layoutItemForkey(layout, child.key); //TODO:可以优化速度，这一步不是必须;
        if (renderItem) {
            if (!padding)
                padding = 0;
            return (React.createElement(GridItem_1.default, { margin: margin, col: col, containerWidth: width, containerPadding: [padding, padding], rowHeight: rowHeight, GridX: renderItem.GridX, GridY: renderItem.GridY, w: renderItem.w, h: renderItem.h, onDrag: this.onDrag, onDragStart: this.onDragStart, onDragEnd: this.onDragEnd, isUserMove: renderItem.isUserMove !== void 666 ? renderItem.isUserMove : false, UniqueKey: child.key, style: { zIndex: 2 }, static: renderItem.static }, child));
        }
    };
    Dragact.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, className = _a.className;
        var containerHeight = this.state.containerHeight;
        return (React.createElement("div", { className: utils_1.stringJoin('DraggerLayout', className + ''), style: { left: 100, width: width, height: containerHeight, zIndex: 1 } },
            React.Children.map(this.props.children, function (child, index) { return _this.getGridItem(child, index); }),
            this.renderPlaceholder()));
    };
    return Dragact;
}(React.Component));
exports.Dragact = Dragact;
