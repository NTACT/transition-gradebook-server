module.exports = context => ({
  numberOfStudentsLongitudinal: require('./numberOfStudentsLongitudinal')(context),
  numberOfStudentsStandard: require('./numberOfStudentsStandard')(context),
  postSchoolStudent: require('./postSchoolStudent')(context),
  riskRoster: require('./riskRoster')(context),
  riskSummary: require('./riskSummary')(context),
  summary: require('./summary')(context),
  student: require('./student')(context),
  studentRiskStandard: require('./studentRiskStandard')(context),
  studentRiskLongitudinal: require('./studentRiskLongitudinal')(context),
});
