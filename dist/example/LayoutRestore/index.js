"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var dragact_1 = require("../../src/lib/dragact");
var index_1 = require("../NormalLayout/index");
require("./index.css");
var Words = [
    { content: 'You can do anything, but not everything.' },
    { content: 'Those who dare to fail miserably can achieve greatly.' },
    { content: 'You miss 100 percent of the shots you never take.' },
    { content: 'Those who believe in telekinetics, raise my hand.' },
    { content: 'I’d rather live with a good question than a bad answer.' }
];
var fakeData = function () {
    var Y = 0;
    return Words.map(function (item, index) {
        if (index % 4 === 0)
            Y++;
        return __assign({}, item, { GridX: index % 4 * 4, GridY: Y * 4, w: 4, h: 2, key: index + '' });
    });
};
var storeLayout = void 666;
var LayoutRestore = /** @class */ (function (_super) {
    __extends(LayoutRestore, _super);
    function LayoutRestore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleOnDragEnd = function () {
            var newLayout = _this.dragactNode.getLayout();
            var parsedLayout = JSON.stringify(newLayout);
            localStorage.setItem('layout', parsedLayout);
        };
        _this.renderDragact = function () {
            var margin = [5, 5];
            var dragactInit = {
                width: 600,
                col: 12,
                rowHeight: 800 / 12,
                margin: margin,
                className: 'normal-layout',
                layout: storeLayout ? storeLayout : fakeData(),
                placeholder: true
            };
            return (React.createElement(dragact_1.Dragact, __assign({}, dragactInit, { ref: function (node) { return node ? _this.dragactNode = node : null; }, onDragEnd: _this.handleOnDragEnd }), function (item, provided) {
                return React.createElement(index_1.Card, { item: item, provided: provided });
            }));
        };
        return _this;
    }
    LayoutRestore.prototype.componentWillMount = function () {
        var lastLayout = localStorage.getItem('layout');
        if (lastLayout) {
            storeLayout = JSON.parse(lastLayout);
        }
    };
    LayoutRestore.prototype.render = function () {
        return (React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
            React.createElement("div", null,
                React.createElement("h1", { style: { textAlign: 'center' } }, "\u5B58\u50A8\u5E03\u5C40 Demo"),
                this.renderDragact())));
    };
    return LayoutRestore;
}(React.Component));
exports.LayoutRestore = LayoutRestore;
