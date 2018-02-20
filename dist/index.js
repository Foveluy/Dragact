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
import { SortedTable } from "./SortedTable/index";
import { SortedTableWithStatic } from "./StaticHeader/index";
import { LayoutRestore } from "./LayoutRestore/index";
import './index.css';
var DemoMap = {
    normalLayout: React.createElement(LayoutDemo, null),
    SortedTable: React.createElement(SortedTable, null),
    StaticHeader: React.createElement(SortedTableWithStatic, null),
    LayoutRestore: React.createElement(LayoutRestore, null)
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
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('normalLayout'); } }, "normalLayout"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('SortedTable'); } }, "SortedTable"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('StaticHeader'); } }, "StaticHeader"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('LayoutRestore'); } }, "LayoutRestore")),
            this.state.demo));
    };
    return DemoDispatcher;
}(React.Component));
ReactDOM.render(React.createElement(DemoDispatcher, null), document.getElementById('root'));
