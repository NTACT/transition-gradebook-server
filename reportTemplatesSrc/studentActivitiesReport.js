const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const TermsTable = require('./components/TermsTable');
const StudentStatusBar = require('./components/StudentStatusBar');
const studentRiskReportStyle = require('./styles/studentRiskReport');
const Icons = require('./components/icons');

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
      students,
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

        <IEPActivityTable terms={terms} students={students} />
        <GraduationPlanActivitiesTable terms={terms} students={students} />

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
        {students.map((student, i) => {
          const { riskFactors, studentNeeds, skills } = student;
          return (
            <React.Fragment key={i}>
              <div style={{pageBreakBefore: 'always'}}/>
              <TermsTable title='Risk Factors' data={riskFactors} rowHeight={23}/>
              <TermsTable title='Areas where student might need support or intervention' data={studentNeeds} rowHeight={20} useIcons />
              <TermsTable title='Skills Trainings Received' data={skills} rowHeight={20} useIcons icon={Icons.xCheckMark} />
            </React.Fragment>
          );
        })}
        <style>{studentRiskReportStyle}</style>
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


const IEPData = props => {
  const { role } = props;
  const attended = !!role ? 'YES' : ' ';
  const roleDisplay = role || ' ';
  return (
    <td style={{ 
        fontSize: 8, 
        borderLeft: '1px solid #D43425',
        
      }}>
        <div>{attended}</div>
        <span>{roleDisplay}</span>
    </td>
  );
}

const IEPActivityTable = props => {
  const {terms, students} = props;

  return (
    <ActivityTable>
      <ActivityTableHeader title={'ATTENDED IEP MEETING'} terms={terms} />
      <tbody style={{ borderTop: '10px solid white' }}>
        <tr style={{ 
            backgroundColor: '#F4F4F4',
        }}>
          <td>{/* placeholder for layout */}</td>
          {students.map((student, i) => {
            const { iepRoles } = student;
            return (
              <React.Fragment key={i}>
                {iepRoles.map((role, idx) => {
                  return (
                    <IEPData key={`role_${idx}`} role={role} />
                  );
                })
                }
              </React.Fragment>
            );
          })}
        </tr>
      </tbody>
    </ActivityTable>
  );
}

const GraduationPlanActivitiesTable = props => {
  const {terms, students} = props;

  return (
    <ActivityTable>
      <ActivityTableHeader title='CAREER DEVELOPMENT/GRADUATION PLAN' terms={terms} />
      <tbody style={{ borderTop: '10px solid white' }}>
        <tr style={{ backgroundColor: '#F4F4F4' }}>
          <td style={{width: 510}}>{/* placeholder for layout */}</td>
          {students.map((student, i) => {
            const { graduationPlans } = student;
            return (
              <React.Fragment key={i}>
                {graduationPlans.map((graduationPlan, idx) => {
                  return (
                    <td key={`plan_${idx}`} style={{ fontSize: 8, borderLeft: '1px solid #D43425', width: 200 }}>
                      <div>{graduationPlan ? `YES` : ' '}</div>
                    </td>
                  );
                })
                }
              </React.Fragment>
            );
          })}
        </tr>
      </tbody>
    </ActivityTable>
  );
}

module.exports = (data) => <StudentActivitiesReport data={data} />;
