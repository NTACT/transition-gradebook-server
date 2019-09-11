module.exports = context => {
  const _ = require('lodash');
  const { map } = _;
  const { reportUtils } = context;

  const isActivityGroupType = groupTypeName => activity =>
    activity.activityType.activityTypeGroup.name === groupTypeName;
  const isCareerAwarenessActivity = isActivityGroupType('Career Awareness');
  const isWorkExperienceActivity = isActivityGroupType('Work Experience');
  const isInclusionActivity = isActivityGroupType('Inclusion');
  const isStudentSupportsActivity = isActivityGroupType('Student Supports');
  const isCollaborationActivity = isActivityGroupType('Collaboration');

  const toActivityRow = activity => ({
    label: activity.activityType.name,
    frequency: activity.frequency,
    events: activity.events.length,
    notes: activity.notes || ''
  });

  return async function runStudentReport(options) {
    const {
      schoolSettings,
      inSchoolStudents,
      schoolYear,
      term
    } = await reportUtils.getSingleTermReportData(options);

    return {
      schoolSettings,
      schoolYear,
      term,
      activitiesHeaders: {
        events: '# Events',
        frequency: 'Frequency',
        notes: 'Notes'
      },
      students: map(inSchoolStudents, student => {
        return {
          id: student.id,
          studentInfo: {
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: student.gender,
            race: student.race,
            grade: student.grade,
            gradeLevel: student.gradeLevel,
            risk: student.risk,
            ell: student.ell,
            hasGraduationPlan: student.hasGraduationPlan,
            disabilities: map(student.disabilities, 'name'),
            iep: {
              attended: student.attendedIepMeeting,
              roleDetails: student.iepRole
            },
            postSchoolGoals: student.postSchoolGoals
          },

          careerAwareness: _.chain(student.activities)
            .filter(isCareerAwarenessActivity)
            .map(toActivityRow)
            .value(),

          paidWork: _.chain(student.activities)
            .filter(isWorkExperienceActivity)
            .map(toActivityRow)
            .value(),

          inclusion: _.chain(student.activities)
            .filter(isInclusionActivity)
            .map(toActivityRow)
            .value(),

          support: _.chain(student.activities)
            .filter(isStudentSupportsActivity)
            .map(toActivityRow)
            .value(),

          collaboration: _.chain(student.activities)
            .filter(isCollaborationActivity)
            .map(toActivityRow)
            .value(),

          riskFactors: [
            {
              label: 'Suspended this year?',
              value: student.suspended
            },
            {
              label: 'Failing math class?',
              value: student.failingMath
            },
            {
              label: 'Retained one or more years?',
              value: student.retained
            },
            {
              label: 'Percentage of time absent',
              value:
                student.absentPercent == null
                  ? 'No Data'
                  : student.absentPercent + '%'
            },
            {
              label: 'GPA',
              value: student.gpa
            },
            {
              label: 'Failing other course(s)?',
              value: student.failingOther
            },
            {
              label: 'Number of schools attended K-present',
              value: student.schoolsAttended
            },
            {
              label: 'Number of behavior marks / office referrals this year',
              value: student.behaviorMarks
            },
            {
              label: 'Failing English / LEA class?',
              value: student.failingEnglish
            },
            {
              label: 'On-track for grade level?',
              value: student.onTrack
            },
            {
              label: 'Participated in at least one extracurricular activitiy?',
              value: student.hasExtracurricular
            }
          ],

          skills: [
            {
              label: 'Self-determination Skills/self advocacy training',
              value: student.hasSelfDeterminationSkills
            },
            {
              label: 'Independent-living Skills',
              value: student.hasIndependentLivingSkills
            },
            {
              label: 'Travel Skills',
              value: student.hasTravelSkills
            },
            {
              label: 'Social Skills',
              value: student.hasSocialSkills
            }
          ],

          studentNeeds: [
            {
              label: 'Attendance',
              value: student.interventions.attendance
            },
            {
              label: 'Behavior',
              value: student.interventions.behavior
            },
            {
              label: 'Engagement',
              value: student.interventions.engagement
            },
            {
              label: 'English / LEA',
              value: student.interventions.english
            },
            {
              label: 'Math',
              value: student.interventions.math
            }
          ]
        };
      })
    };
  };
};
