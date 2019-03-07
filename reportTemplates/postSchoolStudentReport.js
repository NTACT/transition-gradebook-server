const React = require('react');

const {
  Component
} = React;

const SingleTermReportTitle = require('./components/SingleTermReportTitle');

const StudentStatusBar = require('./components/StudentStatusBar');

const Checkboxes = require('./components/Checkboxes');

class PostSchoolStudentReport extends Component {
  render() {
    const {
      schoolSettings,
      students,
      schoolYear,
      term
    } = this.props.data;
    return React.createElement(React.Fragment, null, students.map((student, index) => {
      const {
        studentInfo,
        exitCategory1,
        exitCategory2,
        exitCategory3,
        postSchoolOutcomes
      } = student;
      const {
        firstName,
        lastName
      } = studentInfo;
      return React.createElement(React.Fragment, {
        key: index
      }, React.createElement("div", null, React.createElement(SingleTermReportTitle, {
        reportName: `Student Report: ${firstName} ${lastName}`,
        schoolSettings: schoolSettings,
        schoolYear: schoolYear,
        term: term
      }), React.createElement(StudentStatusBar, {
        student: studentInfo
      })), React.createElement("div", {
        className: "post-school-report-checkboxes"
      }, React.createElement(Checkboxes, {
        title: "Exit Category",
        data: exitCategory1
      }), React.createElement(Checkboxes, {
        data: exitCategory2
      }), React.createElement(Checkboxes, {
        data: exitCategory3
      }), React.createElement(Checkboxes, {
        title: "Post-School Outcomes",
        data: postSchoolOutcomes
      })));
    }));
  }

}

module.exports = data => React.createElement(PostSchoolStudentReport, {
  data: data
});