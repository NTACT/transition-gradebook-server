const React = require('react');
const studentNeedsListStyle = require('../styles/studentNeedsList');

const Item = ({value, label}) => (
  <div className='needs-list-item'>
    <div className='needs-list-value'>
      <div>{value}</div>
    </div>
    <div className='needs-list-label'>{label}</div>
  </div>
);

module.exports = (props) => {
  const { title, data } = props;
  return (
    <div className="needs-list-root">
      <div className='needs-list-title'>{title}</div>
      <div className='needs-list-risk-title'>May need support/intervention in:</div>
      <div>
        <div className='needs-list'>
          {data.map(entry => <Item key={entry.label} value={entry.value} label={entry.label} />)}
        </div>
      </div>
      <style>{studentNeedsListStyle}</style>
    </div>
  )
};
