const enums = require('../enums');
const range = require('lodash/range');
const faker = require('faker');

module.exports = async function createActivities({ models }) {
  if(process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') return;
  const { SchoolYear, Activity, ActivityType } = models;

  const activityTypes = await ActivityType.query();
  const schoolYears = await SchoolYear.query().eager('terms.studentTermInfos.student');

  for(let schoolYear of schoolYears) {
    const students = schoolYear.terms[0].studentTermInfos.map(t => t.student);
    for(let student of students) {
      const activityCount = randInt(4, 12);

      await Activity.query().insertGraph(range(0, activityCount).map(() => ({
        schoolYearId: schoolYear.id,
        studentId: student.id,
        notes: faker.lorem.sentences(),
        frequency: sampleArray(enums.activityFrequencies),
        activityTypeId: sampleArray(activityTypes).id,
        events: range(1, randInt(2, 5)).map(() => ({
          eventTime: `${schoolYear.year}-06-12T01:01:01.110Z`
        }))
      })));
    }
  }

  function randInt(min, max) { return min + Math.floor(Math.random() * (max - min)); }
  function sampleArray(array) { return array[randInt(0, array.length)];}
  function range(min, max) { return Array.from({length: max-min}).map((_, i) => i + min); }
};

module.exports.runOrder = 4;
