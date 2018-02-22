var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * 把用户移动的块，标记为true
 * @param {*} layout
 * @param {*} key
 * @param {*} GridX
 * @param {*} GridY
 * @param {*} isUserMove
 */
export var syncLayout = function (layout, movingItem) {
    for (var idx in layout) {
        if (layout[idx].key === movingItem.UniqueKey) {
            layout[idx].GridX = movingItem.GridX;
            layout[idx].GridY = movingItem.GridY;
            layout[idx].isUserMove = true;
            break;
        }
    }
    return layout;
};
/**
 * 初始化的时候调用
 * 会把isUserMove和key一起映射到layout中
 * 不用用户设置
 * @param {*} layout
 * @param {*} children
 */
export var MapLayoutTostate = function (layout, children) {
    return layout.map(function (child, index) {
        var newChild = __assign({}, child, { isUserMove: true, key: children[index].key, static: children[index].static });
        return newChild;
    });
};
/**
 * 用key从layout中拿出item
 * @param {*} layout 输入进来的布局
 * @param {*} key
 */
export var layoutItemForkey = function (layout, key) {
    return layout[key];
};
