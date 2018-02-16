import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import React from 'react';
import PropTypes from 'prop-types';
import GridItem, { checkInContainer } from './GridItem';

import './style.css';

/**
 * 这个函数会有副作用，不是纯函数，会改变item的Gridx和GridY
 * @param {*} item 
 */
var correctItem = function correctItem(item, col) {
    var _checkInContainer = checkInContainer(item.GridX, item.GridY, col, item.w),
        GridX = _checkInContainer.GridX,
        GridY = _checkInContainer.GridY;

    item.GridX = GridX;
    item.GridY = GridY;
};
var correctLayout = function correctLayout(layout, col) {
    var copy = [].concat(_toConsumableArray(layout));
    for (var i = 0; i < layout.length - 1; i++) {
        correctItem(copy[i], col);
        correctItem(copy[i + 1], col);

        if (collision(copy[i], copy[i + 1])) {
            copy = layoutCheck(copy, copy[i], copy[i].key, copy[i].key, undefined);
        }
    }

    return copy;
};

/**
 * 用key从layout中拿出item
 * @param {*} layout 输入进来的布局
 * @param {*} key 
 */
var layoutItemForkey = function layoutItemForkey(layout, key) {
    for (var i = 0, length = layout.length; i < length; i++) {
        if (key === layout[i].key) {
            return layout[i];
        }
    }
};

/**
 * 初始化的时候调用
 * 会把isUserMove和key一起映射到layout中
 * 不用用户设置
 * @param {*} layout 
 * @param {*} children 
 */

var MapLayoutTostate = function MapLayoutTostate(layout, children) {
    return layout.map(function (child, index) {
        var newChild = _extends({}, child, { isUserMove: true, key: children[index].key, static: children[index].static });
        return newChild;
    });
};

/**
 * 把用户移动的块，标记为true
 * @param {*} layout 
 * @param {*} key 
 * @param {*} GridX 
 * @param {*} GridY 
 * @param {*} isUserMove 
 */
var syncLayout = function syncLayout(layout, key, GridX, GridY, isUserMove) {
    var newlayout = layout.map(function (item) {
        if (item.key === key) {
            item.GridX = GridX;
            item.GridY = GridY;
            item.isUserMove = isUserMove;
            return item;
        }
        return item;
    });
    return newlayout;
};

var collision = function collision(a, b) {
    if (a.GridX === b.GridX && a.GridY === b.GridY && a.w === b.w && a.h === b.h) {
        return true;
    }
    if (a.GridX + a.w <= b.GridX) return false;
    if (a.GridX >= b.GridX + b.w) return false;
    if (a.GridY + a.h <= b.GridY) return false;
    if (a.GridY >= b.GridY + b.h) return false;
    return true;
};

var sortLayout = function sortLayout(layout) {
    return [].concat(layout).sort(function (a, b) {
        if (a.GridY > b.GridY || a.GridY === b.GridY && a.GridX > b.GridX) {
            if (a.static) return 0; //为了静态，排序的时候尽量把静态的放在前面
            return 1;
        } else if (a.GridY === b.GridY && a.GridX === b.GridX) {
            return 0;
        }
        return -1;
    });
};

/**获取layout中，item第一个碰撞到的物体 */
var getFirstCollison = function getFirstCollison(layout, item) {
    for (var i = 0, length = layout.length; i < length; i++) {
        if (collision(layout[i], item)) {
            return layout[i];
        }
    }
    return null;
};

/**
 * 压缩单个元素，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} finishedLayout 压缩完的元素会放进这里来，用来对比之后的每一个元素是否需要压缩
 * @param {*} item 
 */
var compactItem = function compactItem(finishedLayout, item) {
    if (item.static) return item;
    var newItem = _extends({}, item);
    if (finishedLayout.length === 0) {
        return _extends({}, newItem, { GridY: 0 });
    }
    /**
     * 类似一个递归调用
     */
    while (true) {
        var FirstCollison = getFirstCollison(finishedLayout, newItem);
        if (FirstCollison) {
            /**第一次发生碰撞时，就可以返回了 */
            newItem.GridY = FirstCollison.GridY + FirstCollison.h;
            return newItem;
        }
        newItem.GridY--;

        if (newItem.GridY < 0) return _extends({}, newItem, { GridY: 0 /**碰到边界的时候，返回 */
        });
    }
    return newItem;
};

/**
 * 压缩layout，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} layout 
 */
var compactLayout = function compactLayout(layout) {
    var sorted = sortLayout(layout);
    var needCompact = Array(layout.length);
    var compareList = [];
    for (var i = 0, length = sorted.length; i < length; i++) {
        var finished = compactItem(compareList, sorted[i]);
        finished.isUserMove = false;
        compareList.push(finished);
        needCompact[i] = finished;
    }
    return needCompact;
};

