const React = require('react');
const { Component } = React;
const ReportTitle = require('./components/ReportTitle');
const VerticalBarChart = require('./components/VerticalBarChart');
const MultiTermReportTitle = require('./components/MultiTermReportTitle');

class NumberOfStudentsLongitudinal extends Component {
  render() {
    const {
      schoolSettings,
      postSchool,
      risks,
      skills,
      supportNeeded,
      roleInIEPMeeting,
      disabilities,
      activities,
      genders,
      races,
      startYear,
      startTerm,
      endYear,
      endTerm,
    } = this.props.data;

    return (
      <React.Fragment>
        {races && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Race, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={races} barSize={15} multipleBars />
          </React.Fragment>
        }
        {genders && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Gender, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={genders} barSize={25} multipleBars />
          </React.Fragment>
        }
        {postSchool && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Post-school Outcomes, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={postSchool} barSize={25} multipleBars />
          </React.Fragment>
        }
        {risks && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Risk Level, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={risks} barSize={25} riskChart multipleBars />
          </React.Fragment>
        }
        {skills && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Skills Training, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={skills} barSize={25} multipleBars />
          </React.Fragment>
        }
        {supportNeeded && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Support Needs, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={supportNeeded} barSize={25} multipleBars />
          </React.Fragment>
        }
        {roleInIEPMeeting && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Role in IEP Meeting, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={roleInIEPMeeting} barSize={25} multipleBars />
          </React.Fragment>
        }
        {disabilities && 
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Disability, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}
            />
            <VerticalBarChart title='Number of Students' data={disabilities} barSize={10} multipleBars rotateLabels/>
          </React.Fragment>
        }
        {activities &&
          <React.Fragment>
            <MultiTermReportTitle
              reportName={`Number of Students - by Activities, over time`}
              schoolSettings={schoolSettings}
              startYear={startYear}
              startTerm={startTerm}
              endYear={endYear}
              endTerm={endTerm}  
            />
            <VerticalBarChart title='Number of Students' data={activities} barSize={25} multipleBars />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

module.exports = (data) => <NumberOfStudentsLongitudinal data={data} />;
