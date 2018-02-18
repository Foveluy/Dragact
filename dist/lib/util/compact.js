import { sortLayout } from "./sort";
import { getFirstCollison } from "./collison";
/**
 * 压缩单个元素，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} finishedLayout 压缩完的元素会放进这里来，用来对比之后的每一个元素是否需要压缩
 * @param {*} item
 */
export const compactItem = (finishedLayout, item) => {
    if (item.static)
        return item;
    const newItem = Object.assign({}, item);
    if (finishedLayout.length === 0) {
        return Object.assign({}, newItem, { GridY: 0 });
    }
    /**
     * 类似一个递归调用
     */
    while (true) {
        let FirstCollison = getFirstCollison(finishedLayout, newItem);
        if (FirstCollison) {
            /**第一次发生碰撞时，就可以返回了 */
            newItem.GridY = FirstCollison.GridY + FirstCollison.h;
            return newItem;
        }
        newItem.GridY--;
        if (newItem.GridY < 0)
            return Object.assign({}, newItem, { GridY: 0 }); /**碰到边界的时候，返回 */
    }
};
/**
 * 压缩layout，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} layout
 */
export const compactLayout = (layout) => {
    let sorted = sortLayout(layout);
    const needCompact = Array(layout.length);
    const compareList = [];
    for (let i = 0, length = sorted.length; i < length; i++) {
        let finished = compactItem(compareList, sorted[i]);
        finished.isUserMove = false;
        compareList.push(finished);
        needCompact[i] = finished;
    }
    return needCompact;
};
