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
exports.int = function (number) {
    if (number === '' || number === null) {
        return 0;
    }
    return parseInt(number, 10);
};
exports.innerWidth = function (node) {
    var width = node.clientWidth;
    var computedStyle = node.style;
    width -= exports.int(computedStyle.paddingLeft);
    width -= exports.int(computedStyle.paddingRight);
    return width;
};
exports.outerWidth = function (node) {
    var width = node.clientWidth;
    var computedStyle = node.style;
    width += exports.int(computedStyle.borderLeftWidth);
    width += exports.int(computedStyle.borderRightWidth);
    return width;
};
exports.innerHeight = function (node) {
    var height = node.clientHeight;
    var computedStyle = node.style;
    height -= exports.int(computedStyle.paddingTop);
    height -= exports.int(computedStyle.paddingBottom);
    return height;
};
exports.outerHeight = function (node) {
    var height = node.clientHeight;
    var computedStyle = node.style;
    height += exports.int(computedStyle.borderTopWidth);
    height += exports.int(computedStyle.borderBottomWidth);
    return height;
};
exports.parseBounds = function (bounds) {
    return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
    };
};
exports.isNumber = function (things) {
    return typeof things === 'number' ? true : false;
};
exports.getDataSet = function (children) {
    return children.map(function (child) {
        return __assign({}, child.props['data-set'], { isUserMove: true, key: child.key });
    });
};
exports.stringJoin = function (source, join) {
    return source + (join ? " " + join : '');
};
