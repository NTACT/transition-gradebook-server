const React = require('react');

const headerWithTextStyle = require('../styles/headerText');

module.exports = ({
  data,
  title
}) => {
  return React.createElement("div", {
    className: "header-text-container"
  }, React.createElement("div", {
    className: "header-title"
  }, title), React.createElement("div", {
    className: "text-item"
  }, data), React.createElement("style", null, headerWithTextStyle));
};