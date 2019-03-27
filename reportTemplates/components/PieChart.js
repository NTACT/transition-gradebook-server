function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const React = require('react');

const pieChartStyle = require('../styles/pieChart');

const PieChart = require('react-minimal-pie-chart');

const {
  pieChartColors
} = require('../styles/chartColors');

const addColorScheme = list => list.map((item, index) => _objectSpread({}, item, {
  color: pieChartColors[index]
}));

const keySortFn = (a, b) => b.value - a.value;

module.exports = function PieChartWrapper(props) {
  const {
    title,
    data,
    // an array where each element is an object with a 'label' and a 'value' property
    isAbsolute = true,
    // default: expects values to be absolute numbers (they will be summed to get the total)
    isPercentage = false,
    // if true, expects the values to represent a portion of 100%
    isRatio = false,
    // if true, the sum of the values must be equal to 1
    diameter = 100,
    width
  } = props;
  const values = isAbsolute && data.map(entry => Number(entry.value));
  const total = isAbsolute && values.reduce((sum, value) => sum + value, 0);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "piechart-container",
    style: _objectSpread({}, width)
  }, React.createElement("div", {
    className: "piechart-title"
  }, title), React.createElement("div", {
    className: "piechart-caption-and-chart"
  }, React.createElement("div", {
    className: "piechart-caption"
  }, data.sort(keySortFn).map((entry, i) => React.createElement("div", {
    key: entry.label,
    className: "piechart-caption-item"
  }, React.createElement("span", {
    className: "piechart-label"
  }, React.createElement("div", {
    className: "piechart-label-icon",
    style: {
      backgroundColor: pieChartColors[i]
    }
  }), entry.label), React.createElement("span", {
    className: "piechart-value"
  }, isPercentage ? '' : React.createElement("span", null, entry.value, "\xA0"), "(", isRatio && Math.round(entry.value * 100) || isPercentage && Math.round(entry.value) || isAbsolute && total > 0 && Math.round(entry.value / total * 100) || 0, "%)")))), React.createElement(PieChart, {
    data: addColorScheme(data),
    style: {
      width: diameter,
      height: diameter
    },
    startAngle: 90
  }))), React.createElement("style", null, pieChartStyle));
};