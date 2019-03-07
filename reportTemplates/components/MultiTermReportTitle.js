function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const React = require('react');

const ReportTitle = require('./ReportTitle');

const SingleTermReportTitle = require('./SingleTermReportTitle');

module.exports = function MultiTermReportTitle(props) {
  const {
    startYear,
    startTerm,
    endYear,
    endTerm
  } = props,
        rest = _objectWithoutProperties(props, ["startYear", "startTerm", "endYear", "endTerm"]);

  if (startYear.id === endYear.id && startTerm.id === endTerm.id) {
    return React.createElement(SingleTermReportTitle, _extends({}, props, {
      schoolYear: startYear,
      term: startTerm
    }));
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