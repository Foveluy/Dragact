import * as React from "react";
import GridItem, { GridItemEvent } from './GridItem'
import { compactLayout } from './util/compact';
import { getMaxContainerHeight } from './util/sort';
import { layoutCheck } from './util/collison';
import { correctLayout } from './util/correction';
import { stringJoin } from './utils';
import { layoutItemForkey, syncLayout } from './util/initiate';
import { DragactProps, DragactState, DragactLayoutItem } from "./dragact-type";

import './style.css';

const wins = window;

export class Dragact extends React.Component<DragactProps, DragactState> {

    constructor(props: DragactProps) {
        super(props)
        this.onDrag = this.onDrag.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)

        const layout = props.layout;
        this.state = {
            GridXMoving: 0,
            GridYMoving: 0,
            wMoving: 0,
            hMoving: 0,
            placeholderShow: false,
            placeholderMoving: false,
            layout: layout,
            containerHeight: 500,
            dragType: 'drag',
            mapLayout: undefined,
            responsiveState: {
                width: props.width,
                originWidth: props.width,
                lastWindowWidth: wins.innerWidth
            }
        }
    }

    onResizeStart = (layoutItem: GridItemEvent) => {
        const { GridX, GridY, w, h } = layoutItem
        if (this.state.mapLayout) {
            const newlayout = syncLayout(this.state.mapLayout, layoutItem)
            this.setState({
                GridXMoving: GridX,
                GridYMoving: GridY,
                wMoving: w,
                hMoving: h,
                placeholderShow: true,
                placeholderMoving: true,
                mapLayout: newlayout,
                dragType: 'resize'
            })
        }
        this.props.onDragStart && this.props.onDragStart(layoutItem);
    }

    onResizing = (layoutItem: GridItemEvent) => {

        const newLayout = layoutCheck(this.state.layout, layoutItem, layoutItem.UniqueKey + '', layoutItem.UniqueKey + '', 0);

        const { compacted, mapLayout } = compactLayout(newLayout, layoutItem, this.state.mapLayout)

        this.setState({
            layout: compacted,
            wMoving: layoutItem.w,
            hMoving: layoutItem.h,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight)
        })
    }

    onResizeEnd = (layoutItem: GridItemEvent) => {
        const { compacted, mapLayout } = compactLayout(this.state.layout, undefined, this.state.mapLayout)
        this.setState({
            placeholderShow: false,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight)
        })
        this.props.onDragEnd && this.props.onDragEnd(layoutItem);
    }

    onDragStart(bundles: GridItemEvent) {
        const { GridX, GridY, w, h } = bundles
        if (this.state.mapLayout) {
            this.setState({
                GridXMoving: GridX,
                GridYMoving: GridY,
                wMoving: w,
                hMoving: h,
                placeholderShow: true,
                placeholderMoving: true,
                mapLayout: syncLayout(this.state.mapLayout, bundles),
                dragType: 'drag'
            })
        }
        this.props.onDragStart && this.props.onDragStart(bundles);
    }

    onDrag(layoutItem: GridItemEvent) {
        const { GridY, UniqueKey } = layoutItem;
        const moving = GridY - this.state.GridYMoving;

        const newLayout = layoutCheck(this.state.layout, layoutItem, UniqueKey + '', UniqueKey + ''/*用户移动方块的key */, moving);
        const { compacted, mapLayout } = compactLayout(newLayout, layoutItem, this.state.mapLayout);
        this.setState({
            GridXMoving: layoutItem.GridX,
            GridYMoving: layoutItem.GridY,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight)
        })
        this.props.onDrag && this.props.onDrag(layoutItem);
    }

    onDragEnd(layoutItem: GridItemEvent) {
        const { compacted, mapLayout } = compactLayout(this.state.layout, undefined, this.state.mapLayout)
        this.setState({
            placeholderShow: false,
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight)
        })
        this.props.onDragEnd && this.props.onDragEnd(layoutItem);
    }

    renderPlaceholder() {
        if (!this.state.placeholderShow) return null
        var { col, padding, rowHeight, margin, placeholder } = this.props
        const { GridXMoving, GridYMoving, wMoving, hMoving, placeholderMoving, dragType, responsiveState } = this.state

        if (!placeholder) return null;
        if (!padding) padding = 0;
        return (
            <GridItem
                margin={margin}
                col={col}
                containerWidth={responsiveState.width}
                containerPadding={[padding, padding]}
                rowHeight={rowHeight}
                GridX={GridXMoving}
                GridY={GridYMoving}
                w={wMoving}
                h={hMoving}
                style={{ background: 'rgba(15,15,15,0.3)', zIndex: dragType === 'drag' ? 1 : 10, transition: ' all .15s ease-out' }}
                isUserMove={!placeholderMoving}
                dragType={dragType}
                canDrag={false}
                canResize={false}
            >
                {(p: any, resizerProps: any) => <div {...p} />}
            </GridItem>
        )
    }

    componentWillReceiveProps(nextProps: any) {
        if (this.props.layout.length > nextProps.layout.length) { //remove
            const mapLayoutCopy = { ...this.state.mapLayout };
            nextProps.layout.forEach((child: any) => {
                if ((mapLayoutCopy as any)[child.key + ''] !== void 666) delete (mapLayoutCopy as any)[child.key + ''];
            })

            for (const key in mapLayoutCopy) {
                const newLayout = this.state.layout.filter((child) => {
                    if (child.key + '' !== key + '') return child
                })

                const { compacted, mapLayout } = compactLayout(newLayout, undefined, this.state.mapLayout);
                this.setState({
                    containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight),
                    layout: compacted,
                    mapLayout
                })
            }
        } else if (this.props.layout.length < nextProps.layout.length) {//add
            var item;
            for (const idx in nextProps.layout) {
                const i = nextProps.layout[idx];
                if (this.state.mapLayout && !this.state.mapLayout[i.key + '']) {
                    item = i;
                    break;
                }
            }
            if (item !== void 666) {
                const dataSet = { ...item, isUserMove: false, key: item.key + '' };
                var newLayout = [...this.state.layout, dataSet]
                const { compacted, mapLayout } = compactLayout(newLayout, undefined, this.state.mapLayout);
                this.setState({
                    containerHeight: getMaxContainerHeight(compacted,
                        this.props.rowHeight,
                        this.props.margin[1],
                        this.state.containerHeight,
                        false),
                    layout: compacted,
                    mapLayout
                })
            }
        } else {
            this.recalculateLayout(nextProps.layout, nextProps.col);
        }
    }

    recalculateLayout = (layout: DragactLayoutItem[], col: number) => {
        const corrected = correctLayout(layout, col)
        const { compacted, mapLayout } = compactLayout(corrected, undefined, undefined);
        this.setState({
            layout: compacted,
            mapLayout: mapLayout,
            containerHeight: getMaxContainerHeight(compacted, this.props.rowHeight, this.props.margin[1], this.state.containerHeight, false)
        })
    }

    componentDidMount() {
        setTimeout(() => {
            this.recalculateLayout(this.state.layout, this.props.col)
        }, 1);

        if (this.props.responsive === void 666 || this.props.responsive === true) {
            wins.addEventListener('resize', this.onWindowResize)
        }
    }

    componentWillUnmount() {
        if (this.props.responsive === void 666 || this.props.responsive === true) {
            wins.removeEventListener('resize', this.onWindowResize);
        }
    }

    onWindowResize = (event: UIEvent) => {
        console.log(window.innerWidth);
        const { originWidth, lastWindowWidth } = this.state.responsiveState;
        const windowProportion = wins.innerWidth / lastWindowWidth;

        this.props.onWindowResize && this.props.onWindowResize(this.state.responsiveState)
        this.setState({
            responsiveState: { ...this.state.responsiveState, width: originWidth * windowProportion }
        })
    }

    getGridItem(child: any, index: number) {
        const { dragType, mapLayout, responsiveState } = this.state;
        var { col, padding, rowHeight, margin } = this.props;
        if (mapLayout) {
            const renderItem = layoutItemForkey(mapLayout, child.key + '');
            if (!padding) padding = 0;
            return (
                <GridItem
                    {...renderItem}
                    margin={margin}
                    col={col}
                    containerWidth={responsiveState.width}
                    containerPadding={[padding, padding]}
                    rowHeight={rowHeight}
                    onDrag={this.onDrag}
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                    isUserMove={renderItem.isUserMove !== void 666 ? renderItem.isUserMove : false}
                    UniqueKey={child.key}
                    onResizing={this.onResizing}
                    onResizeStart={this.onResizeStart}
                    onResizeEnd={this.onResizeEnd}
                    dragType={dragType}
                    key={child.key}
                >
                    {(GridItemProvided, dragHandle, resizeHandle) => this.props.children(child, {
                        isDragging: renderItem.isUserMove !== void 666 ? renderItem.isUserMove : false,
                        props: GridItemProvided,
                        dragHandle,
                        resizeHandle
                    })}
                </GridItem >
            )
        }
    }

    render() {
        const {
            className,
            layout,
            style
        } = this.props;
        const { containerHeight, responsiveState } = this.state;

        return (
            <div

                className={stringJoin('DraggerLayout', className + '')}
                style={{
                    ...style,
                    left: 100,
                    width: responsiveState.width,
                    height: containerHeight,
                    zIndex: 1
                }}
            >
                {layout.map((item, index) => {
                    return this.getGridItem(item, index)
                })}
                {this.renderPlaceholder()}
            </div>
        )
    }

    //api
    getLayout() {
        return this.state.layout;
    }

    //api
    deleteItem(key: any) {
    }
}