var layoutCheck = function layoutCheck(layout, layoutItem, key, fristItemkey, moving) {
    var i = [],
        movedItem = []; /**收集所有移动过的物体 */
    var newlayout = layout.map(function (item, idx) {

        if (item.key !== key) {
            if (item.static) {
                return item;
            }
            if (collision(item, layoutItem)) {
                i.push(item.key);
                /**
                 * 这里就是奇迹发生的地方，如果向上移动，那么必须注意的是
                 * 一格一格的移动，而不是一次性移动
                 */
                var offsetY = item.GridY + 1;

                /**这一行也非常关键，当向上移动的时候，碰撞的元素必须固定 */
                // if (moving < 0 && layoutItem.GridY > 0) offsetY = item.GridY

                if (layoutItem.GridY > item.GridY && layoutItem.GridY < item.GridY + item.h) {
                    /**
                     * 元素向上移动时，元素的上面空间不足,则不移动这个元素
                     * 当元素移动到GridY>所要向上交换的元素时，就不会进入这里，直接交换元素
                     */
                    offsetY = item.GridY;
                }
                /**
                 * 物体向下移动的时候
                 */

                if (moving > 0) {
                    if (layoutItem.GridY + layoutItem.h < item.GridY) {
                        (function () {
                            var collision = void 0;
                            var copy = _extends({}, item);
                            while (true) {
                                var newLayout = layout.filter(function (item) {
                                    if (item.key !== key && item.key !== copy.key) {
                                        return item;
                                    }
                                });
                                collision = getFirstCollison(newLayout, copy);
                                if (collision) {
                                    offsetY = collision.GridY + collision.h;
                                    break;
                                } else {
                                    copy.GridY--;
                                }
                                if (copy.GridY < 0) {
                                    offsetY = 0;
                                    break;
                                }
                            }
                        })();
                    }
                }

                movedItem.push(_extends({}, item, { GridY: offsetY, isUserMove: false }));
                return _extends({}, item, { GridY: offsetY, isUserMove: false });
            }
        } else if (fristItemkey === key) {

            /**永远保持用户移动的块是 isUserMove === true */
            return _extends({}, item, { GridX: layoutItem.GridX, GridY: layoutItem.GridY, isUserMove: true });
        }

        return item;
    });
    /** 递归调用,将layout中的所有重叠元素全部移动 */
    var length = movedItem.length;
    for (var c = 0; c < length; c++) {
        newlayout = layoutCheck(newlayout, movedItem[c], i[c], fristItemkey, undefined);
    }
    return newlayout;
};

function quickSort(a) {
    return a.length <= 1 ? a : quickSort(a.slice(1).filter(function (item) {
        return item <= a[0];
    })).concat(a[0], quickSort(a.slice(1).filter(function (item) {
        return item > a[0];
    })));
}

var getMaxContainerHeight = function getMaxContainerHeight(layout) {
    var elementHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
    var elementMarginBottom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

    var ar = layout.map(function (item) {
        return item.GridY + item.h;
    });
    var h = quickSort(ar)[ar.length - 1];
    var height = h * (elementHeight + elementMarginBottom) + elementMarginBottom;
    return height;
};

var getDataSet = function getDataSet(children) {
    return children.map(function (child) {
        return _extends({}, child.props['data-set'], { isUserMove: true, key: child.key });
    });
};

var stringJoin = function stringJoin(source, join) {
    return source + (join ? ' ' + join : '');
};

