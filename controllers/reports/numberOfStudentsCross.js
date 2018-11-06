const groupBy = require('lodash/groupBy');
const map = require('lodash/map');
const uniq = require('lodash/uniq');
const enums = require('../../enums');

function getBarWidth(barCount) {
  if(barCount <= 10) return 30;
  if(barCount <= 20) return 20;
  if(barCount <= 30) return 10;

  return 5;
}

module.exports = context => {
  const { reportUtils } = context;

  return async function createNumberOfStudentsCrossReport(options) {
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
    } = options;

    const reportData = await reportUtils.getSingleTermReportData({startYearId, startTermId});
    const {
      schoolSettings,
      inSchoolStudents,
      postSchoolStudents,
      term,
      schoolYear,
      disabilities,
      activityTypeGroups,
    } = reportData;

    const [ criteria1, criteria2 ] = [
      byPostSchoolOutcome && 'postSchoolOutcome',
      bySkillTraining && 'skillTraining',
      bySupportNeed && 'supportNeed',
      byRiskLevel && 'riskLevel',
      byDisability && 'disability',
      byIEPRole && 'iepRole',
      byActivityGroupTypes && 'activityGroupTypes',
    ].filter(v => !!v);
    
    if(!criteria1 || !criteria2) throw new Error('You must select 2 categories to graph');
    const students = criteria1 === 'postSchoolOutcome' || criteria2 === 'postSchoolOutcome'
      ? postSchoolStudents
      : inSchoolStudents;

    const reportName = getTitleFromCriteria(criteria1, criteria2);
    const studentGroups = countStudentsByTwoCategories(students, criteria1, criteria2, reportData);
    const criteria1Labels = getCriteriaLabels(criteria1, reportData);
    const criteria2Labels = getCriteriaLabels(criteria2, reportData);
    const values = Object.entries(studentGroups).map(([label, counts]) => ({ label, ...counts }));
    const barCount = Object.values(studentGroups).reduce((count, value) => count + Object.values(value).length, 0);
    const barSize = getBarWidth(barCount);
    const data = { labels: criteria2Labels, values };

    const resultData = {
      reportName,
      schoolSettings,
      inSchoolStudents,
      postSchoolStudents,
      term,
      schoolYear,
      disabilities,
      activityTypeGroups,
      data,
      barSize,
      studentGroups,

      criteria1Labels,
      criteria2Labels,
    };

    return resultData;
  };
};

const criteriaNames = {
  postSchoolOutcome: 'Post-school Outcome',
  riskLevel: 'Risk Level',
  skillTraining: 'Skill Training',
  supportNeed: 'Support Needed',
  iepRole: 'IEP Role',
  disability: 'Disabilities',
  activityGroupTypes: 'Activity Group',
};

const criteriaLabels = {
  postSchoolOutcome() {
    return [
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
    ];
  },

  riskLevel() {
    return [
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
    ];
  },

  skillTraining() {
    return [
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
    ];
  },

  supportNeed() {
    return [
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
    ];
  },

  iepRole() {
    return [
      {
        key: 'Attended',
        label: 'Attended',
      },
      {
        key: 'Introduced',
        label: 'Introduced',
        value: 3,
      },
      {
        key: 'Reviewed progress',
        label: 'Reviewed progress',
        value: 1,
      },
      {
        key: 'Made suggestions',
        label: 'Made suggestions',
      },
      {
        key: 'Led most of the meeting',
        label: 'Led most of the meeting',
      },
    ];
  },

  disability(reportData) {
    return [
      ...reportData.disabilities.map(disability => {
        return {
          key: disability.name,
          label: disability.name,
        }
      }),
      {key: 'NONE', label: 'NONE'},
    ];
  },

  activityGroupTypes(reportData) {
    return reportData.activityTypeGroups.map(activityTypeGroup => ({
      key: activityTypeGroup.name,
      label: activityTypeGroup.name,
    }));
  },
};

