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
import * as React from "react";
import * as ReactDOM from "react-dom";
import { LayoutDemo } from './NormalLayout/index';
// import { SortedTable } from "./SortedTable/index";
// import { SortedTableWithStatic } from "./StaticHeader/index";
// import { LayoutRestore } from "./LayoutRestore/index";
// import { HandleLayout } from "./HandleLayout/index";
// import { AddRemove } from "./AddRemove/index";
// import { SortableList } from "./SortableList/index";
import './index.css';
import { Dragact } from "./lib/dragact";
var DemoMap = {
    normalLayout: React.createElement(LayoutDemo, null),
};
var DemoDispatcher = /** @class */ (function (_super) {
    __extends(DemoDispatcher, _super);
    function DemoDispatcher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            demo: React.createElement(LayoutDemo, null)
        };
        _this.handleLayoutChange = function (demoName) {
            _this.setState({
                demo: DemoMap[demoName]
            });
        };
        return _this;
    }
    DemoDispatcher.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("div", { className: 'demo-button-layout' },
                React.createElement("div", null, "Switch Demos"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('normalLayout'); } }, "normalLayout")),
            this.state.demo));
    };
    return DemoDispatcher;
}(React.Component));
React.createElement(DemoDispatcher, null);
var fakeData = [
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '0' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '1' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '2' }
];
var blockStyle = {
    background: 'grey',
    height: '100%'
};
ReactDOM.render(React.createElement(Dragact, { layout: fakeData, col: 16, width: 800, rowHeight: 40, margin: [5, 5], className: 'plant-layout', style: { background: '#eee' }, placeholder: true }, function (item, isDragging) {
    return React.createElement("div", { style: blockStyle }, isDragging ? '正在抓取' : '停放');
}), document.getElementById('root'));
