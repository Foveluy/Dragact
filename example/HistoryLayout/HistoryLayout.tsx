import * as React from 'react';

import { DragactProps, DragactLayoutItem } from '../../src/lib/dragact-type';
import { GridItemEvent } from '../../src/lib/GridItem';
import { Dragact } from '../../src/lib/dragact';

interface HistoryDragactState {
    layout: DragactLayoutItem[]
}

export class HistoryDragact extends React.Component<DragactProps, HistoryDragactState> {
    _actionsHistory: string[] = []
    _cacheLayouts: string;
    _activeItem: GridItemEvent
    _dragact: Dragact | null
    constructor(props: DragactProps) {
        super(props);
        this.state = { layout: props.layout } as any;
    }

    _cacheCurrentLayoutStart = (layoutItem: GridItemEvent) => {
        this._activeItem = layoutItem
        if (!this._dragact) {
            return;
        }
        this._cachingLayouts(this._dragact);
    }

    _cacheCurrentLayoutEnd = (layoutItem: GridItemEvent) => {
        const { GridY, GridX, h, w } = this._activeItem;
        if (GridX === layoutItem.GridX && GridY === layoutItem.GridY && h === layoutItem.h && w === layoutItem.w) {
            return;
        }
        this._storeLayoutToHistory(this._cacheLayouts)
    }

    _cachingLayouts = (d: Dragact) => {
        const initiateSnapShot = JSON.stringify({
            layout: d.getLayout(),
        })
        return this._cacheLayouts = initiateSnapShot;
    }

    goBack = () => {
        const mapLayoutHistory = this._actionsHistory;
        if (mapLayoutHistory.length > 1) {
            const last = mapLayoutHistory.pop();
            if (!last) {
                return;
            }
            this._changeDragactLayouts(last);
        }
    }

    reset = () => {
        if (!this._dragact) {
            return;
        }
        this._cachingLayouts(this._dragact);
        this._storeLayoutToHistory(this._cacheLayouts);
        const initiateSnapShot = this._actionsHistory[0];
        this._changeDragactLayouts(initiateSnapShot);
    }

    clear = () => {
        this._actionsHistory = this._actionsHistory.slice(0, 1);
        this._changeDragactLayouts(this._actionsHistory[0]);
    }

    onDragStart = (event: GridItemEvent, currentLayout: DragactLayoutItem[]) => {
        this._cacheCurrentLayoutStart(event)
        this.props.onDragStart && this.props.onDragStart(event, currentLayout)
    }

    onDragEnd = (event: GridItemEvent, currentLayout: DragactLayoutItem[]) => {
        this._cacheCurrentLayoutEnd(event);
        this.props.onDragEnd && this.props.onDragEnd(event, currentLayout)
    }

    _changeDragactLayouts = (snapshot: string) => {
        if (!this._dragact) {
            return;
        }
        try {
            const { layout } = JSON.parse(snapshot);
            this.setState({
                layout
            })
        } catch (e) {
        }

    }

    _storeLayoutToHistory = (layouts: string) => {
        this._actionsHistory.push(layouts);
    }

    componentDidMount() {
        if (this._dragact) {
            const initiateSnapShot = this._cachingLayouts(this._dragact);
            this._storeLayoutToHistory(initiateSnapShot)
        }
    }

    componentWillReceiveProps(nextProps: DragactProps) {
        this.setState({
            layout: nextProps.layout
        })
    }
    _dragactRefCallback = (d: Dragact) => {
        this._dragact = d;
    }

    get getDragact() {
        return this._dragact;
    }

    render() {
        const layout = this.state.layout;
        return <Dragact ref={this._dragactRefCallback} {...this.props} layout={layout} onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} />
    }
}