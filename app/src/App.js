import React from 'react'
import PropTypes from 'prop-types'
import GridItem from './GridItem'

import './style.css'


const MapLayoutTostate = (layout) => {
    return layout.map((child) => {
        let newChild = { ...child, isUserMove: true }
        return newChild
    })
}

const syncLayout = (layout, childIndex, { GridX, GridY }, isUserMove) => {
    let newlayout = Object.assign([], layout)
    for (let i = 0, length = newlayout.length; i < length; i++) {
        if (i === childIndex) {
            newlayout[i].GridX = GridX
            newlayout[i].GridY = GridY
            newlayout[i].isUserMove = isUserMove
        }
    }
    return newlayout
}

const collision = (a, b) => {
    if (a.GridX === b.GridX && a.GridY === b.GridY &&
        a.w === b.w && a.h === b.h) {
            return false
    }

    if (a.GridX + a.w <= b.GridX) return false
    if (a.GridX >= b.GridX + b.w) return false
    if (a.GridY + a.h <= b.GridY) return false
    if (a.GridY >= b.GridY + b.h) return false

    return true
}

const layoutCheck = (layout, layoutItem, index, movingY) => {
    let i, movedItem
    let newlayout = layout.map((item, idx) => {
        if (idx !== index) {
            if (collision(item, layoutItem)) {
                i = idx
                let offsetY = layoutItem.GridY + layoutItem.h
                // if (movingY > 0) offsetY = layoutItem.GridY + layoutItem.h
                // if (movingY < 0) offsetY = layoutItem.GridY
                movedItem = { ...item, GridY: offsetY, isUserMove: false }
                return movedItem
            }
        }
        return item
    })
    /** 递归调用,将layout中的所有重叠元素全部移动 */
    if (typeof i === 'number' && typeof movedItem === 'object') {
        newlayout = layoutCheck(newlayout, movedItem, i, 0)
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
        layout: MapLayoutTostate(this.props.layout)
    }

    onDragStart(bundles) {
        const { GridX, GridY, w, h, index } = bundles
        const newlayout = syncLayout(this.state.layout, index, {
            GridX: GridX,
            GridY: GridY
        }, true)

        console.log('placeholder', GridX, GridY)
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

    onDrag(layoutItem, index) {

        const subTmp = this.state.GridYMoving - layoutItem.GridY

        const newLayout = layoutCheck(this.state.layout, layoutItem, index, subTmp)
        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: newLayout
        })


    }

    onDragEnd(childIndex) {
        let Newlayout = syncLayout(this.state.layout, childIndex, {
            GridX: this.state.GridXMoving,
            GridY: this.state.GridYMoving
        }, false)
        this.setState({
            placeholderShow: false,
            layout: Newlayout
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

    }

    getGridItem(child, index) {
        const { layout } = this.state
        const { col, width, padding, rowHeight } = this.props
        return (
            <GridItem
                col={col}
                containerWidth={width}
                containerPadding={padding}
                rowHeight={rowHeight}
                GridX={layout[index].GridX}
                GridY={layout[index].GridY}
                w={layout[index].w}
                h={layout[index].h}
                onDrag={this.onDrag}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                index={index}
                isUserMove={layout[index].isUserMove}
                style={{ background: '#329' }}
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
        GridX: 3, GridY: 2, w: 2, h: 2
    }, {
        GridX: 0, GridY: 1, w: 2, h: 2
    }, {
        GridX: 3, GridY: 6, w: 2, h: 2
    }, {
        GridX: 3, GridY: 8, w: 2, h: 2
    }]
    return (
        <DraggerLayout layout={layout} width={500}>
            <p key='a'>absolute</p>
            <p key='b'>black</p>
            <p key='c'>children</p>
            <p key='d'>fuck</p>
        </DraggerLayout>
    )
}