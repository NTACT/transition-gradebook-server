const React = require('react');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const now = new Date();
const day = now.getDate();
const month = months[now.getMonth()];
const year = now.getFullYear();
const hours24 = now.getHours();
const minutes = now.getMinutes();

let a = 'AM';
let hours = hours24;
if (hours24 > 12) {
    hours = hours24 - 12;
    a = 'PM';
}

module.exports = ({ currentPage, pageTotal }) => React.createElement(
    'div',
    { className: 'page-count', style: { fontSize: 8 } },
    React.createElement(
        'span',
        { style: { fontWeight: 'bold' } },
        'Page ',
        currentPage,
        '/',
        pageTotal
    ),
    React.createElement(
        'span',
        { style: { marginLeft: 10, fontSize: 6 } },
        month,
        ' ',
        day,
        ', ',
        year,
        ' ',
        hours,
        ':',
        minutes,
        ' ',
        a
    )
);