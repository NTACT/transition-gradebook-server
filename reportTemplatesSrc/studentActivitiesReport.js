const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const TermsTable = require('./components/TermsTable');

class StudentActivitiesReport extends Component {
  render() {
    const {
      schoolSettings,
      startYear,
      startTerm,
      endYear,
      endTerm,
    } = this.props.data;

    return (
      <React.Fragment>
        <MultiTermReportTitle
          reportName='Student Activities Report'
          schoolSettings={schoolSettings}
          startYear={startYear}
          startTerm={startTerm}
          endYear={endYear}
          endTerm={endTerm}
        />

      </React.Fragment>
    );
  }
}

module.exports = (data) => <StudentActivitiesReport data={data} />;
