import *as React from 'react';
import { Dragact } from '../lib/dragact';

const Words = [
    { content: 'You can do anything, but not everything.' },
    { content: 'Those who dare to fail miserably can achieve greatly.' },
    { content: 'You miss 100 percent of the shots you never take.' },
    { content: 'Those who believe in telekinetics, raise my hand.' },
    { content: 'I’d rather live with a good question than a bad answer.' }
]


const Card = ({ item, provided }: any) => {
    // console.log(provided);
    return (
        <div
            className='layout-Item'
            {...provided.props}
            {...provided.dragHandle}
        >
            <div style={{ padding: 5, textAlign: 'center', color: '#595959' }}>{item.content}</div>
        </div>
    )
}

const fakeData = () => {
    var Y = 0;
    return Words.map((item, index) => {
        if (index % 4 === 0) Y++;

        return { ...item, GridX: index % 4 * 4, GridY: Y * 4, w: 4, h: 3, key: index }
    })
}

const makeOne = () => {
    return { content: 'added', GridX: 0, GridY: 0, w: 4, h: 3, key: Date.now() }
}


export class AddRemove extends React.Component<{}, {}> {
    state = {
        layout: fakeData()
    }

    componentDidMount() {

    }
    handleClick = () => {
        this.setState({
            layout: [...this.state.layout, makeOne()]
        })
        console.log(this.state.layout)
    }
    handleDeleteClick = () => {
        this.state.layout.shift()
        this.setState({
            layout: [...this.state.layout]
        })
    }

    render() {
        const margin: [number, number] = [5, 5];
        const dragactInit = {
            width: 800,
            col: 12,
            rowHeight: 800 / 12,
            margin: margin,
            className: 'normal-layout',
            layout: this.state.layout
        }
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>AddRemove Demo</h1>
                        <Dragact {...dragactInit} >
                            {(item, provided) => {
                                return <Card item={item} provided={provided} />
                            }}
                        </Dragact>
                        <button onClick={this.handleClick}>新增</button>
                        <button onClick={this.handleDeleteClick}>删除</button>
                    </div>
                </div>
            </div>
        )
    }
}
