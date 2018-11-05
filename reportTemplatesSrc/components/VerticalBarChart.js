const React = require('react');
const { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Text } = require('recharts');
const verticalBarChartStyle = require('../styles/verticalBarChart');
const { riskIndicatorArray } = require('../styles/riskIndicatorColors');
const defaultColors = require('../styles/chartColors');

const pickRepeatedColor = (index, barColors) => {
  const indexWithInitialOffset = index-1;
  if (indexWithInitialOffset % 2 === 0) return barColors[indexWithInitialOffset/2];
  else return barColors[Math.floor(indexWithInitialOffset/2+1)];
}

// displays up to 20 stripes
const DiagonalStripes = ({ x, y, height, width, stroke}) => (
  <svg x={x} y={y-0.75} width={width} height={height}>
    <rect x={0} y={0} height={height} width={width} stroke={stroke} fill='white' />
    <line stroke={stroke} strokeWidth={0.88} x1='397.12' y1='-454.68' x2='-426.58' y2='481.35'/>
    <line stroke={stroke} strokeWidth={0.88} x1='409.6' y1='-442.41' x2='-414.1' y2='493.62'/>
    <line stroke={stroke} strokeWidth={0.88} x1='422.08' y1='-430.14' x2='-401.62' y2='505.89'/>
    <line stroke={stroke} strokeWidth={0.88} x1='434.56' y1='-417.87' x2='-389.14' y2='518.16'/>
    <line stroke={stroke} strokeWidth={0.88} x1='447.04' y1='-405.6' x2='-376.66' y2='530.43'/>
    <line stroke={stroke} strokeWidth={0.88} x1='459.52' y1='-393.33' x2='-364.18' y2='542.7'/>
    <line stroke={stroke} strokeWidth={0.88} x1='472' y1='-381.06' x2='-351.7' y2='554.97'/>
    <line stroke={stroke} strokeWidth={0.88} x1='484.48' y1='-368.79' x2='-339.22' y2='567.24'/>
    <line stroke={stroke} strokeWidth={0.88} x1='496.96' y1='-356.52' x2='-326.74' y2='579.51'/>
    <line stroke={stroke} strokeWidth={0.88} x1='509.44' y1='-344.25' x2='-314.26' y2='591.78'/>
    <line stroke={stroke} strokeWidth={0.88} x1='521.92' y1='-331.98' x2='-301.78' y2='604.05'/>
    <line stroke={stroke} strokeWidth={0.88} x1='534.4' y1='-319.71' x2='-289.3' y2='616.32'/>
    <line stroke={stroke} strokeWidth={0.88} x1='546.88' y1='-307.44' x2='-276.82' y2='628.59'/>
    <line stroke={stroke} strokeWidth={0.88} x1='559.36' y1='-295.17' x2='-264.34' y2='640.86'/>
    <line stroke={stroke} strokeWidth={0.88} x1='571.84' y1='-282.9' x2='-251.86' y2='653.13'/>
    <line stroke={stroke} strokeWidth={0.88} x1='584.32' y1='-270.63' x2='-239.38' y2='665.4'/>
    <line stroke={stroke} strokeWidth={0.88} x1='596.8' y1='-258.36' x2='-226.9' y2='677.67'/>
    <line stroke={stroke} strokeWidth={0.88} x1='609.28' y1='-246.09' x2='-214.42' y2='689.94'/>
    <line stroke={stroke} strokeWidth={0.88} x1='621.76' y1='-233.82' x2='-201.94' y2='702.21'/>
    <line stroke={stroke} strokeWidth={0.88} x1='634.24' y1='-221.55' x2='-189.45' y2='714.48'/>
  </svg>
);

const CaptionDiagonalStripes = ({stroke}) => (
  <svg height={5} style={{marginBottom: 20}}>
    <rect x={0} y={0} height={5} width={45} stroke={stroke} fill='white' />
    <line stroke={stroke} strokeWidth={0.88} x1='397.12' y1='-454.68' x2='-426.58' y2='481.35'/>
    <line stroke={stroke} strokeWidth={0.88} x1='409.6' y1='-442.41' x2='-414.1' y2='493.62'/>
    <line stroke={stroke} strokeWidth={0.88} x1='422.08' y1='-430.14' x2='-401.62' y2='505.89'/>
  </svg>
);

