import React from 'react'
import PropTypes from 'prop-types'
import Dragger from './Dragger.js'
import { int, innerHeight, innerWidth, outerHeight, outerWidth, parseBounds, isNumber } from './utils'

import './style.css'

export default class CtmpFather extends React.Component {

    onWindowResize(e){
        console.log(this.node.clientWidth)
    }
    componentDidMount(){
        console.log(this.node)
        window.addEventListener('resize', this.onWindowResize.bind(this))
        
    }

    render() {
        return (
            <div
                className='shitWrap'
                style={{ display: 'flex', left: 100, height: 300, border: '1px solid black' }}
                ref={(node) => this.node = node}
            >
                <Dragger
                    bounds='parent'
                    style={{ height: 50, width: 50, padding: 10, margin: 10, border: '1px solid black' }}
                    grid={[30, 30]}
                >
                    <div>
                        <p>asdasdad</p>
                        <p>asdasdad</p>
                    </div>
                </Dragger>
                <Dragger
                    style={{ height: 50, width: 50, padding: 10, margin: 10, border: '1px solid black' }}
                    hasDraggerHandle={true}
                >
                    <div>
                        <p className='handle' >asdasdad</p>
                    </div>
                </Dragger>
            </div>
        )
    }
}
