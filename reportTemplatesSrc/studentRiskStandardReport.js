const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const StudentStatusBar = require('./components/StudentStatusBar');
const StudentStatusBarExtraInfo = require('./components/StudentStatusBarExtraInfo');
const StudentRiskFactorsList = require('./components/StudentRiskFactorsList');
const Checkboxes = require('./components/Checkboxes');
const studentRiskReportStyle = require('./styles/studentRiskReport');

class StudentRiskStandardReport extends Component {
  render() {
    const {
      schoolSettings,
      students,
      schoolYear,
      term,
    } = this.props.data;

    return (
      <React.Fragment>
        {students.map((student, i) => {
          const { studentInfo, riskFactors, studentNeeds } = student;
          const { firstName, lastName } = studentInfo;

          return (
            <div key={i} className='risk-student-report-content'>
              <SingleTermReportTitle 
                reportName={`Risk Report: ${firstName} ${lastName}`}
                schoolSettings={schoolSettings}
                schoolYear={schoolYear}
                term={term}
              />
              <StudentStatusBar student={studentInfo} />
              <StudentStatusBarExtraInfo student={studentInfo}  />
              <StudentRiskFactorsList title='Risk Factors' risk={studentInfo.risk} data={riskFactors} />
              <Checkboxes title='Areas where student might need support or intervention' data={studentNeeds} />
            </div>
          );
        })}
        <style>{studentRiskReportStyle}</style>
      </React.Fragment>
    );
  }
};

module.exports = (data) => <StudentRiskStandardReport data={data} />;
