import React from 'react'
import PropTypes from 'prop-types'
import GridItem from './GridItem'

import './style.css'

class DraggerLayout extends React.Component {
    static PropTypes = {
        /**外部属性 */
        layout: PropTypes.array,
        col: PropTypes.number,
        width: PropTypes.number,
        rowHeight: PropTypes.number,
        padding: PropTypes.number,
    }


    render() {
        const { col, width } = this.props
        return (
            <div
                className='DraggerLayout'
                style={{ position: 'absolute', left: 100, width: 500, height: 500, border: '1px solid black' }}
            >
                {React.Children.map(this.props.children,
                    (child) =>
                        <GridItem
                            col={col}
                            containerWidth={width}
                            containerPadding={padding}
                        >
                            {child}
                        </GridItem >
                )}
            </div>
        )
    }
}

export const LayoutDemo = () => {
    return (
        <DraggerLayout>
            <p>asdasd</p>
            <p>asdasd</p>
        </DraggerLayout>
    )
}