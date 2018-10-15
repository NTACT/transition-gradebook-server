var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const React = require('react');
const ReportTitle = require('./ReportTitle');
const SingleTermReportTitle = require('./SingleTermReportTitle');

module.exports = function MultiTermReportTitle(props) {
  const { startYear, startTerm, endYear, endTerm } = props,
        rest = _objectWithoutProperties(props, ['startYear', 'startTerm', 'endYear', 'endTerm']);
  if (startYear.id === endYear.id && startTerm.id === endTerm.id) {
    return React.createElement(SingleTermReportTitle, _extends({}, props, { schoolYear: startYear, term: startTerm }));
  }

  let startTermLabel = '';
  let endTermLabel = '';

  if (startYear.termType !== 'annual') {
    startTermLabel = ', ' + startTerm.termName;
  }

  if (endYear.termType !== 'annual') {
    endTermLabel = ', ' + endTerm.termName;
  }

  return React.createElement(ReportTitle, _extends({}, rest, {
    timeLabel: `${startYear.year}-${startYear.year + 1}${startTermLabel} to ${endYear.year}-${endYear.year + 1}${endTermLabel}`
  }));
};