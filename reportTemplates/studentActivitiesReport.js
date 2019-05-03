const React = require('react');

const {
  Component
} = React;

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
      activityTypeGroups
    } = this.props.data;
    const iepRows = students.map(student => {
      const {
        iepRoles
      } = student;
      const values = iepRoles.map((role, i) => {
        const attended = !!role ? 'YES' : ' ';
        const roleDisplay = role || ' ';
        return React.createElement("div", {
          key: `student_role_${i}`,
          className: "iep-role"
        }, React.createElement("div", null, attended), React.createElement("div", null, roleDisplay));
      });
      return {
        label: '',
        values
      };
    });
    const gradPlanRows = students.map(student => {
      const {
        graduationPlans
      } = student;
      const values = graduationPlans.map(graduationPlan => graduationPlan ? 'YES' : ' ');
      return {
        label: '',
        values
      };
    });
    return React.createElement(React.Fragment, null, React.createElement(MultiTermReportTitle, {
      reportName: "Student Activities Report",
      schoolSettings: schoolSettings,
      startYear: startYear,
      startTerm: startTerm,
      endYear: endYear,
      endTerm: endTerm
    }), React.createElement(StudentStatusBar, {
      student: studentInfo
    }), React.createElement(ActivityOverTimeTable, {
      title: "ATTENDED IEP MEETING",
      terms: terms,
      rows: iepRows,
      rowHeight: 45
    }), React.createElement(ActivityOverTimeTable, {
      title: "CAREER DEVELOPMENT / GRADUATION PLAN",
      terms: terms,
      rows: gradPlanRows
    }), activityTypeGroups.map((group, i) => {
      const activityGroupRows = group.activityTypes.map(type => {
        const values = terms.map(term => term.student ? term.student.activities.filter(a => a.activityTypeId === type.id).length : 'N/A');
        const label = type.name;
        return {
          label,
          values
        };
      });
      return React.createElement(React.Fragment, {
        key: group.id
      }, [0, 1, 2, 4].includes(i) && React.createElement("div", {
        style: {
          pageBreakBefore: 'always'
        }
      }), React.createElement(ActivityOverTimeTable, {
        title: group.name,
        terms: terms,
        rows: activityGroupRows
      }));
    }), students.map((student, i) => {
      const {
        riskFactors,
        studentNeeds,
        skills
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
      }), React.createElement(TermsTable, {
        title: "Skills Trainings Received",
        data: skills,
        rowHeight: 20,
        useIcons: true
      }));
    }), React.createElement("style", null, studentRiskReportStyle));
  }

}

module.exports = data => React.createElement(StudentActivitiesReport, {
  data: data
});