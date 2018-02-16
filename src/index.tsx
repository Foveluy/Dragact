import * as React from "react";
import * as ReactDOM from "react-dom";
import { LayoutDemo } from './NormalLayout/index';
import { SortedTable } from "./SortedTable";
import { SortedTableWithStatic } from "./StaticHeader";

import './index.css'


const DemoMap: any = {
    normalLayout: <LayoutDemo />,
    SortedTable: <SortedTable />,
    StaticHeader: <SortedTableWithStatic />
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
                <div className='demo-button-layout'>
                    <div>Switch Demos</div>
                    <button onClick={() => this.handleLayoutChange('normalLayout')}>normalLayout</button>
                    <button onClick={() => this.handleLayoutChange('SortedTable')}>SortedTable</button>
                    <button onClick={() => this.handleLayoutChange('StaticHeader')}>StaticHeader</button>
                </div>
                {this.state.demo}
            </div>
        )
    }
}


ReactDOM.render(
    <DemoDispatcher />,
    document.getElementById('root')
);