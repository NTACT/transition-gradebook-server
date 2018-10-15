const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const TermsTable = require('./components/TermsTable');

let RiskSummaryReport = class RiskSummaryReport extends Component {
  render() {
    const {
      schoolSettings,
      riskFactors,
      studentNeeds,
      startYear,
      startTerm,
      endYear,
      endTerm
    } = this.props.data;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(MultiTermReportTitle, {
        reportName: 'Risk Summary Report',
        schoolSettings: schoolSettings,
        startYear: startYear,
        startTerm: startTerm,
        endYear: endYear,
        endTerm: endTerm
      }),
      React.createElement(TermsTable, { title: 'Risk Factors', data: riskFactors }),
      React.createElement(TermsTable, { title: 'Areas where students might need support or intervention', data: studentNeeds })
    );
  }
};


module.exports = data => React.createElement(RiskSummaryReport, { data: data });