import * as React from 'react';
import { Dragact } from '../lib/dragact';

import './index.css';

const Words = [
    { content: 'You can do anything, but not everything.' },
    { content: 'Those who dare to fail miserably can achieve greatly.' },
    { content: 'You miss 100 percent of the shots you never take.', handle: true },
    { content: 'Those who believe in telekinetics, raise my hand.' },
    { content: 'I’d rather live with a good question than a bad answer.' }
]

const fakeData = () => {
    var Y = 0;
    return Words.map((item, index) => {
        if (index % 4 === 0) Y++;
        return { ...item, GridX: index % 4 * 4, GridY: Y * 4, w: 4, h: 2, key: index + '' }
    })
}


const Card = (props: any) => {
    const item: any = props.item;
    return (
        <div className='layout-Item' >
            <div style={{ padding: 5, textAlign: 'center', color: '#595959' }}>
                {item.handle ? <div className='card-handle' id="dragact-handle">点我拖动
            </div> : item.content}
            </div>
        </div>
    )
}


export class HandleLayout extends React.Component<{}, {}> {

    render() {
        const margin: [number, number] = [5, 5];
        const dragactInit = {
            width: 600,
            col: 12,
            rowHeight: 800 / 12,
            margin: margin,
            className: 'normal-layout',
            layout: fakeData(),
            placeholder: true
        }
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>拖拽把手 Demo</h1>
                        <Dragact {...dragactInit}  >
                            {(item: any, isDragging: Boolean) => {
                                return <Card item={item} />
                            }}
                        </Dragact>
                    </div>
                </div>
            </div>
        )
    }
}
