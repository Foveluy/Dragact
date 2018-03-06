var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
export var int = function (number) {
    if (number === '' || number === null) {
        return 0;
    }
    return parseInt(number, 10);
};
export var innerWidth = function (node) {
    var width = node.clientWidth;
    var computedStyle = node.style;
    width -= int(computedStyle.paddingLeft);
    width -= int(computedStyle.paddingRight);
    return width;
};
export var outerWidth = function (node) {
    var width = node.clientWidth;
    var computedStyle = node.style;
    width += int(computedStyle.borderLeftWidth);
    width += int(computedStyle.borderRightWidth);
    return width;
};
export var innerHeight = function (node) {
    var height = node.clientHeight;
    var computedStyle = node.style;
    height -= int(computedStyle.paddingTop);
    height -= int(computedStyle.paddingBottom);
    return height;
};
export var outerHeight = function (node) {
    var height = node.clientHeight;
    var computedStyle = node.style;
    height += int(computedStyle.borderTopWidth);
    height += int(computedStyle.borderBottomWidth);
    return height;
};
export var parseBounds = function (bounds) {
    return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
    };
};
export var isNumber = function (things) {
    return typeof things === 'number' ? true : false;
};
export var getDataSet = function (children) {
    return children.map(function (child) {
        return __assign({}, child.props['data-set'], { isUserMove: true, key: child.key });
    });
};
export var stringJoin = function (source, join) {
    return source + (join ? " " + join : '');
};
