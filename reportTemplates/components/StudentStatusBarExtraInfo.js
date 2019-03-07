const React = require('react');

const studentStatusBarExtraInfoStyle = require('../styles/studentStatusBarExtraInfo');

module.exports = ({
  student
}) => {
  const {
    iep,
    hasGraduationPlan
  } = student;
  const {
    attended,
    roleDetails
  } = iep;
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "risk-student-extra"
  }, React.createElement("div", {
    className: "risk-student-extra-item"
  }, React.createElement("div", null, "Attended IEP Meeting:"), React.createElement("div", {
    className: "risk-student-extra-value"
  }, formatBool(attended), attended === true ? ` - ${roleDetails}` : '')), React.createElement("div", {
    className: "risk-student-extra-item"
  }, React.createElement("div", null, "Career Development/Graduation Plan:"), React.createElement("div", {
    className: "risk-student-extra-value"
  }, formatBool(hasGraduationPlan)))), React.createElement("style", null, studentStatusBarExtraInfoStyle));
};

function formatBool(bool) {
  if (bool === true) return 'Yes';
  if (bool === false) return 'No';
  return 'No Data';
}