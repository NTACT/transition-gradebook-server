
module.exports = context => {
  const { reportUtils } = context;
  const { getLongitudinalReportData } = reportUtils;

  return async function studentActivitiesReport(options) {
    const reportData = await getLongitudinalReportData(options);
    const students = reportData.terms.map(term => {
      term.student = term.students[0];
      return term.student;
    });
    const [student] = students;
    
    reportData.studentInfo = student;
    return reportData;
  };
};
