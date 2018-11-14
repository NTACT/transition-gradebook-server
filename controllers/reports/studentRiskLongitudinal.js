module.exports = context => {
  const _ = require('lodash');
  const findMaxRisk = require('../../utils/findMaxRisk');
  const { map, compact, property, uniqBy, flatMap, maxBy } = _;
  const { reportUtils } = context;

  function maybeKey(key) {
    const getValue = property(key);
    return object => object ? getValue(object) : null;
  }

  return async function runStudentRiskLongitudinalReport(options) {
    const {
      schoolSettings,
      terms,
      startYear,
      startTerm,
      endYear,
      endTerm,
    } = await reportUtils.getLongitudinalReportData(options);
    const students = uniqBy(flatMap(terms, term => term.students), 'id');

    return {
      schoolSettings,
      startYear,
      startTerm,
      endYear,
      endTerm,
      students: map(students, student => {
        const termStudents = map(terms, term => ({
          term,
          student: term.students.find(s => s.id === student.id) || null,
        }));
        const students = map(termStudents, 'student');
        const maxRisk = findMaxRisk(map(compact(students), 'risk'));

        return {
          id: student.id,
          studentInfo: {
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: student.gender,
            race: student.race,
            grade: student.gradeLevel,
            risk: maxRisk,
            ell: student.ell,
            disabilities: map(student.disabilities, 'name'),
            iep: {
              attended: student.attendedIepMeeting,
              roleDetails: student.iepRole,
            },
          },
          riskFactors: {
            header: map(termStudents, ({ term, student }) => ({
              label: term.name,
              risk: student ? student.risk : 'No Data',
            })),
            rows: [
              {
                label: 'Percentage of time absent',
                values: map(students, maybeKey('absentPercent')),
              },
              {
                label: 'Behavior marks / referrals',
                values: map(students, maybeKey('behaviorMarks')),
              },
              {
                label: 'Suspended?',
                values: map(students, maybeKey('suspended')),
              },
              {
                label: 'GPA',
                values: map(students, maybeKey('gpa')),
              },
              {
                label: 'Failing English / LEA class?',
                values: map(students, maybeKey('failingEnglish')),
              },
              {
                label: 'Failing math class?',
                values: map(students, maybeKey('failingMath')),
              },
              {
                label: 'Failing other course(s)?',
                values: map(students, maybeKey('failingOther')),
              },
              {
                label: 'On-track for grade level?',
                values: map(students, maybeKey('onTrack')),
              },
              {
                label: 'Retained one or more years?',
                values: map(students, maybeKey('retained'))
              },
              {
                label: 'Number of schools attended K-present',
                values: map(students, maybeKey('schoolsAttended')),
              },
              {
                label: 'One or more extracurricular activities?',
                values: map(students, maybeKey('hasExtracurricular')),
              },
            ],
          },
          studentNeeds: {
            header: [],
            rows: [
              {
                label: 'Attendance',
                values: map(students, maybeKey('interventions.attendance')),
              },
              {
                label: 'Behavior',
                values: map(students, maybeKey('interventions.behavior')),
              },
              {
                label: 'Engagement',
                values: map(students, maybeKey('interventions.engagement')),
              },
              {
                label: 'English / ELA',
                values: map(students, maybeKey('interventions.english')),
              },
              {
                label: 'Mathematics',
                values: map(students, maybeKey('interventions.math')),
              },
            ],
          },
        };
      }),
    };
  };
};
