import { GridItemEvent } from './gridItem';

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
    layout: DragactLayoutItem[]
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

    children: (Item: DragactLayoutItem, provided: GridItemProvided) => any,


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
    onDragStart?: (event: GridItemEvent, currentLayout: DragactLayoutItem[]) => void

    /**
     * 拖动中的回调
     */
    onDrag?: (event: GridItemEvent, currentLayout: DragactLayoutItem[]) => void

    /**
     * 拖动结束的回调
     */
    onDragEnd?: (event: GridItemEvent, currentLayout: DragactLayoutItem[]) => void

    /**
     * 每个元素的margin,第一个参数是左右，第二个参数是上下
     */
    margin: [number, number]

    /** 
     * layout的名字
    */
    className: number | string

    /**是否有placeholder */
    placeholder?: Boolean

    style?: React.CSSProperties
}

export interface mapLayout {
    [key: string]: DragactLayoutItem
}

export interface DragactState {
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

export interface GridItemProvided {
    isDragging: Boolean
    dragHandle: any;
    resizeHandle: any;
    props: any;
}
