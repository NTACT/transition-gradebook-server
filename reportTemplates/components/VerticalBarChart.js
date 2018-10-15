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
  React.createElement('rect', { x: 0, y: 0, height: height, width: width, stroke: stroke, fill: 'white' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '397.12', y1: '-454.68', x2: '-426.58', y2: '481.35' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '409.6', y1: '-442.41', x2: '-414.1', y2: '493.62' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '422.08', y1: '-430.14', x2: '-401.62', y2: '505.89' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '434.56', y1: '-417.87', x2: '-389.14', y2: '518.16' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '447.04', y1: '-405.6', x2: '-376.66', y2: '530.43' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '459.52', y1: '-393.33', x2: '-364.18', y2: '542.7' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '472', y1: '-381.06', x2: '-351.7', y2: '554.97' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '484.48', y1: '-368.79', x2: '-339.22', y2: '567.24' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '496.96', y1: '-356.52', x2: '-326.74', y2: '579.51' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '509.44', y1: '-344.25', x2: '-314.26', y2: '591.78' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '521.92', y1: '-331.98', x2: '-301.78', y2: '604.05' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '534.4', y1: '-319.71', x2: '-289.3', y2: '616.32' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '546.88', y1: '-307.44', x2: '-276.82', y2: '628.59' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '559.36', y1: '-295.17', x2: '-264.34', y2: '640.86' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '571.84', y1: '-282.9', x2: '-251.86', y2: '653.13' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '584.32', y1: '-270.63', x2: '-239.38', y2: '665.4' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '596.8', y1: '-258.36', x2: '-226.9', y2: '677.67' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '609.28', y1: '-246.09', x2: '-214.42', y2: '689.94' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '621.76', y1: '-233.82', x2: '-201.94', y2: '702.21' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '634.24', y1: '-221.55', x2: '-189.45', y2: '714.48' })
);

const CaptionDiagonalStripes = ({ stroke }) => React.createElement(
  'svg',
  { height: 5, style: { marginBottom: 20 } },
  React.createElement('rect', { x: 0, y: 0, height: 5, width: 45, stroke: stroke, fill: 'white' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '397.12', y1: '-454.68', x2: '-426.58', y2: '481.35' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '409.6', y1: '-442.41', x2: '-414.1', y2: '493.62' }),
  React.createElement('line', { stroke: stroke, strokeWidth: 0.88, x1: '422.08', y1: '-430.14', x2: '-401.62', y2: '505.89' })
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
            React.createElement(
              'div',
              { className: 'vertical-bar-chart-caption-color', style: { background: index % 2 !== 0 ? color : null } },
              index % 2 === 0 && React.createElement(CaptionDiagonalStripes, { stroke: color })
            ),
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