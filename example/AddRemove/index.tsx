import * as React from 'react'
import { Dragact } from '../../src/lib/dragact'

const Words = [
    { content: 'You can do anything, but not everything.' },
    { content: 'Those who dare to fail miserably can achieve greatly.' },
    { content: 'You miss 100 percent of the shots you never take.' },
    { content: 'Those who believe in telekinetics, raise my hand.' },
    { content: 'I’d rather live with a good question than a bad answer.' }
]

const Card = ({ item, provided, onDelete }: any) => {
    return (
        <div
            className="layout-Item"
            {...provided.props}
            {...provided.dragHandle}
        >
            <div
                style={{
                    position: 'absolute',
                    width: 10,
                    height: 10,
                    right: 15,
                    top: 5,
                    cursor: 'pointer'
                }}
                onClick={() => onDelete(item.key)}
            >
                ❌
            </div>
            <div style={{ padding: 5, textAlign: 'center', color: '#595959' }}>
                {item.content}
            </div>
        </div>
    )
}

const fakeData = () => {
    var Y = 0
    return Words.map((item, index) => {
        if (index % 4 === 0) Y++

        return {
            ...item,
            GridX: (index % 4) * 4,
            GridY: Y * 4,
            w: 4,
            h: 3,
            key: index
        }
    })
}

const makeOne = () => {
    return { content: 'added', GridX: 0, GridY: 0, w: 4, h: 3, key: Date.now() }
}

export class AddRemove extends React.Component<{}, {}> {
    state = {
        layout: fakeData()
    }

    componentDidMount() {}
    handleClick = () => {
        const change = this.state.layout.map(item => {
            return { ...item, content: '21312' }
        })
        this.setState({
            layout: [...change, makeOne()]
        })
    }
    hanldeOnDelete = (key: any) => {
        const layout = this.state.layout.filter(item => {
            if (item.key !== key) {
                return item
            }
        })
        this.setState({
            layout: layout
        })
    }

    render() {
        const margin: [number, number] = [5, 5]
        const dragactInit = {
            width: 600,
            col: 12,
            rowHeight: 800 / 12,
            margin: margin,
            className: 'normal-layout',
            layout: this.state.layout,
            placeholder: true
        }
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <h1 style={{ textAlign: 'center' }}>AddRemove Demo</h1>
                        <h3 style={{ textAlign: 'center' }}>在这个布局中，新增一个布局，会新加入一个布局</h3>
                        <button onClick={this.handleClick}>新增</button>
                        <Dragact {...dragactInit}>
                            {(item, provided) => {
                                return (
                                    <Card
                                        item={item}
                                        provided={provided}
                                        onDelete={this.hanldeOnDelete}
                                    />
                                )
                            }}
                        </Dragact>
                    </div>
                </div>
            </div>
        )
    }
}
