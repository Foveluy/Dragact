import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import PropTypes from 'prop-types';
import GridItem from './GridItem';

import './style.css';

var correctLayout = function correctLayout(layout) {
    for (var i = 0; i < layout.length; i++) {
        if (collision(layout[i], layout[i + 1])) {
            return layoutCheck(layout, layout[i], layout[i].key, layout[i].key, -1);
        }
    }
};

var layoutItemForkey = function layoutItemForkey(layout, key) {
    for (var i = 0, length = layout.length; i < length; i++) {
        if (key === layout[i].key) {
            return layout[i];
        }
    }
};

var MapLayoutTostate = function MapLayoutTostate(layout, children) {
    return layout.map(function (child, index) {
        var newChild = _extends({}, child, { isUserMove: true, key: children[index].key });
        return newChild;
    });
};

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

var compactItem = function compactItem(finishedLayout, item) {
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
            newItem.GridY = FirstCollison.GridY + FirstCollison.h;
            return newItem;
        }
        newItem.GridY--;

        if (newItem.GridY < 0) return _extends({}, newItem, { GridY: 0 });
    }
    return newItem;
};

var compactLayout = function compactLayout(layout) {
    var sorted = sortLayout(layout);
    var needCompact = Array(layout.length);
    var compareList = [];
    for (var i = 0, length = sorted.length; i < length; i++) {
        var finished = compactItem(compareList, sorted[i]);
        finished.isUserMove = false;
        compareList.push(finished);
        needCompact[layout.indexOf(sorted[i])] = finished;
    }
    return needCompact;
};

