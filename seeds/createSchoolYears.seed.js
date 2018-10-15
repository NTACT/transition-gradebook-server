const { gradeTypes, gradeLetters, exitCategories, postSchoolOutcomes, grades, genders, termTypes, iepRoles } = require('../enums');
const sample = require('lodash/sample');
const sampleSize = require('lodash/sampleSize');
const range = require('lodash/range');
const faker = require('faker');
const isTest = process.env.NODE_ENV === 'test';
const randomFloat = (min, max) => min + (Math.random() * (max - min));
const randomInt = (min, max) => Math.floor(randomFloat(min, max));
const maybeNull = v => Math.random() > 0.9 ? null : v;
const randomBool = (thres=0.5) => Math.random() > thres;
let studentIdCounter = 1;

module.exports = async function createSchoolYears({ models }) {
  if(process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') return;

  const disabilities = await models.Disability.query();
  let previousSchoolYear = null;

  for(let year = 2015; year <= 2018; year++) {
    const schoolYear = await createSchoolYear({
      year: year,
      students: range(
        isTest ? 10 : 50
      ).map(() => generateStudent())
    });
    if(previousSchoolYear) await migrateStudents(previousSchoolYear.id, schoolYear);
    previousSchoolYear = schoolYear;
  }

  // Creates a school year with students, terms, and student term joins
  async function createSchoolYear({students, ...fields}) {
    const termType = sample(termTypes);
    let termCount;
    const year = fields.year;

    switch(termType) {
      case 'annual': termCount = 1; break;
      case 'semester': termCount = 2; break;
      case 'trimester': termCount = 3; break;
      case 'quarter': termCount = 4; break;
    }

    const yearStart = new Date(year, 0, 1, 1, 1, 1, 1).getTime();
    const termLength = Math.floor((1000 * 60 * 60 * 24 * 365) / termCount);
    const terms = range(termCount).map(i => {
      return {
        index: i,
        startDate: JSON.stringify(new Date(yearStart + (i * termLength))).slice(1, -1)
      };
    });

    const schoolYear = await models.SchoolYear.query().insertGraph({
      terms,
      termType,
      ...fields
    });

    const createdStudents = await models.Student.query().insert(students);

    // Create studentTermInfo's for each student for each term
    let studentIndex = 0;
    for(let student of createdStudents) {
      const gradeFields = generateGradeInfo({gradeLevel: studentIndex === 3 ? 'Post-school' : null});
      for(let term of schoolYear.terms) {
        await models.StudentTermInfo.query().insert(
          generateStudentTermInfo({
            studentId: student.id,
            termId: term.id,
            ...gradeFields,
          })
        );
      }
      studentIndex++;
    }

    // Add random disabilities
    for(let student of createdStudents) {
      const studentDisabilities = sampleSize(disabilities, randomInt(0, 5));
      await models.StudentDisability.query().insert(
        studentDisabilities.map(disability => ({
          studentId: student.id,
          disabilityId: disability.id,
        }))
      );
    }

    return schoolYear;
  }

  async function migrateStudents(prevSchoolYearId, schoolYear) {
    const prevSchoolYear = await models.SchoolYear.query().where('id', prevSchoolYearId).eager('terms.studentTermInfos.student').first();
    const prevYearStudents = prevSchoolYear.terms[0].studentTermInfos.map(t => t.student);
    const studentsToMigrate = sampleSize(prevYearStudents, randomInt(isTest ? 3 : 30, prevYearStudents.length));

    // Create studentTermInfo's for each student for each term
    let studentIndex = 0;
    for(let student of studentsToMigrate) {
      // grade levels should stay consistent between terms
      const gradeFields = generateGradeInfo({gradeLevel: studentIndex === 3 ? 'Post-school' : null});
      for(let term of schoolYear.terms) {
        await models.StudentTermInfo.query().insert(
          generateStudentTermInfo({
            studentId: student.id,
            termId: term.id,
            ...gradeFields,
          })
        );
      }
      studentIndex++;
    }
  }

};

function generateStudentTermInfo(fields={}) {
  const isProblemStudent = randomBool(0.8);
  const gradeType = fields.gradeType || sample(gradeTypes);
  let grade;

  if(fields.grade == null) {
    switch(gradeType) {
      case 'percent':
        grade = isProblemStudent ? randomFloat(0, 80) : randomFloat(70, 100);
        grade = Number.parseFloat(grade).toPrecision(4);
      break;
      case 'gpa':
        grade = isProblemStudent ? randomFloat(0, 3) : randomFloat(2.5, 4);
        grade = Number.parseFloat(grade).toPrecision(3);
      break;
      case 'letter': grade = isProblemStudent ? sample(gradeLetters.slice(4)) : sample(gradeLetters.slice(0, 4)); break;
      default: throw new Error(`Invalid grade type ${gradeType}`);
    }
  } else {
    grade = fields.grade;
  }

  return {
    gradeType: gradeType,
    grade: '' + grade,
    absentPercent: maybeNull(isProblemStudent ? randomInt(0, 30) : 0),
    behaviorMarks: maybeNull(isProblemStudent ? randomInt(0, 5) : 0),
    suspended: maybeNull(randomBool(0.9)),
    failingEnglish: maybeNull(isProblemStudent ? randomBool() : false),
    failingMath: maybeNull(isProblemStudent ? randomBool() : false),
    failingOther: maybeNull(isProblemStudent ? randomBool() : false),
    onTrack: maybeNull(isProblemStudent ? randomBool(0.8) : true),
    retained: maybeNull(isProblemStudent ? randomBool(0.8) : false),
    schoolsAttended: maybeNull(isProblemStudent ? randomInt(0, 5) : 1),
    hasExtracurricular: maybeNull(isProblemStudent ? randomBool(0.8) : true),
    hasSelfDeterminationSkills: maybeNull(randomBool()),
    hasIndependentLivingSkills: maybeNull(randomBool()),
    hasTravelSkills: maybeNull(randomBool()),
    hasSocialSkills: maybeNull(randomBool()),
    hasGraduationPlan: maybeNull(randomBool()),
    attendedIepMeeting: maybeNull(randomBool()),
    iepRole: sample(iepRoles),
    ...fields,
  };
}

function generateStudent(fields={}) {
  return {
    studentId: `id-${studentIdCounter++}`,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    birthday: JSON.stringify(new Date(randomInt(1980, 2010), randomInt(0, 11), randomInt(1, 26), 1, 1, 1, 1)).slice(1, -1),
    ell: randomBool(),
    gender: sample(genders),
    ...fields,
  };
}

function generateGradeInfo(fields={}) {
  const gradeLevel = fields.gradeLevel || sample(grades);
  const exitCategory = fields.exitCategory || gradeLevel === 'Post-school'
    ? randomBool() ? faker.lorem.sentence() : sample(exitCategories)
    : null;
  const postSchoolOutcome = fields.postSchoolOutcome || gradeLevel === 'Post-school'
    ? randomBool() ? faker.lorem.sentence() : sample(postSchoolOutcomes)
    : null;
  return {gradeLevel, exitCategory, postSchoolOutcome};
}
