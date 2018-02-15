import React from 'react'
import PropTypes from 'prop-types'
import GridItem from './GridItem'

import './style.css'

const correctLayout = (layout) => {
    var copy = [...layout];
    for (let i = 0; i < layout.length - 1; i++) {
        if (collision(copy[i], copy[i + 1])) {
            copy = layoutCheck(copy, layout[i], layout[i].key, layout[i].key, undefined)
        }
    }
    return copy;
}

/**
 * 用key从layout中拿出item
 * @param {*} layout 输入进来的布局
 * @param {*} key 
 */
const layoutItemForkey = (layout, key) => {
    for (let i = 0, length = layout.length; i < length; i++) {
        if (key === layout[i].key) {
            return layout[i]
        }
    }
}

/**
 * 初始化的时候调用
 * 会把isUserMove和key一起映射到layout中
 * 不用用户设置
 * @param {*} layout 
 * @param {*} children 
 */

const MapLayoutTostate = (layout, children) => {
    return layout.map((child, index) => {
        let newChild = { ...child, isUserMove: true, key: children[index].key }
        return newChild
    })
}

/**
 * 把用户移动的块，标记为true
 * @param {*} layout 
 * @param {*} key 
 * @param {*} GridX 
 * @param {*} GridY 
 * @param {*} isUserMove 
 */
const syncLayout = (layout, key, GridX, GridY, isUserMove) => {
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

const collision = (a, b) => {
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

const sortLayout = (layout) => {
    return [].concat(layout).sort((a, b) => {
        if (a.GridY > b.GridY || (a.GridY === b.GridY && a.GridX > b.GridX)) {
            return 1
        } else if (a.GridY === b.GridY && a.GridX === b.GridX) {
            return 0
        }
        return -1
    })
}

/**获取layout中，item第一个碰撞到的物体 */
const getFirstCollison = (layout, item) => {
    for (let i = 0, length = layout.length; i < length; i++) {
        if (collision(layout[i], item)) {
            return layout[i]
        }
    }
    return null
}


/**
 * 压缩单个元素，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} finishedLayout 压缩完的元素会放进这里来，用来对比之后的每一个元素是否需要压缩
 * @param {*} item 
 */
const compactItem = (finishedLayout, item) => {
    const newItem = { ...item }

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
    return newItem
}

/**
 * 压缩layout，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {*} layout 
 */
const compactLayout = (layout) => {
    let sorted = sortLayout(layout)


    const needCompact = Array(layout.length)
    const compareList = []
    for (let i = 0, length = sorted.length; i < length; i++) {
        let finished = compactItem(compareList, sorted[i])
        finished.isUserMove = false
        compareList.push(finished)
        needCompact[i] = finished//用于输出从小到大的位置
    }
    return needCompact
}

const layoutCheck = (layout, layoutItem, key, fristItemkey, moving) => {
    let i = [], movedItem = []/**收集所有移动过的物体 */
    let newlayout = layout.map((item, idx) => {
        if (item.key !== key) {
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
                     * 
                     */
                    offsetY = item.GridY
                }
                /**
                 * 物体向下移动的时候
                 */
                if (moving > 0) {
                    if (layoutItem.GridY + layoutItem.h < item.GridY) {
                        let collision;
                        let copy = { ...item }
                        while (true) {
                            let newLayout = layout.filter((item) => {
                                if (item.key !== key && (item.key !== copy.key)) {
                                    return item
                                }
                            })
                            collision = getFirstCollison(newLayout, copy)
                            if (collision) {
                                offsetY = collision.GridY + collision.h
                                break
                            } else {
                                copy.GridY--
                            }
                            if (copy.GridY < 0) {
                                offsetY = 0
                                break
                            }
                        }
                    }
                }
                movedItem.push({ ...item, GridY: offsetY, isUserMove: false })
                return { ...item, GridY: offsetY, isUserMove: false }
            }
        } else if (fristItemkey === key) {
            /**永远保持用户移动的块是 isUserMove === true */
            return { ...item, GridX: layoutItem.GridX, GridY: layoutItem.GridY, isUserMove: true }
        }
        return item
    })
    /** 递归调用,将layout中的所有重叠元素全部移动 */
    const length = movedItem.length;
    for (let c = 0; c < length; c++) {
        newlayout = layoutCheck(newlayout, movedItem[c], i[c], fristItemkey, undefined)
    }
    return newlayout
}

