const React = require('react');
const { Component } = React;
const SingleTermReportTitle = require('./components/SingleTermReportTitle');
const VerticalBarChart = require('./components/VerticalBarChart');

class NumberOfStudentsStandard extends Component {
  render() {
    const {
      schoolSettings,
      term,
      schoolYear,
      postSchool,
      risks,
      skills,
      supportNeeded,
      roleInIEPMeeting,
      disabilities,
      activities,
    } = this.props.data;

    return (
      <React.Fragment>
        {postSchool &&
          <React.Fragment>
            <SingleTermReportTitle reportName={`Number of Students - by Post-school Outcomes`} schoolSettings={schoolSettings} schoolYear={schoolYear} term={term}/>
            <VerticalBarChart title='Number of Students' data={postSchool}/>
          </React.Fragment>
        }

        {risks &&
          <React.Fragment>
            <SingleTermReportTitle reportName={`Number of Students - by Risk Level`} schoolSettings={schoolSettings} schoolYear={schoolYear} term={term}/>
            <VerticalBarChart title='Number of Students' data={risks} />
          </React.Fragment>
        }

        {skills &&
          <React.Fragment>
            <SingleTermReportTitle reportName={`Number of Students - by Skills Training`} schoolSettings={schoolSettings} schoolYear={schoolYear} term={term}/>
            <VerticalBarChart title='Number of Students' data={skills} />
          </React.Fragment>
        }

        {supportNeeded &&
          <React.Fragment>
            <SingleTermReportTitle reportName={`Number of Students - by Support Needs`} schoolSettings={schoolSettings} schoolYear={schoolYear} term={term}/>
            <VerticalBarChart title='Number of Students' data={supportNeeded} />
          </React.Fragment>
        }

        {roleInIEPMeeting &&
          <React.Fragment>
            <SingleTermReportTitle reportName={`Number of Students - by Role in IEP Meeting`} schoolSettings={schoolSettings} schoolYear={schoolYear} term={term}/>
            <VerticalBarChart title='Number of Students' data={roleInIEPMeeting} />
          </React.Fragment>
        }

        {disabilities &&
          <React.Fragment>
            <SingleTermReportTitle reportName={`Number of Students - by Disability`} schoolSettings={schoolSettings} schoolYear={schoolYear} term={term}/>
            <VerticalBarChart title='Number of Students' data={disabilities} barSize={20} />
          </React.Fragment>
        }

        {activities &&
          <React.Fragment>
            <SingleTermReportTitle reportName={`Number of Students - by Activities`} schoolSettings={schoolSettings} schoolYear={schoolYear} term={term}/>
            <VerticalBarChart title='Number of Students' data={activities} />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

module.exports = (data) => <NumberOfStudentsStandard data={data} />;
