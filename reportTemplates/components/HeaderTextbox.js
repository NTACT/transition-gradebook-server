const React = require('react');

const headerTextboxStyle = require('../styles/headerTextbox');

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
  }, data ? data : 'Not indicated'), React.createElement("style", null, headerTextboxStyle));
};