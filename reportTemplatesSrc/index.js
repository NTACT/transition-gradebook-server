module.exports = {
  summaryReport: data => require('./summaryReport')(data),
  riskRosterReport: data => require('./riskRosterReport')(data),
  riskSummaryReport: data => require('./riskSummaryReport')(data),
  numberOfStudentsStandard: data => require('./numberOfStudentsStandard')(data),
  numberOfStudentsLongitudinal: data => require('./numberOfStudentsLongitudinal')(data),
  studentReport: data => require('./studentReport')(data),
  studentRiskStandardReport: data => require('./studentRiskStandardReport')(data),
  studentRiskLongitudinalReport: data => require('./studentRiskLongitudinalReport')(data),
  postSchoolStudentReport: data => require('./postSchoolStudentReport')(data),
};
