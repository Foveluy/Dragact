"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function quickSort(a) {
    return a.length <= 1
        ? a
        : quickSort(a.slice(1).filter(function (item) { return item <= a[0]; })).concat(a[0], quickSort(a.slice(1).filter(function (item) { return item > a[0]; })));
}
exports.quickSort = quickSort;
exports.sortLayout = function (layout) {
    return [].concat(layout).sort(function (a, b) {
        if (a.GridY > b.GridY || (a.GridY === b.GridY && a.GridX > b.GridX)) {
            if (a.static)
                return 0; //为了静态，排序的时候尽量把静态的放在前面
            return 1;
        }
        else if (a.GridY === b.GridY && a.GridX === b.GridX) {
            return 0;
        }
        return -1;
    });
};
/**
 * 这个函数带有记忆功能
 */
exports.getMaxContainerHeight = (function () {
    var lastOneYNH = 0;
    return function (layout, elementHeight, elementMarginBottom, currentHeight, useCache) {
        if (elementHeight === void 0) { elementHeight = 30; }
        if (elementMarginBottom === void 0) { elementMarginBottom = 10; }
        if (useCache !== false) {
            var length_1 = layout.length;
            var currentLastOne = layout[length_1 - 1];
            if (currentLastOne.GridY + currentLastOne.h === lastOneYNH) {
                return currentHeight;
            }
            lastOneYNH = currentLastOne.GridY + currentLastOne.h;
        }
        var ar = layout.map(function (item) {
            return item.GridY + item.h;
        });
        var h = quickSort(ar)[ar.length - 1];
        var height = h * (elementHeight + elementMarginBottom) + elementMarginBottom;
        return height;
    };
})();
