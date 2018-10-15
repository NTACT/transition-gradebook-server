const React = require('react');
const gradeAndAgeTableStyle = require('../styles/gradeAndAgeTable');

module.exports = props => {
    const { data } = props;
    const values = data.map(entry => entry.value);
    const total = values.reduce((sum, value) => sum + value, 0);
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'div',
            { className: 'grade-table' },
            data.map(entry => React.createElement(
                'div',
                { key: entry.label, className: 'grade-table-cell' },
                React.createElement(
                    'div',
                    { className: 'grade-table-label' },
                    entry.label
                ),
                React.createElement(
                    'div',
                    null,
                    entry.value
                )
            )),
            React.createElement(
                'div',
                { className: 'grade-table-cell total' },
                React.createElement(
                    'div',
                    { className: 'grade-table-label' },
                    'TOTAL'
                ),
                React.createElement(
                    'div',
                    null,
                    total
                )
            )
        ),
        React.createElement(
            'style',
            null,
            gradeAndAgeTableStyle
        )
    );
};