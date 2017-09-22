import React from 'react'
import PropTypes from 'prop-types'
import GridItem from './GridItem'

import './style.css'


const layoutItemForkey = (layout, key) => {
    for (let i = 0, length = layout.length; i < length; i++) {
        if (key === layout[i].key) {
            return layout[i]
        }
    }
}

const MapLayoutTostate = (layout, children) => {
    return layout.map((child, index) => {
        let newChild = { ...child, isUserMove: true, key: children[index].key }
        return newChild
    })
}

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

const compactItem = (finishedLayout, item) => {
    const newItem = { ...item }
    
    if (finishedLayout.length === 0) {
        
        return { ...newItem, GridY: 0 }
    }
    /**
     * 类似一个递归调用
     * 
     */
    while (true) {
        
        let FirstCollison = getFirstCollison(finishedLayout, newItem)
        
        if (FirstCollison) {
            newItem.GridY = FirstCollison.GridY + FirstCollison.h
            return newItem
        }
        newItem.GridY--
        
        if (newItem.GridY < 0) {
            
            return { ...newItem, GridY: 0 }
        }
    }
    return newItem
}

const compactLayout = (layout) => {
    let sorted = sortLayout(layout)
    const needCompact = Array(layout.length)
    const compareList = []
    for (let i = 0, length = sorted.length; i < length; i++) {
        let finished = compactItem(compareList, sorted[i])
        finished.isUserMove = false
        compareList.push(finished)
        needCompact[layout.indexOf(sorted[i])] = finished
    }

    return needCompact
}

const layoutCheck = (layout, layoutItem, key, fristItemkey, moving) => {
    let i = [], movedItem = []
    let newlayout = layout.map((item, idx) => {
        if (item.key !== key) {
            if (collision(item, layoutItem)) {
                i.push(item.key)
                let offsetY = layoutItem.GridY
                if (layoutItem.GridY > item.GridY && layoutItem.GridY < item.GridY + item.h) {
                    /**
                     * 元素向上移动时，元素的上面空间不足,则不移动这个元素
                     * 当元素移动到GridY>所要向上交换的元素时，就不会进入这里，直接交换元素
                     * 
                     */
                    offsetY = item.GridY
                }
                if (moving > 0) {
                    /**
                     * 这个地方的实现有点奇妙了，moving用于检查最开始移动的方块
                     * layoutItem.GridY > item.h*(3/4) 这个做会让方块移动比较准确和精确
                     * 如果是其他数字，很可能会出现不可预计的效果
                     * 建议取值范围在1/2 ~ 3/4之间
                     */

                    if (layoutItem.GridY < item.GridY) {
                        let collision;
                        let copy = { ...item }
                        while (true) {
                            let newLayout = layout.filter((item) => {
                                if (item.key !== key && (item.key !== copy.key) ) {
                                    return item
                                }
                            })
                            collision = getFirstCollison(newLayout, copy)
                            if (collision) {
                                offsetY = collision.GridY + collision.h
                                // console.log('移动到', offsetY, '操纵的物体底部', copy.key, '碰撞顶部', copy.GridY,'key',collision.key)
                                break
                            } else {
                                copy.GridY--
                            }
                            if(copy.GridY < 0){
                                // console.log('移动到', offsetY, '操纵的物体底部', copy.key, '碰撞顶部', copy.GridY,)
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
            return { ...item, GridX: layoutItem.GridX, GridY: layoutItem.GridY, isUserMove: true }
        }
        return item
    })
    /** 递归调用,将layout中的所有重叠元素全部移动 */
    if (i.length > 0 && movedItem.length > 0) {
        for (let c = 0; c < Math.min(movedItem.length, i.length); c++) {
            newlayout = layoutCheck(newlayout, movedItem[c], i[c], fristItemkey, undefined)
        }
    }
    return newlayout
}


class DraggerLayout extends React.Component {
    constructor(props) {
        super(props)
        this.onDrag = this.onDrag.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
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

    state = {
        GridXMoving: 0,
        GridYMoving: 0,
        wMoving: 0,
        hMoving: 0,
        placeholderShow: false,
        placeholderMoving: false,
        layout: MapLayoutTostate(this.props.layout, this.props.children)
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
        // const compactedLayout = compactLayout(newLayout)
        // for (let i = 0; i < compactedLayout.length; i++) {
        //     if (key === compactedLayout[i].key) {
        //         /**
        //          * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
        //          * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
        //          * 但是实际layout中的位置还是会改变
        //          * (isUserMove=true用于接触placeholder和元素的绑定)
        //          */
        //         compactedLayout[i].isUserMove = true
        //         layoutItem.GridX = compactedLayout[i].GridX
        //         layoutItem.GridY = compactedLayout[i].GridY
        //         break
        //     }
        // }

        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: newLayout
        })
    }

    onDragEnd(key) {
        const compactedLayout = compactLayout(this.state.layout)
        this.setState({
            placeholderShow: false,
            layout: compactedLayout
        })
    }
    placeholder() {
        if (!this.state.placeholderShow) return null
        const { col, width, padding, rowHeight } = this.props
        const { GridXMoving, GridYMoving, wMoving, hMoving, placeholderMoving } = this.state

        return (
            <GridItem
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
        let that = this
        setTimeout(function () {
            that.setState({
                layout: compactLayout(that.state.layout)
            })
        }, 1);

    }

    getGridItem(child, index) {
        const { layout } = this.state
        const { col, width, padding, rowHeight } = this.props
        const renderItem = layoutItemForkey(layout, child.key)

        return (
            <GridItem
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
                style={{ position: 'absolute', left: 100, width: this.props.width, height: 500, border: '1px solid black' }}
            >
                {React.Children.map(this.props.children,
                    (child, index) => this.getGridItem(child, index)
                )}
                {this.placeholder()}
            </div>
        )
    }
}

export const LayoutDemo = () => {
    const layout = [{
        GridX: 3, GridY: 2, w: 4, h: 4
    }, {
        GridX: 0, GridY: 2, w: 1, h: 3
    }, {
        GridX: 3, GridY: 6, w: 2, h: 1
    }, {
        GridX: 3, GridY: 8, w: 1, h: 4
    }, {
        GridX: 3, GridY: 8, w: 3, h: 4
    }, {
        GridX: 3, GridY: 8, w: 6, h: 2
    }, {
        GridX: 3, GridY: 8, w: 2, h: 1
    }, {
        GridX: 3, GridY: 8, w: 7, h: 4
    }]
    return (
        <DraggerLayout layout={layout} width={1000}>
            <p key='a'>a</p>
            <p key='b'>b</p>
            <p key='c'>c</p>
            <p key='d'>d</p>
            <p key='e'>e</p>
            <p key='f'>f</p>
            <p key='g'>g</p>
            <p key='h'>h</p>
        </DraggerLayout>
    )
}