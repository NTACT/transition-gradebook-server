const React = require('react');

const studentRiskFactorsListStyle = require('../styles/studentRiskFactorsList');

function formatValue(value) {
  if (value == null) return 'No Data';
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value;
}

const Item = ({
  label,
  value
}) => React.createElement("div", {
  className: "risk-list-item"
}, React.createElement("div", {
  className: "risk-list-item-value"
}, React.createElement("div", null, formatValue(value))), React.createElement("div", {
  className: "risk-list-item-label"
}, label));

module.exports = ({
  title,
  risk,
  data
}) => React.createElement("div", {
  className: "risk-list"
}, React.createElement("div", {
  className: "risk-list-title"
}, React.createElement("div", {
  className: "risk-list-title-label"
}, title), React.createElement("div", {
  className: "risk-list-title-risk"
}, risk)), data.map((entry, index) => React.createElement(Item, {
  key: entry.label,
  index: index,
  label: entry.label,
  value: entry.value
})), React.createElement("style", null, studentRiskFactorsListStyle));