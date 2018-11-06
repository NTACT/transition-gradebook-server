const React = require('react');
const { first, capitalize } = require('lodash');
const studentStatusBarStyle = require('../styles/studentStatusBar');
const { riskIndicatorKeys } = require('../styles/riskIndicatorColors');

module.exports = ({ student }) => {
  const {
    studentId,
    firstName,
    lastName,
    gender,
    grade,
    disabilities,
    ell,
    risk,
  } = student;
  let riskColor = null;

  if (risk) {
    riskColor = riskIndicatorKeys[risk].value;
  }
  return (
    <div className='student-status-bar'>
      <div className="student-status-bar-row">
        <div className='student-status-bar-info'>
          <div className='student-status-bar-label'>ID</div>
          <div>{studentId}</div>
        </div>
        <div className='student-status-bar-info'>
          <div className='student-status-bar-label'>Name</div>
          <div>{capitalize(firstName)} {capitalize(lastName)}</div>
        </div>
        <div className='student-status-bar-info'>
          <div className='student-status-bar-label'>Gender</div>
          <div>{capitalize(first(gender))}</div>
        </div>
        <div className='student-status-bar-info'>
          <div className='student-status-bar-label'>Grade/Age</div>
          <div>{grade}</div>
        </div>
        <div className='student-status-bar-info'>
          <div className='student-status-bar-label'>ELL</div>
          <div>{(ell && 'Yes') || 'No'}</div>
        </div>
        <div className='risk-indicator' style={{borderTopColor: riskColor}} />
      </div>
      <div className="student-status-bar-row">
        <div className='student-status-bar-info'>
          <div className='student-status-bar-label'>Category</div>
          <div>{disabilities && disabilities.map(disability => {
            if(typeof disability === 'object') disability = disability.name;
            return (
              <span key={disability} className='student-status-bar-disability'>{disability}</span>
            );
          })}</div>
        </div>
      </div>
      <style>{studentStatusBarStyle}</style>
    </div>
  )
};
