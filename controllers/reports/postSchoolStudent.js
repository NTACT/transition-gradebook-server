module.exports = context => {
  const _ = require('lodash');
  const enums = require('../../enums');
  const { map } = _;
  const { reportUtils } = context;

  return async function runPostSchoolStudentReport(options) {
    const {
      schoolSettings,
      postSchoolStudents,
      schoolYear,
      term,
    } = await reportUtils.getSingleTermReportData(options);
    const exitCategories = new Set(enums.exitCategories);
    const postSchoolOutcomes = new Set(enums.postSchoolOutcomes);

    return {
      schoolSettings,
      schoolYear,
      term,
      students: map(postSchoolStudents, student => {
        const exitCategoryExists = student.exitCategory != null;
        const postSchoolOutcomeExists = student.postSchoolOutcome != null;
        return {
          id: student.id,
          studentInfo: {
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: student.gender,
            grade: student.gradeLevel,
            risk: student.risk,
            ell: student.ell,
            disabilities: map(student.disabilities, 'name'),
            iep: {
              attended: student.attendedIepMeeting,
              roleDetails: student.iepRole,
            },
          },
          exitCategory1: [
            {
              label: 'Graduated with regular diploma',
              value: exitCategoryExists && student.exitCategory === 'Graduated with regular diploma',
            },
            {
              label: 'Graduated with State-defined alternate diploma',
              value: exitCategoryExists && student.exitCategory === 'Graduated with State-defined alternate diploma',
            },
          ],
          exitCategory2: [
            {
              label: 'Exited with a certificate or other non-standard diploma/exiting credential',
              value: exitCategoryExists && student.exitCategory === 'Exited with a certificate or other non-standard diploma/exiting credential',
            },
            {
              label: 'Dropped out',
              value: exitCategoryExists && student.exitCategory === 'Dropped out',
            },
          ],
          exitCategory3: [
            {
              label: 'Aged out',
              value: exitCategoryExists && student.exitCategory === 'Aged out',
            },
            {
              label: 'Died',
              value: exitCategoryExists && student.exitCategory === 'Died',
            },
            {
              label: 'Other',
              value: exitCategoryExists && student.exitCategory === 'Other' || !exitCategories.has(student.exitCategory),
              otherValue: exitCategoryExists && !exitCategories.has(student.exitCategory) && student.exitCategory
                ? `Other (${student.exitCategory})`
                : 'Other'
            },
          ],
          postSchoolOutcomes: [
            {
              label: 'Post-Secondary Education',
              value: postSchoolOutcomeExists && student.postSchoolOutcome === 'Post-Secondary Education',
            },
            {
              label: 'Post-School Employment',
              value: postSchoolOutcomeExists && student.postSchoolOutcome === 'Post-School Employment',
            },
            {
              label: 'Both',
              value: postSchoolOutcomeExists && student.postSchoolOutcome === 'Both',
            },
            {
              label: 'Other',
              value: postSchoolOutcomeExists && (student.postSchoolOutcome === 'Other' || !postSchoolOutcomes.has(student.postSchoolOutcome)),
              otherValue: postSchoolOutcomeExists && !postSchoolOutcomes.has(student.postSchoolOutcome) && student.postSchoolOutcome
                ? `Other (${student.postSchoolOutcome})`
                : 'Other'
            },
          ],
        };
      })
    };

  }

};
