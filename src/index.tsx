import * as React from "react";
import * as ReactDOM from "react-dom";
import { LayoutDemo } from './NormalLayout/index';
// import { SortedTable } from "./SortedTable/index";
// import { SortedTableWithStatic } from "./StaticHeader/index";
// import { LayoutRestore } from "./LayoutRestore/index";
// import { HandleLayout } from "./HandleLayout/index";
// import { AddRemove } from "./AddRemove/index";
// import { SortableList } from "./SortableList/index";
import './index.css'
import { Dragact } from "./lib/dragact";



const DemoMap: any = {
    normalLayout: <LayoutDemo />,
    // SortedTable: <SortedTable />,
    // StaticHeader: <SortedTableWithStatic />,
    // LayoutRestore: <LayoutRestore />,
    // HandleLayout: <HandleLayout />,
    // AddRemove: <AddRemove />,
    // SortableList: <SortableList />
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
                    {/* <button onClick={() => this.handleLayoutChange('SortedTable')}>SortedTable</button>
                    <button onClick={() => this.handleLayoutChange('StaticHeader')}>StaticHeader</button>
                    <button onClick={() => this.handleLayoutChange('LayoutRestore')}>LayoutRestore</button>
                    <button onClick={() => this.handleLayoutChange('HandleLayout')}>HandleLayout</button>
                    <button onClick={() => this.handleLayoutChange('AddRemove')}>AddRemove</button> */}
                    {/* <button onClick={() => this.handleLayoutChange('SortableList')}>SortableList</button> */}
                </div>
                {this.state.demo}
            </div>
        )
    }
}

<DemoDispatcher />


const fakeData = [
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '0' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '1' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '2' }
]

const blockStyle = {
    background: 'grey',
    height: '100%'
};

ReactDOM.render(
    <Dragact
        layout={fakeData}
        col={16}
        width={800}
        rowHeight={40}
        margin={[5, 5]}
        className='plant-layout'
        style={{ background: '#eee' }}
        placeholder={true}
    >
        {(item: any, isDragging: Boolean) => {
            return <div style={blockStyle}>
                {isDragging ? '正在抓取' : '停放'}
            </div>
        }}
    </Dragact>,
    document.getElementById('root')
);