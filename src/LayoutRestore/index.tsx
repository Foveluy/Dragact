// import * as React from 'react';
// import { Dragact } from '../lib/dragact'
// import './index.css';


// interface CardItem {
//     content: string,
//     img: string
// }

// const Words = [
//     { content: 'You can do anything, but not everything.', img: 'http://pic.sc.chinaz.com/files/pic/pic9/201303/xpic10472.jpg' },
//     { content: 'Those who dare to fail miserably can achieve greatly.', img: 'https://img00.deviantart.net/1163/i/2013/059/d/7/irish_views_by_ssquared_photography-d5wjnsk.jpg' },
//     { content: 'You miss 100 percent of the shots you never take.', img: 'http://www.landsendhotel.co.uk/uploads/gallery/gallery/coastal_scenery_seascapes_6.jpg' },
//     { content: 'Those who believe in telekinetics, raise my hand.', img: 'https://tctechcrunch2011.files.wordpress.com/2017/10/26099344353_18cd6fabb8_k.jpg?w=738' },
//     { content: 'I’d rather live with a good question than a bad answer.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa26cLzh6PYUwY4LMpwbHyDHFmWi_w2JuqDzeOdm1IIEbBZO0Vg' }
// ]


// const Card = (props: any) => {
//     const item: CardItem = props.item;
//     return (
//         <div className='layout-Item'>
//             <img src={item.img} style={{ width: '100%', height: '60%' }} draggable={false} alt='card'></img>
//             <div style={{ padding: 5, textAlign: 'center', color: '#595959' }}>{item.content}</div>
//         </div>
//     )
// }


// var storeLayout: any = {};
// export class LayoutRestore extends React.Component<{}, {}> {
//     dragactNode: Dragact;
//     handleOnDragEnd = () => {
//         const maping: any = {};
//         this.dragactNode.getLayout().forEach((item) => {
//             if (item.key)
//                 maping[item.key] = item;
//         })
//         const parsedLayout = JSON.stringify(maping);

//         localStorage.setItem('layout', parsedLayout);
//     }
//     componentWillMount() {
//         const lastLayout = localStorage.getItem('layout');
//         if (lastLayout) {
//             storeLayout = JSON.parse(lastLayout);
//         }
//     }

//     getLayoutItemForKey(key: string) {
//         return storeLayout[key]
//     }

//     renderDragact = () => {
//         const margin: [number, number] = [5, 5];
//         const dragactInit = {
//             width: 800,
//             col: 12,
//             rowHeight: 800 / 12,
//             margin: margin,
//             className: 'normal-layout'
//         }

//         return (
//             <Dragact {...dragactInit} ref={node => node ? this.dragactNode = node : null} onDragEnd={this.handleOnDragEnd}>
//                 {Words.map((el, index) => {
//                     const dataSet = this.getLayoutItemForKey(index + '');
//                     if (dataSet)
//                         return <Card item={el} key={index} data-set={...dataSet} />
//                     else
//                         return <Card item={el} key={index} data-set={{ GridX: (index * 3) % 12, GridY: index * 2, w: 3, h: 3 }} />
//                 })}
//             </Dragact>
//         )
//     }

//     render() {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center' }}>
//                 <div>
//                     <h1 style={{ textAlign: 'center' }}>Layout Restore Demo</h1>
//                     {this.renderDragact()}
//                 </div>
//             </div>
//         )
//     }
// }
