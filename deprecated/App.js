import React from 'react'
import PropTypes from 'prop-types'
import GridItem, { checkInContainer } from './GridItem'
import { compactLayout, compactItem } from './util/compact';
import { quickSort, getMaxContainerHeight } from './util/sort';
import { layoutCheck } from './util/collison';
import { correctLayout } from './util/correction';
import { getDataSet, stringJoin } from './utils';
import { layoutItemForkey, syncLayout } from './util/initiate';

import './style.css';


export class DraggerLayout extends React.Component {
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

    static propTypes = {
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
        this.props.onDragStart && this.props.onDragStart({ GridX, GridY })
    }

    onDrag(layoutItem, key) {

        const { GridX, GridY } = layoutItem
        const moving = GridY - this.state.GridYMoving

        const newLayout = layoutCheck(this.state.layout, layoutItem, key, key/*用户移动方块的key */, moving)
        const compactedLayout = compactLayout(newLayout)
        for (let i = 0; i < compactedLayout.length; i++) {
            const compactedItem = compactedLayout[i];
            if (key === compactedItem.key) {
                /**
                 * 特殊点：当我们移动元素的时候，元素在layout中的位置不断改变
                 * 但是当isUserMove=true的时候，鼠标拖拽的元素不会随着位图变化而变化
                 * 但是实际layout中的位置还是会改变
                 * (isUserMove=true用于解除placeholder和元素的绑定)
                 */
                compactedItem.isUserMove = true
                layoutItem.GridX = compactedItem.GridX
                layoutItem.GridY = compactedItem.GridY
                break
            }
        }
        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        })
        this.props.onDrag && this.props.onDrag({ GridX, GridY });
    }

    onDragEnd(key) {
        const compactedLayout = compactLayout(this.state.layout)
        this.setState({
            placeholderShow: false,
            layout: compactedLayout,
            containerHeight: getMaxContainerHeight(compactedLayout, this.props.rowHeight, this.props.margin[1])
        })

        this.props.onDragEnd && this.props.onDragEnd();
    }
    renderPlaceholder() {
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
                style={{ background: '#d6e4ff', zIndex: 1, transition: ' all .15s' }}
                isUserMove={!placeholderMoving}
            >
            </GridItem >
        )
    }
    componentDidMount() {
        setTimeout(() => {
            let layout = correctLayout(this.state.layout, this.props.col)
            const compacted = compactLayout(layout);
            this.setState({
                layout: compacted,
                containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1])
            })
        }, 1);
    }

    getGridItem(child, index) {
        const { layout } = this.state
        const { col, width, padding, rowHeight, margin } = this.props;
        const renderItem = layoutItemForkey(layout, child.key);//TODO:可以优化速度，这一步不是必须;
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
                UniqueKey={child.key}
                style={{ zIndex: 2 }}
                static={renderItem.static}
            >
                {child}
            </GridItem >
        )
    }

    render() {
        const { layout, col, width, padding, rowHeight, className } = this.props;
        const { containerHeight } = this.state;

        return (
            <div
                className={stringJoin('DraggerLayout', className)}
                style={{ left: 100, width: width, height: containerHeight, zIndex: 1 }}
            >
                {React.Children.map(this.props.children,
                    (child, index) => this.getGridItem(child, index)
                )}
                {this.renderPlaceholder()}
            </div>
        )
    }
}
