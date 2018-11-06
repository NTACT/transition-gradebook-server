const React = require('react');
const { Component } = React;
const VerticalBarChart = require('./components/VerticalBarChart');
const SingleTermReportTitle = require('./components/SingleTermReportTitle');

class NumberOfStudentsCross extends Component {
  render() {
    const {
      reportName,
      schoolSettings,
      data,
      schoolYear,
      term,
      barSize,
    } = this.props.data;

    return (
      <React.Fragment>
        <SingleTermReportTitle
          reportName={reportName}
          schoolSettings={schoolSettings}
          schoolYear={schoolYear}
          term={term}
        />
        <VerticalBarChart title='Number of Students (Cross)' data={data} barSize={barSize || 5} multipleBars />
      </React.Fragment>
    );
  }
}

module.exports = (data) => <NumberOfStudentsCross data={data} />;
