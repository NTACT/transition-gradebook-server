const React = require('react');

const chartContainerStyle = require('../styles/chartContainer');

module.exports = props => React.createElement("div", props, React.createElement("div", {
  className: "chart-container"
}, props.children), React.createElement("style", null, chartContainerStyle));