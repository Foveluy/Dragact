import React from 'react'
import PropTypes from 'prop-types'

import './style.css'

const int = (number) => {
    if (number === '') {
        return 0
    }
    return parseInt(number, 10)
}
const innerWidth = (node) => {
    let width = node.clientWidth;
    const computedStyle = node.style
    width -= int(computedStyle.paddingLeft);
    width -= int(computedStyle.paddingRight);
    return width;
}

const outerWidth = (node) => {
    let width = node.clientWidth;
    const computedStyle = node.style
    width += int(computedStyle.borderLeftWidth);
    width += int(computedStyle.borderRightWidth);
    return width;
}

const innerHeight = (node) => {
    let height = node.clientHeight;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    height -= int(computedStyle.paddingTop);
    height -= int(computedStyle.paddingBottom);
    return height;
}

const outerHeight = (node) => {
    let height = node.clientHeight;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    height += int(computedStyle.borderTopWidth);
    height += int(computedStyle.borderBottomWidth);
    return height;
}

const doc = document

class Drager extends React.Component {
    constructor(...props) {
        super(...props)
        this.move = this.move.bind(this)
        this.ondragend = this.ondragend.bind(this)
    }

    static propTypes = {
        bounds: PropTypes.string,
        grid: PropTypes.arrayOf(PropTypes.number)
    }

    state = {
        x: null,
        y: null,
        originX: 0,
        originY: 0,
        lastX: 0,
        lastY: 0
    }

    componentDidMount() {
    }

    move(event) {
        let { lastX, lastY } = this.state
        /*  event.client - this.state.origin 表示的是移动的距离,
        *   elX表示的是原来已经有的位移
        */
        let deltaX = event.clientX - this.state.originX + lastX
        let deltaY = event.clientY - this.state.originY + lastY

        /**
         * 移动范围设定，永远移动 n 的倍数
         * 注意:设定移动范围的时候，一定要在判断bounds之前，否则会造成bounds不对齐
         */
        const { grid } = this.props
        if (Array.isArray(grid) && grid.length === 2) {
            deltaX = Math.round(deltaX / grid[0]) * grid[0]
            deltaY = Math.round(deltaY / grid[1]) * grid[1]
        }

        if (this.props.bounds === 'parent') {
            const bounds = {
                left: int(this.parent.style.paddingLeft) + int(this.self.style.marginLeft) - this.self.offsetLeft,
                top: int(this.parent.style.paddingTop) + int(this.self.style.marginTop) - this.self.offsetTop,
                right: innerWidth(this.parent) - outerWidth(this.self) - this.self.offsetLeft +
                int(this.parent.style.paddingRight) - int(this.self.style.marginRight),
                bottom: innerHeight(this.parent) - outerHeight(this.self) - this.self.offsetTop +
                int(this.parent.style.paddingBottom) - int(this.self.style.marginBottom)
            }

            /**
             * 保证不超出右边界和底部
             * keep element right and bot can not cross the bounds
             */
            deltaX = Math.min(deltaX, bounds.right)
            deltaY = Math.min(deltaY, bounds.bottom)

            /**
             * 保证不超出左边和上边
             * keep element left and top can not cross the bounds
             */
            deltaX = Math.max(deltaX, bounds.left)
            deltaY = Math.max(deltaY, bounds.top)
        }

        this.setState({
            x: deltaX,
            y: deltaY
        })
    }

    ondrag(event) {
        /** 保证用户在移动元素的时候不会选择到元素内部的东西 */
        doc.body.style.userSelect = 'none'
        doc.addEventListener('mousemove', this.move)
        doc.addEventListener('mouseup', this.ondragend)

        if (this.props.bounds === 'parent' &&
            //为了让 这段代码不会重复执行
            (typeof this.parent === 'undefined' || this.parent === null)) {
            /**
             * 在这里我们将父节点缓存下来，保证当用户鼠标离开拖拽区域时，我们仍然能获取到父节点
             * what we do here is 
             * making sure that we still can retrieve our parent when user's mouse left this node.
             */
            this.parent = event.currentTarget.offsetParent
            /**
             * 我们自己
             * ourself
             */
            this.self = event.currentTarget
        }

        this.setState({
            originX: event.clientX,
            originY: event.clientY,
            lastX: this.state.x,
            lastY: this.state.y
        })
    }

    ondragend(event) {
        /** 取消用户选择限制，用户可以重新选择 */
        doc.body.style.userSelect = ''
        this.parent = null
        this.self = null
        doc.removeEventListener('mousemove', this.move)
        doc.removeEventListener('mouseup', this.ondragend)

    }

    render() {
        const { x, y } = this.state
        const { bounds, style, className, others } = this.props
        let fixedClassName = typeof className === 'undefined' ? '' : className + ' '
        return (
            <div className={`${fixedClassName}WrapDragger`}
                style={{ ...style, touchAction: 'none!important', transform: `translate(${x}px,${y}px)` }}
                onMouseDown={this.ondrag.bind(this)}
                onMouseUp={this.ondragend.bind(this)}
                {...others}
            >
                {/**
             *  React.cloneElement复制了所有的子元素，然后进行渲染，这样用户就可以使用
             *  <drager>
             *       something....
             *  </drager>
             *
             *  React.Children.only 只允许子元素有一个根节点
             */}
                {React.cloneElement(React.Children.only(this.props.children), {})}
            </div>
        )
    }
}

export default class tmpFather extends React.Component {
    render() {
        return (
            <div
                className='shitWrap'
                style={{ left: 100, height: 300, width: 300, border: '1px solid black', position: 'absolute' }}
                ref={(node) => this.node = node}
            >
                <Drager
                    bounds='parent'
                    style={{ padding: 10, margin: 10, border: '1px solid black' }}
                    grid={[30, 30]}
                >
                    <div>
                        <p>asdasdad</p>
                        <p>asdasdad</p>
                    </div>
                </Drager>
                <Drager
                    bounds='parent'
                    style={{ padding: 10, margin: 10, left: 150, border: '1px solid black' }}
                >
                    <div>
                        <p>asdasdad</p>
                    </div>
                </Drager>

            </div>
        )
    }
}
