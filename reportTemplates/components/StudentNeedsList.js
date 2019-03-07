const React = require('react');

const studentNeedsListStyle = require('../styles/studentNeedsList');

const Item = ({
  value,
  label
}) => React.createElement("div", {
  className: "needs-list-item"
}, React.createElement("div", {
  className: "needs-list-value"
}, React.createElement("div", null, value)), React.createElement("div", {
  className: "needs-list-label"
}, label));

module.exports = props => {
  const {
    title,
    data
  } = props;
  return React.createElement("div", {
    className: "needs-list-root"
  }, React.createElement("div", {
    className: "needs-list-title"
  }, title), React.createElement("div", {
    className: "needs-list-risk-title"
  }, "May need support/intervention in:"), React.createElement("div", null, React.createElement("div", {
    className: "needs-list"
  }, data.map(entry => React.createElement(Item, {
    key: entry.label,
    value: entry.value,
    label: entry.label
  })))), React.createElement("style", null, studentNeedsListStyle));
};