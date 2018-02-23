import * as React from "react";
import { GridItemEvent } from '../GridItem'
// import { compactLayout } from '../util/compact';
// import { getMaxContainerHeight } from '../util/sort';
// import { layoutCheck } from '../util/collison';

import { stringJoin } from '../utils';
// import { syncLayout } from '../util/initiate';

import './index.css';
import { Dragger } from "../dragger/index";


export interface DragactLayoutItem {
    GridX: number
    GridY: number
    static?: Boolean
    w: number
    h: number
    isUserMove?: Boolean
    key?: number | string
    handle?: Boolean
    canDrag?: Boolean
    canResize?: Boolean
}

export interface DragactProps {
    /** 
     * 容器的宽度
    */
    width: number,

    /**容器内每个元素的最小高度 */
    rowHeight: number,
    /**
     * 容器内部的padding
     */
    padding?: number,

    children: any[] | any


    // 
    // interface GridItemEvent {
    //     event: any //浏览器拖动事件
    //     GridX: number //在布局中的x格子  
    //     GridY: number //在布局中的y格子  
    //     w: number //元素的宽度
    //     h: number //元素的高度
    //     UniqueKey: string | number //元素的唯一key
    // }

    /**
     * 拖动开始的回调
     */
    onDragStart?: (event: GridItemEvent) => void

    /**
     * 拖动中的回调
     */
    onDrag?: (event: GridItemEvent) => void

    /**
     * 拖动结束的回调
     */
    onDragEnd?: (event: GridItemEvent) => void

    /**
     * 每个元素的margin,第一个参数是左右，第二个参数是上下
     */
    margin: [number, number]

    /** 
     * layout的名字
    */
    className: number | string
}

export interface mapLayout {
    [key: string]: DragactLayoutItem
}

// interface DragactState {
//     GridXMoving: number
//     GridYMoving: number
//     wMoving: number
//     hMoving: number
//     placeholderShow: Boolean
//     placeholderMoving: Boolean
//     layout: any;
//     containerHeight: number
//     dragType: 'drag' | 'resize'
//     mapLayout: mapLayout | undefined
//     col: number

// }


export class Column extends React.Component<{}, {}>{


    render() {
        return this.props.children
    }
}

interface ListItemEvent {
    key: any,
    x: number,
    y: number
}

interface ListCellProps {
    x: number
    y: number
    isUserMove: Boolean
    style: React.CSSProperties
    onDragStart: (e: ListItemEvent) => void
    onDrag: (e: ListItemEvent) => void
    onDragEnd: (e: ListItemEvent) => void
    margin: [number, number]
    rowHeight: number
    width: number
    col: number
    UniqueKey: number
}

const checkInContainer = (GridX: number, GridY: number) => {

    /**防止元素出container */
    // if (GridY < 0) GridY = 0//上边界
    return { GridX, GridY }
}


export class ListCell extends React.Component<ListCellProps, {}>{

    calGridXY(x: number, y: number) {
        const { margin, width, col, rowHeight } = this.props
        const containerWidth = width * col + margin[0];

        /**坐标转换成格子的时候，无须计算margin */
        let GridX = Math.round(x / containerWidth * col)
        let GridY = Math.round(y / (rowHeight + (margin ? margin[1] : 0)))

        // /**防止元素出container */
        return checkInContainer(GridX, GridY)
    }

    onDragStart = (x: number, y: number) => {
        const { GridX, GridY } = this.calGridXY(x, y);
        const { UniqueKey } = this.props;

        this.props.onDragStart({ key: UniqueKey, x: GridX, y: GridY });
    }
    onDrag = (event: any, x: number, y: number) => {
        const { GridX, GridY } = this.calGridXY(x, y);
        const { UniqueKey } = this.props;

        this.props.onDrag({ key: UniqueKey, x: GridX, y: GridY });
    }

    onDragEnd = (event: any, x: number, y: number) => {
        const { GridX, GridY } = this.calGridXY(x, y);
        const { UniqueKey } = this.props;
        this.props.onDragEnd({ key: UniqueKey, x: GridX, y: GridY });
    }


