const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const StudentStatusBar = require('./components/StudentStatusBar');
const Checkboxes = require('./components/Checkboxes');

class PostSchoolStudentReport extends Component {
  render() {
    const {
      schoolSettings,
      students,
      schoolYear,
      term,
    } = this.props.data;

    return (
      <React.Fragment>
        {students.map((student, index) => {
          const {
            studentInfo,
            exitCategory1,
            exitCategory2,
            exitCategory3,
            postSchoolOutcomes,
          } = student;
          const {
            firstName,
            lastName,
          } = studentInfo;
          return (
            <React.Fragment key={index}>
              <div>
                <SingleTermReportTitle 
                  reportName={`Student Report: ${firstName} ${lastName}`}
                  schoolSettings={schoolSettings}
                  schoolYear={schoolYear}
                  term={term}
                />
                <StudentStatusBar student={studentInfo} />
              </div>
              <div className='post-school-report-checkboxes'>
                <Checkboxes title='Exit Category' data={exitCategory1} />
                <Checkboxes data={exitCategory2} />
                <Checkboxes data={exitCategory3} />
                <Checkboxes title='Post-School Outcomes' data={postSchoolOutcomes} />
              </div>
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}

module.exports = data => <PostSchoolStudentReport data={data} />;
