import * as React from "react";
import * as ReactDOM from "react-dom";
import { LayoutDemo } from './NormalLayout/index';
import { SortedTable } from "./SortedTable/index";
import { SortedTableWithStatic } from "./StaticHeader/index";
import './index.css';
const DemoMap = {
    normalLayout: React.createElement(LayoutDemo, null),
    SortedTable: React.createElement(SortedTable, null),
    StaticHeader: React.createElement(SortedTableWithStatic, null)
};
class DemoDispatcher extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            demo: React.createElement(LayoutDemo, null)
        };
        this.handleLayoutChange = (demoName) => {
            this.setState({
                demo: DemoMap[demoName]
            });
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { className: 'demo-button-layout' },
                React.createElement("div", null, "Switch Demos"),
                React.createElement("button", { onClick: () => this.handleLayoutChange('normalLayout') }, "normalLayout"),
                React.createElement("button", { onClick: () => this.handleLayoutChange('SortedTable') }, "SortedTable"),
                React.createElement("button", { onClick: () => this.handleLayoutChange('StaticHeader') }, "StaticHeader")),
            this.state.demo));
    }
}
ReactDOM.render(React.createElement(DemoDispatcher, null), document.getElementById('root'));
