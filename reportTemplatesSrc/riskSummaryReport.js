const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const TermsTable = require('./components/TermsTable');

class RiskSummaryReport extends Component {
  render() {
    const {
      schoolSettings,
      riskFactors,
      studentNeeds,
      startYear,
      startTerm,
      endYear,
      endTerm,
    } = this.props.data;

    return (
      <React.Fragment>
        <MultiTermReportTitle
          reportName='Risk Summary Report'
          schoolSettings={schoolSettings}
          startYear={startYear}
          startTerm={startTerm}
          endYear={endYear}
          endTerm={endTerm}
        />
        <TermsTable title='Risk Factors' data={riskFactors} />
        <TermsTable title='Areas where students might need support or intervention' data={studentNeeds} />
      </React.Fragment>
    );
  }
}

module.exports = (data) => <RiskSummaryReport data={data} />;