function quickSort(a) {
    return a.length <= 1 ? a : quickSort(a.slice(1).filter(item => item <= a[0])).concat(a[0], quickSort(a.slice(1).filter(item => item > a[0])));
}

const getMaxContainerHeight = (layout, elementHeight = 30, elementMarginBottom = 10) => {
    const ar = layout.map((item) => {
        return item.GridY + item.h
    })
    const h = quickSort(ar)[ar.length - 1];
    const height = h * (elementHeight + elementMarginBottom) + elementMarginBottom
    return height
}

const getDataSet = (children) => {
    return children.map((child) => {
        return { ...child.props['data-set'], isUserMove: true, key: child.key }
    })
}


class DraggerLayout extends React.Component {
    constructor(props) {
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
            containerHeight: 500
        }
    }

    static PropTypes = {
        /**外部属性 */
        layout: PropTypes.array,
        col: PropTypes.number,
        width: PropTypes.number,
        /**每个元素的最小高度 */
        rowHeight: PropTypes.number,
        padding: PropTypes.number,
    }




    onDragStart(bundles) {
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
        })
    }

    onDrag(layoutItem, key) {

        const { GridX, GridY } = layoutItem
        const moving = GridY - this.state.GridYMoving

        const newLayout = layoutCheck(this.state.layout, layoutItem, key, key/*用户移动方块的key */, moving)
        const compactedLayout = compactLayout(newLayout)
        for (let i = 0; i < compactedLayout.length; i++) {
            if (key === compactedLayout[i].key) {
                /**
                 * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
                 * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
                 * 但是实际layout中的位置还是会改变
                 * (isUserMove=true用于解除placeholder和元素的绑定)
                 */
                compactedLayout[i].isUserMove = true
                layoutItem.GridX = compactedLayout[i].GridX
                layoutItem.GridY = compactedLayout[i].GridY
                break
            }
        }

        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        })
    }

    onDragEnd(key) {
        const compactedLayout = compactLayout(this.state.layout)
        this.setState({
            placeholderShow: false,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        })
    }
    placeholder() {
        if (!this.state.placeholderShow) return null
        const { col, width, padding, rowHeight, margin } = this.props
        const { GridXMoving, GridYMoving, wMoving, hMoving, placeholderMoving } = this.state

        return (
            <GridItem
                margin={margin}
                col={col}
                containerWidth={width}
                containerPadding={padding}
                rowHeight={rowHeight}
                GridX={GridXMoving}
                GridY={GridYMoving}
                w={wMoving}
                h={hMoving}
                style={{ background: '#a31', zIndex: -1, transition: ' all .15s' }}
                isUserMove={!placeholderMoving}
            >
            </GridItem >
        )
    }
    componentDidMount() {
        setTimeout(() => {
            let layout = correctLayout(this.state.layout)
            const compacted = compactLayout(layout);
            this.setState({
                layout: compacted,
                containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
            })
        }, 1);
    }

    getGridItem(child, index) {
        const { layout } = this.state
        const { col, width, padding, rowHeight, margin } = this.props
        const renderItem = layoutItemForkey(layout, child.key)
        return (
            <GridItem
                margin={margin}
                col={col}
                containerWidth={width}
                containerPadding={padding}
                rowHeight={rowHeight}
                GridX={renderItem.GridX}
                GridY={renderItem.GridY}
                w={renderItem.w}
                h={renderItem.h}
                onDrag={this.onDrag}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                index={index}
                isUserMove={renderItem.isUserMove}
                style={{ background: '#329' }}
                UniqueKey={child.key}
            >
                {child}
            </GridItem >
        )
    }

    render() {
        const { layout, col, width, padding, rowHeight } = this.props

        return (
            <div
                className='DraggerLayout'
                style={{ left: 100, width: this.props.width, height: this.state.containerHeight, border: '1px solid black' }}
            >
                {React.Children.map(this.props.children,
                    (child, index) => this.getGridItem(child, index)
                )}
                {this.placeholder()}
            </div>
        )
    }
}

export default class LayoutDemo extends React.Component {

    render() {
        return (
            <DraggerLayout width={800} col={12} rowHeight={800 / 12} margin={[5, 5]}>
                {['我', '叫', '做', '方', '正'].map((el, index) => {
                    return (<div key={index} data-set={{ GridX: index * 2, GridY: index, w: 2, h: 2 }}>{el}</div>)
                })}
            </DraggerLayout>
        )
    }

}