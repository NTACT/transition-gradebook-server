
module.exports = context => {
  const { map } = require('lodash');
  const { reportUtils } = context;

  return async function createRiskSummaryReport(options) {
    const data = await reportUtils.getLongitudinalReportData(options);
    const { terms } = data;

    const riskFactors = {
      header: map(terms, term => ({
        label: term.name
      })),
      rows: ['No Data', 'low', 'medium', 'high', 'ultra'].map(risk => {
        return {
          risk,
          values: map(terms, term =>
            reportUtils.countWith(term.inSchoolStudents, s => s.risk === risk)
          )
        };
      })
    };

    const studentNeeds = {
      rows: [
        {
          label: 'Attendance',
          values: map(terms, term => reportUtils.countWith(term.inSchoolStudents, 'interventions.attendance')),
        },
        {
          label: 'Behavior',
          values: map(terms, term => reportUtils.countWith(term.inSchoolStudents, 'interventions.behavior')),
        },
        {
          label: 'Engagement',
          values: map(terms, term => reportUtils.countWith(term.inSchoolStudents, 'interventions.engagement')),
        },
        {
          label: 'English / ELA',
          values: map(terms, term => reportUtils.countWith(term.inSchoolStudents, 'interventions.english')),
        },
        {
          label: 'Mathematics',
          values: map(terms, term => reportUtils.countWith(term.inSchoolStudents, 'interventions.math')),
        },
      ]
    };

    return {
      ...data,
      riskFactors,
      studentNeeds,
    };
  };
};
