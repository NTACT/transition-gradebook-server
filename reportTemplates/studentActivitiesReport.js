function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const React = require('react');

const {
  Component
} = React;

const MultiTermReportTitle = require('./components/MultiTermReportTitle');

const TermsTable = require('./components/TermsTable');

const StudentStatusBar = require('./components/StudentStatusBar');

const studentRiskReportStyle = require('./styles/studentRiskReport');

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
    }), React.createElement(IEPActivityTable, {
      terms: terms,
      students: students
    }), React.createElement(GraduationPlanActivitiesTable, {
      terms: terms,
      students: students
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
    }, term.student ? term.student.activities.filter(a => a.activityTypeId === type.id).length : 'N/A'))))))), students.map((student, i) => {
      const {
        riskFactors,
        studentNeeds
      } = student;
      return React.createElement(React.Fragment, {
        key: i
      }, React.createElement("div", {
        style: {
          pageBreakBefore: 'always'
        }
      }), React.createElement(TermsTable, {
        title: "Risk Factors",
        data: riskFactors,
        rowHeight: 23
      }), React.createElement(TermsTable, {
        title: "Areas where student might need support or intervention",
        data: studentNeeds,
        rowHeight: 20,
        useIcons: true
      }));
    }), React.createElement("style", null, studentRiskReportStyle));
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

const IEPData = props => {
  const {
    role
  } = props;
  const attended = !!role ? 'YES' : ' ';
  const roleDisplay = role || ' ';
  return React.createElement("td", {
    style: {
      fontSize: 8,
      borderLeft: '1px solid #D43425'
    }
  }, React.createElement("div", null, attended), React.createElement("span", null, roleDisplay));
};

const IEPActivityTable = props => {
  const {
    terms,
    students
  } = props;
  return React.createElement(ActivityTable, null, React.createElement(ActivityTableHeader, {
    title: 'ATTENDED IEP MEETING',
    terms: terms
  }), React.createElement("tbody", {
    style: {
      borderTop: '10px solid white'
    }
  }, React.createElement("tr", {
    style: {
      backgroundColor: '#F4F4F4'
    }
  }, React.createElement("td", null), students.map((student, i) => {
    const {
      iepRoles
    } = student;
    return React.createElement(React.Fragment, {
      key: i
    }, iepRoles.map((role, idx) => {
      return React.createElement(IEPData, {
        key: `role_${idx}`,
        role: role
      });
    }));
  }))));
};

const GraduationPlanActivitiesTable = props => {
  const {
    terms,
    students
  } = props;
  return React.createElement(ActivityTable, null, React.createElement(ActivityTableHeader, {
    title: "CAREER DEVELOPMENT/GRADUATION PLAN",
    terms: terms
  }), React.createElement("tbody", {
    style: {
      borderTop: '10px solid white'
    }
  }, React.createElement("tr", {
    style: {
      backgroundColor: '#F4F4F4'
    }
  }, React.createElement("td", {
    style: {
      width: 510
    }
  }), students.map((student, i) => {
    const {
      graduationPlans
    } = student;
    return React.createElement(React.Fragment, {
      key: i
    }, graduationPlans.map((graduationPlan, idx) => {
      return React.createElement("td", {
        key: `plan_${idx}`,
        style: {
          fontSize: 8,
          borderLeft: '1px solid #D43425',
          width: 200
        }
      }, React.createElement("div", null, graduationPlan ? `YES` : ' '));
    }));
  }))));
};

module.exports = data => React.createElement(StudentActivitiesReport, {
  data: data
});