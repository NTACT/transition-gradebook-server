const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const StudentStatusBar = require('./components/StudentStatusBar');
const StudentStatusBarExtraInfo = require('./components/StudentStatusBarExtraInfo');
const ActivitiesTable = require('./components/ActivitiesTable');
const StudentRiskFactorsList = require('./components/StudentRiskFactorsList');
const Checkboxes = require('./components/Checkboxes');

const getTotalEvents = ({careerAwareness, paidWork, inclusion, support, collaboration}) => {
  return getEvents(careerAwareness) + getEvents(paidWork) + getEvents(inclusion) + getEvents(support) + getEvents(collaboration); 
}

const getEvents = (activities) => (activities || []).reduce((sum, value) => sum + value.events, 0);

class StudentReport extends Component {
  render() {
    const {
      schoolSettings,
      students,
      activitiesHeaders,
      schoolYear,
      term,
    } = this.props.data;

    return (
      <React.Fragment>
        {students.map((student, index) => {
          const {
            studentInfo,
            careerAwareness,
            paidWork,
            inclusion,
            support,
            collaboration,
            riskFactors,
            skills,
          } = student;
          const {
            firstName,
            lastName,
          } = studentInfo;
          const totalEventCount = getTotalEvents(student);
          
          return (
            <React.Fragment key={index}>
              <SingleTermReportTitle
                reportName={`Student Report: ${firstName} ${lastName}`}
                schoolSettings={schoolSettings}
                schoolYear={schoolYear}
                term={term}
              />
              <StudentStatusBar student={studentInfo} />
              <StudentStatusBarExtraInfo student={studentInfo} />
              <div className='activities-title'>Activities ({totalEventCount} total events)</div>
              <ActivitiesTable
                title='Career Awareness Activities'
                data={careerAwareness}
                activitiesHeaders={activitiesHeaders}
              />
              <ActivitiesTable
                title='Paid Work Activities'
                data={paidWork}
              />
              <ActivitiesTable
                title='Inclusion Activities'
                data={inclusion}
              />
              <ActivitiesTable
                title='Student Support Activities'
                data={support}
              />
              <ActivitiesTable
                title='Collaboration Activities'
                data={collaboration}
              />
              <StudentRiskFactorsList title='Risk Factors' risk={studentInfo.risk} data={riskFactors} />
              <Checkboxes title='Student Skills' data={skills} />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}

module.exports = (data) => <StudentReport data={data} />;
