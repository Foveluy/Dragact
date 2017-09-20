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
        layout: MapLayoutTostate(this.props.layout),
        transitionStyle: ''
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
            transitionStyle:''
        })
    }

    onDrag(cor) {

        this.setState({
            GridXMoving: cor.GridX,
            GridYMoving: cor.GridY,
        })
    }

    onDragEnd(childIndex) {
        let Newlayout = syncLayout(this.state.layout, childIndex, {
            GridX: this.state.GridXMoving,
            GridY: this.state.GridYMoving
        }, false)
        this.setState({
            placeholderShow: false,
            layout: Newlayout,
            transitionStyle:'.WrapDragger{-webkit-transition: all .3s;transition: all .3s;}'
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
                style={{ background: '#a31', zIndex: -1,transition:' all .15s' }}
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
                style={{ background: '#329'}}
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
                style={{ position: 'absolute', left: 100, width: 500, height: 500, border: '1px solid black' }}
            >
                <style dangerouslySetInnerHTML={{ __html: this.state.transitionStyle }}></style>
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
        GridX: 3, GridY: 4, w: 1, h: 3
    }, {
        GridX: 3, GridY: 5, w: 1, h: 3
    }, {
        GridX: 4, GridY: 5, w: 1, h: 3
    }, {
        GridX: 4, GridY: 5, w: 1, h: 3
    }]
    return (
        <DraggerLayout layout={layout}>
            <p key='a'>absolute</p>
            <p key='b'>black</p>
            <p key='c'>children</p>
            <p key='d'>children</p>
        </DraggerLayout>
    )
}