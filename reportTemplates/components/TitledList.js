const React = require('react');
const titledListStyle = require('../styles/titledList');

const Item = ({ index, label, value }) => React.createElement(
    'div',
    { className: 'list-item' },
    React.createElement(
        'div',
        { className: 'list-item-value', style: index % 2 === 0 && { background: '#F4F4F4' } || null },
        React.createElement(
            'div',
            null,
            value
        )
    ),
    React.createElement(
        'div',
        { className: 'list-item-label' },
        label
    )
);

module.exports = ({ data }) => {
    const {
        title = {},
        items = []
    } = data;
    const {
        label,
        value
    } = title;
    return React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { className: 'list-title' },
            React.createElement(
                'div',
                { className: 'list-title-value' },
                value
            ),
            React.createElement(
                'div',
                { className: 'list-title-label' },
                label
            )
        ),
        items.map((entry, index) => React.createElement(Item, { key: entry.label, index: index, label: entry.label, value: entry.value })),
        React.createElement(
            'style',
            null,
            titledListStyle
        )
    );
};