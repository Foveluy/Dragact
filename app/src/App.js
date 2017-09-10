import React from 'react'

import './style.css'

export default class Drager extends React.Component {
    constructor(...props) {
        super(...props)
        this.move = this.move.bind(this)
    }
    move(some) {
        if (!this.state.isDrag) return
        let { elX, elY } = this.state
        
        let fatherLeft = some.target.offsetParent.offsetLeft
        let fatherRight = some.target.offsetParent.offsetLeft + some.target.offsetParent.clientWidth
        let fatherTop = some.target.offsetParent.offsetTop
        let fatherBot = some.target.offsetParent.offsetTop + some.target.offsetParent.clientHeight

        let deltaX = some.clientX - this.state.originX + elX
        let deltaY = some.clientY - this.state.originY + elY

        this.setState({
            x: deltaX,
            y: deltaY
        })
    }
    ondrag(some) {
        document.addEventListener('mousemove', this.move)

        this.setState({
            isDrag: true,
            originX: some.clientX,
            originY: some.clientY,
            elX: this.state.x,
            elY: this.state.y
        })
    }
    ondragend(some) {
        document.removeEventListener('mousemove', this.move)
        this.setState({
            isDrag: false
        })
    }
    onmouseout(some) {

    }
    state = {
        x: 20,
        y: 20,
        isDrag: false,
        originX: 0,
        elX: 0,
        originY: 0,
        elY: 0
    }

    render() {
        const { x, y } = this.state
        return (
            <div className='shitWrap' style={{ left: 100, height: 300, width: 300, border: '1px solid black', position: 'absolute' }}>
                <div className='shit'
                    style={{ userSelect: 'none', touchAction: 'none', border: '2px solid black', padding: 10, transform: `translate(${x}px,${y}px)` }}
                    onMouseMove={this.move.bind(this)}
                    onMouseDown={this.ondrag.bind(this)}
                    onMouseUp={this.ondragend.bind(this)}
                    onMouseOut={this.onmouseout}>
                    asdasdasd
                    </div>
            </div>
        )
    }

}
