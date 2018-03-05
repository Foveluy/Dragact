export interface Bound {
    left: number,
    top: number,
    right: number,
    bottom: number
}

export interface DraggerProps {

    className?: string;

    /**
    * 给予元素一个x,y的初始位置，单位是px
    */
    x?: number,
    y?: number,

    /** 
     * 拖动范围限制
     * 如果不规定范围，那么子元素就可以随意拖动不受限制
     * 1.可以提供自定义的范围限制
     * 2.也可以提供父类为边框的范围限制(string === parent)
     */
    bounds?: Bound | 'parent',

    /**
         * 以网格的方式移动，每次移动并不是平滑的移动
         * [20,30]，鼠标x轴方向移动了20 px ，y方向移动了30 px，整个子元素才会移动
         */
    grid?: [number, number],


    /**只允许移动x轴 */
    /**只允许移动y轴 */
    allowX?: Boolean,
    allowY?: Boolean,


    /**
    * 是否由用户移动
    * 可能是通过外部props改变
    */
    isUserMove?: Boolean,

    /**
     * 生命周期回调
     */
    onDragStart?: (x: number, y: number) => void,
    onMove?: (event: MouseEvent | TouchEvent, x: number, y: number) => void,
    onDragEnd?: (event: MouseEvent | TouchEvent, x: number, y: number) => void,

    onResizeStart?: (event: any, x: number, y: number) => void,
    onResizing?: (event: MouseEvent | TouchEvent, x: number, y: number) => void
    onResizeEnd?: (event: MouseEvent | TouchEvent, x: number, y: number) => void


    style?: React.CSSProperties,

    w?: number,
    h?: number,

    handle?: Boolean;

    canDrag?: Boolean;

    canResize?: Boolean;

    children: (provided: any, resizeMix: any, dragMix: any) => any;
}
