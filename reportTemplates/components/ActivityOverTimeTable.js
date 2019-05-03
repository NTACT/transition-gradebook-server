const React = require('react');

const activityOverTimeTable = require('../styles/activityOverTimeTable');

function displayValue(value, defaultValue = 'N/A') {
  if (value == null) return defaultValue;
  return value;
}

const TermsHeader = ({
  title,
  terms
}) => React.createElement("div", {
  className: "activity-over-time-table-row activity-over-time-table-header"
}, React.createElement("div", {
  className: "activity-over-time-table-title"
}, title), React.createElement(React.Fragment, null, terms && terms.map((term, i) => React.createElement("div", {
  className: "activity-over-time-table-header-label",
  key: i
}, React.createElement("div", null, term.name)))));

const TermsRow = ({
  entry,
  height
}) => {
  const {
    label,
    values
  } = entry;
  return React.createElement("div", {
    className: "activity-over-time-table-row activity-over-time-table-body",
    style: {
      height
    }
  }, React.createElement("div", {
    className: "activity-over-time-table-label-container"
  }, React.createElement("div", {
    className: "activity-over-time-table-label"
  }, label)), values.map((value, i) => React.createElement("div", {
    className: "activity-over-time-table-value",
    key: i
  }, displayValue(value))));
};

module.exports = function ActivityOverTimeTable({
  rows,
  title,
  rowHeight,
  terms
}) {
  return React.createElement(React.Fragment, null, React.createElement("style", null, activityOverTimeTable), React.createElement("div", {
    className: "activity-over-time-table"
  }, React.createElement(TermsHeader, {
    title: title,
    terms: terms
  }), rows.map((entry, i) => React.createElement(TermsRow, {
    key: i,
    entry: entry,
    height: rowHeight
  }))));
};