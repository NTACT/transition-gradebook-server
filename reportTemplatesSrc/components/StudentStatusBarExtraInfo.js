const React = require('react');
const studentStatusBarExtraInfoStyle = require('../styles/studentStatusBarExtraInfo');

module.exports = ({student}) => {
  const {
    iep,
    hasGraduationPlan,
  } = student;
  const {
    attended,
    roleDetails,
  } = iep;

  return (
    <React.Fragment>
      <div className='risk-student-extra'>
        <div className='risk-student-extra-item'>
          <div>Attended IEP Meeting:</div>
          <div className='risk-student-extra-value'>{formatBool(attended)}{attended === true ? ` - ${roleDetails}` : ''}</div>
        </div>
        <div className='risk-student-extra-item'>
          <div>Career Development/Graduation Plan:</div>
          <div className='risk-student-extra-value'>{formatBool(hasGraduationPlan)}</div>
        </div>
      </div>
      <style>{studentStatusBarExtraInfoStyle}</style>
    </React.Fragment>
  )
}

function formatBool(bool) {
  if(bool === true) return 'Yes';
  if(bool === false) return 'No';
  return 'No Data';
}