var layoutCheck = function layoutCheck(layout, layoutItem, key, fristItemkey, moving) {
    var i = [],
        movedItem = [];
    var newlayout = layout.map(function (item, idx) {
        if (item.key !== key) {
            if (collision(item, layoutItem)) {
                i.push(item.key);
                /**
                 * 这里就是奇迹发生的地方，如果向上移动，那么必须注意的是
                 * 一格一格的移动，而不是一次性移动
                 */
                var offsetY = item.GridY + 1;

                /**这一行也非常关键，当向上移动的时候，碰撞的元素必须固定 */
                if (moving < 0 && layoutItem.GridY > 0) offsetY = item.GridY;

                if (layoutItem.GridY > item.GridY && layoutItem.GridY < item.GridY + item.h) {
                    /**
                     * 元素向上移动时，元素的上面空间不足,则不移动这个元素
                     * 当元素移动到GridY>所要向上交换的元素时，就不会进入这里，直接交换元素
                     * 
                     */
                    offsetY = item.GridY;
                    console.log('移动到', offsetY, '操纵的物体key', layoutItem.key, '移动的key', item.key);
                }
                if (moving > 0) {
                    /**
                     * 这个地方的实现有点奇妙了，moving用于检查最开始移动的方块
                     * layoutItem.GridY > item.h*(3/4) 这个做会让方块移动比较准确和精确
                     * 如果是其他数字，很可能会出现不可预计的效果
                     * 建议取值范围在1/2 ~ 3/4之间
                     */

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
                                    console.log('移动到', offsetY, '操纵的物体底部', copy.key, '碰撞顶部', copy.GridY, 'key', collision.key);
                                    break;
                                } else {
                                    copy.GridY--;
                                }
                                if (copy.GridY < 0) {
                                    console.log('移动到', offsetY, '操纵的物体底部', copy.key, '碰撞顶部', copy.GridY);
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
            return _extends({}, item, { GridX: layoutItem.GridX, GridY: layoutItem.GridY, isUserMove: true });
        }
        return item;
    });
    /** 递归调用,将layout中的所有重叠元素全部移动 */
    if (i.length > 0 && movedItem.length > 0) {
        for (var c = 0; c < Math.min(movedItem.length, i.length); c++) {
            newlayout = layoutCheck(newlayout, movedItem[c], i[c], fristItemkey, undefined);
        }
    }
    return newlayout;
};

var DraggerLayout = function (_React$Component) {
    _inherits(DraggerLayout, _React$Component);

    function DraggerLayout(props) {
        _classCallCheck(this, DraggerLayout);

        var _this = _possibleConstructorReturn(this, (DraggerLayout.__proto__ || _Object$getPrototypeOf(DraggerLayout)).call(this, props));

        _this.state = {
            GridXMoving: 0,
            GridYMoving: 0,
            wMoving: 0,
            hMoving: 0,
            placeholderShow: false,
            placeholderMoving: false,
            layout: MapLayoutTostate(_this.props.layout, _this.props.children)
        };

        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
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
                if (key === compactedLayout[i].key) {
                    /**
                     * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
                     * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
                     * 但是实际layout中的位置还是会改变
                     * (isUserMove=true用于接触placeholder和元素的绑定)
                     */
                    compactedLayout[i].isUserMove = true;
                    layoutItem.GridX = compactedLayout[i].GridX;
                    layoutItem.GridY = compactedLayout[i].GridY;
                    break;
                }
            }

            this.setState({
                GridXMoving: layoutItem.GridX,
                GridYMoving: layoutItem.GridY,
                layout: compactedLayout
            });
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(key) {
            var compactedLayout = compactLayout(this.state.layout);
            this.setState({
                placeholderShow: false,
                layout: compactedLayout
            });
        }
    }, {
        key: 'placeholder',
        value: function placeholder() {
            if (!this.state.placeholderShow) return null;
            var _props = this.props,
                col = _props.col,
                width = _props.width,
                padding = _props.padding,
                rowHeight = _props.rowHeight;
            var _state = this.state,
                GridXMoving = _state.GridXMoving,
                GridYMoving = _state.GridYMoving,
                wMoving = _state.wMoving,
                hMoving = _state.hMoving,
                placeholderMoving = _state.placeholderMoving;


            return React.createElement(GridItem, {
                col: col,
                containerWidth: width,
                containerPadding: padding,
                rowHeight: rowHeight,
                GridX: GridXMoving,
                GridY: GridYMoving,
                w: wMoving,
                h: hMoving,
                style: { background: '#a31', zIndex: -1, transition: ' all .15s' },
                isUserMove: !placeholderMoving
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var that = this;
            setTimeout(function () {
                var layout = correctLayout(that.state.layout);
                that.setState({
                    layout: compactLayout(layout)
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
                rowHeight = _props2.rowHeight;

            var renderItem = layoutItemForkey(layout, child.key);

            return React.createElement(
                GridItem,
                {
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
                    style: { background: '#329' },
                    UniqueKey: child.key
                },
                child
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props3 = this.props,
                layout = _props3.layout,
                col = _props3.col,
                width = _props3.width,
                padding = _props3.padding,
                rowHeight = _props3.rowHeight;


            return React.createElement(
                'div',
                {
                    className: 'DraggerLayout',
                    style: { position: 'absolute', left: 100, width: this.props.width, height: 1000, border: '1px solid black' }
                },
                React.Children.map(this.props.children, function (child, index) {
                    return _this2.getGridItem(child, index);
                }),
                this.placeholder()
            );
        }
    }]);

    return DraggerLayout;
}(React.Component);

DraggerLayout.PropTypes = {
    /**外部属性 */
    layout: PropTypes.array,
    col: PropTypes.number,
    width: PropTypes.number,
    /**每个元素的最小高度 */
    rowHeight: PropTypes.number,
    padding: PropTypes.number
};


export var LayoutDemo = function LayoutDemo() {
    var layout = [{
        GridX: 0, GridY: 0, w: 3, h: 3
    }, {
        GridX: 0, GridY: 0, w: 3, h: 3
    }, {
        GridX: 0, GridY: 0, w: 3, h: 3
    }, {
        GridX: 0, GridY: 0, w: 3, h: 3
    }, {
        GridX: 3, GridY: 8, w: 3, h: 3
    }, {
        GridX: 3, GridY: 8, w: 3, h: 3
    }, {
        GridX: 3, GridY: 8, w: 3, h: 3
    }, {
        GridX: 3, GridY: 8, w: 3, h: 3
    }];
    return React.createElement(
        DraggerLayout,
        { layout: layout, width: 1000, col: 12 },
        React.createElement(
            'p',
            { key: 'a' },
            'a'
        ),
        React.createElement(
            'p',
            { key: 'b' },
            'b'
        ),
        React.createElement(
            'p',
            { key: 'c' },
            'c'
        ),
        React.createElement(
            'p',
            { key: 'd' },
            'd'
        ),
        React.createElement(
            'p',
            { key: 'e' },
            'e'
        ),
        React.createElement(
            'p',
            { key: 'f' },
            'f'
        ),
        React.createElement(
            'p',
            { key: 'g' },
            'g'
        ),
        React.createElement(
            'p',
            { key: 'h' },
            'h'
        )
    );
};
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

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

    __REACT_HOT_LOADER__.register(DraggerLayout, 'DraggerLayout', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(LayoutDemo, 'LayoutDemo', 'app/src/App.js');
}();

;