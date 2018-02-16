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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var index_1 = require("./NormalLayout/index");
var SortedTable_1 = require("./SortedTable");
var StaticHeader_1 = require("./StaticHeader");
require("./index.css");
var DemoMap = {
    normalLayout: React.createElement(index_1.LayoutDemo, null),
    SortedTable: React.createElement(SortedTable_1.SortedTable, null),
    StaticHeader: React.createElement(StaticHeader_1.SortedTableWithStatic, null)
};
var DemoDispatcher = /** @class */ (function (_super) {
    __extends(DemoDispatcher, _super);
    function DemoDispatcher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            demo: React.createElement(index_1.LayoutDemo, null)
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
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('normalLayout'); } }, "normalLayout"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('SortedTable'); } }, "SortedTable"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('StaticHeader'); } }, "StaticHeader")),
            this.state.demo));
    };
    return DemoDispatcher;
}(React.Component));
ReactDOM.render(React.createElement(DemoDispatcher, null), document.getElementById('root'));
