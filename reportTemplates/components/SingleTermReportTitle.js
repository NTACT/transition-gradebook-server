function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const React = require('react');

const ReportTitle = require('./ReportTitle');

module.exports = function SingleTermReportTitle(props) {
  const {
    schoolYear,
    term
  } = props,
        rest = _objectWithoutProperties(props, ["schoolYear", "term"]);

  let termLabel = '';

  if (schoolYear.termType !== 'annual') {
    termLabel = ', ' + term.termName;
  }

  return React.createElement(ReportTitle, _extends({}, rest, {
    timeLabel: `School Year ${schoolYear.year}-${schoolYear.year + 1}${termLabel}`
  }));
};