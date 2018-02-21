import *as React from 'react';
import { Dragact } from '../lib/dragact';

import './index.css';

const Words = [
    { content: 'You can do anything, but not everything.', img: 'http://pic.sc.chinaz.com/files/pic/pic9/201303/xpic10472.jpg' },
    { content: 'Those who dare to fail miserably can achieve greatly.', img: 'https://img00.deviantart.net/1163/i/2013/059/d/7/irish_views_by_ssquared_photography-d5wjnsk.jpg' },
    { content: 'You miss 100 percent of the shots you never take.', img: 'http://www.landsendhotel.co.uk/uploads/gallery/gallery/coastal_scenery_seascapes_6.jpg' },
    { content: 'Those who believe in telekinetics, raise my hand.', img: 'https://tctechcrunch2011.files.wordpress.com/2017/10/26099344353_18cd6fabb8_k.jpg?w=738' },
    { content: 'I’d rather live with a good question than a bad answer.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa26cLzh6PYUwY4LMpwbHyDHFmWi_w2JuqDzeOdm1IIEbBZO0Vg' }
]


const Card = (props: any) => {
    const item: any = props.item;
    const dataSet: any = props['data-set'];
    return (
        <div className='layout-Item' >
            <img src={item.img} style={{ width: '100%', height: '60%' }} draggable={false} alt='card'></img>
            <div style={{ padding: 5, textAlign: 'center', color: '#595959' }}>{dataSet.handle ? <div className='card-handle' id="dragact-handle">点我拖动</div> : item.content}</div>
        </div>
    )
}


export class HandleLayout extends React.Component<{}, {}> {
    layoutWrap: HTMLDivElement | null
    dragactNode: Dragact;
    state = {
        layout: []
    }

    componentDidMount() {
        this.setState({
            layout: this.dragactNode.getLayout()
        })
    }
    render() {
        const margin: [number, number] = [5, 5];
        const dragactInit = {
            width: 800,
            col: 12,
            rowHeight: 800 / 12,
            margin: margin,
            className: 'normal-layout'
        }
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>Handle Layout Demo</h1>
                        <Dragact {...dragactInit} ref={node => node ? this.dragactNode = node : null} >
                            <Card item={Words[0]} key={0} data-set={{ GridX: 0, GridY: 0, w: 3, h: 3 }} />
                            <Card item={Words[1]} key={1} data-set={{ GridX: 3, GridY: 0, w: 3, h: 3 }} />
                            <Card item={Words[2]} key={2} data-set={{ GridX: 6, GridY: 0, w: 3, h: 3 }} />
                            <Card item={Words[3]} key={3} data-set={{ GridX: 9, GridY: 0, w: 3, h: 3, handle: true }} />
                        </Dragact>
                    </div>
                </div>
            </div>
        )
    }
}
