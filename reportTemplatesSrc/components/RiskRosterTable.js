const React = require('react');
const { first, capitalize, chunk, truncate } = require('lodash');
const riskRosterTableStyle = require('../styles/riskRosterTable');
const { riskIndicatorKeys } = require('../styles/riskIndicatorColors');
const AtRisk = require('./AtRisk');

const generatePlaceholders = (count) => {
  let placeholders = [];
  for (index = 0; index < count; index++) {
    placeholders.push(<Placeholder key={index} />);
  }
  return placeholders;
}

const Placeholder = () => <div className='risk-roster-placeholder'/>;
const Spacer = () => <div className='risk-roster-spacer' />;


const RiskRosterHeader = () => 
  <div className='risk-roster-row risk-roster-header'>
    <div className='risk-roster-header-student risk-roster-indicator'></div>
    <div className='risk-roster-header-student risk-roster-name'>
      ID/Name
    </div>
    <div className='risk-roster-header-student'>
      Gender
    </div>
    <div className='risk-roster-header-student'>
      Race
    </div>
    <div className='risk-roster-header-student'>
      Grade/Age
    </div>
    <div className='risk-roster-header-student'>
      Category
    </div>
    <div className='risk-roster-header-student risk-roster-ell'>
      ELL
    </div>
    <div className='risk-roster-header-risk'>
      Attendance
    </div>
    <div className='risk-roster-header-risk'>
      Behavior
    </div>
    <div className='risk-roster-header-risk'>
      Engagement
    </div>
    <div className='risk-roster-header-risk'>
      English/ELA
    </div>
    <div className='risk-roster-header-risk'>
      Math
    </div>
  </div>

const RiskRosterRow = ({ studentTermInfo }) => {
  const {
    studentId,
    firstName,
    lastName,
    gender,
    race,
    gradeLevel,
    disabilities,
    ell,
    risk,
    interventions,
  } = studentTermInfo;

  const {
    attendance,
    behavior,
    engagement,
    english,
    math,
  } = interventions;

  const riskMetric = riskIndicatorKeys[risk];
  const {
    value,
    label,
  } = riskMetric;

  return (
    <div className='risk-roster-row'>
      <div className='risk-roster-indicator'>
        <div className='risk-indicator-container'>
          <div className='risk-indicator' style={{borderTopColor: value}}></div>
        </div>
        <div className='risk-indicator-label'>({label})</div>
      </div>
      <div className='risk-roster-name'>
        <div>
          <div>{studentId}</div>
          <div><b>{truncate(capitalize(firstName) + ' ' + capitalize(lastName), {length: 25})}</b></div>
        </div>
      </div>
      <div className='risk-roster-student'>
        {capitalize(first(gender))}
      </div>
      <div className="risk-roster-student">
        {race}
      </div>
      <div className='risk-roster-student'>
        {gradeLevel}
      </div>
      <div className='risk-roster-student'>
        {disabilities && chunk(disabilities, 4).map((disabilities, i) =>
          <React.Fragment key={i}>
            {i ? <br/> : ''}
            {disabilities.map(d => d.name).join('/')}
          </React.Fragment>
        )}
      </div>
      <div className='risk-roster-student risk-roster-ell'>
        {(ell && 'Yes') || 'No'}
      </div>
      <div className='risk-roster-risk'>
        {attendance && <AtRisk/>}
      </div>
      <div className='risk-roster-risk'>
        {behavior && <AtRisk/>}
      </div>
      <div className='risk-roster-risk'>
        {engagement && <AtRisk/>}
      </div>
      <div className='risk-roster-risk'>
        {english && <AtRisk/>}
      </div>
      <div className='risk-roster-risk'>
        {math && <AtRisk/>}
      </div>
    </div>
  )
}

module.exports = ({data, maxCount, pageNumber}) =>
  <React.Fragment>
    <div className='risk-roster-table'>
      <RiskRosterHeader />
      {data.map((studentTermInfo, index) =>
        <RiskRosterRow key={index} studentTermInfo={studentTermInfo} />
      )}
      {data.length < maxCount && generatePlaceholders(maxCount - data.length)}
      {pageNumber > 1 && <Spacer/>}
    </div>
    <style>{riskRosterTableStyle}</style>
  </React.Fragment>
