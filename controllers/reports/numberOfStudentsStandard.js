module.exports = context => {
  const { reportUtils } = context;
  const enums = require('../../enums');
  const map = require('lodash/map');
  const countBy = require('lodash/countBy');

  return async function createNumberOfStudentsStandardReport(options) {
    const {
      startYearId,
      startTermId,
      byPostSchoolOutcome,
      byRiskLevel,
      bySkillTraining,
      bySupportNeed,
      byIEPRole,
      byDisability,
      byActivityGroupTypes,
      byRaces,
      byGenders
    } = options;

    const {
      schoolSettings,
      inSchoolStudents,
      postSchoolStudents,
      term,
      schoolYear,
      disabilities,
      activityTypeGroups
    } = await reportUtils.getSingleTermReportData({ startYearId, startTermId });

    function calcPostSchool() {
      const counts = countBy(postSchoolStudents, 'postSchoolOutcome');
      return map(enums.postSchoolOutcomes, postSchoolOutcome => {
        return {
          label: postSchoolOutcome,
          value: counts[postSchoolOutcome] || 0
        };
      });
    }

    function calcGenders() {
      const genderCounts = countBy(inSchoolStudents, 'gender');

      return enums.genders.map(gender => ({
        label: gender,
        value: genderCounts[gender] || 0
      }));
    }

    function calcRaces() {
      const raceCounts = countBy(
        inSchoolStudents,
        student => student.race || 'N/A'
      );

      return [
        ...enums.races.map(race => ({
          label: race,
          value: raceCounts[race] || 0
        })),
        { label: 'N/A', value: raceCounts['N/A'] || 0 }
      ];
    }

    function calcRisks() {
      const riskCounts = countBy(inSchoolStudents, 'risk');
      return [
        {
          label: 'No Data Risk',
          value: riskCounts['No Data'] || 0
        },
        {
          label: 'Low Risk',
          value: riskCounts.low || 0
        },
        {
          label: 'Medium Risk',
          value: riskCounts.medium || 0
        },
        {
          label: 'High Risk',
          value: riskCounts.high || 0
        },
        {
          label: 'Ultra Risk',
          value: riskCounts.ultra || 0
        }
      ];
    }

    function calcSkills() {
      const counts = reportUtils.countMultipleWith(
        inSchoolStudents,
        student => {
          const counts = [];
          if (student.hasSelfDeterminationSkills)
            counts.push('hasSelfDeterminationSkills');
          if (student.hasIndependentLivingSkills)
            counts.push('hasIndependentLivingSkills');
          if (student.hasTravelSkills) counts.push('hasTravelSkills');
          if (student.hasSocialSkills) counts.push('hasSocialSkills');
          return counts;
        }
      );

      return [
        {
          label: 'Self-Determination Skills/self advocacy training',
          value: counts.hasSelfDeterminationSkills || 0
        },
        {
          label: 'Independent-Living Skills',
          value: counts.hasIndependentLivingSkills || 0
        },
        {
          label: 'Travel Skills',
          value: counts.hasTravelSkills || 0
        },
        {
          label: 'Social Skills',
          value: counts.hasSocialSkills || 0
        }
      ];
    }

    function calcSupportneeded() {
      const counts = reportUtils.countMultipleWith(
        inSchoolStudents,
        student => {
          const { interventions } = student;
          const counts = [];
          if (interventions.attendance) counts.push('attendance');
          if (interventions.behavior) counts.push('behavior');
          if (interventions.engagement) counts.push('engagement');
          if (interventions.english) counts.push('english');
          if (interventions.math) counts.push('math');
          return counts;
        }
      );

      return [
        {
          label: 'Attendance',
          value: counts.attendance || 0
        },
        {
          label: 'Behavior',
          value: counts.behavior || 0
        },
        {
          label: 'Engagement',
          value: counts.engagement || 0
        },
        {
          label: 'English',
          value: counts.english || 0
        },
        {
          label: 'Math',
          value: counts.math || 0
        }
      ];
    }

    function calcRoleInIEPMeeting() {
      const counts = countBy(inSchoolStudents, 'iepRole');
      return map(enums.iepRoles, iepRole => {
        return {
          label: iepRole,
          value: counts[iepRole] || 0
        };
      });
    }

    function calcDisabilities() {
      const counts = reportUtils.countMultipleWith(
        inSchoolStudents,
        student => {
          const { disabilities } = student;
          if (!disabilities.length) return ['none'];
          return map(disabilities, 'id');
        }
      );
      return [
        ...disabilities.map(disability => ({
          label: disability.name,
          value: counts[disability.id] || 0
        })),
        {
          label: 'NONE',
          value: counts.none || 0
        }
      ];
    }

    function calcActivities() {
      const counts = reportUtils.countMultipleWith(inSchoolStudents, student =>
        map(student.activities, 'activityType.activityTypeGroup.id')
      );
      return activityTypeGroups.map(group => {
        return {
          label: group.name,
          value: counts[group.id] || 0
        };
      });
    }

    const data = {
      schoolSettings,
      term,
      schoolYear,
      postSchool: byPostSchoolOutcome && calcPostSchool(),
      risks: byRiskLevel && calcRisks(),
      skills: bySkillTraining && calcSkills(),
      supportNeeded: bySupportNeed && calcSupportneeded(),
      roleInIEPMeeting: byIEPRole && calcRoleInIEPMeeting(),
      disabilities: byDisability && calcDisabilities(),
      activities: byActivityGroupTypes && calcActivities(),
      genders: byGenders && calcGenders(),
      races: byRaces && calcRaces()
    };

    return data;
  };
};
