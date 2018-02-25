import * as React from "react";
import GridItem, { GridItemEvent } from './GridItem'
import { compactLayout } from './util/compact';
import { getMaxContainerHeight } from './util/sort';
import { layoutCheck } from './util/collison';
import { correctLayout } from './util/correction';
import { stringJoin } from './utils';
import { layoutItemForkey, syncLayout } from './util/initiate';

import './style.css';


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
    layout: DragactLayoutItem[] //暂时不推荐使用
    /** 
     * 宽度切分比 
     * 这个参数会把容器的宽度平均分为col等份
     * 于是容器内元素的最小宽度就等于 containerWidth/col
    */
    col: number,

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

    placeholder?: Boolean
}

export interface mapLayout {
    [key: string]: DragactLayoutItem
}

interface DragactState {
    GridXMoving: number
    GridYMoving: number
    wMoving: number
    hMoving: number
    placeholderShow: Boolean
    placeholderMoving: Boolean
    layout: DragactLayoutItem[]
    containerHeight: number
    dragType: 'drag' | 'resize'
    mapLayout: mapLayout | undefined

}

export class Dragact extends React.Component<DragactProps, DragactState> {
    constructor(props: DragactProps) {
        super(props)
        this.onDrag = this.onDrag.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)

        // const layout = props.layout ?
        //     MapLayoutTostate(props.layout, props.children)
        //     :
        //     getDataSet(props.children);

