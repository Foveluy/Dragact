'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import LayoutDemo from './App';


ReactDOM.render(
    <div>
        <LayoutDemo />
    </div>,
    document.getElementById('root')
);

document.body.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, false);