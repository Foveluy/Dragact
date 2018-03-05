import *as React from 'react';
import { DragactLayoutItem, GridItemProvided } from '../../src/lib/dragact-type'
import { HistoryDragact } from './HistoryLayout'
import { Words } from './largedata';
import './index.css';

const fakeData = () => {
    var Y = 0;
    return Words.map((item, index) => {
        if (index % 4 === 0) Y++;

        return { ...item, GridX: index % 4 * 4, GridY: Y * 4, w: 4, h: 3, key: index + '' }
    })
}


export const Card: (any: any) => any = ({ item, provided }) => {
    return (
        <div
            className='layout-Item'
            {...provided.props}
            {...provided.dragHandle}
            style={{
                ...provided.props.style,
                background: `${provided.isDragging ? '#eaff8f' : 'white'}`
            }}
        >
            <div
                style={{ padding: 5, textAlign: 'center', color: '#595959' }}
            >
                <span>title</span>
                <div style={{ borderBottom: '1px solid rgba(120,120,120,0.1)' }} />
                {item.content}
            </div>
            <span
                {...provided.resizeHandle}
                style={{
                    position: 'absolute',
                    width: 10, height: 10, right: 2, bottom: 2, cursor: 'se-resize',
                    borderRight: '2px solid rgba(15,15,15,0.2)',
                    borderBottom: '2px solid rgba(15,15,15,0.2)'
                }}
            />
        </div>
    )
}


export class HistoryDemo extends React.Component<{}, {}> {
    drag: HistoryDragact | null
    render() {
        const margin: [number, number] = [5, 5];
        const dragactInit = {
            width: 600,
            col: 16,
            rowHeight: 40,
            margin: margin,
            className: 'normal-layout',
            layout: fakeData()
        }
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <div>
                    <h1 style={{ textAlign: 'center' }}>
                        复原操作demo
                    </h1>
                    <button onClick={() => {
                        if (this.drag) {
                            this.drag.goBack();
                        }
                    }}>back</button>
                    <button onClick={() => {
                        if (this.drag) {
                            this.drag.reset();
                        }
                    }}>reset</button>
                    <button onClick={() => {
                        if (this.drag) {
                            this.drag.clear();
                        }
                    }}>clear</button>
                    <HistoryDragact
                        {...dragactInit}
                        placeholder={true}
                        ref={n => this.drag = n}
                        style={{
                            background: '#003A8C'
                        }}
                    >
                        {(item: DragactLayoutItem, provided: GridItemProvided) => {
                            return <Card
                                item={item}
                                provided={provided}
                            />
                        }}
                    </HistoryDragact>
                </div>
            </div>
        )
    }
}
