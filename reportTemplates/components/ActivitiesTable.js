const React = require('react');
const { truncate } = require('lodash');
const activitiesTableStyle = require('../styles/activitiesTable');

const ActivityHeader = ({ total, title, header = {} }) => {
  const {
    events,
    frequency,
    notes
  } = header;
  return React.createElement(
    'div',
    { className: 'activities-table-row activities-table-header' },
    React.createElement(
      'div',
      { className: 'activities-table-title' },
      React.createElement(
        'span',
        { className: 'activities-table-total' },
        total
      ),
      title
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value activities-table-events' },
      events
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value activities-table-frequency' },
      frequency
    ),
    React.createElement(
      'div',
      { className: 'activities-table-notes' },
      notes
    )
  );
};

const ActivityRow = ({ entry }) => {
  const {
    label,
    events,
    frequency,
    notes
  } = entry;

  return React.createElement(
    'div',
    { className: 'activities-table-row' },
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
      { className: 'activities-table-value activities-table-events' },
      React.createElement(
        'div',
        null,
        events
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-value activities-table-frequency' },
      React.createElement(
        'div',
        null,
        frequency
      )
    ),
    React.createElement(
      'div',
      { className: 'activities-table-notes' },
      React.createElement(
        'div',
        null,
        truncate(notes, { length: 80, omission: '...' })
      )
    )
  );
};

module.exports = ({ data, activitiesHeaders, title }) => {
  const total = data.reduce((sum, activity) => sum + activity.events, 0);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { className: 'activities-table' },
      React.createElement(ActivityHeader, { total: total, title: title, header: activitiesHeaders }),
      data.map((entry, i) => React.createElement(ActivityRow, { key: i, entry: entry }))
    ),
    React.createElement(
      'style',
      null,
      activitiesTableStyle
    )
  );
};