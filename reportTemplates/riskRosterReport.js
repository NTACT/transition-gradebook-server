const React = require('react');
const { chunk } = require('lodash');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const RiskRosterTable = require('./components/RiskRosterTable');

let RiskRosterReport = class RiskRosterReport extends Component {
  render() {
    const {
      schoolSettings,
      inSchoolStudents,
      term,
      schoolYear,
      appliedFilters
    } = this.props.data;
    const firstChunk = inSchoolStudents.slice(0, 10);
    const remainingChunks = chunk(inSchoolStudents.slice(10), 12);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(SingleTermReportTitle, {
        reportName: 'Risk Roster Report',
        schoolSettings: schoolSettings,
        schoolYear: schoolYear,
        term: term,
        appliedFilters: appliedFilters
      }),
      React.createElement(RiskRosterTable, { data: firstChunk, maxCount: 10 }),
      remainingChunks.map((studentGroup, index) => React.createElement(RiskRosterTable, { key: index, data: studentGroup, maxCount: 12 }))
    );
  }
};


module.exports = data => React.createElement(RiskRosterReport, { data: data });