const React = require('react');
const activityOverTimeTable = require('../styles/activityOverTimeTable');

function displayValue(value, defaultValue = 'N/A') {
  if(value == null) return defaultValue;
  return value;
}

const TermsHeader = ({ title, terms }) => (
  <div className='activity-over-time-table-row activity-over-time-table-header'>
    <div className='activity-over-time-table-title'>{title}</div>
    <React.Fragment>
      {terms && terms.map((term, i) =>
        <div className='activity-over-time-table-header-label' key={i}>
          <div>{term.name}</div>
        </div>
      )}
    </React.Fragment>
  </div>
);

const TermsRow = ({ entry, height }) => {
  const {
    label,
    values,
  } = entry;
  return (
    <div className='activity-over-time-table-row activity-over-time-table-body' style={{ height }}>
      <div className='activity-over-time-table-label-container'>
        <div className='activity-over-time-table-label'>
          {label}
        </div>
      </div>
      {values.map((value, i) => 
        <div className='activity-over-time-table-value' key={i}>
          {displayValue(value)}
        </div>
      )}
    </div>
  );
};

module.exports = function ActivityOverTimeTable({ rows, title, rowHeight, terms}) {

  return (
    <React.Fragment>
      <style>{activityOverTimeTable}</style>
      <div className='activity-over-time-table'>
        <TermsHeader title={title} terms={terms} />
        {rows.map((entry, i) =>
          <TermsRow key={i} entry={entry}  eight={rowHeight} />
        )}
      </div>
    </React.Fragment>
  );
};