    render() {
        const { x, y, isUserMove, width, style, rowHeight, margin } = this.props;

        return (
            <Dragger
                x={x * width}
                y={Math.round(y * rowHeight + margin[1] * (y + 1))}
                style={{ ...style, width: width, transition: this.props.isUserMove ? '' : 'all .2s', }}
                isUserMove={isUserMove}
                onDragStart={this.onDragStart}
                onMove={this.onDrag}
                canResize={false}
                onDragEnd={this.onDragEnd}
            >
                {this.props.children}
            </Dragger>
        )
    }

}

export const collision = (a: number, b: number) => {
    if (a === b) {
        return 1
    }
    if (a + 1 <= b) return -1
    if (a >= b + 1) return -1
    return 2
}


const swapList = (list: any, movingItem: any, firstKey: any) => {
    var moving: any = [];
    var newList = list.map((oldItem: any) => {
        if (oldItem.key !== movingItem.key) {
            const num = collision(oldItem.y, movingItem.y)
            if (num > 0) {
                // console.log(num)
                var offset = oldItem.y - 1
                // if (movingItem.y > oldItem.y && movingItem.y < oldItem.y + 1) {
                //     /**
                //      * 元素向上移动时，元素的上面空间不足,则不移动这个元素
                //      * 当元素移动到GridY>所要向上交换的元素时，就不会进入这里，直接交换元素
                //      */
                //     console.log('你来了')
                //     offset = oldItem.y
                // }
                // }
                moving.push({ ...oldItem, y: offset, isUserMove: false })

                return { ...oldItem, y: offset, isUserMove: false }
            }
            return oldItem
        } else if (movingItem.key === firstKey) {

            /**永远保持用户移动的块是 isUserMove === true */
            return { ...oldItem, ...movingItem }
        }
        return oldItem
    })


    for (const i in moving) {
        newList = swapList(newList, moving[i], firstKey);
    }
    return newList;
}

/**获取layout中，item第一个碰撞到的物体 */
export const getFirstCollison = (layout: any, item: any) => {
    for (let i = 0, length = layout.length; i < length; i++) {
        if (collision(layout[i].y, item.y) > 0) {
            return layout[i]
        }
    }
    return null
}

const compactCell = (partialList: any, cell: any) => {


    if (partialList.length === 0) {
        return { ...cell, y: 0 }
    }
    var newCell = { ...cell };
    /**
     * 类似一个递归调用
     */
    while (true) {

        let FirstCollison = getFirstCollison(partialList, newCell)
        if (FirstCollison) {

            /**第一次发生碰撞时，就可以返回了 */
            return { ...newCell, y: FirstCollison.y + 1 }
        }
        newCell.y--

        if (newCell.y < 0) return { ...newCell, y: 0 }/**碰到边界的时候，返回 */
    }

}


export const compactList = (list: any, movingItem: any) => {
    const sort = list.sort((a: any, b: any) => {
        if (a.y === b.y) {

            if (b.isUserMove) return 1
        }
        if (a.y > b.y) return 1
        return 0
    })
    // console.log('sor',sort)
    const needCompact = Array(list.length)
    const after: any = [];
    for (const i in sort) {
        const finished = compactCell(after, sort[i]);

        if (movingItem) {
            if (movingItem.key === finished.key) {
                finished.isUserMove = true
            } else
                finished.isUserMove = false
        }
        else
            finished.isUserMove = false

        after.push(finished);
        needCompact[(i as any)] = finished;
    }


    return needCompact;
}


export class DragactList extends React.Component<DragactProps, any> {
    dragact: HTMLDivElement | null

    constructor(props: DragactProps) {
        super(props)
        // const layout = getDataSet(props.children);


        const layout = props.children.map((child: any) => {
            return child.map((el: any) => {
                return { ...el.props['data-set'], key: el.key, isUserMove: false };
            })
        })
        // console.log(layout)
        // console.log(layout);

        this.state = {
            GridXMoving: 0,
            GridYMoving: 0,
            wMoving: 0,
            hMoving: 0,
            placeholderShow: false,
            placeholderMoving: false,
            layout: layout,
            containerHeight: 500,
            dragType: 'drag',
            mapLayout: undefined,
            col: 3,
            currentList: 0
        }
    }

