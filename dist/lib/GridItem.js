import * as React from "react";
import { Dragger } from './dragger/index';
import { checkInContainer } from './util/correction';
export default class GridItem extends React.Component {
    constructor(props) {
        super(props);
        this.onDrag = this.onDrag.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.calGridXY = this.calGridXY.bind(this);
        this.calColWidth = this.calColWidth.bind(this);
    }
    /** 计算容器的每一个格子多大 */
    calColWidth() {
        const { containerWidth, col, containerPadding, margin } = this.props;
        if (margin) {
            return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col;
        }
        return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col;
    }
    /**转化，计算网格的GridX,GridY值 */
    calGridXY(x, y) {
        const { margin, containerWidth, col, w, rowHeight } = this.props;
        /**坐标转换成格子的时候，无须计算margin */
        let GridX = Math.round(x / containerWidth * col);
        let GridY = Math.round(y / (rowHeight + (margin ? margin[1] : 0)));
        // /**防止元素出container */
        return checkInContainer(GridX, GridY, col, w);
    }
    /**给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px */
    calGridItemPosition(GridX, GridY) {
        var { margin, rowHeight } = this.props;
        if (!margin)
            margin = [0, 0];
        let x = Math.round(GridX * this.calColWidth() + (GridX + 1) * margin[0]);
        let y = Math.round(GridY * rowHeight + margin[1] * (GridY + 1));
        return {
            x: x,
            y: y
        };
    }
    shouldComponentUpdate(props, state) {
        return this.props.GridX !== props.GridX ||
            this.props.GridY !== props.GridY ||
            this.props.isUserMove !== props.isUserMove;
    }
    /**宽和高计算成为px */
    calWHtoPx(w, h) {
        var { margin } = this.props;
        if (!margin)
            margin = [0, 0];
        const wPx = Math.round(w * this.calColWidth() + (w - 1) * margin[0]);
        const hPx = Math.round(h * this.props.rowHeight + (h - 1) * margin[1]);
        return { wPx, hPx };
    }
    onDragStart(x, y) {
        const { w, h, UniqueKey } = this.props;
        if (this.props.static)
            return;
        const { GridX, GridY } = this.calGridXY(x, y);
        this.props.onDragStart && this.props.onDragStart({
            event, GridX, GridY, w, h, UniqueKey: UniqueKey + ''
        });
    }
    onDrag(event, x, y) {
        if (this.props.static)
            return;
        const { GridX, GridY } = this.calGridXY(x, y);
        const { w, h, UniqueKey } = this.props;
        this.props.onDrag && this.props.onDrag({ GridX, GridY, w, h, UniqueKey: UniqueKey + '', event });
    }
    onDragEnd() {
        if (this.props.static)
            return;
        if (this.props.onDragEnd)
            this.props.onDragEnd(this.props.UniqueKey + '');
    }
    render() {
        const { w, h, style, bounds, GridX, GridY } = this.props;
        const { x, y } = this.calGridItemPosition(GridX, GridY);
        const { wPx, hPx } = this.calWHtoPx(w, h);
        return (React.createElement(Dragger, { style: Object.assign({}, style, { width: wPx, height: hPx, position: 'absolute', transition: this.props.isUserMove ? '' : 'all .2s' }), onDragStart: this.onDragStart, onMove: this.onDrag, onDragEnd: this.onDragEnd, x: x, y: y, isUserMove: this.props.isUserMove, bounds: bounds },
            React.createElement("div", { style: { width: wPx, height: hPx } }, React.Children.map(this.props.children, (child) => child))));
    }
}
GridItem.defaultProps = {
    col: 12,
    containerWidth: 500,
    containerPadding: [0, 0],
    margin: [10, 10],
    rowHeight: 30,
    w: 1,
    h: 1
};
