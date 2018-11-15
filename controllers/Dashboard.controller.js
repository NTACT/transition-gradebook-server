module.exports = context => {
  const { groupBy, map } = require('lodash');
  const { models } = context;
  const { getSingleTermReportData } = require('../utils/reportUtils')(context);
  const enums = require('../enums');

  class DashboardController {
    async getDashboardDataForTerm(termId) {
      const { schoolYearId } = await models.Term.query().where('id', termId).first();
      const { inSchoolStudents, activityTypeGroups, studentActivities } = await getSingleTermReportData({
        startYearId: schoolYearId,
        startTermId: termId,
      });
      const students = inSchoolStudents;
      const studentMap = students.reduce((map, student) => {
        map.set(student.id, student);
        return map;
      }, new Map());

      // Calculate grade groups
      const studentGradeLookup = groupBy(students, 'gradeLevel');
      const studentGradeGroups = enums.grades
        .filter(gradeLevel => gradeLevel !== 'Post-school')
        .map(gradeLevel => ({
          gradeLevel,
          students: map(studentGradeLookup[gradeLevel] || [], 'id')
        }));

      const activityGroups = activityTypeGroups.map(group => {
        const students = new Set();
        const activities = studentActivities.filter(activity => {
          const student = studentMap.get(activity.studentId);
          if(student && activity.activityType.activityTypeGroup.id === group.id) {
            students.add(student.id);
            return true;
          }
        });

        return {
          ...group,
          activityCount: activities.length,
          students: Array.from(students),
        };
      });

      // Calculate risk groups
      const studentRiskLookup = groupBy(students, 'risk');
      const studentRiskGroups = [
        {risk: 'No Data', students: map(studentRiskLookup['No Data'] || [], 'id')},
        {risk: 'low', students: map(studentRiskLookup['low'] || [], 'id')},
        {risk: 'medium', students: map(studentRiskLookup['medium'] || [], 'id')},
        {risk: 'high', students: map(studentRiskLookup['high'] || [], 'id')},
        {risk: 'ultra', students: map(studentRiskLookup['ultra'] || [], 'id')},
      ];
      const offTrackStudents = map(students.filter(s => s.onTrack === false), 'id');
      const chronicAbsentStudents = map(students.filter(s => s.absentPercent >= 10), 'id');


      const interventionGroups = Object.entries(
        students.reduce((interventionGroups, student) => {
          const {
            attendance,
            behavior,
            engagement,
            english,
            math, 
          } = student.interventions;
          if(attendance) interventionGroups.attendance.push(student);
          if(behavior) interventionGroups.behavior.push(student);
          if(engagement) interventionGroups.engagement.push(student);
          if(english) interventionGroups.english.push(student);
          if(math) interventionGroups.math.push(student);
          return interventionGroups;
        }, {
          attendance: [],
          behavior: [],
          engagement: [],
          english: [],
          math: [],
        })
      ).map(([name, students]) => ({
        name,
        students: map(students, 'id')
      }));

      const raceGroupMap = {
        ...enums.races.reduce((defaults, race) => {
          defaults[race] = [];
          return defaults;
        }, {}),
        ...groupBy(students, student => student.race || 'N/A'),
      };

      const raceGroups = Object.entries(raceGroupMap).map(([ race, students ]) => {
        return {
          race,
          students: map(students, 'id'),
        };
      });

      for(let student of students) {
        delete student.riskData; // let client handle this
        delete student.risk;
      }

      return {
        students,

        // For: "Total students"
        studentGradeGroups,

        // For: "Number of students receiving Activities"
        activityGroups,
        
        // For: "Number of students receiving Activities"
        studentRiskGroups,
        offTrackStudents,
        chronicAbsentStudents,

        // For: "Students who need intervention / supports in"
        interventionGroups,

        // For: "Total number of students by race"
        raceGroups,
      };
    }
  }

  return DashboardController;
};
