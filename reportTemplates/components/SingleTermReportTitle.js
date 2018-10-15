var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const React = require('react');
const ReportTitle = require('./ReportTitle');

module.exports = function SingleTermReportTitle(props) {
  const { schoolYear, term } = props,
        rest = _objectWithoutProperties(props, ['schoolYear', 'term']);
  let termLabel = '';

  if (schoolYear.termType !== 'annual') {
    termLabel = ', ' + term.termName;
  }

  return React.createElement(ReportTitle, _extends({}, rest, {
    timeLabel: `School Year ${schoolYear.year}-${schoolYear.year + 1}${termLabel}`
  }));
};