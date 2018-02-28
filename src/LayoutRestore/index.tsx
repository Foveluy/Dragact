import * as React from 'react';
import { Dragact } from '../../src/lib/dragact'
import { Card } from '../NormalLayout/index';
import './index.css';

const Words = [
    { content: 'You can do anything, but not everything.' },
    { content: 'Those who dare to fail miserably can achieve greatly.' },
    { content: 'You miss 100 percent of the shots you never take.' },
    { content: 'Those who believe in telekinetics, raise my hand.' },
    { content: 'I’d rather live with a good question than a bad answer.' }
]


const fakeData = () => {
    var Y = 0;

    return Words.map((item, index) => {
        if (index % 4 === 0) Y++;
        return { ...item, GridX: index % 4 * 4, GridY: Y * 4, w: 4, h: 2, key: index + '' }
    })
}




var storeLayout: any = void 666;
export class LayoutRestore extends React.Component<{}, {}> {
    dragactNode: Dragact;
    handleOnDragEnd = () => {
        const newLayout = this.dragactNode.getLayout();
        const parsedLayout = JSON.stringify(newLayout);

        localStorage.setItem('layout', parsedLayout);
    }
    componentWillMount() {
        const lastLayout = localStorage.getItem('layout');
        if (lastLayout) {
            storeLayout = JSON.parse(lastLayout);
        }
    }

    renderDragact = () => {
        const margin: [number, number] = [5, 5];
        const dragactInit = {
            width: 600,
            col: 12,
            rowHeight: 800 / 12,
            margin: margin,
            className: 'normal-layout',
            layout: storeLayout ? storeLayout : fakeData(),
            placeholder: true
        }

        return (
            <Dragact
                {...dragactInit}
                ref={node => node ? this.dragactNode = node : null}
                onDragEnd={this.handleOnDragEnd}

            >
                {(item: any, provided: any) => {
                    return <Card item={item} provided={provided} />
                }}
            </Dragact>
        )
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    <h1 style={{ textAlign: 'center' }}>存储布局 Demo</h1>
                    {this.renderDragact()}
                </div>
            </div>
        )
    }
}
