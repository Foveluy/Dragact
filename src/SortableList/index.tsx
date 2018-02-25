import * as React from 'react';
import { DragactList } from '../lib/dragactList/dragactList';


const Words = [
    { content: 'You can do anything, but not everything.', img: 'http://pic.sc.chinaz.com/files/pic/pic9/201303/xpic10472.jpg' },
    { content: 'Those who dare to fail miserably can achieve greatly.', img: 'https://img00.deviantart.net/1163/i/2013/059/d/7/irish_views_by_ssquared_photography-d5wjnsk.jpg' },
    { content: 'You miss 100 percent of the shots you never take.', img: 'http://www.landsendhotel.co.uk/uploads/gallery/gallery/coastal_scenery_seascapes_6.jpg' },
    { content: 'Those who believe in telekinetics, raise my hand.', img: 'https://tctechcrunch2011.files.wordpress.com/2017/10/26099344353_18cd6fabb8_k.jpg?w=738' },
    { content: 'I’d rather live with a good question than a bad answer.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa26cLzh6PYUwY4LMpwbHyDHFmWi_w2JuqDzeOdm1IIEbBZO0Vg' }
]


const Cell = (props: any) => {
    const item = props.item;
    return (
        <div className='layout-Cell' style={{ width: 400, height: 50, border: '1px solid black' }}>
            <img src={item.img} style={{ width: 45, height: 45 }} draggable={false} alt='card'></img>
            <div style={{ paddingLeft: 12, color: '#595959' }}>{item.content}</div>
        </div>
    )
}

const dataList = [
    { y: 0, ...Words[0], key: '0' },
    { y: 1, ...Words[1], key: '1' },
    { y: 2, ...Words[2], key: '2' },
    { y: 3, ...Words[3], key: '3' }
]

const dataList2 = [
    { y: 0, ...Words[0], key: '100' },
    { y: 1, ...Words[1], key: '101' },
    { y: 2, ...Words[2], key: '201' },
    { y: 3, ...Words[3], key: '301' }
]



export class SortableList extends React.Component<{}, {}> {
    one: DragactList | null;
    two: DragactList | null;




    render() {
        const list = [dataList, dataList2];

        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    <h1 style={{ textAlign: 'center' }}>Sort list Demo</h1>
                    <DragactList
                        layout={list}
                        width={450}
                        rowHeight={60}
                        margin={[50, 5]}
                        className='normal-layout'
                        ref={node => this.one = node}
                    >
                        {(child: any, index: number) => {
                            return <Cell item={child} />
                        }}
                    </DragactList>
                </div>
            </div>
        )
    }

}

