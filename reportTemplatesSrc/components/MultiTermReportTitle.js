const React = require('react');
const ReportTitle = require('./ReportTitle');
const SingleTermReportTitle = require('./SingleTermReportTitle');

module.exports = function MultiTermReportTitle(props) {
  const { startYear, startTerm, endYear, endTerm, ...rest } = props;
  if(startYear.id === endYear.id && startTerm.id === endTerm.id) {
    return (<SingleTermReportTitle {...props} schoolYear={startYear} term={startTerm}/>);
  }

  let startTermLabel = '';
  let endTermLabel = '';

  if(startYear.termType !== 'annual') {
    startTermLabel = ', ' + startTerm.termName
  }

  if(endYear.termType !== 'annual') {
    endTermLabel = ', ' + endTerm.termName
  }

  return (
    <ReportTitle {...rest}
      timeLabel={`${startYear.year}-${startYear.year+1}${startTermLabel} to ${endYear.year}-${endYear.year+1}${endTermLabel}`}
    />
  );
}
