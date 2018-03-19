import { sortLayout } from "./sort";
import { getFirstCollison } from "./collison";
import { DragactLayoutItem, mapLayout } from "../dragact-type";
import { GridItemEvent } from "../GridItem";

/**
 * 压缩单个元素，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} finishedLayout 压缩完的元素会放进这里来，用来对比之后的每一个元素是否需要压缩
 * @param {*} item 
 */
export const compactItem = (finishedLayout: DragactLayoutItem[], item: DragactLayoutItem) => {
    if (item.static) return item;
    const newItem = { ...item, key: item.key + '' }
    if (finishedLayout.length === 0) {
        return { ...newItem, GridY: 0 }
    }
    /**
     * 类似一个递归调用
     */
    while (true) {
        let FirstCollison = getFirstCollison(finishedLayout, newItem)
        if (FirstCollison) {
            /**第一次发生碰撞时，就可以返回了 */
            newItem.GridY = FirstCollison.GridY + FirstCollison.h
            return newItem
        }
        newItem.GridY--

        if (newItem.GridY < 0) return { ...newItem, GridY: 0 }/**碰到边界的时候，返回 */
    }

}

/**
 * 压缩layout，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} layout 
 */
export const compactLayout = function () {
    var _cache: any = {
    };

    return function (layout: DragactLayoutItem[], movingItem: GridItemEvent | undefined, mapedLayout: mapLayout | undefined) {
        if (movingItem) {
            if (_cache.GridX === movingItem.GridX
                && _cache.GridY === movingItem.GridY &&
                _cache.w === movingItem.w &&
                _cache.h === movingItem.h &&
                _cache.UniqueKey === movingItem.UniqueKey
            ) {
                return {
                    compacted: layout,
                    mapLayout: mapedLayout
                };
            }
            _cache = movingItem;
        }
        let sorted = sortLayout(layout)//把静态的放在前面
        const needCompact = Array(layout.length)
        const compareList = []
        const mapLayout: mapLayout = {};
        
        
        for (let i = 0, length = sorted.length; i < length; i++) {
            let finished = compactItem(compareList, sorted[i])
            if (movingItem) {
                if (movingItem.UniqueKey === finished.key) {
                    movingItem.GridX = finished.GridX;
                    movingItem.GridY = finished.GridY;
                    finished.isUserMove = true
                } else
                    finished.isUserMove = false
            }
            else
                finished.isUserMove = false
            compareList.push(finished)
            needCompact[i] = finished
            mapLayout[finished.key + ''] = finished;
        }
        
        return {
            compacted: needCompact,
            mapLayout
        }
    }

}()