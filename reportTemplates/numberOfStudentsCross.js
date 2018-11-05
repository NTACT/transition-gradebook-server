const React = require('react');
const { Component } = React;
const VerticalBarChart = require('./components/VerticalBarChart');
const SingleTermReportTitle = require('./components/SingleTermReportTitle');

let NumberOfStudentsCross = class NumberOfStudentsCross extends Component {
  render() {
    const {
      reportName,
      schoolSettings,
      data,
      schoolYear,
      term,
      barSize
    } = this.props.data;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(SingleTermReportTitle, {
        reportName: reportName,
        schoolSettings: schoolSettings,
        schoolYear: schoolYear,
        term: term
      }),
      React.createElement(VerticalBarChart, { title: 'Number of Students (Cross)', data: data, barSize: barSize || 5, multipleBars: true })
    );
  }
};


module.exports = data => React.createElement(NumberOfStudentsCross, { data: data });