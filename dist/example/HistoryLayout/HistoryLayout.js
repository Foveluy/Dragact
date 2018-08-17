"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var dragact_1 = require("../../src/lib/dragact");
var HistoryDragact = /** @class */ (function (_super) {
    __extends(HistoryDragact, _super);
    function HistoryDragact(props) {
        var _this = _super.call(this, props) || this;
        _this._actionsHistory = [];
        _this._cacheCurrentLayoutStart = function (layoutItem) {
            _this._activeItem = layoutItem;
            if (!_this._dragact) {
                return;
            }
            _this._cachingLayouts(_this._dragact);
        };
        _this._cacheCurrentLayoutEnd = function (layoutItem) {
            var _a = _this._activeItem, GridY = _a.GridY, GridX = _a.GridX, h = _a.h, w = _a.w;
            if (GridX === layoutItem.GridX && GridY === layoutItem.GridY && h === layoutItem.h && w === layoutItem.w) {
                return;
            }
            _this._storeLayoutToHistory(_this._cacheLayouts);
        };
        _this._cachingLayouts = function (d) {
            var initiateSnapShot = JSON.stringify({
                layout: d.getLayout(),
            });
            return _this._cacheLayouts = initiateSnapShot;
        };
        _this.goBack = function () {
            var mapLayoutHistory = _this._actionsHistory;
            if (mapLayoutHistory.length > 1) {
                var last = mapLayoutHistory.pop();
                if (!last) {
                    return;
                }
                _this._changeDragactLayouts(last);
            }
        };
        _this.reset = function () {
            if (!_this._dragact) {
                return;
            }
            _this._cachingLayouts(_this._dragact);
            _this._storeLayoutToHistory(_this._cacheLayouts);
            var initiateSnapShot = _this._actionsHistory[0];
            _this._changeDragactLayouts(initiateSnapShot);
        };
        _this.clear = function () {
            _this._actionsHistory = _this._actionsHistory.slice(0, 1);
            _this._changeDragactLayouts(_this._actionsHistory[0]);
        };
        _this.onDragStart = function (event, currentLayout) {
            _this._cacheCurrentLayoutStart(event);
            _this.props.onDragStart && _this.props.onDragStart(event, currentLayout);
        };
        _this.onDragEnd = function (event, currentLayout) {
            _this._cacheCurrentLayoutEnd(event);
            _this.props.onDragEnd && _this.props.onDragEnd(event, currentLayout);
        };
        _this._changeDragactLayouts = function (snapshot) {
            if (!_this._dragact) {
                return;
            }
            try {
                var layout = JSON.parse(snapshot).layout;
                _this.setState({
                    layout: layout
                });
            }
            catch (e) {
            }
        };
        _this._storeLayoutToHistory = function (layouts) {
            _this._actionsHistory.push(layouts);
        };
        _this._dragactRefCallback = function (d) {
            _this._dragact = d;
        };
        _this.state = { layout: props.layout };
        return _this;
    }
    HistoryDragact.prototype.componentDidMount = function () {
        if (this._dragact) {
            var initiateSnapShot = this._cachingLayouts(this._dragact);
            this._storeLayoutToHistory(initiateSnapShot);
        }
    };
    HistoryDragact.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState({
            layout: nextProps.layout
        });
    };
    Object.defineProperty(HistoryDragact.prototype, "getDragact", {
        get: function () {
            return this._dragact;
        },
        enumerable: true,
        configurable: true
    });
    HistoryDragact.prototype.render = function () {
        var layout = this.state.layout;
        return React.createElement(dragact_1.Dragact, __assign({ ref: this._dragactRefCallback }, this.props, { layout: layout, onDragStart: this.onDragStart, onDragEnd: this.onDragEnd }));
    };
    return HistoryDragact;
}(React.Component));
exports.HistoryDragact = HistoryDragact;
