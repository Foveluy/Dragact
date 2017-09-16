import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { int, innerHeight, innerWidth, outerHeight, outerWidth, parseBounds, isNumber } from './utils';

var doc = document;

var Dragger = function (_React$Component) {
    _inherits(Dragger, _React$Component);

    function Dragger() {
        var _ref;

        _classCallCheck(this, Dragger);

        for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
            props[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Dragger.__proto__ || _Object$getPrototypeOf(Dragger)).call.apply(_ref, [this].concat(props)));

        _this.state = {
            x: null,
            y: null,
            originX: 0,
            originY: 0,
            lastX: 0,
            lastY: 0
        };

        _this.move = _this.move.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        return _this;
    }

    _createClass(Dragger, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'move',
        value: function move(event) {
            var _state = this.state,
                lastX = _state.lastX,
                lastY = _state.lastY;
            /*  event.client - this.state.origin 表示的是移动的距离,
            *   elX表示的是原来已经有的位移
            */

            var deltaX = event.clientX - this.state.originX + lastX;
            var deltaY = event.clientY - this.state.originY + lastY;

            var bounds = this.props.bounds;

            if (bounds) {
                /**
                * 如果用户指定一个边界，那么在这里处理
                */
                var NewBounds = typeof bounds !== 'string' ? bounds : parseBounds(bounds);

                /**
                 * 移动范围设定，永远移动 n 的倍数
                 * 注意:设定移动范围的时候，一定要在判断bounds之前，否则会造成bounds不对齐
                 */
                var grid = this.props.grid;

                if (Array.isArray(grid) && grid.length === 2) {
                    deltaX = Math.round(deltaX / grid[0]) * grid[0];
                    deltaY = Math.round(deltaY / grid[1]) * grid[1];
                }

                if (this.props.bounds === 'parent') {
                    NewBounds = {
                        left: int(this.parent.style.paddingLeft) + int(this.self.style.marginLeft) - this.self.offsetLeft,
                        top: int(this.parent.style.paddingTop) + int(this.self.style.marginTop) - this.self.offsetTop,
                        right: innerWidth(this.parent) - outerWidth(this.self) - this.self.offsetLeft + int(this.parent.style.paddingRight) - int(this.self.style.marginRight),
                        bottom: innerHeight(this.parent) - outerHeight(this.self) - this.self.offsetTop + int(this.parent.style.paddingBottom) - int(this.self.style.marginBottom)
                    };
                }

                /**
                 * 保证不超出右边界和底部
                 * keep element right and bot can not cross the bounds
                 */
                if (isNumber(NewBounds.right)) deltaX = Math.min(deltaX, NewBounds.right);
                if (isNumber(NewBounds.bottom)) deltaY = Math.min(deltaY, NewBounds.bottom);

                /**
                 * 保证不超出左边和上边
                 * keep element left and top can not cross the bounds
                 */
                if (isNumber(NewBounds.left)) deltaX = Math.max(deltaX, NewBounds.left);
                if (isNumber(NewBounds.top)) deltaY = Math.max(deltaY, NewBounds.top);
            }

            /**如果设置了x,y限制 */
            deltaX = this.props.allowX ? deltaX : 0;
            deltaY = this.props.allowY ? deltaY : 0;

            this.setState({
                x: deltaX,
                y: deltaY
            });
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(event) {
            /** 保证用户在移动元素的时候不会选择到元素内部的东西 */
            doc.body.style.userSelect = 'none';

            if (this.props.hasDraggerHandle) {
                if (event.target.className !== 'handle') return;
            }

            doc.addEventListener('mousemove', this.move);
            doc.addEventListener('mouseup', this.onDragEnd);

            if (this.props.bounds === 'parent' && (
            //为了让 这段代码不会重复执行
            typeof this.parent === 'undefined' || this.parent === null)) {
                /**
                 * 在这里我们将父节点缓存下来，保证当用户鼠标离开拖拽区域时，我们仍然能获取到父节点
                 * what we do here is 
                 * making sure that we still can retrieve our parent when user's mouse left this node.
                 */
                this.parent = event.currentTarget.offsetParent;
                /**
                 * 我们自己
                 * ourself
                 */
                this.self = event.currentTarget;
            }

            this.setState({
                originX: event.clientX,
                originY: event.clientY,
                lastX: this.state.x,
                lastY: this.state.y
            });
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(event) {
            /** 取消用户选择限制，用户可以重新选择 */
            doc.body.style.userSelect = '';
            this.parent = null;
            this.self = null;
            doc.removeEventListener('mousemove', this.move);
            doc.removeEventListener('mouseup', this.onDragEnd);
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                x = _state2.x,
                y = _state2.y;
            var _props = this.props,
                bounds = _props.bounds,
                style = _props.style,
                className = _props.className,
                others = _props.others;

            /**主要是为了让用户定义自己的className去修改css */

            var fixedClassName = typeof className === 'undefined' ? '' : className + ' ';
            return React.createElement(
                'div',
                _extends({ className: fixedClassName + 'WrapDragger',
                    style: _extends({}, style, { touchAction: 'none!important', transform: 'translate(' + x + 'px,' + y + 'px)' }),
                    onMouseDown: this.onDragStart.bind(this),
                    onMouseUp: this.onDragEnd.bind(this)
                }, others),
                React.cloneElement(React.Children.only(this.props.children), {})
            );
        }
    }]);

    return Dragger;
}(React.Component);

Dragger.propTypes = {
    bounds: PropTypes.oneOfType([PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number
    }), PropTypes.string]),
    grid: PropTypes.arrayOf(PropTypes.number),
    allowX: PropTypes.bool,
    allowY: PropTypes.bool,
    hasDraggerHandle: PropTypes.bool
};
Dragger.defaultProps = {
    allowX: true,
    allowY: true,
    hasDraggerHandle: false
};
var _default = Dragger;
export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(doc, 'doc', 'app/src/Dragger.js');

    __REACT_HOT_LOADER__.register(Dragger, 'Dragger', 'app/src/Dragger.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'app/src/Dragger.js');
}();

;