const React = require('react');
const { Component } = React;
const chunk = require('lodash/chunk');
const SingleTermReportTitle = require('./components/SingleTermReportTitle');

class PreEtsReport extends Component {
  render() {
    const {
      schoolSettings,
      inSchoolStudents,
      term,
      schoolYear,
      appliedFilters
    } = this.props.data;

    const studentPages = chunk(inSchoolStudents, 6);

    return (
      <React.Fragment>
        <SingleTermReportTitle
          reportName="Pre-ETS Activity Report"
          schoolSettings={schoolSettings}
          schoolYear={schoolYear}
          term={term}
          appliedFilters={appliedFilters}
        />
        {studentPages.map(students => <PreETSTable inSchoolStudents={students} />)}
      </React.Fragment>
    );
  }
}

function TableRow(props) {
  const { index, ...rest } = props;
  return (
    <tr
      {...rest}
      style={{
        height: 70,
        fontSize: '70%',
        backgroundColor: index % 2 ? 'white' : '#f4f4f4'
      }}
    />
  );
}

const PreETSTable = ({ inSchoolStudents, ...rest }) => (
  <table
    style={{
      width: '100%',
      textAlign: 'center',
      borderCollapse: 'collapse'
    }}
    {...rest}
  >
    <thead>
      <tr
        style={{
          backgroundColor: '#D43425',
          color: 'white',
          width: '100%',
          fontSize: '50%',
          padding: '20px 10px 20px 10px'
        }}
      >
        <th>Name</th>
        <th>Student ID</th>
        <th>
          Race/
        <br />
          Ethnicity
      </th>
        <th>Engaged with VR</th>
        <th>On-track for graduation</th>
        <th>Job Exploration Counseling</th>
        <th>Work Based Learning</th>
        <th>
          Counseling on Transition
        <br />
          Programs or PSE at IHEs
      </th>
        <th>
          Training in Workplace Readiness,
        <br />
          Social Skills,
        <br />
          Independent Living
      </th>
        <th>Instruction in Self-Advocacy</th>
      </tr>
    </thead>
    <tbody>
      {inSchoolStudents.map((student, index) => {
        const engagedWithVr = student.activities.some(
          activity =>
            activity.activityType.name ===
            'Referral Complete to VR (PW, IAC)'
        );
        const hasJobExplorationCounseling = student.activities.some(
          activity =>
            activity.activityType.name ===
            'Job Exploration Counseling (CW, Pre-ETS)'
        );
        const hasWorkBasedLearning = student.activities.some(
          activity =>
            activity.activityType.activityTypeGroup.name ===
            'Work Experience'
        );

        const hasCounselingOnTransitionPrograms = student.activities.some(
          activity => {
            const activityTypeName = activity.activityType.name;
            return (
              activityTypeName === 'Career Mentor (CW, SS)' ||
              activityTypeName === 'Graduation Coach/ Mentor (SS)' ||
              activityTypeName ===
              'School Counselor for Post-School Planning (SS)'
            );
          }
        );

        return (
          <TableRow key={student.id} index={index}>
            <td>
              {student.firstName} {student.lastName}
            </td>
            <td>{student.studentId}</td>
            <td>{student.race}</td>
            <td>{engagedWithVr ? 'Yes' : 'No'}</td>
            <td>{student.onTrack ? 'Yes' : 'No'}</td>
            <td>{hasJobExplorationCounseling ? 'Yes' : 'No'}</td>
            <td>{hasWorkBasedLearning ? 'Yes' : 'No'}</td>
            <td>{hasCounselingOnTransitionPrograms ? 'Yes' : 'No'}</td>
            <td>
              {student.hasIndependentLivingSkills ||
                student.hasSocialSkills
                ? 'Yes'
                : 'No'}
            </td>
            <td>{student.hasSelfDeterminationSkills ? 'Yes' : 'No'}</td>
          </TableRow>
        );
      })}
    </tbody>
  </table>
)

module.exports = data => <PreEtsReport data={data} />;
