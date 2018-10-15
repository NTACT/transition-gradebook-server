
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

    const data = await resolveObject({
      schoolSettings,
      term,
      schoolYear: models.SchoolYear.query().where('id', term.schoolYearId).eager('terms').first(),
      riskRepartition: reportUtils.getRiskCount(inSchoolStudents),
      disabilityRepartition: reportUtils.getDisabilityCount(inSchoolStudents),
      careerAwarenessActivities: reportUtils.getCareerAwarenessActivities(schoolYear.id),
      workExperienceActivities: reportUtils.getWorkExperienceActivities(schoolYear.id),
      inclusionActivities: reportUtils.getInclusionActivities(schoolYear.id),
      studentSupportsActivities: reportUtils.getStudentSupportsActivities(schoolYear.id),
      collaborationActivities: reportUtils.getCollaborationActivities(schoolYear.id),
      gradeAndAgeRepartition: reportUtils.getGradeRepartition(inSchoolStudents),
      roleInIEPMeeting: reportUtils.getIEPMeetingRoleCount(inSchoolStudents),
      receivedSkillsTraining: reportUtils.getStudentSkillCount(inSchoolStudents),
      gender: reportUtils.getGenderCount(inSchoolStudents),
      cdgp: reportUtils.getCareerDevelopmentOrGraduationPlanCount(inSchoolStudents),
      attendedIEPMeeting: reportUtils.getIEPMeetingAttendance(inSchoolStudents),
      studentNeeds: reportUtils.getStudentNeeds(inSchoolStudents),
    });

    return data;
  };
};
