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
    <rect x={0} y={0} height={height} width={width} stroke={stroke} fill={stroke} />
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
                  <div className='vertical-bar-chart-caption-color' style={{
                    background: index % 2 === 0 ? color : null,
                    border: `1px solid ${color}`
                  }}/>
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
