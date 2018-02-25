import *as React from 'react';
import { Dragact, DragactLayoutItem } from '../lib/dragact'
import './index.css';


interface CardItem {
    content: string,
    img: string
}

const Words = [
    { content: 'You can do anything, but not everything.' },
    { content: 'Those who dare to fail miserably can achieve greatly.' },
    { content: 'You miss 100 percent of the shots you never take.' },
    { content: 'Those who believe in telekinetics, raise my hand.' },
    { content: 'I’d rather live with a good question than a bad answer.' }
]

const fakeData = () => {
    return Words.map((item, index) => {
        return { ...item, GridX: index * 2, GridY: 0, w: 4, h: 2, key: index + '' }
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


export class LayoutDemo extends React.Component<{}, {}> {
    render() {
        const margin: [number, number] = [5, 5];
        const dragactInit = {
            width: 1200,
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
                        Normal Layout Demo
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
