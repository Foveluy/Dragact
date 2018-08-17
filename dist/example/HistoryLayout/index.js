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
var HistoryLayout_1 = require("./HistoryLayout");
var largedata_1 = require("./largedata");
require("./index.css");
var fakeData = function () {
    var Y = 0;
    return largedata_1.Words.map(function (item, index) {
        if (index % 4 === 0)
            Y++;
        return __assign({}, item, { GridX: index % 4 * 4, GridY: Y * 4, w: 4, h: 3, key: index + '' });
    });
};
exports.Card = function (_a) {
    var item = _a.item, provided = _a.provided;
    return (React.createElement("div", __assign({ className: 'layout-Item' }, provided.props, provided.dragHandle, { style: __assign({}, provided.props.style, { background: "" + (provided.isDragging ? '#eaff8f' : 'white') }) }),
        React.createElement("div", { style: { padding: 5, textAlign: 'center', color: '#595959' } },
            React.createElement("span", null, "title"),
            React.createElement("div", { style: { borderBottom: '1px solid rgba(120,120,120,0.1)' } }),
            item.content),
        React.createElement("span", __assign({}, provided.resizeHandle, { style: {
                position: 'absolute',
                width: 10, height: 10, right: 2, bottom: 2, cursor: 'se-resize',
                borderRight: '2px solid rgba(15,15,15,0.2)',
                borderBottom: '2px solid rgba(15,15,15,0.2)'
            } }))));
};
var HistoryDemo = /** @class */ (function (_super) {
    __extends(HistoryDemo, _super);
    function HistoryDemo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HistoryDemo.prototype.render = function () {
        var _this = this;
        var margin = [5, 5];
        var dragactInit = {
            width: 600,
            col: 16,
            rowHeight: 40,
            margin: margin,
            className: 'normal-layout',
            layout: fakeData()
        };
        return (React.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'center'
            } },
            React.createElement("div", null,
                React.createElement("h1", { style: { textAlign: 'center' } }, "\u590D\u539F\u64CD\u4F5Cdemo"),
                React.createElement("button", { onClick: function () {
                        if (_this.drag) {
                            _this.drag.goBack();
                        }
                    } }, "back"),
                React.createElement("button", { onClick: function () {
                        if (_this.drag) {
                            _this.drag.reset();
                        }
                    } }, "reset"),
                React.createElement("button", { onClick: function () {
                        if (_this.drag) {
                            _this.drag.clear();
                        }
                    } }, "clear"),
                React.createElement(HistoryLayout_1.HistoryDragact, __assign({}, dragactInit, { placeholder: true, ref: function (n) { return _this.drag = n; }, style: {
                        background: '#003A8C'
                    } }), function (item, provided) {
                    return React.createElement(exports.Card, { item: item, provided: provided });
                }))));
    };
    return HistoryDemo;
}(React.Component));
exports.HistoryDemo = HistoryDemo;
