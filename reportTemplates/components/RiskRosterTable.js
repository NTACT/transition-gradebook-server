const React = require('react');
const { first, capitalize, chunk, truncate } = require('lodash');
const riskRosterTableStyle = require('../styles/riskRosterTable');
const { riskIndicatorKeys } = require('../styles/riskIndicatorColors');
const AtRisk = require('./AtRisk');

const generatePlaceholders = count => {
  let placeholders = [];
  for (index = 0; index < count; index++) {
    placeholders.push(React.createElement(Placeholder, { key: index }));
  }
  return placeholders;
};

const Placeholder = () => React.createElement('div', { className: 'risk-roster-placeholder' });
const Spacer = () => React.createElement('div', { className: 'risk-roster-spacer' });

const RiskRosterHeader = () => React.createElement(
  'div',
  { className: 'risk-roster-row risk-roster-header' },
  React.createElement('div', { className: 'risk-roster-header-student risk-roster-indicator' }),
  React.createElement(
    'div',
    { className: 'risk-roster-header-student risk-roster-name' },
    'ID/Name'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-student' },
    'Gender'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-student' },
    'Grade/Age'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-student' },
    'Category'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-student risk-roster-ell' },
    'ELL'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-risk' },
    'Attendance'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-risk' },
    'Behavior'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-risk' },
    'Engagement'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-risk' },
    'English/ELA'
  ),
  React.createElement(
    'div',
    { className: 'risk-roster-header-risk' },
    'Math'
  )
);

const RiskRosterRow = ({ studentTermInfo }) => {
  const {
    studentId,
    firstName,
    lastName,
    gender,
    gradeLevel,
    disabilities,
    ell,
    risk,
    interventions
  } = studentTermInfo;

  const {
    attendance,
    behavior,
    engagement,
    english,
    math
  } = interventions;

  const riskMetric = riskIndicatorKeys[risk];
  const {
    value,
    label
  } = riskMetric;

  return React.createElement(
    'div',
    { className: 'risk-roster-row' },
    React.createElement(
      'div',
      { className: 'risk-roster-indicator' },
      React.createElement(
        'div',
        { className: 'risk-indicator-container' },
        React.createElement('div', { className: 'risk-indicator', style: { borderTopColor: value } })
      ),
      React.createElement(
        'div',
        { className: 'risk-indicator-label' },
        '(',
        label,
        ')'
      )
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-name' },
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          studentId
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'b',
            null,
            truncate(capitalize(firstName) + ' ' + capitalize(lastName), { length: 25 })
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-student' },
      capitalize(first(gender))
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-student' },
      gradeLevel
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-student' },
      disabilities && chunk(disabilities, 4).map((disabilities, i) => React.createElement(
        React.Fragment,
        { key: i },
        i ? React.createElement('br', null) : '',
        disabilities.map(d => d.name).join('/')
      ))
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-student risk-roster-ell' },
      ell && 'Yes' || 'No'
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-risk' },
      attendance && React.createElement(AtRisk, null)
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-risk' },
      behavior && React.createElement(AtRisk, null)
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-risk' },
      engagement && React.createElement(AtRisk, null)
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-risk' },
      english && React.createElement(AtRisk, null)
    ),
    React.createElement(
      'div',
      { className: 'risk-roster-risk' },
      math && React.createElement(AtRisk, null)
    )
  );
};

module.exports = ({ data, maxCount, pageNumber }) => React.createElement(
  React.Fragment,
  null,
  React.createElement(
    'div',
    { className: 'risk-roster-table' },
    React.createElement(RiskRosterHeader, null),
    data.map((studentTermInfo, index) => React.createElement(RiskRosterRow, { key: index, studentTermInfo: studentTermInfo })),
    data.length < maxCount && generatePlaceholders(maxCount - data.length),
    pageNumber > 1 && React.createElement(Spacer, null)
  ),
  React.createElement(
    'style',
    null,
    riskRosterTableStyle
  )
);