export var DraggerLayout = function (_React$Component) {
    _inherits(DraggerLayout, _React$Component);

    function DraggerLayout(props) {
        _classCallCheck(this, DraggerLayout);

        var _this = _possibleConstructorReturn(this, (DraggerLayout.__proto__ || _Object$getPrototypeOf(DraggerLayout)).call(this, props));

        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);

        var layout = props.layout ? MapLayoutTostate(props.layout, props.children) : getDataSet(props.children);

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

    _createClass(DraggerLayout, [{
        key: 'onDragStart',
        value: function onDragStart(bundles) {
            var GridX = bundles.GridX,
                GridY = bundles.GridY,
                w = bundles.w,
                h = bundles.h,
                UniqueKey = bundles.UniqueKey;


            var newlayout = syncLayout(this.state.layout, UniqueKey, GridX, GridY, true);

            this.setState({
                GridXMoving: GridX,
                GridYMoving: GridY,
                wMoving: w,
                hMoving: h,
                placeholderShow: true,
                placeholderMoving: true,
                layout: newlayout
            });
            this.props.onDragStart && this.props.onDragStart({ GridX: GridX, GridY: GridY });
        }
    }, {
        key: 'onDrag',
        value: function onDrag(layoutItem, key) {
            var GridX = layoutItem.GridX,
                GridY = layoutItem.GridY;

            var moving = GridY - this.state.GridYMoving;

            var newLayout = layoutCheck(this.state.layout, layoutItem, key, key /*用户移动方块的key */, moving);
            var compactedLayout = compactLayout(newLayout);
            for (var i = 0; i < compactedLayout.length; i++) {
                var compactedItem = compactedLayout[i];
                if (key === compactedItem.key) {
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
            this.props.onDrag && this.props.onDrag({ GridX: GridX, GridY: GridY });
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(key) {
            var compactedLayout = compactLayout(this.state.layout);
            this.setState({
                placeholderShow: false,
                layout: compactedLayout,
                containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
            });

            this.props.onDragEnd && this.props.onDragEnd();
        }
    }, {
        key: 'renderPlaceholder',
        value: function renderPlaceholder() {
            if (!this.state.placeholderShow) return null;
            var _props = this.props,
                col = _props.col,
                width = _props.width,
                padding = _props.padding,
                rowHeight = _props.rowHeight,
                margin = _props.margin;
            var _state = this.state,
                GridXMoving = _state.GridXMoving,
                GridYMoving = _state.GridYMoving,
                wMoving = _state.wMoving,
                hMoving = _state.hMoving,
                placeholderMoving = _state.placeholderMoving;


            return React.createElement(GridItem, {
                margin: margin,
                col: col,
                containerWidth: width,
                containerPadding: padding,
                rowHeight: rowHeight,
                GridX: GridXMoving,
                GridY: GridYMoving,
                w: wMoving,
                h: hMoving,
                style: { background: '#d6e4ff', zIndex: 1, transition: ' all .15s' },
                isUserMove: !placeholderMoving
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            setTimeout(function () {
                var layout = correctLayout(_this2.state.layout, _this2.props.col);
                var compacted = compactLayout(layout);
                _this2.setState({
                    layout: compacted,
                    containerHeight: getMaxContainerHeight(compacted, _this2.props.rowHeight, _this2.props.margin[1])
                });
            }, 1);
        }
    }, {
        key: 'getGridItem',
        value: function getGridItem(child, index) {
            var layout = this.state.layout;
            var _props2 = this.props,
                col = _props2.col,
                width = _props2.width,
                padding = _props2.padding,
                rowHeight = _props2.rowHeight,
                margin = _props2.margin;

            var renderItem = layoutItemForkey(layout, child.key); //TODO:可以优化速度，这一步不是必须;
            return React.createElement(
                GridItem,
                {
                    margin: margin,
                    col: col,
                    containerWidth: width,
                    containerPadding: padding,
                    rowHeight: rowHeight,
                    GridX: renderItem.GridX,
                    GridY: renderItem.GridY,
                    w: renderItem.w,
                    h: renderItem.h,
                    onDrag: this.onDrag,
                    onDragStart: this.onDragStart,
                    onDragEnd: this.onDragEnd,
                    index: index,
                    isUserMove: renderItem.isUserMove,
                    UniqueKey: child.key,
                    style: { zIndex: 2 },
                    'static': renderItem.static
                },
                child
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props3 = this.props,
                layout = _props3.layout,
                col = _props3.col,
                width = _props3.width,
                padding = _props3.padding,
                rowHeight = _props3.rowHeight,
                className = _props3.className;
            var containerHeight = this.state.containerHeight;


            return React.createElement(
                'div',
                {
                    className: stringJoin('DraggerLayout', className),
                    style: { left: 100, width: width, height: containerHeight, zIndex: 1 }
                },
                React.Children.map(this.props.children, function (child, index) {
                    return _this3.getGridItem(child, index);
                }),
                this.renderPlaceholder()
            );
        }
    }]);

    return DraggerLayout;
}(React.Component);
DraggerLayout.propTypes = {
    /**外部属性 */
    layout: PropTypes.array,
    col: PropTypes.number,
    width: PropTypes.number,
    /**每个元素的最小高度 */
    rowHeight: PropTypes.number,
    padding: PropTypes.number
};
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(correctItem, 'correctItem', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(correctLayout, 'correctLayout', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(layoutItemForkey, 'layoutItemForkey', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(MapLayoutTostate, 'MapLayoutTostate', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(syncLayout, 'syncLayout', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(collision, 'collision', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(sortLayout, 'sortLayout', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(getFirstCollison, 'getFirstCollison', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(compactItem, 'compactItem', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(compactLayout, 'compactLayout', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(layoutCheck, 'layoutCheck', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(quickSort, 'quickSort', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(getMaxContainerHeight, 'getMaxContainerHeight', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(getDataSet, 'getDataSet', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(stringJoin, 'stringJoin', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(DraggerLayout, 'DraggerLayout', 'app/src/App.js');
}();

;