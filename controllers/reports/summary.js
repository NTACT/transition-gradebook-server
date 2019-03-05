
module.exports = context => {
  const resolveObject = require('../../utils/resolveObject');
  const { reportUtils } = context;
  const { models } = context;

  return async function runSummaryReport(options) {
    const {
      schoolSettings,
      term,
      inSchoolStudents,
      schoolYear,
    } = await reportUtils.getSingleTermReportData(options);

    const appliedFilters = reportUtils.getActiveFilters(options);

    const data = await resolveObject({
      schoolSettings,
      term,
      schoolYear: models.SchoolYear.query().where('id', term.schoolYearId).eager('terms').first(),
      riskRepartition: reportUtils.getRiskCount(inSchoolStudents),
      disabilityRepartition: reportUtils.getDisabilityCount(inSchoolStudents),
      careerAwarenessActivities: reportUtils.getCareerAwarenessActivities(schoolYear.id, inSchoolStudents),
      workExperienceActivities: reportUtils.getWorkExperienceActivities(schoolYear.id, inSchoolStudents),
      inclusionActivities: reportUtils.getInclusionActivities(schoolYear.id, inSchoolStudents),
      studentSupportsActivities: reportUtils.getStudentSupportsActivities(schoolYear.id, inSchoolStudents),
      collaborationActivities: reportUtils.getCollaborationActivities(schoolYear.id, inSchoolStudents),
      gradeAndAgeRepartition: reportUtils.getGradeRepartition(inSchoolStudents),
      roleInIEPMeeting: reportUtils.getIEPMeetingRoleCount(inSchoolStudents),
      receivedSkillsTraining: reportUtils.getStudentSkillCount(inSchoolStudents),
      gender: reportUtils.getGenderCount(inSchoolStudents),
      race: reportUtils.getRaceCount(inSchoolStudents),
      cdgp: reportUtils.getCareerDevelopmentOrGraduationPlanCount(inSchoolStudents),
      attendedIEPMeeting: reportUtils.getIEPMeetingAttendance(inSchoolStudents),
      studentNeeds: reportUtils.getStudentNeeds(inSchoolStudents),
      appliedFilters,
    });

    return data;
  };
};
