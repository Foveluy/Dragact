import React from 'react'
import PropTypes from 'prop-types'

import './style.css'

const int = (number) => {
    if (number === '') {
        return 0
    }
    return parseInt(number, 10)
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


class Drager extends React.Component {
    constructor(...props) {
        super(...props)
        this.move = this.move.bind(this)
        this.ondragend = this.ondragend.bind(this)
    }
    static propTypes = {
        bounds: PropTypes.string
    }

    state = {
        x: null,
        y: null,
        originX: 0,
        elX: 0,
        originY: 0,
        elY: 0
    }

    componentDidMount() {
    }

    move(some) {
        let { elX, elY } = this.state

        /*  some.client - this.state.origin 表示的是移动的距离,
        *   elX表示的是原来已经有的位移
        */
        let deltaX = some.clientX - this.state.originX + elX
        let deltaY = some.clientY - this.state.originY + elY

        if (this.props.bounds === 'parent') {
            const bounds = {
                left: int(this.parent.style.paddingLeft) + int(this.self.style.marginLeft) - this.self.offsetLeft,
                top: int(this.parent.style.paddingTop) + int(this.self.style.marginTop) - this.self.offsetTop,
                right: this.parent.clientWidth - outerWidth(this.self) - this.self.offsetLeft +
                int(this.parent.style.paddingRight) - int(this.self.style.marginRight),
                bottom: innerHeight(this.parent) - outerHeight(this.self) - this.self.offsetTop +
                int(this.parent.style.paddingBottom) - int(this.self.style.marginBottom)
            }
            console.log(bounds.right)

            deltaX = Math.min(deltaX, bounds.right)
            deltaY = Math.min(deltaY, bounds.bottom)

            deltaX = Math.max(deltaX, bounds.left)
            deltaY = Math.max(deltaY, bounds.top)
        }

        this.setState({
            x: deltaX,
            y: deltaY
        })
    }
    ondrag(some) {
        document.addEventListener('mousemove', this.move)
        document.addEventListener('mouseup', this.ondragend)


        if (this.props.bounds === 'parent' && typeof this.parent === 'undefined') {
            /**
             * 在这里我们将父节点缓存下来，保证当用户鼠标离开拖拽区域时，我们仍然能获取到父节点
             * what we do here is 
             * making sure that we still can retrieve our parent when user's mouse left this node.
             */
            this.parent = some.target.offsetParent
            /**
             * 我们自己
             * ourself
             */
            this.self = some.target
        }

        this.setState({
            originX: some.clientX,
            originY: some.clientY,
            elX: this.state.x,
            elY: this.state.y
        })
    }
    ondragend(some) {
        console.log('脱离了')
        document.removeEventListener('mousemove', this.move)
        document.removeEventListener('mouseup', this.ondragend)
    }


    render() {
        const { x, y } = this.state
        return (
            <div className='shit'
                style={{ userSelect: 'none', margin: 10, touchAction: 'none', border: '2px solid black', padding: 10, transform: `translate(${x}px,${y}px)` }}
                onMouseDown={this.ondrag.bind(this)}
                onMouseUp={this.ondragend.bind(this)}
            >
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
                >
                    <div>
                        <p>asdasdad</p>
                        <p>asdasdad</p>
                    </div>
                </Drager>

            </div>
        )
    }
}
