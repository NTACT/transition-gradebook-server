const React = require('react');
const { truncate } = require('lodash');
const activitiesTableStyle = require('../styles/activitiesTable');

const ActivityHeader = ({ total, title, header={} }) => {
  const {
    events,
    frequency,
    notes,
  } = header;
  return (
    <div className='activities-table-row activities-table-header'>
      <div className='activities-table-title'>
        <span className='activities-table-total'>{total}</span>
        {title}
      </div>
      <div className='activities-table-value activities-table-events'>
        {events}
      </div>
      <div className='activities-table-value activities-table-frequency'>
        {frequency}
      </div>
      <div className='activities-table-notes'>
        {notes}
      </div>
    </div>
  )
}

const ActivityRow = ({entry}) => {
  const {
    label,
    events,
    frequency,
    notes,
  } = entry;

  return (
    <div className='activities-table-row'>
      <div className='activities-table-label'>
        <div>{label}</div>
      </div>
      <div className='activities-table-value activities-table-events'>
        <div>{events}</div>
      </div>
      <div className='activities-table-value activities-table-frequency'>
        <div>{frequency}</div>
      </div>
      <div className='activities-table-notes'>
        <div>{truncate(notes, {length: 80, omission: '...'})}</div>
      </div>
    </div>
  )
}

module.exports = ({data, activitiesHeaders, title}) => {
  const total = data.reduce((sum, activity) => sum + activity.events, 0);
  return (
    <React.Fragment>
      <div className='activities-table'>
        {<ActivityHeader total={total} title={title} header={activitiesHeaders} />}
        {data.map((entry, i) =>
          <ActivityRow key={i} entry={entry} />
        )}
      </div>
      <style>{activitiesTableStyle}</style>
    </React.Fragment>
  )
}