    componentWillReceiveProps(nextProps: any) {
        // if (this.props.children.length > nextProps.children.length) { //remove
        //     const mapLayoutCopy = { ...this.state.mapLayout };
        //     nextProps.children.forEach((child: any) => {
        //         if ((mapLayoutCopy as any)[child.key] !== void 666) delete (mapLayoutCopy as any)[child.key];
        //     })
        //     for (const key in mapLayoutCopy) {
        //         const newLayout = this.state.layout.filter((child) => {
        //             if (child.key !== key) return child
        //         })
        //         const { compacted, mapLayout } = compactLayout(newLayout, undefined);
        //         this.setState({
        //             containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1]),
        //             layout: compacted,
        //             mapLayout
        //         })
        //     }
        // }

        // if (this.props.children.length < nextProps.children.length) { //add
        //     var item;
        //     for (const idx in nextProps.children) {
        //         const i = nextProps.children[idx];
        //         if (this.state.mapLayout && !this.state.mapLayout[i.key]) {
        //             item = i;
        //             break;
        //         }
        //     }
        //     if (item !== void 666) {
        //         const dataSet = { ...item.props['data-set'], isUserMove: false, key: item.key };
        //         var newLayout = [...this.state.layout, dataSet]
        //         newLayout = correctLayout(newLayout, this.state.col)
        //         const { compacted, mapLayout } = compactLayout(newLayout, undefined);
        //         console.log(mapLayout)
        //         // console.log(layout)
        //         this.setState({
        //             containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1]),
        //             layout: compacted,
        //             mapLayout
        //         })
        //     }
        // }

    }


    componentDidMount() {

        setTimeout(() => {
            const swp = [...this.state.layout[0]]
            this.state.layout[0] = this.state.layout[1];
            this.state.layout[1] = swp;
            this.setState({
                layout: this.state.layout
            })

        }, 1000);
    }


    onDragStart = (e: ListItemEvent) => {
        const { key, x } = e;


        for (const idx in this.state.layout[x]) {
            if (this.state.layout[x][idx].key === key) {

                this.state.layout[x][idx].isUserMove = true;
                break;
            }
        }
        this.setState({
            layout: this.state.layout,
            currentList: x
        })
        console.log(this.state.layout)
    }

    onDrag = (e: ListItemEvent) => {
        const { key, x, y } = e;


        const newList = swapList(this.state.layout[x], { y, key }, key)
        const compacted = compactList(newList, { y, key });
        this.state.layout[x] = compacted;

        this.setState({
            layout: [...this.state.layout]
        })
    }

    onDragEnd = (e: ListItemEvent) => {
        const { x, y } = e;

        if (this.state.currentList !== x) {
            this.state.layout[x].push({ y, key: "10203", isUserMove: false })
            const compacted = compactList(this.state.layout[x], undefined);
            this.state.layout[x] = compacted;
            this.setState({
                layout: [...this.state.layout]
            })

        } else {
            const compacted = compactList(this.state.layout[x], undefined);
            this.state.layout[x] = compacted;
            this.setState({
                layout: [...this.state.layout]
            })
        }

    }

    renderList = () => {
        return this.props.children.map((child: any, index: number) => <div className='list-oneof' key={index}>{this.renderColumn(child, index)}</div>)
    }
    renderColumn = (child: any, index: number) => {
        // const column = this.state.layout[index];

        const { width, margin, rowHeight } = this.props;

        

        return child.map((c: any, idx: any) => {
            const key = c.key;
            var renderItem: any;
            for (const i in this.state.layout[index]) {
                if (this.state.layout[index][i].key === key) {
                    renderItem = this.state.layout[index][i];
                }
            }
            console.log(index,key)
            return <ListCell
                margin={margin}
                rowHeight={rowHeight}
                width={width}
                col={this.props.children.length}
                x={index}
                y={renderItem.y}
                style={{ position: 'absolute' }}
                key={idx}
                UniqueKey={key}
                isUserMove={renderItem.isUserMove}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onDragEnd={this.onDragEnd}
            >
                {c}
            </ListCell>
        })
    }

    render() {
        const { width, className, children } = this.props;
        const numberOfCol = children.length;

        return (
            <div
                className={stringJoin('DraggerLayout', className + '')}
                style={{ left: 100, width: width * numberOfCol, height: '', zIndex: 1 }}
            >
                {this.renderList()}
            </div>
        )
    }
}
