import { DragactLayout } from "../dragact";

/**
 * 把用户移动的块，标记为true
 * @param {*} layout 
 * @param {*} key 
 * @param {*} GridX 
 * @param {*} GridY 
 * @param {*} isUserMove 
 */
export const syncLayout = (layout: DragactLayout[], key: number | string, GridX: number, GridY: number, isUserMove: Boolean) => {
    const newlayout = layout.map((item) => {
        if (item.key === key) {
            item.GridX = GridX
            item.GridY = GridY
            item.isUserMove = isUserMove
            return item
        }
        return item
    })
    return newlayout
}


/**
 * 初始化的时候调用
 * 会把isUserMove和key一起映射到layout中
 * 不用用户设置
 * @param {*} layout 
 * @param {*} children 
 */

export const MapLayoutTostate = (layout: DragactLayout[], children: any[]) => {
    return layout.map((child, index) => {
        let newChild = { ...child, isUserMove: true, key: children[index].key, static: children[index].static }
        return newChild
    })
}

/**
 * 用key从layout中拿出item
 * @param {*} layout 输入进来的布局
 * @param {*} key 
 */
export const layoutItemForkey = (layout: DragactLayout[], key: number) => {
    for (let i = 0, length = layout.length; i < length; i++) {
        if (key === layout[i].key) {
            return layout[i]
        }
    }
}


