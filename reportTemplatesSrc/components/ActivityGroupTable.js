const React = require('react');
const careerAwarenessActivitiesTableStyle = require('../styles/careerAwarenessActivitiesTable');

const sumRow = (data) => Object.keys(data).reduce((sum, key) => key === 'label' ? sum : sum + data[key], 0);

const sumArray = (data) => data.reduce((sum, row) => sum + sumRow(row), 0);

const ActivityHeader = ({grandTotal, title, header={}}) => {
  const {
    events,
    timePeriod,
    notes,
  } = header;
  return (
    <div className='activities-table-row activities-table-header'>
      <div className='activities-table-total'>
        {grandTotal}
      </div>
      <div className='activities-table-title'>
        {title}
      </div>
      <div className='activities-table-value'>
        One Time
      </div>
      <div className='activities-table-value'>
        Occassionally
      </div>
      <div className='activities-table-value'>
        2-4x/week
      </div>
      <div className='activities-table-value'>
        Daily
      </div>
      <div className='activities-table-value'>
        Weekly
      </div>
      <div className='activities-table-value'>
        Monthly
      </div>
      <div className='activities-table-value'>
        Quarterly
      </div>
      <div className='activities-table-value'>
        Every Semester
      </div>
      <div className='activities-table-value'>
        Annually
      </div>
    </div>
  )
};

const ActivityRow = ({entry}) => {
  const {
    label,
    oneTime,
    occasionally,
    veryFrequently,
    daily,
    weekly,
    monthly,
    quarterly,
    everySemester,
    annually,
  } = entry;
  const rowTotal = sumRow(entry);
  return (
    <div className='activities-table-row career-activities-table-row'>
      <div className='activities-table-total'>
        <div>{rowTotal}</div>
      </div>
      <div className='activities-table-label'>
        <div>{label}</div>
      </div>
      <div className='activities-table-value'>
        <div>{oneTime}</div>
      </div>
      <div className='activities-table-value'>
        <div>{occasionally}</div>
      </div>
      <div className='activities-table-value'>
        <div>{veryFrequently}</div>
      </div>
      <div className='activities-table-value'>
        <div>{daily}</div>
      </div>
      <div className='activities-table-value'>
        <div>{weekly}</div>
      </div>
      <div className='activities-table-value'>
        <div>{monthly}</div>
      </div>
      <div className='activities-table-value'>
        <div>{quarterly}</div>
      </div>
      <div className='activities-table-value'>
        <div>{everySemester}</div>
      </div>
      <div className='activities-table-value'>
        <div>{annually}</div>
      </div>
    </div>
  )
};

function ActivityGroupTable({data, title, splitAt, breakAfter, breakBefore, style}) {
  const grandTotal = sumArray(data);

  if(splitAt) {
    const firstHalf = data.slice(0, splitAt);
    const secondHalf = data.slice(splitAt);
    return (
      <React.Fragment>
        <ActivityGroupTable data={firstHalf} title={title} breakAfter/>
        <ActivityGroupTable data={secondHalf} breakAfter={breakAfter} breakBefore/>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div className='activities-table' style={{
        ...style, 
        pageBreakAfter: breakAfter ? 'always' : 'default',
        pageBreakBefore: breakBefore ? 'always' : 'default',
        pageBreakInside: 'avoid'
      }}>
        {title && <ActivityHeader grandTotal={grandTotal} title={title} />}
        {data.map(entry =>
          <ActivityRow key={entry.label} entry={entry}/>
        )}
      </div>
      <style>{careerAwarenessActivitiesTableStyle}</style>
    </React.Fragment>
  )
};

module.exports = ActivityGroupTable;
