const React = require('react');
const { Component } = React;
const ReportTitle = require('./components/ReportTitle');
const VerticalBarChart = require('./components/VerticalBarChart');
const MultiTermReportTitle = require('./components/MultiTermReportTitle');

let NumberOfStudentsLongitudinal = class NumberOfStudentsLongitudinal extends Component {
  render() {
    const {
      schoolSettings,
      postSchool,
      risks,
      skills,
      supportNeeded,
      roleInIEPMeeting,
      disabilities,
      activities,
      genders,
      races,
      startYear,
      startTerm,
      endYear,
      endTerm
    } = this.props.data;

    return React.createElement(
      React.Fragment,
      null,
      races && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Race, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: races, barSize: 15, multipleBars: true })
      ),
      genders && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Gender, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: genders, barSize: 25, multipleBars: true })
      ),
      postSchool && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Post-school Outcomes, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: postSchool, barSize: 25, multipleBars: true })
      ),
      risks && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Risk Level, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: risks, barSize: 25, riskChart: true, multipleBars: true })
      ),
      skills && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Skills Training, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: skills, barSize: 25, multipleBars: true })
      ),
      supportNeeded && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Support Needs, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: supportNeeded, barSize: 25, multipleBars: true })
      ),
      roleInIEPMeeting && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Role in IEP Meeting, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: roleInIEPMeeting, barSize: 25, multipleBars: true })
      ),
      disabilities && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Disability, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: disabilities, barSize: 10, multipleBars: true, rotateLabels: true })
      ),
      activities && React.createElement(
        React.Fragment,
        null,
        React.createElement(MultiTermReportTitle, {
          reportName: `Number of Students - by Activities, over time`,
          schoolSettings: schoolSettings,
          startYear: startYear,
          startTerm: startTerm,
          endYear: endYear,
          endTerm: endTerm
        }),
        React.createElement(VerticalBarChart, { title: 'Number of Students', data: activities, barSize: 25, multipleBars: true })
      )
    );
  }
};


module.exports = data => React.createElement(NumberOfStudentsLongitudinal, { data: data });