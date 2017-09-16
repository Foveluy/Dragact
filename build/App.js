import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import Dragger from './Dragger.js';
import { int, innerHeight, innerWidth, outerHeight, outerWidth, parseBounds, isNumber } from './utils';

var CtmpFather = function (_React$Component) {
    _inherits(CtmpFather, _React$Component);

    function CtmpFather() {
        _classCallCheck(this, CtmpFather);

        return _possibleConstructorReturn(this, (CtmpFather.__proto__ || _Object$getPrototypeOf(CtmpFather)).apply(this, arguments));
    }

    _createClass(CtmpFather, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                {
                    className: 'shitWrap',
                    style: { display: 'flex', left: 100, height: 300, width: 300, border: '1px solid black', position: 'absolute' },
                    ref: function ref(node) {
                        return _this2.node = node;
                    }
                },
                React.createElement(
                    Dragger,
                    {
                        bounds: 'parent',
                        style: { height: 50, width: 50, padding: 10, margin: 10, border: '1px solid black' },
                        grid: [30, 30]
                    },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'p',
                            null,
                            'asdasdad'
                        ),
                        React.createElement(
                            'p',
                            null,
                            'asdasdad'
                        )
                    )
                ),
                React.createElement(
                    Dragger,
                    {
                        style: { height: 50, width: 50, padding: 10, margin: 10, border: '1px solid black' },
                        hasDraggerHandle: true
                    },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'p',
                            { className: 'handle' },
                            'asdasdad'
                        )
                    )
                )
            );
        }
    }]);

    return CtmpFather;
}(React.Component);

var _default = CtmpFather;
export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(CtmpFather, 'CtmpFather', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'app/src/App.js');
}();

;