import React from 'react'
import PropTypes from 'prop-types'
import GridItem from './GridItem'
import { int, innerHeight, innerWidth, outerHeight, outerWidth, parseBounds, isNumber } from './utils'

import './style.css'

export default class CtmpFather extends React.Component {

    onWindowResize(e) {
        console.log(this.node.clientWidth)
    }
    componentDidMount() {
        console.log(this.node)
        window.addEventListener('resize', this.onWindowResize.bind(this))

    }

    render() {
        return (
            <div
                className='shitWrap'
                style={{ position: 'absolute', left: 100, width: 500, height: 500, border: '1px solid black' }}
                ref={(node) => this.node = node}
            >
                <GridItem/>
            </div>
        )
    }
}