const criteriaGroupers = {
  postSchoolOutcome(students) {
    const groups = groupBy(students, student => {
      const { postSchoolOutcome } = student;
      if(!enums.postSchoolOutcomes.includes(postSchoolOutcome)) return 'Other';
      return postSchoolOutcome;
    });
    const defaultGroups = enums.postSchoolOutcomes.reduce((groups, key) => {
      groups[key] = [];
      return groups;
    }, {});
    return {...defaultGroups, ...groups};
  },

  riskLevel(students) {
    const groups = groupBy(students, student => student.risk || 'No Data');
    return {
      'No Data': groups['No Data'] || [],
      low: groups['low'] || [],
      medium: groups['medium'] || [],
      high: groups['high'] || [],
      ultra: groups['ultra'] || [],
    };
  },

  skillTraining(students) {
    const groups = groupMultipleWith(students, student => {
      const counts = [];
      if(student.hasSelfDeterminationSkills) counts.push('hasSelfDeterminationSkills');
      if(student.hasIndependentLivingSkills) counts.push('hasIndependentLivingSkills');
      if(student.hasTravelSkills) counts.push('hasTravelSkills');
      if(student.hasSocialSkills) counts.push('hasSocialSkills');
      return counts;
    });

    return {
      hasSelfDeterminationSkills: groups.hasSelfDeterminationSkills || [],
      hasIndependentLivingSkills: groups.hasIndependentLivingSkills || [],
      hasTravelSkills: groups.hasTravelSkills || [],
      hasSocialSkills: groups.hasSocialSkills || [],
    };
  },

  supportNeed(students) {
    const groups = groupMultipleWith(students, student => {
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
      attendance: groups.attendance || [],
      behavior: groups.behavior || [],
      engagement: groups.engagement || [],
      english: groups.english || [],
      math: groups.math || [],
    };
  },

  iepRole(students) {
    const groups = groupBy(students, 'iepRole');

    const defaultGroups = enums.iepRoles.reduce((groups, key) => {
      groups[key] = [];
      return groups;
    }, {});

    return {...defaultGroups, ...groups};
  },

  disability(students, reportData) {
    const { disabilities } = reportData;
    const defaultGroups = disabilities.reduce((groups, disability) => {
      groups[disability.name] = [];
      return groups;
    }, { NONE: [] });
    const groups = groupMultipleWith(students, student => {
      const { disabilities } = student;
      if(!disabilities.length) return ['NONE'];
      return student.disabilities.map(disability => disability.name);
    });
    return {...defaultGroups, ...groups};
  },

  activityGroupTypes(students, reportData) {
    const { activityTypeGroups } = reportData;
    const groups = groupMultipleWith(students, student => {
      return map(student.activities, 'activityType.activityTypeGroup.name');
    });
    const defaultGroups = activityTypeGroups.reduce((groups, activityTypeGroup) => {
      groups[activityTypeGroup.name] = [];
      return groups;
    }, {});
    return {...defaultGroups, ...groups};
  },
};

function getCriteriaLabels(criteria, reportData) {
  if(!criteriaLabels.hasOwnProperty(criteria)) throw new Error(`Invalid criteria: "${criteria}"`);
  return criteriaLabels[criteria](reportData);
}

function groupStudentsByCriteria(students, criteria, reportData) {
  if(!criteriaGroupers.hasOwnProperty(criteria)) throw new Error(`Invalid criteria: "${criteria}"`);
  return criteriaGroupers[criteria](students, reportData);
}

function countStudentsByCriteria(students, criteria, reportData) {
  const groups = groupStudentsByCriteria(students, criteria, reportData);
  return Object.entries(groups).reduce((counts, [ key, values ]) => {
    counts[key] = values.length;
    return counts;
  }, {});
}

function countStudentsByTwoCategories(students, criteria1, criteria2, reportData) {
  const outerGroup = groupStudentsByCriteria(students, criteria1, reportData);
  return Object.entries(outerGroup).reduce((crossedGroups, [ key, students ]) => {
    crossedGroups[key] = countStudentsByCriteria(students, criteria2, reportData);
    return crossedGroups;
  }, {});
}

function getTitleFromCriteria(criteria1, criteria2) {
  const name1 = criteriaNames[criteria1];
  const name2 = criteriaNames[criteria2];
  return `Number of Students - ${name1} by ${name2}`;
}

function groupMultipleWith(array, fn) {
  const { length } = array;
  let groups = {};
  for(let i = 0; i < length; i++) {
    const countKeys = uniq(fn(array[i], i, array));
    for(let key of countKeys) {
      if(!groups[key]) groups[key] = [];
      groups[key].push(array[i]);
    }
  }
  return groups;
}

module.exports.forTesting = {
  getCriteriaLabels,
  groupStudentsByCriteria,
  countStudentsByCriteria,
  countStudentsByTwoCategories,
  getTitleFromCriteria,
  groupMultipleWith,
};
