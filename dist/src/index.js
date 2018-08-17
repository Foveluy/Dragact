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
var index_1 = require("../example/NormalLayout/index");
var index_2 = require("../example/StaticWidget/index");
var index_3 = require("../example/LayoutRestore/index");
var index_4 = require("../example/HandleLayout/index");
var index_5 = require("../example/AddRemove/index");
var index_6 = require("../example/HistoryLayout/index");
var index_7 = require("../example/mobileLayout/index");
require("./index.css");
// import { Dragact } from "./lib/dragact";
var DemoMap = {
    normalLayout: React.createElement(index_1.LayoutDemo, null),
    // SortedTable: <SortedTable />,
    StaticHeader: React.createElement(index_2.SortedTableWithStatic, null),
    LayoutRestore: React.createElement(index_3.LayoutRestore, null),
    HandleLayout: React.createElement(index_4.HandleLayout, null),
    AddRemove: React.createElement(index_5.AddRemove, null),
    Mobile: React.createElement(index_7.Mobile, null),
    HistoryLayout: React.createElement(index_6.HistoryDemo, null)
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
            React.createElement("iframe", { src: "https://ghbtns.com/github-btn.html?user=215566435&repo=Dragact&type=star&count=true&size=large", frameBorder: '0', scrolling: "0", width: "160px", height: "30px" }),
            React.createElement("iframe", { src: "https://ghbtns.com/github-btn.html?user=215566435&repo=Dragact&type=fork&count=true&size=large", frameBorder: "0", scrolling: "0", width: "158px", height: "30px" }),
            React.createElement("div", null, "\u5207\u6362 Demos"),
            React.createElement("div", { className: 'demo-button-layout' },
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('normalLayout'); } }, "\u666E\u901A\u5E03\u5C40"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('StaticHeader'); } }, "\u9759\u6001\u7EC4\u4EF6"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('LayoutRestore'); } }, "\u5B58\u50A8\u5E03\u5C40"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('HistoryLayout'); } }, "\u8BB0\u5FC6\u64CD\u4F5C\u5E03\u5C40"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('HandleLayout'); } }, "\u62D6\u62FD\u628A\u624B"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('AddRemove'); } }, "\u589E\u52A0\u548C\u5220\u9664"),
                React.createElement("button", { onClick: function () { return _this.handleLayoutChange('Mobile'); } }, "\u79FB\u52A8\u7AEF")),
            this.state.demo));
    };
    return DemoDispatcher;
}(React.Component));
{ /* <DemoDispatcher /> */ }
//<Dragact/> */}
// const fakeData = [
//     { GridX: 0, GridY: 0, w: 4, h: 2, key: '0' },
//     { GridX: 0, GridY: 0, w: 4, h: 2, key: '1' },
//     { GridX: 0, GridY: 0, w: 4, h: 2, key: '2' }
// ]
// const getblockStyle = (isDragging: Boolean) => {
//     return {
//         background: isDragging ? '#1890ff' : 'white',
//     }
// };
// const Handle = ({ provided }: any) => {
//     return (
//         <div
//             {...provided.dragHandle}
//             style={{
//                 ...getblockStyle(provided.isDragging),
//                 borderBottom: '1px solid rgba(120,120,120,0.3)',
//                 textAlign: 'center'
//             }}
//         >
//             点击拖拽
//         </div>
//     )
// }
// ReactDOM.render(
//     <Dragact
//         layout={fakeData}//必填项
//         col={16}//必填项
//         width={800}//必填项
//         rowHeight={40}//必填项
//         margin={[5, 5]}//必填项
//         className='plant-layout'//必填项
//         style={{ background: '#333' }}//非必填项
//         placeholder={true}//非必填项
//     >
//         {(item: any, provided: any) => {
//             return (
//                 <div
//                     {...provided.props}
//                     style={{ ...provided.props.style, background: 'white' }}
//                 >
//                     <Handle provided={provided} />
//                     {provided.isDragging ? '正在抓取' : '停放'}
//                 </div>
//             )
//         }}
//     </Dragact>,
//     document.getElementById('root')
// );
ReactDOM.render(React.createElement(DemoDispatcher, null), document.getElementById('root'));
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
