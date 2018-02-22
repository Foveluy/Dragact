import * as React from 'react';
import { Dragact } from '../lib/dragact';
import './index.css';
var Words = [
    { content: 'Sorry I just can not move in any circumstances', img: 'http://pic.sc.chinaz.com/files/pic/pic9/201303/xpic10472.jpg', static: true },
    { content: 'Those who dare to fail miserably can achieve greatly.', img: 'https://img00.deviantart.net/1163/i/2013/059/d/7/irish_views_by_ssquared_photography-d5wjnsk.jpg' },
    { content: 'You miss 100 percent of the shots you never take.', img: 'http://www.landsendhotel.co.uk/uploads/gallery/gallery/coastal_scenery_seascapes_6.jpg' },
    { content: 'Sorry I just can not move in any circumstances,too', img: 'https://tctechcrunch2011.files.wordpress.com/2017/10/26099344353_18cd6fabb8_k.jpg?w=738', static: true },
    { content: 'I’d rather live with a good question than a bad answer.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa26cLzh6PYUwY4LMpwbHyDHFmWi_w2JuqDzeOdm1IIEbBZO0Vg' }
];
var Cell = function (props) {
    var item = props.item;
    return (React.createElement("div", { className: "layout-Cell " + (item.static ? "static" : ""), style: { background: item.static ? "#e8e8e8" : "" } },
        React.createElement("img", { src: item.img, style: { width: 45, height: 45 }, draggable: false, alt: 'card' }),
        React.createElement("div", { style: { paddingLeft: 12, color: '#595959' } }, item.content)));
};
export var SortedTableWithStatic = function () {
    return (React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
        React.createElement("div", null,
            React.createElement("h1", { style: { textAlign: 'center' } }, "Static Header Table Demo"),
            React.createElement(Dragact, { width: 800, col: 1, rowHeight: 60, margin: [2, 2], className: 'normal-layout' }, Words.map(function (el, index) {
                return React.createElement(Cell, { item: el, key: index, "data-set": { GridX: 0, GridY: index, w: 1, h: 1, static: el.static } });
            })))));
};
