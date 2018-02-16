export const int = (number: string | null) => {
    if (number === '' || number === null) {
        return 0
    }
    return parseInt(number, 10)
}
export const innerWidth = (node: HTMLElement) => {
    let width = node.clientWidth;
    const computedStyle = node.style;

    width -= int(computedStyle.paddingLeft);
    width -= int(computedStyle.paddingRight);
    return width;
}

export const outerWidth = (node: HTMLElement) => {
    let width = node.clientWidth;
    const computedStyle = node.style
    width += int(computedStyle.borderLeftWidth);
    width += int(computedStyle.borderRightWidth);
    return width;
}

export const innerHeight = (node: HTMLElement) => {
    let height = node.clientHeight;
    const computedStyle = node.style
    height -= int(computedStyle.paddingTop);
    height -= int(computedStyle.paddingBottom);
    return height;
}

export const outerHeight = (node: HTMLElement) => {
    let height = node.clientHeight;
    const computedStyle = node.style
    height += int(computedStyle.borderTopWidth);
    height += int(computedStyle.borderBottomWidth);
    return height;
}

export interface Bound {
    left: number,
    top: number,
    right: number,
    bottom: number
}
export const parseBounds = (bounds: Bound) => {
    return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
    }
}

export const isNumber = (things: any) => {
    return typeof things === 'number' ? true : false
}

export const getDataSet = (children: any[]) => {
    return children.map((child) => {
        return { ...child.props['data-set'], isUserMove: true, key: child.key, }
    })
}

export const stringJoin = (source: string, join: string) => {
    return source + (join ? ` ${join}` : '')
}
