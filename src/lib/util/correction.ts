import { collision, layoutCheck } from "./collison";
import { DragactLayoutItem } from "../dragact-type";
import { GridItemEvent } from "../gridItem";


export const checkInContainer = (GridX: number, GridY: number, col: number, w: number) => {

    /**防止元素出container */
    if (GridX + w > col - 1) GridX = col - w //右边界
    if (GridX < 0) GridX = 0//左边界
    if (GridY < 0) GridY = 0//上边界
    return { GridX, GridY }
}

/**
 * 这个函数会有副作用，不是纯函数，会改变item的Gridx和GridY
 * @param {*} item 
 */
export const correctItem = (item: DragactLayoutItem, col: number) => {
    const { GridX, GridY } = checkInContainer(item.GridX, item.GridY, col, item.w)
    item.GridX = GridX;
    item.GridY = GridY;
}
export const correctLayout = (layout: DragactLayoutItem[], col: number) => {
    var copy = [...layout];
    for (let i = 0; i < layout.length - 1; i++) {
        correctItem(copy[i], col)
        correctItem(copy[i + 1], col);

        if (collision(copy[i], copy[i + 1])) {
            copy = layoutCheck(copy, <GridItemEvent>copy[i], (<GridItemEvent>copy[i]).UniqueKey + '', (<GridItemEvent>copy[i]).UniqueKey + '', 0)
        }
    }

    return copy;
}
