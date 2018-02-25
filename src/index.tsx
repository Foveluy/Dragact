import * as React from "react";
import * as ReactDOM from "react-dom";
import { LayoutDemo } from './NormalLayout/index';
import { SortedTableWithStatic } from "./StaticWidget/index";
import { LayoutRestore } from "./LayoutRestore/index";
import { HandleLayout } from "./HandleLayout/index";
// import { AddRemove } from "./AddRemove/index";
import { Mobile } from "./mobileLayout/index";
import './index.css'



const DemoMap: any = {
    normalLayout: <LayoutDemo />,
    // SortedTable: <SortedTable />,
    StaticHeader: <SortedTableWithStatic />,
    LayoutRestore: <LayoutRestore />,
    HandleLayout: <HandleLayout />,
    // AddRemove: <AddRemove />,
    Mobile: <Mobile />
}

class DemoDispatcher extends React.Component<{}, {}> {

    state = {
        demo: <LayoutDemo />
    }

    handleLayoutChange = (demoName: string) => {
        this.setState({
            demo: DemoMap[demoName]
        })
    }

    render() {
        return (
            <div>
                <div>切换 Demos</div>
                <div className='demo-button-layout'>
                    <button onClick={() => this.handleLayoutChange('normalLayout')}>普通布局</button>
                    <button onClick={() => this.handleLayoutChange('StaticHeader')}>静态组件</button>
                    <button onClick={() => this.handleLayoutChange('LayoutRestore')}>存储布局</button>
                    <button onClick={() => this.handleLayoutChange('HandleLayout')}>拖拽把手</button>
                    <button onClick={() => this.handleLayoutChange('Mobile')}>移动端</button>
                </div>
                {this.state.demo}
            </div>
        )
    }
}

<DemoDispatcher />






ReactDOM.render(
    <DemoDispatcher />,
    document.getElementById('root')
);


document.addEventListener('touchmove', function (e) { e.preventDefault() }, false);