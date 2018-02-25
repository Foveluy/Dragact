import *as React from 'react';
import { Dragact, DragactLayoutItem } from '../lib/dragact'
import { Words } from './largedata'
import './index.css';


interface CardItem {
    content: string,
    img: string
}



const fakeData = () => {
    var Y = 0;
    return Words.map((item, index) => {
        if (index % 4 === 0) Y++;

        return { ...item, GridX: index % 4 * 4, GridY: Y * 4, w: 4, h: 3, key: index + '', canResize: false }
    })
}


const Card = (props: any) => {
    const item: CardItem = props.item;
    const isDragging: Boolean = props.isDragging;
    return (
        <div
            className='layout-Item'
            style={{ background: `${isDragging ? '#eaff8f' : 'white'}` }}>
            <div
                style={{ padding: 5, textAlign: 'center', color: '#595959' }}
            >
                <span>title</span>
                <div style={{ borderBottom: '1px solid rgba(120,120,120,0.1)' }} />
                {item.content}
            </div>
        </div>
    )
}


export class Mobile extends React.Component<{}, {}> {
    render() {
        const margin: [number, number] = [5, 5];
        const dragactInit = {
            width: 500,
            col: 16,
            rowHeight: 45,
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
                        手机普通布局demo
                    </h1>
                    <Dragact
                        {...dragactInit}
                        placeholder={true}
                        style={{
                            background: '#003A8C'
                        }}
                    >
                        {(item: DragactLayoutItem, isDragging: Boolean) => {
                            return <Card
                                item={item}
                                isDragging={isDragging}
                            />
                        }}
                    </Dragact>
                </div>
            </div>
        )
    }
}
