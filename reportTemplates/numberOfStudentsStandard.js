const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const VerticalBarChart = require('./components/VerticalBarChart');

let NumberOfStudentsStandard = class NumberOfStudentsStandard extends Component {
  render() {
    const {
      schoolSettings,
      term,
      schoolYear,
      postSchool,
      risks,
      skills,
      supportNeeded,
      roleInIEPMeeting,
      disabilities,
      activities
    } = this.props.data;

    return React.createElement(
      React.Fragment,
      null,
      postSchool && React.createElement(
        React.Fragment,
        null,
        React.createElement(SingleTermReportTitle, { reportName: `Number of Students - by Post-school Outcomes`, schoolSettings: schoolSettings, schoolYear: schoolYear, term: term }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: postSchool })
      ),
      risks && React.createElement(
        React.Fragment,
        null,
        React.createElement(SingleTermReportTitle, { reportName: `Number of Students - by Risk Level`, schoolSettings: schoolSettings, schoolYear: schoolYear, term: term }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: risks })
      ),
      skills && React.createElement(
        React.Fragment,
        null,
        React.createElement(SingleTermReportTitle, { reportName: `Number of Students - by Skills Training`, schoolSettings: schoolSettings, schoolYear: schoolYear, term: term }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: skills })
      ),
      supportNeeded && React.createElement(
        React.Fragment,
        null,
        React.createElement(SingleTermReportTitle, { reportName: `Number of Students - by Support Needs`, schoolSettings: schoolSettings, schoolYear: schoolYear, term: term }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: supportNeeded })
      ),
      roleInIEPMeeting && React.createElement(
        React.Fragment,
        null,
        React.createElement(SingleTermReportTitle, { reportName: `Number of Students - by Role in IEP Meeting`, schoolSettings: schoolSettings, schoolYear: schoolYear, term: term }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: roleInIEPMeeting })
      ),
      disabilities && React.createElement(
        React.Fragment,
        null,
        React.createElement(SingleTermReportTitle, { reportName: `Number of Students - by Disability`, schoolSettings: schoolSettings, schoolYear: schoolYear, term: term }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: disabilities, barSize: 20 })
      ),
      activities && React.createElement(
        React.Fragment,
        null,
        React.createElement(SingleTermReportTitle, { reportName: `Number of Students - by Activities`, schoolSettings: schoolSettings, schoolYear: schoolYear, term: term }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: activities })
      )
    );
  }
};


module.exports = data => React.createElement(NumberOfStudentsStandard, { data: data });