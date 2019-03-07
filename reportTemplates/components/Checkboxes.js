const React = require('react');

const AtRisk = require('./AtRisk');

const checkboxesStyle = require('../styles/checkboxes');

const Checkbox = ({
  value,
  label
}) => React.createElement("div", {
  key: label,
  className: "checkbox-item"
}, React.createElement("div", {
  className: "checkbox-value"
}, React.createElement("div", null, value && React.createElement(AtRisk, null))), React.createElement("div", {
  className: "checkbox-label"
}, label));

module.exports = ({
  data,
  title
}) => {
  return React.createElement("div", {
    className: "checkboxes-container"
  }, React.createElement("div", {
    className: "checkboxes-title"
  }, title), React.createElement("div", {
    className: "checkboxes"
  }, data.map(entry => React.createElement(Checkbox, {
    key: entry.label,
    value: entry.value,
    label: entry.value ? entry.otherValue || entry.label : entry.label
  }))), React.createElement("style", null, checkboxesStyle));
};