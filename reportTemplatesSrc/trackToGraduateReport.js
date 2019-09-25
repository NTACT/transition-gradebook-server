const React = require('react');
const { chunk } = require('lodash');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const OnTrackToGraduateTable = require('./components/OnTrackToGraduateTable');

class TrackToGraduateReport extends Component {
  render() {
    const {
      schoolSettings,
      inSchoolStudents,
      term,
      schoolYear,
      appliedFilters,
    } = this.props.data;
    const firstChunk = inSchoolStudents.slice(0, 10);
    const remainingChunks = chunk(inSchoolStudents.slice(10), 12);

    return (
      <React.Fragment>
        <SingleTermReportTitle 
          reportName='On Track to Graduate Report'
          schoolSettings={schoolSettings}
          schoolYear={schoolYear}
          term={term}
          appliedFilters={appliedFilters}
        />
        <OnTrackToGraduateTable data={firstChunk} maxCount={10}/>
        {remainingChunks.map((studentGroup, index) =>
          <OnTrackToGraduateTable key={index} data={studentGroup} maxCount={12}/>
        )}
      </React.Fragment>
    );
  }
}

module.exports = (data) => <TrackToGraduateReport data={data} />;
