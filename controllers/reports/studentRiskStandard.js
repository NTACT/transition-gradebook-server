module.exports = context => {
  const _ = require('lodash');
  const { map } = _;
  const { reportUtils } = context;

  return async function runStudentRiskStandardReport(options) {
    const { 
      schoolSettings,
      inSchoolStudents,
      schoolYear,
      term,
    } = await reportUtils.getSingleTermReportData(options);

    return {
      schoolSettings,
      schoolYear,
      term,
      students: map(inSchoolStudents, student => {
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
            hasGraduationPlan: student.hasGraduationPlan,
            disabilities: map(student.disabilities, 'name'),
            iep: {
              attended: student.attendedIepMeeting,
              roleDetails: student.iepRole,
            },
          },
          riskFactors: [
            {
              label: 'Suspended this year?',
              value: student.suspended,
            },
            {
              label: 'Failing math class?',
              value: student.failingMath,
            },
            {
              label: 'Retained one or more years?',
              value: student.retained,
            },
            {
              label: 'Percentage of time absent',
              value: student.absentPercent == null ? 'No Data' : (student.absentPercent + '%'),
            },
            {
              label: 'GPA',
              value: student.gpa,
            },
            {
              label: 'Failing other course(s)?',
              value: student.failingOther,
            },
            {
              label: 'Number of schools attended K-present',
              value: student.schoolsAttended,
            },
            {
              label: 'Number of behavior marks / office referrals this year',
              value: student.behaviorMarks,
            },
            {
              label: 'Failing English / LEA class?',
              value: student.failingEnglish,
            },
            {
              label: 'On-track for grade level?',
              value: student.onTrack,
            },
            {
              label: 'Participated in at least one extracurricular activitiy?',
              value: student.hasExtracurricular,
            },
          ],
          studentNeeds: [
            {
              label: 'Attendance',
              value: student.interventions.attendance,
            },
            {
              label: 'Behavior',
              value: student.interventions.behavior,
            },
            {
              label: 'Engagement',
              value: student.interventions.engagement,
            },
            {
              label: 'English / LEA',
              value: student.interventions.english,
            },
            {
              label: 'Math',
              value: student.interventions.math,
            },
          ]
        };
      })
    };
  };
};