const generateBars = (data, {multipleBars, riskChart, barSize, barColors, rotateLabels}) => {
  if (multipleBars) {
    return data.labels.map((entry, index) => {
      const color = pickRepeatedColor(index, barColors);
      return (
        <Bar key={entry.key} barSize={barSize} dataKey={entry.key} stroke={color} fill='white' shape={index % 2 === 0 ? <DiagonalStripes stroke={color} /> : null}>
          <LabelList content={props => {
            let distance = rotateLabels ? 5 : 0;
            if(rotateLabels && props.value >= 100) distance = 10;
            return (
              <text {...props}
                fontSize={9}
                dx={rotateLabels ? 0 : props.width / 2}
                dy={rotateLabels ? 0 : -5}
                textAnchor="middle"
                transform={rotateLabels ? `rotate(90 ${props.x + (props.width / 4)} ${props.y})` : null} 
                x={props.x - distance} y={props.y}
              >
                {props.value}
              </text>
            );
          }}/>
        </Bar>
      )
    });
  }
  else if (riskChart) {
    return riskIndicatorArray.map((entry, index) =>
      <Bar key={entry.key} barSize={barSize} dataKey={entry.key} shape={<DiagonalStripes stroke={entry.color} />}>
        <LabelList position='top' fontSize={9} />
      </Bar>
    );
  }
  return (
    <Bar barSize={barSize} dataKey='value' strokeWidth={2} shape={<DiagonalStripes stroke={barColors[0]}/>} >
      <LabelList position='top' fontSize={9} />
    </Bar>
  );
}

const generateCaptions = (data, {multipleBars, riskChart, barColors}) => {
  if (multipleBars) {
    return (
      <div className='vertical-bar-chart-caption-container'>
        <div className='vertical-bar-chart-caption-content'>
          {
            data.labels.map((entry, index) => {
              color = pickRepeatedColor(index, barColors);
              return (
                <div key={entry.key} className='vertical-bar-chart-caption-item'>
                  <div className='vertical-bar-chart-caption-color' style={{background: index % 2 !== 0 ? color : null}}>
                    {index % 2 === 0 && <CaptionDiagonalStripes stroke={color} />}
                  </div>
                  <div className='vertical-bar-chart-caption-label'>{entry.label}</div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
  else if (riskChart) {
    return (
      <div className='vertical-bar-chart-caption-container vertical-bar-chart-caption-container-risk'>
        <div className='vertical-bar-chart-caption-content'>
          {riskIndicatorArray.map((entry, index) =>
            <div key={index} className='vertical-bar-chart-caption-item vertical-bar-chart-caption-risk'>
              <div className='risk-indicator' style={{borderTopColor: entry.color}} />
              <div className='vertical-bar-chart-caption-label'>{entry.label}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

module.exports = ({title, data, barSize=90, barColors=defaultColors, multipleBars=false, riskChart=false, rotateLabels=false}) => {
  return (
    <div className='vertical-bar-chart-container'>
      <div className='vertical-bar-chart-content'>
        <div className='vertical-bar-chart-title'>
          {title}
        </div>
        <div>
          <BarChart width={700} height={400} data={multipleBars ? data.values : data}>
            <CartesianGrid vertical={false} strokeDasharray='3 0' />
            <YAxis
              dataKey={multipleBars || riskChart ? null : 'value'}
              stroke='#D43425'
              tick={{dx: -5, stroke: '#4A4A4A', fontSize: 9}}
              domain={[0, dataMax => Math.floor(dataMax * 1.1) + 1] /* Keep labels from being cut off by the top of the chart */ }
            />
            <XAxis type='category' dataKey='label' stroke='#D43425' tick={{dy: 7, stroke: '#4A4A4A', fontSize: 9, marginTop: 2}} />
            {generateBars(data, {multipleBars, riskChart, barSize, barColors, rotateLabels})}
          </BarChart>
        </div>
      </div>
      {generateCaptions(data, {multipleBars, riskChart, barColors})}
      <style>{verticalBarChartStyle}</style>
    </div>
  );
};
