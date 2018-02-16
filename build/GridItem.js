import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';

import PropTypes from 'prop-types';
import Dragger from './Dragger';

export var checkInContainer = function checkInContainer(GridX, GridY, col, w) {
    /**防止元素出container */
    if (GridX + w > col - 1) GridX = col - w; //右边界
    if (GridX < 0) GridX = 0; //左边界
    if (GridY < 0) GridY = 0; //上边界
    return { GridX: GridX, GridY: GridY };
};

var GridItem = function (_React$Component) {
    _inherits(GridItem, _React$Component);

    function GridItem(props) {
        _classCallCheck(this, GridItem);

        var _this = _possibleConstructorReturn(this, (GridItem.__proto__ || _Object$getPrototypeOf(GridItem)).call(this, props));

        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        _this.calGridXY = _this.calGridXY.bind(_this);
        _this.calColWidth = _this.calColWidth.bind(_this);
        return _this;
    }

    _createClass(GridItem, [{
        key: 'calColWidth',


        /** 计算容器的每一个格子多大 */
        value: function calColWidth() {
            var _props = this.props,
                containerWidth = _props.containerWidth,
                col = _props.col,
                containerPadding = _props.containerPadding,
                margin = _props.margin;


            return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col;
        }

        /**转化，计算网格的GridX,GridY值 */

    }, {
        key: 'calGridXY',
        value: function calGridXY(x, y) {
            var _props2 = this.props,
                margin = _props2.margin,
                containerWidth = _props2.containerWidth,
                col = _props2.col,
                w = _props2.w;

            /**坐标转换成格子的时候，无须计算margin */

            var GridX = Math.round(x / containerWidth * col);
            var GridY = Math.round(y / (this.props.rowHeight + margin[1]));

            // /**防止元素出container */
            return checkInContainer(GridX, GridY, col, w);
        }

        /**给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px */

    }, {
        key: 'calGridItemPosition',
        value: function calGridItemPosition(GridX, GridY) {
            var _props3 = this.props,
                w = _props3.w,
                margin = _props3.margin,
                col = _props3.col,
                containerWidth = _props3.containerWidth;

            var x = Math.round(GridX * this.calColWidth() + (GridX + 1) * margin[0]);
            var y = Math.round(GridY * this.props.rowHeight + margin[1] * (GridY + 1));

            return {
                x: x,
                y: y
            };
        }

        /**宽和高计算成为px */

    }, {
        key: 'calWHtoPx',
        value: function calWHtoPx(w, h) {
            var _props4 = this.props,
                margin = _props4.margin,
                containerPadding = _props4.containerPadding,
                containerWidth = _props4.containerWidth,
                col = _props4.col;


            var wPx = Math.round(w * this.calColWidth() + (w - 1) * margin[0]);
            var hPx = Math.round(h * this.props.rowHeight + (h - 1) * margin[1]);

            return { wPx: wPx, hPx: hPx };
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(x, y) {
            var _props5 = this.props,
                w = _props5.w,
                h = _props5.h,
                UniqueKey = _props5.UniqueKey;

            if (this.props.static) return;

            var _calGridXY = this.calGridXY(x, y),
                GridX = _calGridXY.GridX,
                GridY = _calGridXY.GridY;

            this.props.onDragStart({
                event: event, GridX: GridX, GridY: GridY, w: w, h: h, UniqueKey: UniqueKey
            });
        }
    }, {
        key: 'onDrag',
        value: function onDrag(event, x, y) {
            if (this.props.static) return;

            var _calGridXY2 = this.calGridXY(x, y),
                GridX = _calGridXY2.GridX,
                GridY = _calGridXY2.GridY;

            var _props6 = this.props,
                w = _props6.w,
                h = _props6.h,
                col = _props6.col,
                UniqueKey = _props6.UniqueKey;

            this.props.onDrag({ GridX: GridX, GridY: GridY, w: w, h: h }, UniqueKey);
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd() {
            if (this.props.static) return;
            if (this.props.onDragEnd) this.props.onDragEnd(this.props.UniqueKey);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props7 = this.props,
                w = _props7.w,
                h = _props7.h,
                margin = _props7.margin,
                style = _props7.style,
                bounds = _props7.bounds,
                GridX = _props7.GridX,
                GridY = _props7.GridY;

            var _calGridItemPosition = this.calGridItemPosition(this.props.GridX, this.props.GridY),
                x = _calGridItemPosition.x,
                y = _calGridItemPosition.y;

            var _calWHtoPx = this.calWHtoPx(w, h),
                wPx = _calWHtoPx.wPx,
                hPx = _calWHtoPx.hPx;

            return React.createElement(
                Dragger,
                {
                    style: _extends({}, style, { width: wPx, height: hPx, position: 'absolute',
                        transition: this.props.isUserMove ? '' : 'all .2s'
                    }),
                    onDragStart: this.onDragStart,
                    onMove: this.onDrag,
                    onDragEnd: this.onDragEnd,
                    x: x,
                    y: y,
                    isUserMove: this.props.isUserMove
                },
                React.createElement(
                    'div',
                    { style: { width: wPx, height: hPx } },
                    React.Children.map(this.props.children, function (child) {
                        return child;
                    })
                )
            );
        }
    }]);

    return GridItem;
}(React.Component);

GridItem.propTypes = {
    /**外部容器属性 */
    col: PropTypes.number,
    containerWidth: PropTypes.number,
    containerPadding: PropTypes.array,

    /**子元素的属性 */
    margin: PropTypes.array,
    GridX: PropTypes.number,
    GridY: PropTypes.number,
    rowHeight: PropTypes.number,

    /**子元素的宽高 */
    w: PropTypes.number,
    h: PropTypes.number,

    /**生命周期回掉函数 */
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func

};
GridItem.defaultProps = {
    col: 12,
    containerWidth: 500,
    containerPadding: [0, 0],
    margin: [10, 10],
    rowHeight: 30,
    w: 1,
    h: 1 };
var _default = GridItem;
export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(checkInContainer, 'checkInContainer', 'app/src/GridItem.js');

    __REACT_HOT_LOADER__.register(GridItem, 'GridItem', 'app/src/GridItem.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'app/src/GridItem.js');
}();

;