import * as React from "react";
import GridItem, { GridItemEvent } from './GridItem'
import { compactLayout } from './util/compact';
import { getMaxContainerHeight } from './util/sort';
import { layoutCheck } from './util/collison';
import { correctLayout } from './util/correction';
import { getDataSet, stringJoin } from './utils';
import { layoutItemForkey, syncLayout, MapLayoutTostate } from './util/initiate';

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
    layout?: DragactLayoutItem[] //暂时不推荐使用
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
}

interface DragactState {
    GridXMoving: number
    GridYMoving: number
    wMoving: number
    hMoving: number
    placeholderShow: Boolean,
    placeholderMoving: Boolean,
    layout: DragactLayoutItem[],
    containerHeight: number,
    dragType: 'drag' | 'resize'
}

export class Dragact extends React.Component<DragactProps, DragactState> {
    constructor(props: DragactProps) {
        super(props)
        this.onDrag = this.onDrag.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)


        const layout = props.layout ?
            MapLayoutTostate(props.layout, props.children)
            :
            getDataSet(props.children);

        this.state = {
            GridXMoving: 0,
            GridYMoving: 0,
            wMoving: 0,
            hMoving: 0,
            placeholderShow: false,
            placeholderMoving: false,
            layout: layout,
            containerHeight: 500,
            dragType: 'drag'
        }
    }
    onResizeStart = (layoutItem: GridItemEvent) => {
        const { GridX, GridY, w, h, UniqueKey } = layoutItem
        const sync = syncLayout(this.state.layout, UniqueKey, GridX, GridY, true);
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

        const compacted = compactLayout(newLayout)

        for (let i = 0; i < compacted.length; i++) {
            const compactedItem = compacted[i];
            if (layoutItem.UniqueKey === compactedItem.key) {
                /**
                 * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
                 * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
                 * 但是实际layout中的位置还是会改变
                 * (isUserMove=true用于解除placeholder和元素的绑定)
                 */
                compactedItem.isUserMove = true
                break
            }
        }

        this.setState({
            layout: compacted,
            wMoving: layoutItem.w,
            hMoving: layoutItem.h,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
        })
    }

    onResizeEnd = (layoutItem: GridItemEvent) => {
        const compactedLayout = compactLayout(this.state.layout)
        this.setState({
            placeholderShow: false,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        })
        this.props.onDragEnd && this.props.onDragEnd(layoutItem);
    }

    onDragStart(bundles: GridItemEvent) {
        const { GridX, GridY, w, h, UniqueKey } = bundles

        const newlayout = syncLayout(this.state.layout, UniqueKey, GridX, GridY, true)

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

        const { GridY, UniqueKey } = layoutItem
        const moving = GridY - this.state.GridYMoving

        const newLayout = layoutCheck(this.state.layout, layoutItem, UniqueKey, UniqueKey/*用户移动方块的key */, moving)
        const compactedLayout = compactLayout(newLayout)
        for (let i = 0; i < compactedLayout.length; i++) {
            const compactedItem = compactedLayout[i];
            if (UniqueKey === compactedItem.key) {
                /**
                 * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
                 * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
                 * 但是实际layout中的位置还是会改变
                 * (isUserMove=true用于解除placeholder和元素的绑定)
                 */
                compactedItem.isUserMove = true
                layoutItem.GridX = compactedItem.GridX
                layoutItem.GridY = compactedItem.GridY
                break
            }
        }
        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        })
        this.props.onDrag && this.props.onDrag(layoutItem);
    }

    onDragEnd(layoutItem: GridItemEvent) {

        const compactedLayout = compactLayout(this.state.layout)

        this.setState({
            placeholderShow: false,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        })

        this.props.onDragEnd && this.props.onDragEnd(layoutItem);
    }
    renderPlaceholder() {
        if (!this.state.placeholderShow) return null
        var { col, width, padding, rowHeight, margin } = this.props
        const { GridXMoving, GridYMoving, wMoving, hMoving, placeholderMoving, dragType } = this.state

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
                style={{ background: 'rgba(15,15,15,0.3)', zIndex: dragType === 'drag' ? 1 : 10, transition: ' all .15s' }}
                isUserMove={!placeholderMoving}
                dragType={dragType}
                canDrag={false}
                canResize={false}
            />
        )
    }

    componentWillReceiveProps(nextProps: any) {
        if(nextProps.children.length !== this.props.children.length){
            
        }

        const layout = getDataSet(nextProps.children);
        let newlayout = correctLayout(layout, this.props.col)
        const compacted = compactLayout(newlayout);
        console.log(layout)
        this.setState({
            layout: compacted
        })
    }


    componentDidMount() {
        setTimeout(() => {
            let layout = correctLayout(this.state.layout, this.props.col)
            const compacted = compactLayout(layout);
            this.setState({
                layout: compacted,
                containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
            })
        }, 1);
    }

    getGridItem(child: any, index: number) {
        const { layout, dragType } = this.state
        var { col, width, padding, rowHeight, margin } = this.props;
        const renderItem = layoutItemForkey(layout, child.key);//TODO:可以优化速度，这一步不是必须;
        if (renderItem) {
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
                >
                    {child}
                </GridItem >
            )
        }
    }

    render() {
        const { width, className } = this.props;
        const { containerHeight } = this.state;

        return (
            <div
                className={stringJoin('DraggerLayout', className + '')}
                style={{ left: 100, width: width, height: containerHeight, zIndex: 1 }}
            >
                {React.Children.map(this.props.children,
                    (child, index) => this.getGridItem(child, index)
                )}
                {this.renderPlaceholder()}
            </div>
        )
    }

    //api
    getLayout() {
        return this.state.layout;
    }
}
