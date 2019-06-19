const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const StudentStatusBar = require('./components/StudentStatusBar');
const StudentStatusBarExtraInfo = require('./components/StudentStatusBarExtraInfo');
const ActivitiesTable = require('./components/ActivitiesTable');
const StudentRiskFactorsList = require('./components/StudentRiskFactorsList');
const Checkboxes = require('./components/Checkboxes');
const HeaderTextbox = require('./components/HeaderTextbox'); 

const getTotalEvents = ({
  careerAwareness,
  paidWork,
  inclusion,
  support,
  collaboration
}) => {
  return (
    getEvents(careerAwareness) +
    getEvents(paidWork) +
    getEvents(inclusion) +
    getEvents(support) +
    getEvents(collaboration)
  );
};

const getEvents = activities =>
  (activities || []).reduce((sum, value) => sum + value.events, 0);

const getFormattedTermType = term => {
  const { termType } = term;
  if(termType === 'annual') {
    return 'SCHOOL YEAR';
  }
  return termType && termType.toUpperCase();
}

class StudentReport extends Component {
  render() {
    const {
      schoolSettings,
      students,
      activitiesHeaders,
      schoolYear,
      term
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
            studentNeeds,
          } = student;
          const { firstName, lastName, postSchoolGoals} = studentInfo;
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
              <div className="activities-title">
                Activities ({totalEventCount} total events)
              </div>
              <ActivitiesTable
                title="Career Awareness Activities"
                data={careerAwareness}
                activitiesHeaders={activitiesHeaders}
              />
              <ActivitiesTable title="Paid Work Activities" data={paidWork} />
              <ActivitiesTable title="Inclusion Activities" data={inclusion} />
              <ActivitiesTable
                title="Student Support Activities"
                data={support}
              />
              <ActivitiesTable
                title="Collaboration Activities"
                data={collaboration}
              />
              <StudentRiskFactorsList
                title="Risk Factors"
                risk={studentInfo.risk}
                data={riskFactors}
              />
              <Checkboxes
                title="Areas where student might need support or intervention"
                data={studentNeeds}
                style={{ marginBottom: 50 }}
              />
              <Checkboxes title={`SKILLS TRAININGS RECEIVED THIS ${getFormattedTermType(term)}`} data={skills} style={{marginBottom: 50}} />
              <HeaderTextbox title="POST-SCHOOL GOALS" data={postSchoolGoals} />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}

module.exports = data => <StudentReport data={data} />;
