const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const GradeAndAgeTable = require('./components/GradeAndAgeTable');
const DisabilityTable = require('./components/DisabilityTable');
const RiskTable = require('./components/RiskTable');
const ChartContainer = require('./components/ChartContainer');
const PieChart = require('./components/PieChart');
const HorizontalBarChart = require('./components/HorizontalBarChart');
const StudentNeedsList = require('./components/StudentNeedsList');
const ActivityGroupTable = require('./components/ActivityGroupTable');

let SummaryReport = class SummaryReport extends Component {
  render() {
    const {
      schoolSettings,
      schoolYear,
      term,
      gradeAndAgeRepartition,
      disabilityRepartition,
      riskRepartition,
      roleInIEPMeeting,
      receivedSkillsTraining,
      gender,
      race,
      cdgp,
      attendedIEPMeeting,
      studentNeeds,
      careerAwarenessActivities,
      workExperienceActivities,
      inclusionActivities,
      studentSupportsActivities,
      collaborationActivities
    } = this.props.data;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(SingleTermReportTitle, {
        reportName: 'Summary Report',
        schoolSettings: schoolSettings,
        schoolYear: schoolYear,
        term: term
      }),
      React.createElement(GradeAndAgeTable, { data: gradeAndAgeRepartition }),
      React.createElement(DisabilityTable, { data: disabilityRepartition }),
      React.createElement(RiskTable, { data: riskRepartition }),
      React.createElement(
        ChartContainer,
        null,
        React.createElement(HorizontalBarChart, { title: 'Role in IEP Meeting', data: roleInIEPMeeting }),
        React.createElement(HorizontalBarChart, { title: 'Received Skills Training', data: receivedSkillsTraining })
      ),
      React.createElement(
        ChartContainer,
        null,
        React.createElement(PieChart, { title: 'Gender', data: gender, diameter: 100 }),
        React.createElement(PieChart, { title: 'Career Development or Graduation Plan', data: cdgp, diameter: 100 }),
        React.createElement(PieChart, { title: 'Attended IEP Meeting', data: attendedIEPMeeting, diameter: 100 })
      ),
      React.createElement(StudentNeedsList, { title: 'Number of Students', data: studentNeeds }),
      React.createElement(ActivityGroupTable, { title: 'Career Awareness Activities', data: careerAwarenessActivities }),
      React.createElement(ActivityGroupTable, { title: 'Work Experience Activities', data: workExperienceActivities }),
      React.createElement(ActivityGroupTable, { title: 'Inclusion Activities', data: inclusionActivities, style: { marginBottom: 50 } }),
      React.createElement(ActivityGroupTable, { title: 'Student Supports Activities', data: studentSupportsActivities }),
      React.createElement(ActivityGroupTable, { title: 'Collaboration Activities', data: collaborationActivities })
    );
  }
};


module.exports = data => React.createElement(SummaryReport, { data: data });