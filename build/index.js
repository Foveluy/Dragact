'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import LayoutDemo from './App';

ReactDOM.render(React.createElement(
    'div',
    null,
    React.createElement(LayoutDemo, null)
), document.getElementById('root'));
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }
}();

;