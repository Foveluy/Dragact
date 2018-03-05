import { DragactLayoutItem } from "../dragact-type";
import { GridItemEvent } from "../gridItem";

export const collision = (a: DragactLayoutItem, b: DragactLayoutItem) => {
    if (a.GridX === b.GridX && a.GridY === b.GridY &&
        a.w === b.w && a.h === b.h) {
        return true
    }
    if (a.GridX + a.w <= b.GridX) return false
    if (a.GridX >= b.GridX + b.w) return false
    if (a.GridY + a.h <= b.GridY) return false
    if (a.GridY >= b.GridY + b.h) return false
    return true
}


/**获取layout中，item第一个碰撞到的物体 */
export const getFirstCollison = (layout: DragactLayoutItem[], item: DragactLayoutItem) => {

    for (let i = 0, length = layout.length; i < length; i++) {
        if (collision(layout[i], item)) {
            return layout[i]
        }
    }
    return null
}


/**
 * 这个函数带有记忆功能
 */
export const layoutCheck = function () {

    var caches: any = {};

    const _layoutCheck = function (layout: DragactLayoutItem[], layoutItem: GridItemEvent,
        key: string, fristItemkey: string, moving: number) {


        if (layoutItem.GridX === caches.GridX
            && layoutItem.GridY === caches.GridY
            && layoutItem.w === caches.w
            && layoutItem.h === caches.h) {
            return layout;
        }
        caches = { ...layoutItem };

        let i: any = [], movedItem: any = []/**收集所有移动过的物体 */
        let newlayout = layout.map((item, idx) => {
            if (item.key !== key) {
                if (item.static) {
                    return item
                }
                if (collision(item, layoutItem)) {
                    i.push(item.key)
                    /**
                     * 这里就是奇迹发生的地方，如果向上移动，那么必须注意的是
                     * 一格一格的移动，而不是一次性移动
                     */
                    let offsetY = item.GridY + 1

                    /**这一行也非常关键，当向上移动的时候，碰撞的元素必须固定 */
                    // if (moving < 0 && layoutItem.GridY > 0) offsetY = item.GridY

                    if (layoutItem.GridY > item.GridY && layoutItem.GridY < item.GridY + item.h) {
                        /**
                         * 元素向上移动时，元素的上面空间不足,则不移动这个元素
                         * 当元素移动到GridY>所要向上交换的元素时，就不会进入这里，直接交换元素
                         */
                        offsetY = item.GridY
                    }
                    // const newItem = { ...item, GridX: layoutItem.GridX, GridY: offsetY, isUserMove: false };

                    const newItem = { ...item, GridY: offsetY, isUserMove: false }
                    movedItem.push(newItem)
                    return newItem
                }
            } else if (fristItemkey === key) {

                /**永远保持用户移动的块是 isUserMove === true */
                return { ...item, ...layoutItem }
            }

            return item
        })
        /** 递归调用,将layout中的所有重叠元素全部移动 */
        const length = movedItem.length;
        for (let c = 0; c < length; c++) {
            newlayout = _layoutCheck(newlayout, movedItem[c], i[c], fristItemkey, 0)
        }
        return newlayout
    }
    return _layoutCheck;
}();

