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
import * as React from 'react';
import { Dragact } from '../lib/dragact';
import './index.css';
var Words = [
    { content: 'You can do anything, but not everything.' },
    { content: 'Those who dare to fail miserably can achieve greatly.' },
    { content: 'You miss 100 percent of the shots you never take.' },
    { content: 'Those who believe in telekinetics, raise my hand.' },
    { content: 'I’d rather live with a good question than a bad answer.' }
];
var fakeData = function () {
    return Words.map(function (item, index) {
        return __assign({}, item, { GridX: index * 2, GridY: 0, w: 4, h: 2, key: index + '' });
    });
};
var Card = function (props) {
    var item = props.item;
    var isDragging = props.isDragging;
    return (React.createElement("div", { className: 'layout-Item', style: { background: "" + (isDragging ? '#eaff8f' : 'white') } },
        React.createElement("div", { style: { padding: 5, textAlign: 'center', color: '#595959' } },
            React.createElement("span", null, "title"),
            React.createElement("div", { style: { borderBottom: '1px solid rgba(120,120,120,0.1)' } }),
            item.content)));
};
var LayoutDemo = /** @class */ (function (_super) {
    __extends(LayoutDemo, _super);
    function LayoutDemo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LayoutDemo.prototype.render = function () {
        var margin = [5, 5];
        var dragactInit = {
            width: 1200,
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
                React.createElement("h1", { style: { textAlign: 'center' } }, "Normal Layout Demo"),
                React.createElement(Dragact, __assign({}, dragactInit, { placeholder: true, style: {
                        background: '#003A8C'
                    } }), function (item, isDragging) {
                    return React.createElement(Card, { item: item, isDragging: isDragging });
                }))));
    };
    return LayoutDemo;
}(React.Component));
export { LayoutDemo };
