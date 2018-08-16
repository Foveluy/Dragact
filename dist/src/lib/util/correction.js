"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collison_1 = require("./collison");
exports.checkInContainer = function (GridX, GridY, col, w) {
    /**防止元素出container */
    if (GridX + w > col - 1)
        GridX = col - w; //右边界
    if (GridX < 0)
        GridX = 0; //左边界
    if (GridY < 0)
        GridY = 0; //上边界
    return { GridX: GridX, GridY: GridY };
};
/**
 * 这个函数会有副作用，不是纯函数，会改变item的Gridx和GridY
 * @param {*} item
 */
exports.correctItem = function (item, col) {
    var _a = exports.checkInContainer(item.GridX, item.GridY, col, item.w), GridX = _a.GridX, GridY = _a.GridY;
    item.GridX = GridX;
    item.GridY = GridY;
};
exports.correctLayout = function (layout, col) {
    var copy = layout.slice();
    for (var i = 0; i < layout.length - 1; i++) {
        exports.correctItem(copy[i], col);
        exports.correctItem(copy[i + 1], col);
        if (collison_1.collision(copy[i], copy[i + 1])) {
            copy = collison_1.layoutCheck(copy, copy[i], copy[i].UniqueKey + '', copy[i].UniqueKey + '', 0);
        }
    }
    return copy;
};
