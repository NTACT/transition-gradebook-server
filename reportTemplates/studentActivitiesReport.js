function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const React = require('react');

const {
  Component
} = React;

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
      activityTypeGroups
    } = this.props.data;
    return React.createElement(React.Fragment, null, React.createElement(MultiTermReportTitle, {
      reportName: "Student Activities Report",
      schoolSettings: schoolSettings,
      startYear: startYear,
      startTerm: startTerm,
      endYear: endYear,
      endTerm: endTerm
    }), React.createElement(StudentStatusBar, {
      student: studentInfo
    }), activityTypeGroups.map((group, i) => React.createElement(ActivityTable, {
      key: group.id,
      break: i === 1 || i === 3
    }, React.createElement(ActivityTableHeader, {
      title: group.name,
      terms: terms
    }), React.createElement("tbody", {
      style: {
        borderTop: '10px solid white'
      }
    }, group.activityTypes.map((type, i) => React.createElement("tr", {
      key: type.id,
      style: {
        backgroundColor: i % 2 ? 'white' : '#F4F4F4'
      }
    }, React.createElement("td", {
      style: {
        textAlign: 'left',
        fontSize: 10,
        paddingLeft: 10
      }
    }, type.name), terms.map(term => React.createElement("td", {
      key: term.id,
      style: {
        fontSize: 8,
        borderLeft: '1px solid #D43425'
      }
    }, term.student ? term.student.activities.filter(a => a.activityTypeId === type.id).length : 'N/A'))))))));
  }

}

const ActivityTable = props => React.createElement("table", _extends({}, props, {
  style: {
    width: '100%',
    textAlign: 'center',
    borderSpacing: 0,
    borderCollapse: 'collapse',
    marginTop: 10,
    pageBreakBefore: props.break ? 'always' : null
  }
}));

const ActivityTableHeader = props => React.createElement("thead", {
  style: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#D43425',
    color: 'white',
    fontSize: 12,
    height: 30
  }
}, React.createElement("tr", null, React.createElement("td", {
  style: {
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 10
  }
}, props.title), props.terms.map((term, i) => React.createElement("td", {
  key: i
}, term.name))));

const ActivityTableRow = props => React.createElement("tr", null);

module.exports = data => React.createElement(StudentActivitiesReport, {
  data: data
});