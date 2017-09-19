import React from 'react'
import PropTypes from 'prop-types'
import GridItem from './GridItem'

import './style.css'


const MapLayoutTostate = (layout) => {
    console.log('进来了', layout)
    return layout
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
        const { GridX, GridY, w, h } = bundles
        console.log(bundles)
        this.setState({
            GridXMoving: GridX,
            GridYMoving: GridY,
            wMoving: w,
            hMoving: h,
            placeholderShow: true,
            placeholderMoving: true
        })
    }

    onDrag(cor) {
        this.setState({
            GridXMoving: cor.GridX,
            GridYMoving: cor.GridY,
        })
    }

    onDragEnd() {
        console.log(this.state)
        this.setState({
            placeholderShow: false
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
                style={{ background: '#a31' }}
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
        GridX: 3, GridY: 4, w: 3, h: 2
    }, {
        GridX: 1, GridY: 3, w: 3, h: 3
    }, {
        GridX: 2, GridY: 5, w: 3, h: 3
    }]
    return (
        <DraggerLayout layout={layout}>
            <p>absolute</p>
            <p>black</p>
            <p>children</p>
        </DraggerLayout>
    )
}