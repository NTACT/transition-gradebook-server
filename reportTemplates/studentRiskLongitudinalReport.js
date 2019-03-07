const React = require('react');

const {
  Component
} = React;

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
      endTerm
    } = this.props.data;
    return React.createElement(React.Fragment, null, students.map((student, i) => {
      const {
        studentInfo,
        riskFactors,
        studentNeeds
      } = student;
      const {
        firstName,
        lastName
      } = studentInfo;
      return React.createElement(React.Fragment, {
        key: i
      }, React.createElement(MultiTermReportTitle, {
        reportName: `Risk Report: ${firstName} ${lastName}`,
        schoolSettings: schoolSettings,
        startYear: startYear,
        startTerm: startTerm,
        endYear: endYear,
        endTerm: endTerm
      }), React.createElement(StudentStatusBar, {
        student: studentInfo
      }), React.createElement(TermsTable, {
        title: "Risk Factors",
        data: riskFactors,
        rowHeight: 23
      }), React.createElement(TermsTable, {
        title: "Areas where student might need support or intervention",
        data: studentNeeds,
        rowHeight: 20,
        useIcons: true
      }));
    }), React.createElement("style", null, studentRiskReportStyle));
  }

}

;

module.exports = data => React.createElement(StudentRiskLongitudinalReport, {
  data: data
});