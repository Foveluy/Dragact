'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import { LayoutDemo } from './NormalLayout';
import { SortedTable } from './SortedTable';
import { SortedTableWithStatic } from './StaticHeader';



ReactDOM.render(
    <div>
        <LayoutDemo />
        <SortedTable />
        <SortedTableWithStatic />
    </div>,
    document.getElementById('root')
);

document.body.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, false);
