const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const TermsTable = require('./components/TermsTable');

let StudentActivitiesReport = class StudentActivitiesReport extends Component {
  render() {
    const {
      schoolSettings,
      startYear,
      startTerm,
      endYear,
      endTerm
    } = this.props.data;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(MultiTermReportTitle, {
        reportName: 'Student Activities Report',
        schoolSettings: schoolSettings,
        startYear: startYear,
        startTerm: startTerm,
        endYear: endYear,
        endTerm: endTerm
      })
    );
  }
};


module.exports = data => React.createElement(StudentActivitiesReport, { data: data });