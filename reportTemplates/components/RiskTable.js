const React = require('react');
const riskTableStyle = require('../styles/riskTable');
const riskIndicatorColors = require('../styles/riskIndicatorColors');

module.exports = ({ data }) => React.createElement(
  React.Fragment,
  null,
  React.createElement(
    'div',
    { className: 'risk-table' },
    data.map((entry, index) => React.createElement(
      'div',
      { key: entry.label, className: 'risk-table-cell' },
      React.createElement('div', { className: 'risk-indicator', style: { borderTopColor: riskIndicatorColors[index] } }),
      React.createElement(
        'div',
        { className: 'risk-table-label-and-value' },
        React.createElement(
          'div',
          { className: 'risk-table-label' },
          entry.label
        ),
        React.createElement(
          'div',
          { className: 'risk-table-value' },
          entry.value
        )
      )
    ))
  ),
  React.createElement(
    'style',
    null,
    riskTableStyle
  )
);