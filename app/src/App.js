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
            // return {
            //     ...item,
            //     GridX: GridX,
            //     GridY: GridY,
            //     isUserMove: isUserMove
            // }
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
        // console.log('排序中：', a, b)
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
    let newItem = { ...item }
    if (finishedLayout.length === 0) {
        return { ...newItem, GridY: 0 }
    }

    while (true) {
        let FirstCollison = getFirstCollison(finishedLayout, newItem)
        if (FirstCollison) {
            newItem.GridY = FirstCollison.GridY + FirstCollison.h
            return newItem
        }else{
            if (newItem.GridY <= 0) return {...newItem,GridY:0}
        }
        newItem.GridY--
    }
    return newItem
}

const compactLayout = (layout) => {
    // console.log('排序前', layout)
    let sorted = sortLayout(layout)
    // console.log('排序后', sorted)
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

const layoutCheck = (layout, layoutItem, key, fristItemkey) => {
    let i, movedItem
    let newlayout = layout.map((item, idx) => {
        if (item.key !== key) {
            if (collision(item, layoutItem)) {
                i = item.key
                let offsetY = layoutItem.GridY + layoutItem.h
                movedItem = { ...item, GridY: offsetY, isUserMove: false }
                return movedItem
            }
        } else if (fristItemkey === key) {
            return { ...item, GridX: layoutItem.GridX, GridY: layoutItem.GridY, isUserMove: true }
        }
        return item
    })
    /** 递归调用,将layout中的所有重叠元素全部移动 */
    if (typeof i === 'string' && typeof movedItem === 'object') {
        newlayout = layoutCheck(newlayout, movedItem, i, fristItemkey)
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
        const newLayout = layoutCheck(this.state.layout, layoutItem, key, key/*用户移动方块的key */)
        // const compactedLayout = compactLayout(newLayout)
        // const sy = syncLayout(compactedLayout, key, layoutItem.GridX, layoutItem.GridY, true)

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
        setTimeout(function() {
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
    }]
    return (
        <DraggerLayout layout={layout} width={500}>
            <p key='a'>a</p>
            <p key='b'>b</p>
            <p key='c'>c</p>
            <p key='d'>d</p>
        </DraggerLayout>
    )
}