const React = require('react');
const AtRisk = require('./AtRisk');
const checkboxesStyle = require('../styles/checkboxes');

const Checkbox = ({value, label}) =>
  <div key={label} className='checkbox-item'>
    <div className='checkbox-value'>
      <div>{value && <AtRisk />}</div>
    </div>
    <div className='checkbox-label'>{label}</div>
  </div>

module.exports = ({ data, title, ...rest }) => {
  return (
    <div className='checkboxes-container' {...rest}>
      <div className='checkboxes-title'>
        {title}
      </div>
      <div className='checkboxes'>
        {data.map(entry =>
          <Checkbox key={entry.label} value={entry.value} label={entry.value ? (entry.otherValue || entry.label) : entry.label} />
        )}
      </div>
      <style>{checkboxesStyle}</style>
    </div>
  )
};
