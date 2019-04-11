const React = require('react');

const horizontalBarChartStyle = require('../styles/horizontalBarChart');

const {
  horizontalBarColors
} = require('../styles/chartColors');

module.exports = props => {
  const {
    data
  } = props;
  const values = data.map(entry => entry.value);
  const maxValue = Math.max.apply(null, values);
  const {
    title,
    barMaxWidth = 210,
    captionWidth = 120
  } = props;
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "barchart-container"
  }, React.createElement("div", {
    className: "barchart-title",
    style: {
      marginLeft: captionWidth + 10
    }
  }, title), data.map((entry, index) => React.createElement("div", {
    key: index,
    className: "barchart-bar-and-caption"
  }, React.createElement("div", {
    className: "barchart-caption",
    style: {
      width: captionWidth
    }
  }, entry.label), React.createElement("div", {
    className: "barchart-bar",
    style: {
      width: barMaxWidth
    }
  }, React.createElement("div", {
    className: "barchart-bar-fill",
    style: {
      width: maxValue <= 0 ? null : entry.value / maxValue * barMaxWidth,
      background: maxValue <= 0 ? null : index % 2 === 0 ? horizontalBarColors[0] : horizontalBarColors[1]
    }
  })), React.createElement("div", {
    className: "barchart-value"
  }, entry.value, " (", Math.round(entry.value / maxValue * 100), "%)")))), React.createElement("style", null, horizontalBarChartStyle));
};