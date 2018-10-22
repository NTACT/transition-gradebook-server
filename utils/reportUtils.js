module.exports = context => {
  const { models, controllers } = context;
  const {
    property,
    flatMap,
    map,
    filter,
    groupBy,
    first,
    last,
  } = require('lodash');

  // Loads all the data you could need for a report between a start year/term and an end year/term
  // optionally, pass an array of student ids `studentIds` to only select the 
  async function getLongitudinalReportData({ 
    startYearId,
    startTermId,
    endYearId,
    endTermId,
    studentIds,
  }) {
    endYearId = endYearId || startYearId;
    endTermId = endTermId || startTermId;

    if(!startYearId) throw {error: 'Start year is required.', status: 400};
    if(!startTermId) throw {error: 'Start term is required.', status: 400};
    if(!endYearId) throw {error: 'End year is required.', status: 400};
    if(!endTermId) throw {error: 'End term is required.', status: 400};

    startYearId = +startYearId;
    startTermId = +startTermId;
    endYearId = +endYearId;
    endTermId = +endTermId;

    let [
      startYear,
      endYear,
      startTerm,
      endTerm,
      schoolSettings,
      disabilities,
      activityTypeGroups
    ] = await Promise.all([
      findSchoolYearById(startYearId),
      findSchoolYearById(endYearId),
      findTermById(startTermId),
      findTermById(endTermId),
      getSchoolSettings(),
      getDisabilities(),
      getActivityTypeGroups(),
    ]);

    if(!startYear) throw new Error('Invalid start year.');
    if(!startTerm) throw new Error('Invalid start term.');
    if(!endYear) throw new Error('Invalid end year.');
    if(!endTerm) throw new Error('Invalid end term.');

    // Make sure startYear is before endYear and startTerm is before endTerm
    if(startYear.year > endYear.year) [startYear, endYear] = [endYear, startYear];
    if(startTerm.startDate > endTerm.startDate) [startTerm, endTerm] = [endTerm, startTerm];

    const rawSchoolYears = await models.SchoolYear
      .query()
      .orderBy('year', 'asc')
      .where('year', '>=', startYear.year)
      .andWhere('year', '<=', endYear.year)
      .eager('terms(inTermRange, orderByIndex).studentTermInfos(inStudentIds).student.disabilities', {
        inTermRange: query => query.whereBetween('startDate', [startTerm.startDate, endTerm.startDate]),
        orderByIndex: query => query.orderBy('index', 'asc'),
        inStudentIds: query => studentIds ? query.whereIn('studentId', studentIds) : query,
      });

    const schoolYearIds = map(rawSchoolYears, 'id');
    const studentActivities = await models.Activity
        .query()
        .whereIn('schoolYearId', schoolYearIds)
        .eager('[events, activityType.activityTypeGroup]');
    const studentActivitiesByYear = groupBy(studentActivities, 'schoolYearId');

    // Add additional properties to schools years and their eagerly loaded terms/students
    const schoolYears = rawSchoolYears.map(year => {
      year.yearRange = `${year.year}-${year.year+1}`;

      // For each student in each term, load risk data, gpa, etc.
      year.terms = map(year.terms, term => {
        term.startDate = new Date(term.startDate);
        term.number = term.index + 1;
        term.termType = year.termType;
        term.schoolYearName = year.yearRange;
        term.termName = year.termType === 'annual' ? '' : (year.termType[0].toUpperCase() + term.number)
        term.name = `${term.schoolYearName}${year.termType === 'annual' ? '' : (' ' + term.termName)}`;

        term.students = map(term.studentTermInfos, studentTermInfo => {
          const { riskData, risk, interventions } = controllers.riskDataController.calcTermInfoRiskData(schoolSettings, studentTermInfo);
          const activities = filter(studentActivitiesByYear[year.id] || [],
            activity => activity.studentId === studentTermInfo.student.id
          );
          const activityEvents = flatMap(activities, 'events');
          const gpa = controllers.riskDataController.calcGpa(schoolSettings, studentTermInfo);
          const sortName = `${studentTermInfo.student.lastName} ${studentTermInfo.student.firstName}`.toLowerCase();

          return {
            gpa,
            riskData,
            risk,
            interventions,
            activities,
            activityEvents,
            sortName,
            ...studentTermInfo,
            ...studentTermInfo.student,
          };
        })
        .sort((a, b) => {
          if(a.sortName === b.sortName) return 0;
          if(a.sortName > b.sortName) return 1;
          return -1;
        });

        for(let student of term.students) delete student.sortName; // client has its own sortName computed value

        term.postSchoolStudents = filter(term.students, isPostSchool);
        term.inSchoolStudents = filter(term.students, notPostSchool);

        return term;
      });

      return year;
    });

    const terms = flatMap(schoolYears, schoolYear => schoolYear.terms);

    return {
      schoolSettings,
      disabilities,
      activityTypeGroups,
      schoolYears,
      terms,
      studentActivities,
      startYear: first(schoolYears),
      startTerm: first(first(schoolYears).terms),
      endYear: last(schoolYears),
      endTerm: last(last(schoolYears).terms),
    };
  }

  // Same as getLongitudinalReportData except it only retreives data for a single year/term
  async function getSingleTermReportData({startYearId, startTermId, studentIds}) {
    const data = await getLongitudinalReportData({startYearId, startTermId, studentIds});
    data.term = data.terms[0];
    data.schoolYear = data.schoolYears[0];
    data.students = data.term.students;
    data.inSchoolStudents = data.term.inSchoolStudents;
    data.postSchoolStudents = data.term.postSchoolStudents;
    return data;
  }

  const getSchoolSettings = () => controllers.schoolSettingsController.getSchoolSettings();
  const getDisabilities = () => models.Disability.query();
  const getActivityTypeGroups = () => models.ActivityTypeGroup.query().eager('activityTypes');

  const notPostSchool = student => student.gradeLevel !== 'Post-school';
  const isPostSchool = student => student.gradeLevel === 'Post-school';
  
  function countWith(array, fn) {
    fn = typeof fn !== 'function' ? property(fn) : fn;
    const { length } = array;
    let count = 0;
    for(let i = 0; i < length; i++) {
      if(fn(array[i], i, array)) count++;
    }
    return count;
  }

  // Calls `fn` on each value in `array`
  // fn should return an array of keys to increment in `counts`
  function countMultipleWith(array, fn) {
    const { length } = array;
    let counts = {};
    for(let i = 0; i < length; i++) {
      const countKeys = fn(array[i], i, array);
      for(let key of countKeys) counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }

  async function findSchoolYearById(id) {
    return models.SchoolYear.query().where('id', id).first();
  }

  async function findTermById(id) {
    const term = await models.Term.query().where('id', id).first();
    if(term) {
      term.startDateRaw = term.startDate;
      term.startDate = new Date(term.startDate);
    }
    return term;
  }

  // filters an array of objects and returns the number of elements where the value of the specified key is equal to the expected value
  // data must be an array; key and expectedValue must be a string, a number, or a function
  const countResult = (data, key, expectedValue) => data
    .filter(entry => {
      return typeof expectedValue === 'function'
        ? expectedValue(property(key)(entry))
        : property(key)(entry) === expectedValue
    })
    .length;
  
  // wraps the value returned by countResult in an object
  const countFilteredData = (data, key, expectedValue, label) => ({
    label: label || expectedValue,
    value: countResult(data, key, expectedValue),
  });

  const countFilteredActivityEvents = (data, expectedValue) => data.filter(activity => activity.frequency === expectedValue).map(activity => activity.events.length).reduce((sum, value) => sum + value, 0);

  const countActivityEvents = (data) =>
    data.activityTypes.map(activityType => ({
      label: activityType.name,
      oneTime: countFilteredActivityEvents(activityType.activities, 'One time'),
      occasionally: countFilteredActivityEvents(activityType.activities, 'Occasionally'),
      veryFrequently: countFilteredActivityEvents(activityType.activities, '2 to 4 times per week'),
      daily: countFilteredActivityEvents(activityType.activities, 'Daily'),
      weekly: countFilteredActivityEvents(activityType.activities, 'Weekly'),
      monthly: countFilteredActivityEvents(activityType.activities, 'Monthly'),
      quarterly: countFilteredActivityEvents(activityType.activities, 'Quarterly'),
      everySemester: countFilteredActivityEvents(activityType.activities, 'Every semester'),
      annually: countFilteredActivityEvents(activityType.activities, 'Annually'),
    }));

  return {
    getLongitudinalReportData,
    getSingleTermReportData,
    countWith,
    countMultipleWith,

    countFilteredData,
    getRiskCount: data => [
      countFilteredData(data, 'risk', 'low', 'Low'),
      countFilteredData(data, 'risk', 'medium', 'Medium'),
      countFilteredData(data, 'risk', 'high', 'High'),
      countFilteredData(data, 'risk', 'ultra', 'Ultra'),
    ],

    getGenderCount: data => [
      countFilteredData(data, 'student.gender', 'male', 'Male'),
      countFilteredData(data, 'student.gender', 'female', 'Female'),
      countFilteredData(data, 'student.gender', 'trans', 'Trans'),
    ],

    getCareerDevelopmentOrGraduationPlanCount: data => [
      countFilteredData(data, 'hasGraduationPlan', null, 'No Data'),
      countFilteredData(data, 'hasGraduationPlan', false, 'No'),
      countFilteredData(data, 'hasGraduationPlan', true, 'Yes'),
    ],

    getIEPMeetingAttendance: data => [
      countFilteredData(data, 'attendedIepMeeting', null, 'No Data'),
      countFilteredData(data, 'attendedIepMeeting', false, 'No'),
      countFilteredData(data, 'attendedIepMeeting', true, 'Yes'),
    ],

    getIEPMeetingRoleCount: data => [
      countFilteredData(data, 'iepRole', 'Attended'),
      countFilteredData(data, 'iepRole', 'Introduced'),
      countFilteredData(data, 'iepRole', 'Reviewed progress'),
      countFilteredData(data, 'iepRole', 'Made suggestions'),
      countFilteredData(data, 'iepRole', 'Led most of the meeting'),
    ],

    getStudentSkillCount: data => [
      countFilteredData(data, 'hasSelfDeterminationSkills', true, 'Self-determination skills'),
      countFilteredData(data, 'hasIndependentLivingSkills', true, 'Independent living skills'),
      countFilteredData(data, 'hasTravelSkills', true, 'Travel skills'),
      countFilteredData(data, 'hasSocialSkills', true, 'Social skills'),
    ],

    getDisabilityCount: async data => [
      ...await getDisabilities().map(disability => ({
        label: disability.name,
        value: data
          .filter(student => {
            return student.disabilities.find(d => d.id === disability.id);
          })
          .length
      })),
      {
        label: 'none',
        value: data.filter(student => student.disabilities.length === 0).length
      }
    ],

    getGradeRepartition: data => [
      countFilteredData(data, 'gradeLevel', '6', 'GR6'),
      countFilteredData(data, 'gradeLevel', '7', 'GR7'),
      countFilteredData(data, 'gradeLevel', '8', 'GR8'),
      countFilteredData(data, 'gradeLevel', '9', 'GR9'),
      countFilteredData(data, 'gradeLevel', '10', 'GR10'),
      countFilteredData(data, 'gradeLevel', '11', 'GR11'),
      countFilteredData(data, 'gradeLevel', '12', 'GR12'),
      countFilteredData(data, 'gradeLevel', 'age 18', 'AGE18'),
      countFilteredData(data, 'gradeLevel', 'age 19', 'AGE19'),
      countFilteredData(data, 'gradeLevel', 'age 20', 'AGE20'),
      countFilteredData(data, 'gradeLevel', 'age 21', 'AGE21'),
    ],

    getStudentNeeds: data => [
      countFilteredData(data, 'absentPercent', (value) => value >= 10, 'who are absent 10% or more of the time'),
      countFilteredData(data, 'behaviorMarks', (value) => value > 0, 'who have 1 or more behavior marks'),
      countFilteredData(data, 'suspended', true, 'who have 1 or more suspensions this term'),
      countFilteredData(data, 'gpa', (value) => value < 2.0, 'who have less than 2.0 GPA'),
      countFilteredData(data, 'failingEnglish', true, 'who are failing English / ELA class'),
      countFilteredData(data, 'failingMath', true, 'who are failing Math class'),
      countFilteredData(data, 'failingOther', true, 'who are failing another course(s)'),
      countFilteredData(data, 'onTrack', true, 'who are on-track for grade level'),
      countFilteredData(data, 'retained', true, 'who were retained one or more years'),
      countFilteredData(data, 'hasExtracurricular', length => length > 0, 'who participate in extracurricular activities'),
      countFilteredData(data, 'interventions.attendance', true, 'Attendance'),
      countFilteredData(data, 'interventions.behavior', true, 'Behavior'),
      countFilteredData(data, 'interventions.engagement', true, 'Engagement'),
      countFilteredData(data, 'interventions.english', true, 'English'),
      countFilteredData(data, 'interventions.math', true, 'Math'),
    ],
    
    getCareerAwarenessActivities: async (yearId) => 
      countActivityEvents(await controllers.activityController.getSchoolYearActivitiesForGroup('Career Awareness', yearId)),
    
    getWorkExperienceActivities: async (yearId) => 
      countActivityEvents(await controllers.activityController.getSchoolYearActivitiesForGroup('Work Experience', yearId)),
    
    getInclusionActivities: async (yearId) => 
      countActivityEvents(await controllers.activityController.getSchoolYearActivitiesForGroup('Inclusion', yearId)),
    
    getStudentSupportsActivities: async (yearId) => 
      countActivityEvents(await controllers.activityController.getSchoolYearActivitiesForGroup('Student Supports', yearId)),
    
    getCollaborationActivities: async (yearId) => 
      countActivityEvents(await controllers.activityController.getSchoolYearActivitiesForGroup('Collaboration', yearId)),
  };
};
