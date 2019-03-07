const React = require('react');

const disabilityTableStyle = require('../styles/disabilityTable');

module.exports = props => {
  const {
    data
  } = props;
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "disability-table"
  }, data.map(entry => React.createElement("div", {
    key: entry.label,
    className: "disability-table-cell"
  }, React.createElement("div", {
    className: "disability-table-label"
  }, entry.label), React.createElement("div", null, entry.value)))), React.createElement("style", null, disabilityTableStyle));
};