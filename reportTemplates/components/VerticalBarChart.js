var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require('react');
const { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Text } = require('recharts');
const verticalBarChartStyle = require('../styles/verticalBarChart');
const { riskIndicatorArray } = require('../styles/riskIndicatorColors');
const defaultColors = require('../styles/chartColors');

const pickRepeatedColor = (index, barColors) => {
  const indexWithInitialOffset = index - 1;
  if (indexWithInitialOffset % 2 === 0) return barColors[indexWithInitialOffset / 2];else return barColors[Math.floor(indexWithInitialOffset / 2 + 1)];
};

// displays up to 20 stripes
const DiagonalStripes = ({ x, y, height, width, stroke }) => React.createElement(
  'svg',
  { x: x, y: y - 0.75, width: width, height: height },
  React.createElement('rect', { x: 0, y: 0, height: height, width: width, stroke: stroke, fill: stroke })
);

const generateBars = (data, { multipleBars, riskChart, barSize, barColors, rotateLabels }) => {
  if (multipleBars) {
    return data.labels.map((entry, index) => {
      const color = pickRepeatedColor(index, barColors);
      return React.createElement(
        Bar,
        { key: entry.key, barSize: barSize, dataKey: entry.key, stroke: color, fill: 'white', shape: index % 2 === 0 ? React.createElement(DiagonalStripes, { stroke: color }) : null },
        React.createElement(LabelList, { content: props => {
            let distance = rotateLabels ? 5 : 0;
            if (rotateLabels && props.value >= 100) distance = 10;
            return React.createElement(
              'text',
              _extends({}, props, {
                fontSize: 9,
                dx: rotateLabels ? 0 : props.width / 2,
                dy: rotateLabels ? 0 : -5,
                textAnchor: 'middle',
                transform: rotateLabels ? `rotate(90 ${props.x + props.width / 4} ${props.y})` : null,
                x: props.x - distance, y: props.y
              }),
              props.value
            );
          } })
      );
    });
  } else if (riskChart) {
    return riskIndicatorArray.map((entry, index) => React.createElement(
      Bar,
      { key: entry.key, barSize: barSize, dataKey: entry.key, shape: React.createElement(DiagonalStripes, { stroke: entry.color }) },
      React.createElement(LabelList, { position: 'top', fontSize: 9 })
    ));
  }
  return React.createElement(
    Bar,
    { barSize: barSize, dataKey: 'value', strokeWidth: 2, shape: React.createElement(DiagonalStripes, { stroke: barColors[0] }) },
    React.createElement(LabelList, { position: 'top', fontSize: 9 })
  );
};

const generateCaptions = (data, { multipleBars, riskChart, barColors }) => {
  if (multipleBars) {
    return React.createElement(
      'div',
      { className: 'vertical-bar-chart-caption-container' },
      React.createElement(
        'div',
        { className: 'vertical-bar-chart-caption-content' },
        data.labels.map((entry, index) => {
          color = pickRepeatedColor(index, barColors);
          return React.createElement(
            'div',
            { key: entry.key, className: 'vertical-bar-chart-caption-item' },
            React.createElement('div', { className: 'vertical-bar-chart-caption-color', style: {
                background: index % 2 === 0 ? color : null,
                border: `1px solid ${color}`
              } }),
            React.createElement(
              'div',
              { className: 'vertical-bar-chart-caption-label' },
              entry.label
            )
          );
        })
      )
    );
  } else if (riskChart) {
    return React.createElement(
      'div',
      { className: 'vertical-bar-chart-caption-container vertical-bar-chart-caption-container-risk' },
      React.createElement(
        'div',
        { className: 'vertical-bar-chart-caption-content' },
        riskIndicatorArray.map((entry, index) => React.createElement(
          'div',
          { key: index, className: 'vertical-bar-chart-caption-item vertical-bar-chart-caption-risk' },
          React.createElement('div', { className: 'risk-indicator', style: { borderTopColor: entry.color } }),
          React.createElement(
            'div',
            { className: 'vertical-bar-chart-caption-label' },
            entry.label
          )
        ))
      )
    );
  }
  return null;
};

module.exports = ({ title, data, barSize = 90, barColors = defaultColors, multipleBars = false, riskChart = false, rotateLabels = false }) => {
  return React.createElement(
    'div',
    { className: 'vertical-bar-chart-container' },
    React.createElement(
      'div',
      { className: 'vertical-bar-chart-content' },
      React.createElement(
        'div',
        { className: 'vertical-bar-chart-title' },
        title
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          BarChart,
          { width: 700, height: 400, data: multipleBars ? data.values : data },
          React.createElement(CartesianGrid, { vertical: false, strokeDasharray: '3 0' }),
          React.createElement(YAxis, {
            dataKey: multipleBars || riskChart ? null : 'value',
            stroke: '#D43425',
            tick: { dx: -5, stroke: '#4A4A4A', fontSize: 9 },
            domain: [0, dataMax => Math.floor(dataMax * 1.1) + 1] /* Keep labels from being cut off by the top of the chart */
          }),
          React.createElement(XAxis, { type: 'category', dataKey: 'label', stroke: '#D43425', tick: { dy: 7, stroke: '#4A4A4A', fontSize: 9, marginTop: 2 } }),
          generateBars(data, { multipleBars, riskChart, barSize, barColors, rotateLabels })
        )
      )
    ),
    generateCaptions(data, { multipleBars, riskChart, barColors }),
    React.createElement(
      'style',
      null,
      verticalBarChartStyle
    )
  );
};