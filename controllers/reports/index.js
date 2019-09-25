module.exports = context => ({
  numberOfStudentsCross: require('./numberOfStudentsCross')(context),
  numberOfStudentsLongitudinal: require('./numberOfStudentsLongitudinal')(
    context
  ),
  numberOfStudentsStandard: require('./numberOfStudentsStandard')(context),
  postSchoolStudent: require('./postSchoolStudent')(context),
  riskRoster: require('./riskRoster')(context),
  riskSummary: require('./riskSummary')(context),
  summary: require('./summary')(context),
  trackToGraduate: require('./trackToGraduate')(context),
  student: require('./student')(context),
  studentActivities: require('./studentActivities')(context),
  studentRiskStandard: require('./studentRiskStandard')(context),
  studentRiskLongitudinal: require('./studentRiskLongitudinal')(context),
  preEts: require('./preEts')(context)
});
