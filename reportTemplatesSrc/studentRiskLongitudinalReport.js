const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const StudentStatusBar = require('./components/StudentStatusBar');
const TermsTable = require('./components/TermsTable');
const studentRiskReportStyle = require('./styles/studentRiskReport');

class StudentRiskLongitudinalReport extends Component {
  render() {
    const {
      schoolSettings,
      students,
      startYear,
      startTerm,
      endYear,
      endTerm,
    } = this.props.data;

    return (
      <React.Fragment>
        {students.map((student, i) => {
          const { studentInfo, riskFactors, studentNeeds } = student;
          const { firstName, lastName } = studentInfo;
          return (
            <React.Fragment key={i}>
              <MultiTermReportTitle
                reportName={`Risk Report: ${firstName} ${lastName}`}
                schoolSettings={schoolSettings}
                startYear={startYear}
                startTerm={startTerm}
                endYear={endYear}
                endTerm={endTerm}
              />
              <StudentStatusBar student={studentInfo} />
              <TermsTable title='Risk Factors' data={riskFactors} rowHeight={23} />
              <TermsTable title='Areas where student might need support or intervention' data={studentNeeds} rowHeight={20} useIcons />
            </React.Fragment>
          );
        })}
        <style>{studentRiskReportStyle}</style>
      </React.Fragment>
    );
  }
};

module.exports = (data) => <StudentRiskLongitudinalReport data={data} />;
