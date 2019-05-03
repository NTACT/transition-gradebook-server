const React = require('react');
const { Component } = React;
const MultiTermReportTitle = require('./components/MultiTermReportTitle');
const TermsTable = require('./components/TermsTable');
const StudentStatusBar = require('./components/StudentStatusBar');
const studentRiskReportStyle = require('./styles/studentRiskReport');
const ActivityOverTimeTable = require('./components/ActivityOverTimeTable');

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

    const iepRows = students.map(student => {
      const { iepRoles } = student;
      const values = iepRoles.map((role, i) => {
        const attended = !!role ? 'YES' : ' ';
        const roleDisplay = role || ' ';
        return (
          <div key={`student_role_${i}`}>
            <div>{attended}</div>
            <div>{roleDisplay}</div>
          </div>
        );
      });
      return {
        label: '',
        values,
      }
    });

    const gradPlanRows = students.map(student => {
      const { graduationPlans } = student;
      const values = graduationPlans.map(graduationPlan => (graduationPlan ? 'YES' : ' '));
      return {
        label: '',
        values,
      }
    });

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

        <ActivityOverTimeTable title='ATTENDED IEP MEETING' terms={terms} rows={iepRows } />
        <ActivityOverTimeTable title='CAREER DEVELOPMENT / GRADUATION PLAN' terms={terms} rows={gradPlanRows } />

        {activityTypeGroups.map((group, i) => {
          const activityGroupRows = group.activityTypes.map((type) => {
            const values = terms.map(term => (term.student ?
              term.student.activities.filter(a => a.activityTypeId === type.id).length : 'N/A'));
            const label = type.name;
            return {
              label, values,
            }
          });
          return (
            <React.Fragment key={group.id}>
              {[0, 1, 3].includes(i) && <div style={{ pageBreakBefore: 'always' }} />}
              <ActivityOverTimeTable title={group.name} terms={terms} rows={activityGroupRows} />
            </React.Fragment>
          );
        })}        
        {students.map((student, i) => {
          const { riskFactors, studentNeeds, skills } = student;
          return (
            <React.Fragment key={i}>
              <div style={{pageBreakBefore: 'always'}}/>
              <TermsTable title='Risk Factors' data={riskFactors} rowHeight={23}/>
              <TermsTable title='Areas where student might need support or intervention' data={studentNeeds} rowHeight={20} useIcons />
              <TermsTable title='Skills Trainings Received' data={skills} rowHeight={20} useIcons />
            </React.Fragment>
          );
        })}
        <style>{studentRiskReportStyle}</style>
      </React.Fragment>
    );
  }
}

module.exports = (data) => <StudentActivitiesReport data={data} />;
