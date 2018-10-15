module.exports = context => {
  const { controllers, models } = context;

  const riskUtils = require('../utils/riskUtils');
  const { calcTermInfoRiskData } = riskUtils;

  class RiskDataController {
    constructor() {
      // For testing
      Object.assign(this, riskUtils);
    }

    async getStudentRiskDataByTerms(termIds) {
      const schoolSettings = await controllers.schoolSettingsController.getSchoolSettings();
      const terms = await models.Term.query()
        .whereIn('id', termIds)
        .eager('studentTermInfos(notPostSchool).student', {
          notPostSchool: query => query.where('gradeLevel', '!=', 'Post-school')
        });

      return terms.map(term => {
        term.students = term.studentTermInfos.map(
          studentTermInfo => ({
            ...studentTermInfo.student,
            ...calcTermInfoRiskData(schoolSettings, studentTermInfo)
          })
        );
        return term;
      });
    }
  }

  return RiskDataController;
};

