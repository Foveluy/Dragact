import * as React from "react";
import * as ReactDOM from "react-dom";
import { LayoutDemo } from './NormalLayout/index';
import { SortedTableWithStatic } from "./StaticWidget/index";
import { LayoutRestore } from "./LayoutRestore/index";
import { HandleLayout } from "./HandleLayout/index";
// import { AddRemove } from "./AddRemove/index";
import { Mobile } from "./mobileLayout/index";
import './index.css'
// import { Dragact } from "./lib/dragact";



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
                <iframe src="https://ghbtns.com/github-btn.html?user=215566435&repo=Dragact&type=star&count=true&size=large" 
                frameBorder='0' scrolling="0" width="160px" height="30px"></iframe>
                <iframe src="https://ghbtns.com/github-btn.html?user=215566435&repo=Dragact&type=fork&count=true&size=large" 
                frameBorder="0" scrolling="0" width="158px" height="30px"></iframe>
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

{/* <DemoDispatcher />

<Dragact/> */}

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
//                     {...provided.dragHandle}
//                     style={{
//                         ...provided.props.style,
//                         ...getblockStyle(provided.isDragging)
//                     }}
//                 >
//                     {provided.isDragging ? '正在抓取' : '停放'}
//                 </div>
//             )
//         }}
//     </Dragact>,
//     document.getElementById('root')
// );



ReactDOM.render(
    <DemoDispatcher />,
    document.getElementById('root')
);


document.addEventListener('touchmove', function (e) { e.preventDefault() }, false);