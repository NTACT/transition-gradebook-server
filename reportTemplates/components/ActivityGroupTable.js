var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require('react');
const careerAwarenessActivitiesTableStyle = require('../styles/careerAwarenessActivitiesTable');

const sumRow = data => Object.keys(data).reduce((sum, key) => key === 'label' ? sum : sum + data[key], 0);

const sumArray = data => data.reduce((sum, row) => sum + sumRow(row), 0);

const ActivityHeader = ({ grandTotal, title, header = {} }) => {
  const {
    events,
    timePeriod,
    notes
  } = header;
  return React.createElement(
    'div',
    { className: 'activities-table-row activities-table-header' },
    React.createElement(
      'div',
      { className: 'activities-table-total' },
      grandTotal
    ),
    React.createElement(
      'div',
      { className: 'activities-table-title' },
      title
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'One Time'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'Occassionally'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      '2-4x/week'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'Daily'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'Weekly'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'Monthly'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'Quarterly'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'Every Semester'
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      'Annually'
    )
  );
};

const ActivityRow = ({ entry }) => {
  const {
    label,
    oneTime,
    occasionally,
    veryFrequently,
    daily,
    weekly,
    monthly,
    quarterly,
    everySemester,
    annually
  } = entry;
  const rowTotal = sumRow(entry);
  return React.createElement(
    'div',
    { className: 'activities-table-row career-activities-table-row' },
    React.createElement(
      'div',
      { className: 'activities-table-total' },
      React.createElement(
        'div',
        null,
        rowTotal
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-label' },
      React.createElement(
        'div',
        null,
        label
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        oneTime
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        occasionally
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        veryFrequently
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        daily
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        weekly
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        monthly
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        quarterly
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        everySemester
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value' },
      React.createElement(
        'div',
        null,
        annually
      )
    )
  );
};

function ActivityGroupTable({ data, title, splitAt, breakAfter, breakBefore, style }) {
  const grandTotal = sumArray(data);

  if (splitAt) {
    const firstHalf = data.slice(0, splitAt);
    const secondHalf = data.slice(splitAt);
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(ActivityGroupTable, { data: firstHalf, title: title, breakAfter: true }),
      React.createElement(ActivityGroupTable, { data: secondHalf, breakAfter: breakAfter, breakBefore: true })
    );
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { className: 'activities-table', style: _extends({}, style, {
          pageBreakAfter: breakAfter ? 'always' : 'default',
          pageBreakBefore: breakBefore ? 'always' : 'default',
          pageBreakInside: 'avoid'
        }) },
      title && React.createElement(ActivityHeader, { grandTotal: grandTotal, title: title }),
      data.map(entry => React.createElement(ActivityRow, { key: entry.label, entry: entry }))
    ),
    React.createElement(
      'style',
      null,
      careerAwarenessActivitiesTableStyle
    )
  );
};

module.exports = ActivityGroupTable;