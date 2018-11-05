
module.exports = context => {
  const { reportUtils } = context;
  const map = require('lodash/map');
  const flatMap = require('lodash/flatMap');
  const countBy = require('lodash/countBy');

  return async function createNumberOfStudentsLongitudinalReport(options) {
    const {
      startYearId,
      endYearId,
      startTermId,
      endTermId,
      byPostSchoolOutcome,
      byRiskLevel,
      bySkillTraining,
      bySupportNeed,
      byIEPRole,
      byDisability,
      byActivityGroupTypes,
    } = options;

    const {
      schoolSettings,
      disabilities,
      activityTypeGroups,
      schoolYears,
      startYear,
      startTerm,
      endYear,
      endTerm,
    } = await reportUtils.getLongitudinalReportData({startYearId, startTermId, endYearId, endTermId});

    const data = {
      schoolSettings,
      startYear,
      startTerm,
      endYear,
      endTerm,

      postSchool: byPostSchoolOutcome && {
        labels: [
          {
            key: 'postSecondaryEducation',
            label: 'Post-Secondary Education',
          },
          {
            key: 'postSchoolEmployment',
            label: 'Post-School Employment',
          },
          {
            key: 'both',
            label: 'Both',
          },
        ],

        values: flatMap(schoolYears, year =>
          map(year.terms, term => {
            const postSchoolOutcomeCounts = countBy(term.postSchoolStudents, 'postSchoolOutcome');
            return {
              termId: term.id,
              label: term.name,
              postSecondaryEducation: postSchoolOutcomeCounts['Postsecondary Education'] || 0,
              postSchoolEmployment: postSchoolOutcomeCounts['Post-School Employment'] || 0,
              both: postSchoolOutcomeCounts['Both'] || 0,
            };
          })
        ),
      },

      risks: byRiskLevel && {
        labels: [
          {
            key: 'No Data',
            label: 'No Data',
          },
          {
            key: 'low',
            label: 'Low',
          },
          {
            key: 'medium',
            label: 'Medium',
          },
          {
            key: 'high',
            label: 'High',
          },
          {
            key: 'ultra',
            label: 'Ultra'
          },
        ],
        values: flatMap(schoolYears, year => 
          map(year.terms, term => {
            const riskCounts = countBy(term.inSchoolStudents, 'risk');
            return {
              termId: term.id,
              label: term.name,
              'No Data': riskCounts['No Data'] || 0,
              low: riskCounts.low || 0,
              medium: riskCounts.medium || 0,
              high: riskCounts.high || 0,
              ultra: riskCounts.ultra || 0,
            };
          })
        ),
      },

      skills: bySkillTraining && {
        labels: [
          {
            key: 'hasSelfDeterminationSkills',
            label: 'Self-Determination Skills',
          },
          {
            key: 'hasIndependentLivingSkills',
            label: 'Independent-Living Skills',
          },
          {
            key: 'hasTravelSkills',
            label: 'Travel Skills',
          },
          {
            key: 'hasSocialSkills',
            label: 'Social Skills',
          },
        ],
        values: flatMap(schoolYears, year =>
          map(year.terms, term => {
            const { inSchoolStudents } = term;
            const counts = reportUtils.countMultipleWith(inSchoolStudents, student => {
              const counts = [];
              if(student.hasSelfDeterminationSkills) counts.push('hasSelfDeterminationSkills');
              if(student.hasIndependentLivingSkills) counts.push('hasIndependentLivingSkills');
              if(student.hasTravelSkills) counts.push('hasTravelSkills');
              if(student.hasSocialSkills) counts.push('hasSocialSkills');
              return counts;
            });

            return {
              termId: term.id,
              label: term.name,
              hasSelfDeterminationSkills: counts.hasSelfDeterminationSkills || 0,
              hasIndependentLivingSkills: counts.hasIndependentLivingSkills || 0,
              hasTravelSkills: counts.hasTravelSkills || 0,
              hasSocialSkills: counts.hasSocialSkills || 0,
            };
          })
        ),
      },

      supportNeeded: bySupportNeed && {
        labels: [
          {
            key: 'attendance',
            label: 'Attendance',
          },
          {
            key: 'behavior',
            label: 'Behavior',
          },
          {
            key: 'engagement',
            label: 'Engagement',
          },
          {
            key: 'english',
            label: 'English',
          },
          {
            key: 'math',
            label: 'Math',
          },
        ],
        values: flatMap(schoolYears, year =>
          map(year.terms, term => {
            const { inSchoolStudents } = term;
            const counts = reportUtils.countMultipleWith(inSchoolStudents, student => {
              const { interventions } = student;
              const counts = [];
              if(interventions.attendance) counts.push('attendance');
              if(interventions.behavior) counts.push('behavior');
              if(interventions.engagement) counts.push('engagement');
              if(interventions.english) counts.push('english');
              if(interventions.math) counts.push('math');
              return counts;
            });

            return {
              termId: term.id,
              label: term.name,
              attendance: counts.attendance || 0,
              behavior: counts.behavior || 0,
              engagement: counts.engagement || 0,
              english: counts.english || 0,
              math: counts.math || 0,
            }
          }),
        ),
      },

      roleInIEPMeeting: byIEPRole && {
        labels: [
          {
            key: 'attended',
            label: 'Attended',
          },
          {
            key: 'introduced',
            label: 'Introduced',
            value: 3,
          },
          {
            key: 'reviewedProgress',
            label: 'Reviewed Progress',
            value: 1,
          },
          {
            key: 'madeSuggestions',
            label: 'Made Suggestions',
          },
          {
            key: 'ledMostOfMeeting',
            label: 'Led Most of the Meeting',
          },
        ],
        values: flatMap(schoolYears, year =>
          map(year.terms, term => {
            const { inSchoolStudents } = term;
            const iepRoleCounts = countBy(inSchoolStudents, 'iepRole');

            return {
              termId: term.id,
              label: '2018-2019 Q1',
              attended: iepRoleCounts['Attended'] || 0,
              introduced: iepRoleCounts['Introduced'] || 0,
              reviewedProgress: iepRoleCounts['Reviewed progress'] || 0,
              madeSuggestions: iepRoleCounts['Made suggestions'] || 0,
              ledMostOfMeeting: iepRoleCounts['Led most of the meeting'] || 0,
            }
          })
        ),
      },
      
      disabilities: byDisability && {
        labels: [
          ...disabilities.map(disability => {
            return {
              key: disability.name,
              label: disability.name,
            }
          }),
          {key: 'NONE', label: 'NONE'},
        ],
        values: flatMap(schoolYears, year =>
          map(year.terms, term => {
            const { inSchoolStudents } = term;
            const disabilityCounts = reportUtils.countMultipleWith(inSchoolStudents, student => {
              const { disabilities } = student;
              if(!disabilities.length) return ['NONE'];
              return student.disabilities.map(disability => disability.name);
            });

            return {
              termId: term.id,
              label: term.name,
              NONE: 0,
              // default each disability count to 0
              ...disabilities.map(d => d.name).reduce((defaults, disabilityName) => {
                defaults[disabilityName] = 0;
                return defaults;
              }, {}),
              ...disabilityCounts,
            };
          })
        ),
      },

      activities: byActivityGroupTypes && {
        labels: activityTypeGroups.map(activityTypeGroup => ({
          key: activityTypeGroup.id,
          label: activityTypeGroup.name,
        })),

        values: flatMap(schoolYears, year => 
          map(year.terms, term => {
            const { inSchoolStudents } = term;
            const counts = reportUtils.countMultipleWith(inSchoolStudents, student => {
              return map(student.activities, 'activityType.activityTypeGroup.id');
            });
            return {
              termId: term.id,
              label: term.name,
              ...activityTypeGroups.reduce((defaults, group) => {
                defaults[group.id] = 0;
                return defaults;
              }),
              ...counts,
            };
          })
        ),
      },
    };

    require('fs').writeFileSync('./report-data', JSON.stringify(data, null, 2));

    return data;
  };
};
