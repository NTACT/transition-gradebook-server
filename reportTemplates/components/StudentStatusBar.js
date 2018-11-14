const React = require('react');
const { first, capitalize } = require('lodash');
const studentStatusBarStyle = require('../styles/studentStatusBar');
const { riskIndicatorKeys } = require('../styles/riskIndicatorColors');

module.exports = ({ student }) => {
  const {
    studentId,
    firstName,
    lastName,
    gender,
    race,
    grade,
    disabilities,
    ell,
    risk
  } = student;
  let riskColor = null;

  if (risk) {
    riskColor = riskIndicatorKeys[risk].value;
  }
  return React.createElement(
    'div',
    { className: 'student-status-bar' },
    React.createElement(
      'div',
      { className: 'student-status-bar-row' },
      React.createElement(
        'div',
        { className: 'student-status-bar-info' },
        React.createElement(
          'div',
          { className: 'student-status-bar-label' },
          'ID'
        ),
        React.createElement(
          'div',
          null,
          studentId
        )
      ),
      React.createElement(
        'div',
        { className: 'student-status-bar-info' },
        React.createElement(
          'div',
          { className: 'student-status-bar-label' },
          'Name'
        ),
        React.createElement(
          'div',
          null,
          capitalize(firstName),
          ' ',
          capitalize(lastName)
        )
      ),
      React.createElement(
        'div',
        { className: 'student-status-bar-info' },
        React.createElement(
          'div',
          { className: 'student-status-bar-label' },
          'Gender'
        ),
        React.createElement(
          'div',
          null,
          capitalize(first(gender))
        )
      ),
      React.createElement(
        'div',
        { className: 'student-status-bar-info' },
        React.createElement(
          'div',
          { className: 'student-status-bar-label' },
          'Race'
        ),
        React.createElement(
          'div',
          null,
          race || 'N/A'
        )
      ),
      React.createElement(
        'div',
        { className: 'student-status-bar-info' },
        React.createElement(
          'div',
          { className: 'student-status-bar-label' },
          'Grade/Age'
        ),
        React.createElement(
          'div',
          null,
          grade
        )
      ),
      React.createElement(
        'div',
        { className: 'student-status-bar-info' },
        React.createElement(
          'div',
          { className: 'student-status-bar-label' },
          'ELL'
        ),
        React.createElement(
          'div',
          null,
          ell && 'Yes' || 'No'
        )
      ),
      React.createElement('div', { className: 'risk-indicator', style: { borderTopColor: riskColor } })
    ),
    React.createElement(
      'div',
      { className: 'student-status-bar-row' },
      React.createElement(
        'div',
        { className: 'student-status-bar-info' },
        React.createElement(
          'div',
          { className: 'student-status-bar-label' },
          'Category'
        ),
        React.createElement(
          'div',
          null,
          disabilities && disabilities.map(disability => {
            if (typeof disability === 'object') disability = disability.name;
            return React.createElement(
              'span',
              { key: disability, className: 'student-status-bar-disability' },
              disability
            );
          })
        )
      )
    ),
    React.createElement(
      'style',
      null,
      studentStatusBarStyle
    )
  );
};