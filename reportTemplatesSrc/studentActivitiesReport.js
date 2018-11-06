const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const TermsTable = require('./components/TermsTable');
const StudentStatusBar = require('./components/StudentStatusBar');

class StudentActivitiesReport extends Component {
  render() {
    const {
      schoolSettings,
      startYear,
      startTerm,
      endYear,
      endTerm,
      terms,
      studentInfo,
      activityTypeGroups,
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
        <StudentStatusBar student={studentInfo}/>

        {activityTypeGroups.map((group, i) =>
          <ActivityTable key={group.id} break={i === 1 || i === 3}>
            <ActivityTableHeader title={group.name} terms={terms}></ActivityTableHeader>
            <tbody style={{borderTop: '10px solid white'}}>
              {group.activityTypes.map((type, i) =>
                <tr key={type.id} style={{
                  backgroundColor: i % 2 ? 'white' : '#F4F4F4'
                }}>
                  <td style={{ textAlign: 'left', fontSize: 10, paddingLeft: 10 }}>{type.name}</td>
                  {terms.map(term =>
                    <td key={term.id} style={{ fontSize: 8, borderLeft: '1px solid #D43425' }}>
                      {term.student ? term.student.activities.filter(a => a.activityTypeId === type.id).length : 'N/A'}
                    </td>  
                  )}
                </tr>  
              )}
            </tbody>
          </ActivityTable>
        )}
      </React.Fragment>
    );
  }
}

const ActivityTable = props => (
  <table {...props} style={{
    width: '100%',
    textAlign: 'center',
    borderSpacing: 0,
    borderCollapse: 'collapse',
    marginTop: 10,
    pageBreakBefore: props.break ? 'always' : null,
  }}/>
);

const ActivityTableHeader = props => (
  <thead style={{
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#D43425',
    color: 'white',
    fontSize: 12,
    height: 30,
  }}>
    <tr>
      <td style={{ fontSize: 16, textAlign: 'left', paddingLeft: 10 }}>{props.title}</td>
      {props.terms.map((term, i) =>
        <td key={i}>{term.name}</td>
      )}
    </tr>
  </thead>
);

const ActivityTableRow = props => (
  <tr>

  </tr>
);

module.exports = (data) => <StudentActivitiesReport data={data} />;
