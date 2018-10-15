const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const GradeAndAgeTable = require('./components/GradeAndAgeTable');
const DisabilityTable = require('./components/DisabilityTable');
const RiskTable = require('./components/RiskTable');
const ChartContainer = require('./components/ChartContainer');
const PieChart = require('./components/PieChart');
const HorizontalBarChart = require('./components/HorizontalBarChart');
const StudentNeedsList = require('./components/StudentNeedsList');
const ActivityGroupTable = require('./components/ActivityGroupTable');

class SummaryReport extends Component {
  render() {
    const {
      schoolSettings,
      schoolYear,
      term,
      gradeAndAgeRepartition,
      disabilityRepartition,
      riskRepartition,
      roleInIEPMeeting,
      receivedSkillsTraining,
      gender,
      cdgp,
      attendedIEPMeeting,
      studentNeeds,
      careerAwarenessActivities,
      workExperienceActivities,
      inclusionActivities,
      studentSupportsActivities,
      collaborationActivities,
    } = this.props.data;

    return (
      <React.Fragment>
        <SingleTermReportTitle
          reportName='Summary Report'
          schoolSettings={schoolSettings}
          schoolYear={schoolYear}
          term={term}
        />
        <GradeAndAgeTable data={gradeAndAgeRepartition}/>
    
        <DisabilityTable data={disabilityRepartition}/>
    
        <RiskTable data={riskRepartition}/>
        <ChartContainer>
          <HorizontalBarChart title='Role in IEP Meeting' data={roleInIEPMeeting} />
          <HorizontalBarChart title='Received Skills Training' data={receivedSkillsTraining} />
        </ChartContainer>
        <ChartContainer>
          <PieChart title='Gender' data={gender} diameter={100} />
          <PieChart title='Career Development or Graduation Plan' data={cdgp} diameter={100} />
          <PieChart title='Attended IEP Meeting' data={attendedIEPMeeting} diameter={100} />
        </ChartContainer>

        <StudentNeedsList title='Number of Students' data={studentNeeds} />
        <ActivityGroupTable title='Career Awareness Activities' data={careerAwarenessActivities}/>
        <ActivityGroupTable title='Work Experience Activities' data={workExperienceActivities}/>
        <ActivityGroupTable title='Inclusion Activities' data={inclusionActivities} style={{marginBottom: 50}}/>
        <ActivityGroupTable title='Student Supports Activities' data={studentSupportsActivities}/>
        <ActivityGroupTable title='Collaboration Activities' data={collaborationActivities}/>
      </React.Fragment>
    );
  }
}

module.exports = (data) => <SummaryReport data={data} />;
