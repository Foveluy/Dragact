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
    { content: 'You can do anything, but not everything.', img: 'http://pic.sc.chinaz.com/files/pic/pic9/201303/xpic10472.jpg' },
    { content: 'Those who dare to fail miserably can achieve greatly.', img: 'https://img00.deviantart.net/1163/i/2013/059/d/7/irish_views_by_ssquared_photography-d5wjnsk.jpg' },
    { content: 'You miss 100 percent of the shots you never take.', img: 'http://www.landsendhotel.co.uk/uploads/gallery/gallery/coastal_scenery_seascapes_6.jpg' },
    { content: 'Those who believe in telekinetics, raise my hand.', img: 'https://tctechcrunch2011.files.wordpress.com/2017/10/26099344353_18cd6fabb8_k.jpg?w=738' },
    { content: 'I’d rather live with a good question than a bad answer.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa26cLzh6PYUwY4LMpwbHyDHFmWi_w2JuqDzeOdm1IIEbBZO0Vg' }
];
var Card = function (props) {
    var item = props.item;
    return (React.createElement("div", { className: 'layout-Item' },
        React.createElement("img", { src: item.img, style: { width: '100%', height: '60%' }, draggable: false, alt: 'card' }),
        React.createElement("div", { style: { padding: 5, textAlign: 'center', color: '#595959' } }, item.content)));
};
var storeLayout = {};
var LayoutRestore = /** @class */ (function (_super) {
    __extends(LayoutRestore, _super);
    function LayoutRestore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleOnDragEnd = function () {
            var maping = {};
            _this.dragactNode.getLayout().forEach(function (item) {
                if (item.key)
                    maping[item.key] = item;
            });
            var parsedLayout = JSON.stringify(maping);
            localStorage.setItem('layout', parsedLayout);
        };
        _this.renderDragact = function () {
            var margin = [5, 5];
            var dragactInit = {
                width: 800,
                col: 12,
                rowHeight: 800 / 12,
                margin: margin,
                className: 'normal-layout'
            };
            return (React.createElement(Dragact, __assign({}, dragactInit, { ref: function (node) { return node ? _this.dragactNode = node : null; }, onDragEnd: _this.handleOnDragEnd }), Words.map(function (el, index) {
                var dataSet = _this.getLayoutItemForKey(index + '');
                if (dataSet)
                    return React.createElement(Card, { item: el, key: index, "data-set": dataSet });
                else
                    return React.createElement(Card, { item: el, key: index, "data-set": { GridX: (index * 3) % 12, GridY: index * 2, w: 3, h: 3 } });
            })));
        };
        return _this;
    }
    LayoutRestore.prototype.componentWillMount = function () {
        var lastLayout = localStorage.getItem('layout');
        if (lastLayout) {
            storeLayout = JSON.parse(lastLayout);
        }
    };
    LayoutRestore.prototype.getLayoutItemForKey = function (key) {
        return storeLayout[key];
    };
    LayoutRestore.prototype.render = function () {
        return (React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
            React.createElement("div", null,
                React.createElement("h1", { style: { textAlign: 'center' } }, "Layout Restore Demo"),
                this.renderDragact())));
    };
    return LayoutRestore;
}(React.Component));
export { LayoutRestore };
