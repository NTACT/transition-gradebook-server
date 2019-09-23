function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const React = require('react');

const {
  Component
} = React;

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
    return React.createElement(React.Fragment, null, React.createElement(SingleTermReportTitle, {
      reportName: "Pre-ETS Activity Report",
      schoolSettings: schoolSettings,
      schoolYear: schoolYear,
      term: term,
      appliedFilters: appliedFilters
    }), studentPages.map(students => React.createElement(PreETSTable, {
      inSchoolStudents: students
    })));
  }

}

function TableRow(props) {
  const {
    index
  } = props,
        rest = _objectWithoutProperties(props, ["index"]);

  return React.createElement("tr", _extends({}, rest, {
    style: {
      height: 70,
      fontSize: '70%',
      backgroundColor: index % 2 ? 'white' : '#f4f4f4'
    }
  }));
}

const PreETSTable = (_ref) => {
  let {
    inSchoolStudents
  } = _ref,
      rest = _objectWithoutProperties(_ref, ["inSchoolStudents"]);

  return React.createElement("table", _extends({
    style: {
      width: '100%',
      textAlign: 'center',
      borderCollapse: 'collapse'
    }
  }, rest), React.createElement("thead", null, React.createElement("tr", {
    style: {
      backgroundColor: '#D43425',
      color: 'white',
      width: '100%',
      fontSize: '50%',
      padding: '20px 10px 20px 10px'
    }
  }, React.createElement("th", null, "Name"), React.createElement("th", null, "Student ID"), React.createElement("th", null, "Race/", React.createElement("br", null), "Ethnicity"), React.createElement("th", null, "Engaged with VR"), React.createElement("th", null, "On-track for graduation"), React.createElement("th", null, "Job Exploration Counseling"), React.createElement("th", null, "Work Based Learning"), React.createElement("th", null, "Counseling on Transition", React.createElement("br", null), "Programs or PSE at IHEs"), React.createElement("th", null, "Training in Workplace Readiness,", React.createElement("br", null), "Social Skills,", React.createElement("br", null), "Independent Living"), React.createElement("th", null, "Instruction in Self-Advocacy"))), React.createElement("tbody", null, inSchoolStudents.map((student, index) => {
    const engagedWithVr = student.activities.some(activity => activity.activityType.name === 'Referral Complete to VR (PW, IAC)');
    const hasJobExplorationCounseling = student.activities.some(activity => activity.activityType.name === 'Job Exploration Counseling (CW, Pre-ETS)');
    const hasWorkBasedLearning = student.activities.some(activity => activity.activityType.activityTypeGroup.name === 'Work Experience');
    const hasCounselingOnTransitionPrograms = student.activities.some(activity => {
      const activityTypeName = activity.activityType.name;
      return activityTypeName === 'Career Mentor (CW, SS)' || activityTypeName === 'Graduation Coach/ Mentor (SS)' || activityTypeName === 'School Counselor for Post-School Planning (SS)';
    });
    return React.createElement(TableRow, {
      key: student.id,
      index: index
    }, React.createElement("td", null, student.firstName, " ", student.lastName), React.createElement("td", null, student.studentId), React.createElement("td", null, student.race), React.createElement("td", null, engagedWithVr ? 'Yes' : 'No'), React.createElement("td", null, student.onTrack ? 'Yes' : 'No'), React.createElement("td", null, hasJobExplorationCounseling ? 'Yes' : 'No'), React.createElement("td", null, hasWorkBasedLearning ? 'Yes' : 'No'), React.createElement("td", null, hasCounselingOnTransitionPrograms ? 'Yes' : 'No'), React.createElement("td", null, student.hasIndependentLivingSkills || student.hasSocialSkills ? 'Yes' : 'No'), React.createElement("td", null, student.hasSelfDeterminationSkills ? 'Yes' : 'No'));
  })));
};

module.exports = data => React.createElement(PreEtsReport, {
  data: data
});