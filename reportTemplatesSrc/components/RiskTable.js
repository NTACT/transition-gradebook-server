const React = require('react');
const riskTableStyle = require('../styles/riskTable');
const riskIndicatorColors = require('../styles/riskIndicatorColors');

module.exports = ({ data }) => (
  <React.Fragment>
    <div className='risk-table'>
      {data.map((entry, index) =>
        <div key={entry.label} className='risk-table-cell'>
          <div className='risk-indicator' style={{borderTopColor: riskIndicatorColors[index]}}/>
          <div className='risk-table-label-and-value'>
            <div className='risk-table-label'>{entry.label}</div>
            <div className='risk-table-value'>{entry.value}</div>
          </div>
        </div>
      )}
    </div>
    <style>{riskTableStyle}</style>
  </React.Fragment>
);
