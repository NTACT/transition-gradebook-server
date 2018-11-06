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

function CaptionDiagonalStripes({ stroke }) {
  return (
    <svg height={5} style={{ marginBottom: 20 }}>
      <rect x={0} y={0} height={5} width={45} stroke={stroke} fill='white' />
      <line stroke={stroke} strokeWidth={0.88} x1='397.12' y1='-454.68' x2='-426.58' y2='481.35'/>
      <line stroke={stroke} strokeWidth={0.88} x1='409.6' y1='-442.41' x2='-414.1' y2='493.62'/>
      <line stroke={stroke} strokeWidth={0.88} x1='422.08' y1='-430.14' x2='-401.62' y2='505.89'/>
    </svg>
  );
};

module.exports = function StripeBar({ index }) {
  const color = pickRepeatedColor(index, defaultColors);
  return (
    <div className="stripe-bar" style={{
      background: index % 2 !== 0 ? color : null,
      width: 45,
      height: 5,
    }}>
      {index % 2 === 0 && <CaptionDiagonalStripes stroke={color} />}
    </div>
  );
}
