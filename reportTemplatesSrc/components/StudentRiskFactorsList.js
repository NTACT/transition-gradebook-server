const React = require('react');
const studentRiskFactorsListStyle = require('../styles/studentRiskFactorsList');

function formatValue(value) {
  if(value == null) return 'No Data';
  if(value === true) return 'Yes';
  if(value === false) return 'No';
  return value;
}

const Item = ({ label, value }) => (
  <div className='risk-list-item'>
    <div className='risk-list-item-value'>
      <div>{formatValue(value)}</div>
    </div>
    <div className='risk-list-item-label'>
      {label}
    </div>
  </div>
);

module.exports = ({title, risk, data}) => (
  <div className='risk-list'>
    <div className='risk-list-title'>
      <div className='risk-list-title-label'>{title}</div>
      <div className='risk-list-title-risk'>{risk}</div>
    </div>
    {data.map((entry, index) =>
      <Item key={entry.label} index={index} label={entry.label} value={entry.value} />
    )}
    <style>{studentRiskFactorsListStyle}</style>
  </div>
);
