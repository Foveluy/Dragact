import React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'
import Dragger from './Dragger'

export default class GridItem extends Component {
    constructor(props) {
        super(props)
        this.onDrag = this.onDrag.bind(this)
        this.calGridXY = this.calGridXY.bind(this)
        this.calColWidth = this.calColWidth.bind(this)
    }


    static PropTypes = {
        col: PropTypes.number,
        margin: PropTypes.number,
        containerWidth: PropTypes.number,
        containerPadding: PropTypes.number,
    }

    static defaultProps = {
        col: 12,
        containerWidth: 500
    }

    /** 计算容器的每一个格子多大 */
    calColWidth() {
        return this.props.containerWidth / this.props.col
    }

    /**转化，计算网格的x,y值 */
    calGridXY(x, y) {
        let GridX = Math.round(x / this.calColWidth())
        let GridY = Math.round(y / this.calColWidth())
        console.log(GridX, GridY)
    }

    onDrag(event, x, y) {
        this.calGridXY(x, y)
    }

    render() {
        return (
            <Dragger
                bounds='parent'
                style={{ position: 'absolute', border: '1px solid black' }}
                onMove={this.onDrag}
            >
                <p>asdasdas</p>
            </Dragger>
        )
    }
}