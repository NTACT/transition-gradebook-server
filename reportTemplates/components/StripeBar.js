const React = require('react');

const defaultColors = require('../styles/chartColors');

function pickRepeatedColor(index, barColors) {
  const indexWithInitialOffset = index - 1;

  if (indexWithInitialOffset % 2 === 0) {
    return barColors[indexWithInitialOffset / 2];
  } else {
    return barColors[Math.floor(indexWithInitialOffset / 2 + 1)];
  }
}

function CaptionDiagonalStripes({
  stroke
}) {
  return React.createElement("svg", {
    height: 5,
    style: {
      marginBottom: 20
    }
  }, React.createElement("rect", {
    x: 0,
    y: 0,
    height: 5,
    width: 45,
    stroke: stroke,
    fill: stroke
  }));
}

;

module.exports = function StripeBar({
  index
}) {
  const color = pickRepeatedColor(index, defaultColors);
  return React.createElement("div", {
    className: "stripe-bar",
    style: {
      background: index % 2 === 0 ? color : null,
      border: `1px solid ${color}`,
      width: 45,
      height: 5
    }
  }, index % 2 === 0 && React.createElement(CaptionDiagonalStripes, {
    stroke: color
  }));
};