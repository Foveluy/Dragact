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
// import { compactLayout } from '../util/compact';
// import { getMaxContainerHeight } from '../util/sort';
// import { layoutCheck } from '../util/collison';
import { stringJoin } from '../utils';
// import { syncLayout } from '../util/initiate';
import './index.css';
import { Dragger } from "../dragger/index";
// interface DragactState {
//     GridXMoving: number
//     GridYMoving: number
//     wMoving: number
//     hMoving: number
//     placeholderShow: Boolean
//     placeholderMoving: Boolean
//     layout: any;
//     containerHeight: number
//     dragType: 'drag' | 'resize'
//     mapLayout: mapLayout | undefined
//     col: number
// }
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Column.prototype.render = function () {
        return this.props.children;
    };
    return Column;
}(React.Component));
export { Column };
var checkInContainer = function (GridX, GridY) {
    /**防止元素出container */
    // if (GridY < 0) GridY = 0//上边界
    return { GridX: GridX, GridY: GridY };
};
var ListCell = /** @class */ (function (_super) {
    __extends(ListCell, _super);
    function ListCell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onDragStart = function (x, y) {
            var _a = _this.calGridXY(x, y), GridX = _a.GridX, GridY = _a.GridY;
            var _b = _this.props, UniqueKey = _b.UniqueKey, currentListIndex = _b.currentListIndex;
            _this.props.onDragStart({ key: UniqueKey, x: GridX, y: GridY, currentListIndex: currentListIndex });
        };
        _this.onDrag = function (event, x, y) {
            var _a = _this.calGridXY(x, y), GridX = _a.GridX, GridY = _a.GridY;
            var _b = _this.props, UniqueKey = _b.UniqueKey, currentListIndex = _b.currentListIndex;
            _this.props.onDrag({ key: UniqueKey, x: GridX, y: GridY, currentListIndex: currentListIndex });
        };
        _this.onDragEnd = function (event, x, y) {
            var _a = _this.calGridXY(x, y), GridX = _a.GridX, GridY = _a.GridY;
            var _b = _this.props, UniqueKey = _b.UniqueKey, currentListIndex = _b.currentListIndex;
            console.log(_this.props);
            _this.props.onDragEnd({ key: UniqueKey, x: GridX, y: GridY, currentListIndex: currentListIndex });
        };
        return _this;
    }
    ListCell.prototype.calGridXY = function (x, y) {
        var _a = this.props, margin = _a.margin, width = _a.width, col = _a.col, rowHeight = _a.rowHeight;
        var containerWidth = width * col + margin[0];
        /**坐标转换成格子的时候，无须计算margin */
        var GridX = Math.round(x / containerWidth * col);
        var GridY = Math.round(y / (rowHeight + (margin ? margin[1] : 0)));
        // /**防止元素出container */
        return checkInContainer(GridX, GridY);
    };
    ListCell.prototype.render = function () {
        var _a = this.props, currentListIndex = _a.currentListIndex, y = _a.y, isUserMove = _a.isUserMove, width = _a.width, style = _a.style, rowHeight = _a.rowHeight, margin = _a.margin;
        return (React.createElement(Dragger, { x: currentListIndex * width, y: Math.round(y * rowHeight + margin[1] * (y + 1)), style: __assign({}, style, { width: width, transition: this.props.isUserMove ? '' : 'all .2s' }), isUserMove: isUserMove, onDragStart: this.onDragStart, onMove: this.onDrag, canResize: false, onDragEnd: this.onDragEnd }, this.props.children));
    };
    return ListCell;
}(React.Component));
export { ListCell };
export var collision = function (a, b) {
    if (a === b) {
        return 1;
    }
    if (a + 1 <= b)
        return -1;
    if (a >= b + 1)
        return -1;
    return 2;
};
var swapList = function (list, movingItem, firstKey) {
    var moving = [];
    var newList = list.map(function (oldItem) {
        if (oldItem.key !== movingItem.key) {
            var num = collision(oldItem.y, movingItem.y);
            if (num > 0) {
                // console.log(num)
                var offset = movingItem.y - 1;
                // if (movingItem.y > oldItem.y && movingItem.y < oldItem.y + 1) {
                //     /**
                //      * 元素向上移动时，元素的上面空间不足,则不移动这个元素
                //      * 当元素移动到GridY>所要向上交换的元素时，就不会进入这里，直接交换元素
                //      */
                //     console.log('你来了')
                //     offset = oldItem.y
                // }
                // }
                moving.push(__assign({}, oldItem, { y: offset, isUserMove: false }));
                return __assign({}, oldItem, { y: offset, isUserMove: false });
            }
            return oldItem;
        }
        else if (movingItem.key === firstKey) {
            /**永远保持用户移动的块是 isUserMove === true */
            return __assign({}, oldItem, movingItem);
        }
        return oldItem;
    });
    for (var i in moving) {
        newList = swapList(newList, moving[i], firstKey);
    }
    return newList;
};
/**获取layout中，item第一个碰撞到的物体 */
export var getFirstCollison = function (layout, item) {
    for (var i = 0, length_1 = layout.length; i < length_1; i++) {
        if (collision(layout[i].y, item.y) > 0) {
            return layout[i];
        }
    }
    return null;
};
var compactCell = function (partialList, cell) {
    if (partialList.length === 0) {
        return __assign({}, cell, { y: 0 });
    }
    var newCell = __assign({}, cell);
    /**
     * 类似一个递归调用
     */
    while (true) {
        var FirstCollison = getFirstCollison(partialList, newCell);
        if (FirstCollison) {
            /**第一次发生碰撞时，就可以返回了 */
            return __assign({}, newCell, { y: FirstCollison.y + 1 });
        }
        newCell.y--;
        if (newCell.y < 0)
            return __assign({}, newCell, { y: 0 }); /**碰到边界的时候，返回 */
    }
};
export var compactList = function (list, movingItem) {
    var sort = list.sort(function (a, b) {
        if (a.y === b.y) {
            if (b.isUserMove)
                return 1;
        }
        if (a.y > b.y)
            return 1;
        return 0;
    });
    var needCompact = Array(list.length);
    var after = [];
    var mapList = {};
    for (var i in sort) {
        var finished = compactCell(after, sort[i]);
        if (movingItem) {
            if (movingItem.key === finished.key) {
                // finished.y = movingItem.y;
                finished.isUserMove = true;
            }
            else
                finished.isUserMove = false;
        }
        else
            finished.isUserMove = false;
        after.push(finished);
        needCompact[i] = finished;
        mapList[finished.key] = finished;
    }
    return {
        compacted: needCompact,
        maped: mapList
    };
};
var DragactList = /** @class */ (function (_super) {
    __extends(DragactList, _super);
    function DragactList(props) {
        var _this = _super.call(this, props) || this;
        _this.onDragStart = function (e) {
            var key = e.key, x = e.x;
            for (var idx in _this.state.layout[x]) {
                if (_this.state.layout[x][idx].key === key) {
                    _this.state.layout[x][idx].isUserMove = true;
                    break;
                }
            }
            _this.setState({
                layout: _this.state.layout,
                lastList: x
            });
        };
        _this.onDrag = function (e) {
            var key = e.key, x = e.x, y = e.y, currentListIndex = e.currentListIndex;
            if (!_this.state.layout[x])
                return; //如果超出列表，就返回
            if (x !== e.currentListIndex) {
                //移动到别的列表
                var i = _this.state.maped[x][key];
                if (!i) {
                    _this.state.layout[x].push({ y: y, isUserMove: false, key: key, content: 'placeholder', currentListIndex: currentListIndex });
                }
            }
            // if (x !== this.state.lastList && this.state.lastList !== e.currentListIndex) {
            //     const { lastList } = this.state;
            //     //跟上一个不一样的时候
            //     this.state.layout[lastList] = this.state.layout[lastList].filter((item: any) => {
            //         if (item.key !== key) {
            //             return item
            //         }
            //     })
            //     const compact = compactList(this.state.layout[lastList], undefined);
            //     this.state.layout[lastList] = compact.compacted;
            //     console.log(`上一次:${lastList}`, this.state.layout)
            //     delete this.state.maped[lastList][key]
            //     console.log(this.state.maped)
            // }
            console.log(e);
            var newList = swapList(_this.state.layout[x], { y: y, key: key }, key);
            var _a = compactList(newList, { y: y, key: key }), compacted = _a.compacted, maped = _a.maped;
            _this.state.layout[x] = compacted;
            _this.state.maped[x] = maped;
            _this.setState({
                layout: _this.state.layout.slice(),
                maped: _this.state.maped.slice(),
                lastList: x
            });
        };
        _this.onDragEnd = function (e) {
            var x = e.x, key = e.key, currentListIndex = e.currentListIndex;
            if (x !== currentListIndex) {
                //1.删除原来list中的数据
                _this.state.layout[currentListIndex] = _this.state.layout[currentListIndex].filter(function (item) {
                    if (item.key !== key) {
                        return item;
                    }
                });
                //2.删除原来map中的数据
                delete _this.state.maped[currentListIndex][key];
                var compact = compactList(_this.state.layout[currentListIndex], undefined);
                _this.state.layout[currentListIndex] = compact.compacted;
                _this.state.maped[currentListIndex] = compact.maped;
                _this.state.layout[x] = _this.state.layout[x].map(function (item) {
                    if (key === item.key) {
                        return __assign({}, item, { currentListIndex: x });
                    }
                    return item;
                });
            }
            var _a = compactList(_this.state.layout[x], undefined), compacted = _a.compacted, maped = _a.maped;
            _this.state.layout[x] = compacted;
            _this.state.maped[x] = maped;
            console.log(_this.state.layout);
            _this.setState({
                layout: _this.state.layout.slice(),
                maped: _this.state.maped.slice()
            });
            // if (this.state.currentList !== x) {
            //     this.state.layout[x].push({ y, key: "10203", isUserMove: false })
            //     const compacted = compactList(this.state.layout[x], undefined);
            //     this.state.layout[x] = compacted;
            //     this.setState({
            //         layout: [...this.state.layout]
            //     })
            // } else {
            // }
        };
        _this.renderList = function () {
            // console.log('set', this.props.layout)
            return _this.props.layout.map(function (child, index) {
                return React.createElement("div", { className: 'list-oneof', style: {
                        background: 'red',
                        height: 60 * _this.state.layout[index].length,
                        width: 400
                    }, key: index }, _this.renderColumn(child, index));
            });
        };
        _this.renderColumn = function (child, index) {
            // const column = this.state.layout[index];
            var _a = _this.props, width = _a.width, margin = _a.margin, rowHeight = _a.rowHeight;
            return child.map(function (c, idx) {
                var key = c.key;
                var renderItem;
                // renderItem = this.state.maped[index][key];
                for (var i in _this.state.maped) {
                    renderItem = _this.state.maped[i][key];
                    if (renderItem)
                        break;
                }
                // console.log(renderItem)
                // if (renderItem.key === '1') console.log(renderItem.listPosition)
                return React.createElement(ListCell, { margin: margin, rowHeight: rowHeight, width: width, col: _this.state.layout.length, currentListIndex: renderItem.currentListIndex, y: renderItem ? renderItem.y : c.y, style: { position: 'absolute' }, key: idx, UniqueKey: key, isUserMove: renderItem ? renderItem.isUserMove : false, onDragStart: _this.onDragStart, onDrag: _this.onDrag, onDragEnd: _this.onDragEnd }, _this.props.children(c, idx));
            });
        };
        // const layout = getDataSet(props.children);
        var array = [];
        var layout = props.layout.map(function (child, idx) {
            return child.map(function (el, index) {
                if (!array[idx])
                    array[idx] = {};
                array[idx][el.key] = __assign({}, el, { key: el.key, isUserMove: false, currentListIndex: idx });
                return __assign({}, el, { key: el.key, isUserMove: false, currentListIndex: idx });
            });
        });
        console.log(array);
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
            mapLayout: undefined,
            col: 3,
            currentList: 0,
            maped: array,
            lastList: void 666
        };
        return _this;
    }
    DragactList.prototype.componentWillReceiveProps = function (nextProps) {
        // if (this.props.children.length > nextProps.children.length) { //remove
        //     const mapLayoutCopy = { ...this.state.mapLayout };
        //     nextProps.children.forEach((child: any) => {
        //         if ((mapLayoutCopy as any)[child.key] !== void 666) delete (mapLayoutCopy as any)[child.key];
        //     })
        //     for (const key in mapLayoutCopy) {
        //         const newLayout = this.state.layout.filter((child) => {
        //             if (child.key !== key) return child
        //         })
        //         const { compacted, mapLayout } = compactLayout(newLayout, undefined);
        //         this.setState({
        //             containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1]),
        //             layout: compacted,
        //             mapLayout
        //         })
        //     }
        // }
        // if (this.props.children.length < nextProps.children.length) { //add
        //     var item;
        //     for (const idx in nextProps.children) {
        //         const i = nextProps.children[idx];
        //         if (this.state.mapLayout && !this.state.mapLayout[i.key]) {
        //             item = i;
        //             break;
        //         }
        //     }
        //     if (item !== void 666) {
        //         const dataSet = { ...item.props['data-set'], isUserMove: false, key: item.key };
        //         var newLayout = [...this.state.layout, dataSet]
        //         newLayout = correctLayout(newLayout, this.state.col)
        //         const { compacted, mapLayout } = compactLayout(newLayout, undefined);
        //         console.log(mapLayout)
        //         // console.log(layout)
        //         this.setState({
        //             containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1]),
        //             layout: compacted,
        //             mapLayout
        //         })
        //     }
        // }
    };
    DragactList.prototype.componentDidMount = function () {
        // setTimeout(() => {
        //     const swp = [...this.state.layout[0]]
        //     this.state.layout[0] = this.state.layout[1];
        //     this.state.layout[1] = swp;
        //     const swpMap = { ...this.state.maped[0] }
        //     this.state.maped[0] = this.state.maped[1];
        //     this.state.maped[1] = swpMap;
        //     this.setState({
        //         layout: this.state.layout,
        //         maped: this.state.maped
        //     })
        //     // console.log(this.state.layout)
        // }, 1000);
    };
    DragactList.prototype.render = function () {
        var _a = this.props, width = _a.width, className = _a.className;
        var numberOfCol = this.state.layout.length;
        return (React.createElement("div", { className: stringJoin('DraggerLayout', className + ''), style: { left: 100, width: width * numberOfCol, height: '', zIndex: 1, display: 'flex' } }, this.renderList()));
    };
    return DragactList;
}(React.Component));
export { DragactList };
