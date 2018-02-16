"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var sort_1 = require("./sort");
var collison_1 = require("./collison");
/**
 * 压缩单个元素，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} finishedLayout 压缩完的元素会放进这里来，用来对比之后的每一个元素是否需要压缩
 * @param {*} item
 */
exports.compactItem = function (finishedLayout, item) {
    if (item.static)
        return item;
    var newItem = __assign({}, item);
    if (finishedLayout.length === 0) {
        return __assign({}, newItem, { GridY: 0 });
    }
    /**
     * 类似一个递归调用
     */
    while (true) {
        var FirstCollison = collison_1.getFirstCollison(finishedLayout, newItem);
        if (FirstCollison) {
            /**第一次发生碰撞时，就可以返回了 */
            newItem.GridY = FirstCollison.GridY + FirstCollison.h;
            return newItem;
        }
        newItem.GridY--;
        if (newItem.GridY < 0)
            return __assign({}, newItem, { GridY: 0 }); /**碰到边界的时候，返回 */
    }
};
/**
 * 压缩layout，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} layout
 */
exports.compactLayout = function (layout) {
    var sorted = sort_1.sortLayout(layout);
    var needCompact = Array(layout.length);
    var compareList = [];
    for (var i = 0, length_1 = sorted.length; i < length_1; i++) {
        var finished = exports.compactItem(compareList, sorted[i]);
        finished.isUserMove = false;
        compareList.push(finished);
        needCompact[i] = finished;
    }
    return needCompact;
};
