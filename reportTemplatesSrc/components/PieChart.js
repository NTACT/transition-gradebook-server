const React = require('react');
const pieChartStyle = require('../styles/pieChart');
const PieChart = require('react-minimal-pie-chart');
const { pieChartColors } = require('../styles/chartColors');

const addColorScheme = (list) =>
  list.map((item, index) => ({
    ...item,
    color: pieChartColors[index],
  }));

const keySortFn = (a, b) => b.value - a.value;

module.exports = function PieChartWrapper(props) {
  const {
    title,
    data, // an array where each element is an object with a 'label' and a 'value' property
    isAbsolute=true, // default: expects values to be absolute numbers (they will be summed to get the total)
    isPercentage=false, // if true, expects the values to represent a portion of 100%
    isRatio=false, // if true, the sum of the values must be equal to 1
    diameter=100,
    width,
  } = props;
  const values = isAbsolute && data.map(entry => Number(entry.value));
  const total = isAbsolute && values.reduce((sum, value) => sum + value, 0);
  return (
    <React.Fragment>
      <div className='piechart-container' style={{...width}}>
        <div className='piechart-title'>{title}</div>
        <div className='piechart-caption-and-chart'>
            <div className='piechart-caption'>
              {data.sort(keySortFn).map((entry, i) =>
                <div key={entry.label} className='piechart-caption-item'>
                    <span className='piechart-label'>
                      <div className="piechart-label-icon" style={{backgroundColor: pieChartColors[i]}}/>
                      {entry.label}
                    </span>
                    <span className='piechart-value'>
                        {isPercentage ? '' : <span>{entry.value}&nbsp;</span>}
                        ({
                            (isRatio && Math.round(entry.value * 100)) 
                            || (isPercentage && Math.round(entry.value))
                            || ((isAbsolute && total > 0 && Math.round(entry.value / total * 100)) || 0)
                        }%)
                    </span>
                </div>
              )}
            </div>
            <PieChart
              data={addColorScheme(data)}
              style={{width: diameter, height: diameter}}
              startAngle={90} />
        </div>
      </div>
      <style>{pieChartStyle}</style>
    </React.Fragment>
  );
};
