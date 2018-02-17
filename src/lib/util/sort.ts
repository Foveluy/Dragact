import { DragactLayoutItem } from "../dragact";

export function quickSort(a: number[]): any {
    return a.length <= 1 ? a : quickSort(a.slice(1).filter(item => item <= a[0])).concat(a[0], quickSort(a.slice(1).filter(item => item > a[0])));
}

export const sortLayout = (layout: any) => {
    return [].concat(layout).sort((a: any, b: any) => {
        if (a.GridY > b.GridY || (a.GridY === b.GridY && a.GridX > b.GridX)) {
            if (a.static) return 0//为了静态，排序的时候尽量把静态的放在前面
            return 1
        } else if (a.GridY === b.GridY && a.GridX === b.GridX) {
            return 0
        }
        return -1
    })
}

export const getMaxContainerHeight = (layout: DragactLayoutItem[], elementHeight = 30, elementMarginBottom = 10) => {
    const ar = layout.map((item) => {
        return item.GridY + item.h
    })
    const h = quickSort(ar)[ar.length - 1];
    const height = h * (elementHeight + elementMarginBottom) + elementMarginBottom
    return height
}

