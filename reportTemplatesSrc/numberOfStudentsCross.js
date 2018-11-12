const React = require('react');
const { Component } = React;
const VerticalBarChart = require('./components/VerticalBarChart');
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const crossTableStyle = require('./styles/crossTable');
const StripeBar = require('./components/StripeBar');

class NumberOfStudentsCross extends Component {
  render() {
    const {
      reportName,
      schoolSettings,
      data,
      schoolYear,
      term,
      barSize,
      criteria1Labels,
      criteria2Labels,
      studentGroups,
      columnWidth,
    } = this.props.data;

    return (
      <React.Fragment>
        <style>{crossTableStyle}</style>
        <SingleTermReportTitle
          reportName={reportName}
          schoolSettings={schoolSettings}
          schoolYear={schoolYear}
          term={term}
        />
        <VerticalBarChart title='Number of Students (Cross)' data={data} barSize={barSize || 5} multipleBars />
        
        <SingleTermReportTitle
          reportName={reportName}
          schoolSettings={schoolSettings}
          schoolYear={schoolYear}
          term={term}
        />

        <CrossTable>
          <CrossTableHeader>
            <tr>
              <th/>
                {criteria1Labels.map(({ key, label }) =>
                  <th key={key} style={{
                    position: 'relative',
                    width: columnWidth,
                  }}>

                    {label}
                  </th>
                )}
              <th/>
            </tr>
          </CrossTableHeader>

          <CrossTableContent>
            {criteria2Labels.map(({ key, label }, i) => {
              const total = criteria1Labels.reduce((total, { key : criteria1Key }) =>
                total + studentGroups[criteria1Key][key]
              , 0);
              return (
                <React.Fragment key={key}>
                  <tr>
                    <CrossTableCell>
                      <StripeBar index={i}/>
                      <RowTitle>{label}</RowTitle>
                    </CrossTableCell>
                    {criteria1Labels.map(({ key : criteria1Key }) =>
                      <CrossTableCell key={criteria1Key}>
                        {studentGroups[criteria1Key][key]}
                      </CrossTableCell>
                    )}
                    <CrossTableTotalCell>
                      {total}
                    </CrossTableTotalCell>
                  </tr>
                </React.Fragment>
              );
            })}
          </CrossTableContent>

          <CrossTableFooter>
            <tr>
              <CrossTableTotalCell>TOTALS</CrossTableTotalCell>
              {criteria1Labels.map(({ key }) =>
                <CrossTableTotalCell key={key}>
                  {Object.values(studentGroups[key]).reduce((a, b) => a + b, 0)}
                </CrossTableTotalCell>
              )}
              <CrossTableTotalCell/>
            </tr>
          </CrossTableFooter>
        </CrossTable>
      </React.Fragment>
    );
  }
}

function CrossTable(props) {
  return (<table {...props} className="cross-table"/>);
}

function CrossTableHeader(props) {
  return (<thead {...props} className="cross-table-header"/>);
}

function CrossTableContent(props) {
  return (<tbody {...props} className="cross-table-content"/>);
}

function CrossTableFooter(props) {
  return (<tfoot {...props} className="cross-table-footer"/>);
}

function CrossTableCell(props) {
  return (<td {...props} className="cross-table-cell"/>);
}

function CrossTableTotalCell(props) {
  return (<td {...props} className="cross-table-total-cell"/>);
}

function RowTitle(props) {
  return (<div {...props} className="cross-table-row-title" style={{
    maxWidth: 150,
    whiteSpace: 'normal',
    marginTop: 5,
    textAlign: 'center',
  }}/>);
}

module.exports = (data) => <NumberOfStudentsCross data={data} />;
