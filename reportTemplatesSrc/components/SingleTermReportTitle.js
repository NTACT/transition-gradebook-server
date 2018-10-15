const React = require('react');
const ReportTitle = require('./ReportTitle');

module.exports = function SingleTermReportTitle(props) {
  const { schoolYear, term, ...rest } = props;
  let termLabel = '';

  if(schoolYear.termType !== 'annual') {
    termLabel = ', ' + term.termName
  }

  return (
    <ReportTitle {...rest}
      timeLabel={`School Year ${schoolYear.year}-${schoolYear.year+1}${termLabel}`}
    />
  );
}