        const layout = props.layout;

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
            mapLayout: undefined
        }
    }
    onResizeStart = (layoutItem: GridItemEvent) => {
        const { GridX, GridY, w, h } = layoutItem
        const sync = syncLayout(this.state.layout, layoutItem);
        this.setState({
            GridXMoving: GridX,
            GridYMoving: GridY,
            wMoving: w,
            hMoving: h,
            placeholderShow: true,
            placeholderMoving: true,
            layout: sync,
            dragType: 'resize'
        })
    }

    onResizing = (layoutItem: GridItemEvent) => {

        const newLayout = layoutCheck(this.state.layout, layoutItem, layoutItem.UniqueKey, layoutItem.UniqueKey, 0);

        const { compacted, mapLayout } = compactLayout(newLayout, layoutItem)

        this.setState({
            layout: compacted,
            wMoving: layoutItem.w,
            hMoving: layoutItem.h,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
        })
    }

    onResizeEnd = (layoutItem: GridItemEvent) => {
        const { compacted, mapLayout } = compactLayout(this.state.layout, undefined)
        this.setState({
            placeholderShow: false,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
        })
        this.props.onDragEnd && this.props.onDragEnd(layoutItem);
    }

    onDragStart(bundles: GridItemEvent) {
        const { GridX, GridY, w, h } = bundles

        const newlayout = syncLayout(this.state.layout, bundles)

        this.setState({
            GridXMoving: GridX,
            GridYMoving: GridY,
            wMoving: w,
            hMoving: h,
            placeholderShow: true,
            placeholderMoving: true,
            layout: newlayout,
            dragType: 'drag'
        })
        this.props.onDragStart && this.props.onDragStart(bundles)
    }

    onDrag(layoutItem: GridItemEvent) {

        const { GridY, UniqueKey } = layoutItem;
        const moving = GridY - this.state.GridYMoving;

        const newLayout = layoutCheck(this.state.layout, layoutItem, UniqueKey, UniqueKey/*用户移动方块的key */, moving);
        const { compacted, mapLayout } = compactLayout(newLayout, layoutItem);

        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
        })
        this.props.onDrag && this.props.onDrag(layoutItem);
    }

    onDragEnd(layoutItem: GridItemEvent) {

        const { compacted, mapLayout } = compactLayout(this.state.layout, undefined)

        this.setState({
            placeholderShow: false,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
        })

        this.props.onDragEnd && this.props.onDragEnd(layoutItem);
    }
    renderPlaceholder() {
        if (!this.state.placeholderShow) return null
        var { col, width, padding, rowHeight, margin, placeholder } = this.props
        const { GridXMoving, GridYMoving, wMoving, hMoving, placeholderMoving, dragType } = this.state

        if (!placeholder) return null;
        if (!padding) padding = 0;
        return (
            <GridItem
                margin={margin}
                col={col}
                containerWidth={width}
                containerPadding={[padding, padding]}
                rowHeight={rowHeight}
                GridX={GridXMoving}
                GridY={GridYMoving}
                w={wMoving}
                h={hMoving}
                style={{ background: 'rgba(15,15,15,0.3)', zIndex: dragType === 'drag' ? 1 : 10, transition: ' all .15s ease-out' }}
                isUserMove={!placeholderMoving}
                dragType={dragType}
                canDrag={false}
                canResize={false}
            />
        )
    }

    componentWillReceiveProps(nextProps: any) {
        if (this.props.children.length > nextProps.children.length) { //remove
            const mapLayoutCopy = { ...this.state.mapLayout };
            nextProps.children.forEach((child: any) => {
                if ((mapLayoutCopy as any)[child.key] !== void 666) delete (mapLayoutCopy as any)[child.key];
            })
            for (const key in mapLayoutCopy) {
                const newLayout = this.state.layout.filter((child) => {
                    if (child.key !== key) return child
                })
                const { compacted, mapLayout } = compactLayout(newLayout, undefined);
                this.setState({
                    containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1]),
                    layout: compacted,
                    mapLayout
                })
            }
        }

        if (this.props.children.length < nextProps.children.length) { //add
            var item;
            for (const idx in nextProps.children) {
                const i = nextProps.children[idx];
                if (this.state.mapLayout && !this.state.mapLayout[i.key]) {
                    item = i;
                    break;
                }
            }
            if (item !== void 666) {
                const dataSet = { ...item.props['data-set'], isUserMove: false, key: item.key };
                var newLayout = [...this.state.layout, dataSet]
                newLayout = correctLayout(newLayout, this.props.col)
                const { compacted, mapLayout } = compactLayout(newLayout, undefined);
                console.log(mapLayout)
                // console.log(layout)
                this.setState({
                    containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1]),
                    layout: compacted,
                    mapLayout
                })
            }
        }

    }


    componentDidMount() {
        setTimeout(() => {
            let layout = correctLayout(this.state.layout, this.props.col)
            const { compacted, mapLayout } = compactLayout(layout, undefined);
            this.setState({
                layout: compacted,
                mapLayout: mapLayout,
                containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
            })
        }, 1);
    }

    getGridItem(child: any, index: number) {
        const { dragType, mapLayout } = this.state;
        var { col, width, padding, rowHeight, margin } = this.props;
        if (mapLayout) {
            const renderItem = layoutItemForkey(mapLayout, child.key);
            if (!padding) padding = 0;
            return (
                <GridItem
                    margin={margin}
                    col={col}
                    containerWidth={width}
                    containerPadding={[padding, padding]}
                    rowHeight={rowHeight}
                    GridX={renderItem.GridX}
                    GridY={renderItem.GridY}
                    w={renderItem.w}
                    h={renderItem.h}
                    onDrag={this.onDrag}
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                    isUserMove={renderItem.isUserMove !== void 666 ? renderItem.isUserMove : false}
                    UniqueKey={child.key}
                    static={renderItem.static}
                    onResizing={this.onResizing}
                    onResizeStart={this.onResizeStart}
                    onResizeEnd={this.onResizeEnd}
                    dragType={dragType}
                    handle={renderItem.handle}
                    canDrag={renderItem.canDrag}
                    canResize={renderItem.canResize}
                    key={child.key}
                >
                    {this.props.children(child, index)}
                </GridItem >
            )
        }
    }
    render() {
        const {
            width,
            className,
            layout
        } = this.props;
        const { containerHeight } = this.state;

        return (
            <div
                className={stringJoin('DraggerLayout', className + '')}
                style={{
                    left: 100,
                    width: width,
                    height: containerHeight,
                    zIndex: 1
                }}
            >
                {layout.map((item, index) => {
                    return this.getGridItem(item, index)
                })}
                {this.renderPlaceholder()}
            </div>
        )
    }

    //api
    getLayout() {
        return this.state.layout;
    }

    //api
    deleteItem(key: any) {
    }
}
