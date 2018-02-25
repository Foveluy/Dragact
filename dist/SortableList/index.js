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
import { DragactList } from '../lib/dragactList/dragactList';
var Words = [
    { content: 'You can do anything, but not everything.', img: 'http://pic.sc.chinaz.com/files/pic/pic9/201303/xpic10472.jpg' },
    { content: 'Those who dare to fail miserably can achieve greatly.', img: 'https://img00.deviantart.net/1163/i/2013/059/d/7/irish_views_by_ssquared_photography-d5wjnsk.jpg' },
    { content: 'You miss 100 percent of the shots you never take.', img: 'http://www.landsendhotel.co.uk/uploads/gallery/gallery/coastal_scenery_seascapes_6.jpg' },
    { content: 'Those who believe in telekinetics, raise my hand.', img: 'https://tctechcrunch2011.files.wordpress.com/2017/10/26099344353_18cd6fabb8_k.jpg?w=738' },
    { content: 'I’d rather live with a good question than a bad answer.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa26cLzh6PYUwY4LMpwbHyDHFmWi_w2JuqDzeOdm1IIEbBZO0Vg' }
];
var Cell = function (props) {
    var item = props.item;
    return (React.createElement("div", { className: 'layout-Cell', style: { width: 400, height: 50, border: '1px solid black' } },
        React.createElement("img", { src: item.img, style: { width: 45, height: 45 }, draggable: false, alt: 'card' }),
        React.createElement("div", { style: { paddingLeft: 12, color: '#595959' } }, item.content)));
};
var dataList = [
    __assign({ y: 0 }, Words[0], { key: '0' }),
    __assign({ y: 1 }, Words[1], { key: '1' }),
    __assign({ y: 2 }, Words[2], { key: '2' }),
    __assign({ y: 3 }, Words[3], { key: '3' })
];
var dataList2 = [
    __assign({ y: 0 }, Words[0], { key: '100' }),
    __assign({ y: 1 }, Words[1], { key: '101' }),
    __assign({ y: 2 }, Words[2], { key: '201' }),
    __assign({ y: 3 }, Words[3], { key: '301' })
];
var SortableList = /** @class */ (function (_super) {
    __extends(SortableList, _super);
    function SortableList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SortableList.prototype.render = function () {
        var _this = this;
        var list = [dataList, dataList2];
        return (React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
            React.createElement("div", null,
                React.createElement("h1", { style: { textAlign: 'center' } }, "Sort list Demo"),
                React.createElement(DragactList, { layout: list, width: 450, rowHeight: 60, margin: [50, 5], className: 'normal-layout', ref: function (node) { return _this.one = node; } }, function (child, index) {
                    return React.createElement(Cell, { item: child });
                }))));
    };
    return SortableList;
}(React.Component));
export { SortableList };
