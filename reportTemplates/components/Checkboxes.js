function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

module.exports = (_ref) => {
  let {
    data,
    title
  } = _ref,
      rest = _objectWithoutProperties(_ref, ["data", "title"]);

  return React.createElement("div", _extends({
    className: "checkboxes-container"
  }, rest), React.createElement("div", {
    className: "checkboxes-title"
  }, title), React.createElement("div", {
    className: "checkboxes"
  }, data.map(entry => React.createElement(Checkbox, {
    key: entry.label,
    value: entry.value,
    label: entry.value ? entry.otherValue || entry.label : entry.label
  }))), React.createElement("style", null, checkboxesStyle));
};