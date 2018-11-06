jest.setTimeout(60000 * 5); // this one might take a while
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;
const last = require('lodash/last');
const first = require('lodash/first');
const sample = require('lodash/sample');
const sampleSize = require('lodash/sampleSize');
const enums = require('../enums');

async function getLongitudinalReportOptions(rapid, options) {
  const startYear = await rapid.models.SchoolYear.query().where('year', 2016).eager('terms.studentTermInfos.student.disabilities').first();
  const middleYear = await rapid.models.SchoolYear.query().where('year', 2017).eager('terms.studentTermInfos.student.disabilities').first();
  const endYear = await rapid.models.SchoolYear.query().where('year', 2018).eager('terms.studentTermInfos.student.disabilities').first();
  const startTerm = first(startYear.terms);
  const endTerm = last(endYear.terms);
  const expectedYears = [startYear, middleYear, endYear];
  const expectedTerms = expectedYears.map(y => y.terms).reduce((a, b) => [...a, ...b], []);
  return {
    expectedYears,
    expectedTerms,
    startYear,
    endYear,
    startTerm,
    endTerm,
    startYearId: startYear.id,
    endYearId: endYear.id,
    startTermId: startTerm.id,
    endTermId: endTerm.id,
    ...options,
  };
}

describe('reports', () => {
  rapidTest('Should be able to run the summary report', async rapid => {
    await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
  });

  rapidTest('reportUtils.getLongitudinalReportData should return school years', async rapid => {
    const { schoolYears } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: 1,
      startTermId: 1,
      endYearId: 1,
      endTermId: 1,
    });

    expect(schoolYears).toBeTruthy();
    expect(Array.isArray(schoolYears)).toBeTruthy();
    expect(schoolYears.length).toEqual(1);
    expect(schoolYears[0].id).toEqual(1);
  });

  rapidTest('reportUtils.getLongitudinalReportData should return terms', async rapid => {
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: 1,
      startTermId: 1,
      endYearId: 1,
      endTermId: 1,
    });

    expect(terms).toBeTruthy();
    expect(Array.isArray(terms)).toBeTruthy();
    expect(terms.length).toEqual(1);
    expect(terms[0].id).toEqual(1);
  });

  rapidTest('reportUtils.getLongitudinalReportData should return school settings', async rapid => {
    const { schoolSettings } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: 1,
      startTermId: 1,
      endYearId: 1,
      endTermId: 1,
    });

    expect(schoolSettings).toBeTruthy();
    expect(schoolSettings.name).toEqual('School Name');
  });

  rapidTest('reportUtils.getLongitudinalReportData should return student risk data', async rapid => {
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: 1,
      startTermId: 1,
      endYearId: 1,
      endTermId: 1,
    });

    expect(terms[0].students.every(student => student))
    for(let term of terms) {
      for(let student of term.students) {
        expect(['low', 'medium', 'high', 'ultra'].includes(student.risk)).toBeTruthy();
      }
    }
  });

  rapidTest('reportUtils.getLongitudinalReportData should return student interventions', async rapid => {
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: 1,
      startTermId: 1,
      endYearId: 1,
      endTermId: 1,
    });

    expect(terms[0].students.every(student => student))
    for(let term of terms) {
      for(let student of term.students) {
        expect(typeof student.interventions).toEqual('object');
      }
    }
  });

  rapidTest('reportUtils.getLongitudinalReportData should only return years and terms specified by its options', async rapid => {
    const [ startYear, middleYear, endYear ] = await rapid.models.SchoolYear.query().whereIn('year', [2016, 2017, 2018]).orderBy('year', 'asc').eager('terms');
    const startTerm = startYear.terms[0];
    const endTerm = last(endYear.terms);
    const { schoolYears, terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: startYear.id,
      startTermId: startTerm.id,
      endYearId: endYear.id,
      endTermId: endTerm.id,
    });

    expect(schoolYears.length).toEqual(3);
    expect(terms.length).toEqual(
      startYear.terms.length + middleYear.terms.length + endYear.terms.length
    );
  });

  rapidTest('reportUtils.getLongitudinalReportData should only return students in the years/terms specified by its options', async rapid => {
    const [ startYear, middleYear, endYear ] = await rapid.models.SchoolYear.query().whereIn('year', [2016, 2017, 2018]).orderBy('year', 'asc').eager('terms');
    const startTerm = startYear.terms[0];
    const endTerm = last(endYear.terms);
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: startYear.id,
      startTermId: startTerm.id,
      endYearId: endYear.id,
      endTermId: endTerm.id,
    });
    const termIds = terms.map(t => t.id);
    const students = terms.map(t => t.students).reduce((a, b) => [...a, ...b], []);

    expect(students.length).toEqual(
      (await rapid.models.StudentTermInfo.query().whereIn('termId', termIds)).length
    );
  });

  rapidTest('reportUtils.getLongitudinalReportData should only return an in-school only list of students', async rapid => {
    const [ startYear, middleYear, endYear ] = await rapid.models.SchoolYear.query().whereIn('year', [2016, 2017, 2018]).orderBy('year', 'asc').eager('terms');
    const startTerm = startYear.terms[0];
    const endTerm = last(endYear.terms);
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: startYear.id,
      startTermId: startTerm.id,
      endYearId: endYear.id,
      endTermId: endTerm.id,
    });
    const termIds = terms.map(t => t.id);
    const inSchoolStudents = terms.map(t => t.inSchoolStudents).reduce((a, b) => [...a, ...b], []);

    expect(inSchoolStudents.length).toEqual(
      (await rapid.models.StudentTermInfo.query()
        .whereIn('termId', termIds)
        .andWhere('gradeLevel', '!=', 'Post-school')
      ).length
    );
  });

  rapidTest('reportUtils.getLongitudinalReportData should only return an post-school only list of students', async rapid => {
    const [ startYear, middleYear, endYear ] = await rapid.models.SchoolYear.query().whereIn('year', [2016, 2017, 2018]).orderBy('year', 'asc').eager('terms');
    const startTerm = startYear.terms[0];
    const endTerm = last(endYear.terms);
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: startYear.id,
      startTermId: startTerm.id,
      endYearId: endYear.id,
      endTermId: endTerm.id,
    });
    const termIds = terms.map(t => t.id);
    const postSchoolStudents = terms.map(t => t.postSchoolStudents).reduce((a, b) => [...a, ...b], []);

    expect(postSchoolStudents.length).toEqual(
      (await rapid.models.StudentTermInfo.query()
        .whereIn('termId', termIds)
        .andWhere('gradeLevel', '=', 'Post-school')
      ).length
    );
  });

  rapidTest('reportUtils.getLongitudinalReportData should return student activities that are in the selected years', async rapid => {
    const [ startYear, middleYear, endYear ] = await rapid.models.SchoolYear.query().whereIn('year', [2016, 2017, 2018]).orderBy('year', 'asc').eager('terms');
    const startTerm = startYear.terms[0];
    const endTerm = endYear.terms[0];
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: startYear.id,
      startTermId: startTerm.id,
      endYearId: endYear.id,
      endTermId: endTerm.id,
    });

    for(let term of terms) {
      for(let student of term.students) {
        expect(Array.isArray(student.activities)).toBeTruthy();
        for(let activity of student.activities) {
          expect(
            activity.schoolYearId === startYear.id ||
            activity.schoolYearId === middleYear.id ||
            activity.schoolYearId === endYear.id
          ).toBeTruthy();
        }
      }
    }
  });

  rapidTest('reportUtils.getLongitudinalReportData should return student disabilities', async rapid => {
    const [ startYear, middleYear, endYear ] = await rapid.models.SchoolYear.query().whereIn('year', [2016, 2017, 2018]).orderBy('year', 'asc').eager('terms');
    const startTerm = startYear.terms[0];
    const endTerm = endYear.terms[0];
    const { terms } = await rapid.reportUtils.getLongitudinalReportData({
      startYearId: startYear.id,
      startTermId: startTerm.id,
      endYearId: endYear.id,
      endTermId: endTerm.id,
    });

    expect(terms[0].students.every(student => student))
    for(let term of terms) {
      for(let student of term.students) {
        expect(Array.isArray(student.disabilities)).toBeTruthy();
      }
    }
  });

  rapidTest('Summary report should respond with the school year object', async rapid => {
    const data = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(data.schoolYear).toBeTruthy();
    expect(data.schoolYear.id).toEqual(1);
  });

  rapidTest('Summary report should respond with counts for each grade level (except post-school) in a term', async rapid => {
    const data = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(data.gradeAndAgeRepartition).toBeTruthy();
    expect(data.gradeAndAgeRepartition.length).toEqual(enums.grades.length - 1); // minus 1 for post-school
    for(let { label, value } of data.gradeAndAgeRepartition) {
      expect(typeof label).toEqual('string');
      expect(typeof value).toEqual('number');
    }
  });

  rapidTest('Summary report should respond with counts for each risk level', async rapid => {
    const data = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(data.riskRepartition).toBeTruthy();
    const lowRow = data.riskRepartition.find(row => row.label === 'Low');
    const mediumRow = data.riskRepartition.find(row => row.label === 'Medium');
    const highRow = data.riskRepartition.find(row => row.label === 'High');
    const ultraRow = data.riskRepartition.find(row => row.label === 'Ultra');

    expect(typeof lowRow.value).toEqual('number');
    expect(lowRow.value >= 0).toBeTruthy();
    expect(typeof mediumRow.value).toEqual('number');
    expect(mediumRow.value >= 0).toBeTruthy();
    expect(typeof highRow.value).toEqual('number');
    expect(highRow.value >= 0).toBeTruthy();
    expect(typeof ultraRow.value).toEqual('number');
    expect(ultraRow.value >= 0).toBeTruthy();
  });

  rapidTest('Summary report should respond with counts for each disability level (plus 1 for no disabilities)', async rapid => {
    const data = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    const disabilities = await rapid.models.Disability.query()
    expect(data.disabilityRepartition).toBeTruthy();
    expect(data.disabilityRepartition.length).toEqual(disabilities.length + 1);
    for(let { label, value } of data.disabilityRepartition) {
      expect(typeof label).toEqual('string');
      expect(typeof value).toEqual('number');
    }
  });

  rapidTest('Summary report should return counts for career awareness activities', async rapid => {
    const { careerAwarenessActivities } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(careerAwarenessActivities)).toBeTruthy();

    for(let row of careerAwarenessActivities) {
      expect(typeof row.label).toEqual('string');
      expect(typeof row.oneTime).toEqual('number');
      expect(typeof row.occasionally).toEqual('number');
      expect(typeof row.veryFrequently).toEqual('number');
      expect(typeof row.daily).toEqual('number');
      expect(typeof row.weekly).toEqual('number');
      expect(typeof row.monthly).toEqual('number');
      expect(typeof row.quarterly).toEqual('number');
      expect(typeof row.everySemester).toEqual('number');
      expect(typeof row.annually).toEqual('number');
    }
  });

  rapidTest('Summary report should return counts for work experience activities', async rapid => {
    const { workExperienceActivities } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(workExperienceActivities)).toBeTruthy();

    for(let row of workExperienceActivities) {
      expect(typeof row.label).toEqual('string');
      expect(typeof row.oneTime).toEqual('number');
      expect(typeof row.occasionally).toEqual('number');
      expect(typeof row.veryFrequently).toEqual('number');
      expect(typeof row.daily).toEqual('number');
      expect(typeof row.weekly).toEqual('number');
      expect(typeof row.monthly).toEqual('number');
      expect(typeof row.quarterly).toEqual('number');
      expect(typeof row.everySemester).toEqual('number');
      expect(typeof row.annually).toEqual('number');
    }
  });

  rapidTest('Summary report should return counts for inclusion activities', async rapid => {
    const { inclusionActivities } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(inclusionActivities)).toBeTruthy();

    for(let row of inclusionActivities) {
      expect(typeof row.label).toEqual('string');
      expect(typeof row.oneTime).toEqual('number');
      expect(typeof row.occasionally).toEqual('number');
      expect(typeof row.veryFrequently).toEqual('number');
      expect(typeof row.daily).toEqual('number');
      expect(typeof row.weekly).toEqual('number');
      expect(typeof row.monthly).toEqual('number');
      expect(typeof row.quarterly).toEqual('number');
      expect(typeof row.everySemester).toEqual('number');
      expect(typeof row.annually).toEqual('number');
    }
  });

  rapidTest('Summary report should return counts for student support activities', async rapid => {
    const { studentSupportsActivities } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(studentSupportsActivities)).toBeTruthy();

    for(let row of studentSupportsActivities) {
      expect(typeof row.label).toEqual('string');
      expect(typeof row.oneTime).toEqual('number');
      expect(typeof row.occasionally).toEqual('number');
      expect(typeof row.veryFrequently).toEqual('number');
      expect(typeof row.daily).toEqual('number');
      expect(typeof row.weekly).toEqual('number');
      expect(typeof row.monthly).toEqual('number');
      expect(typeof row.quarterly).toEqual('number');
      expect(typeof row.everySemester).toEqual('number');
      expect(typeof row.annually).toEqual('number');
    }
  });

  rapidTest('Summary report should return counts for collaboration activities', async rapid => {
    const { collaborationActivities } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(collaborationActivities)).toBeTruthy();

    for(let row of collaborationActivities) {
      expect(typeof row.label).toEqual('string');
      expect(typeof row.oneTime).toEqual('number');
      expect(typeof row.occasionally).toEqual('number');
      expect(typeof row.veryFrequently).toEqual('number');
      expect(typeof row.daily).toEqual('number');
      expect(typeof row.weekly).toEqual('number');
      expect(typeof row.monthly).toEqual('number');
      expect(typeof row.quarterly).toEqual('number');
      expect(typeof row.everySemester).toEqual('number');
      expect(typeof row.annually).toEqual('number');
    }
  });

  rapidTest('Summary report should return counts for iep roles', async rapid => {
    const { roleInIEPMeeting } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(roleInIEPMeeting)).toBeTruthy();
    expect(roleInIEPMeeting.length).toEqual(enums.iepRoles.length);
  });

  rapidTest('Summary report receivedSkillsTraining', async rapid => {
    const { receivedSkillsTraining } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(receivedSkillsTraining)).toBeTruthy();
    expect(receivedSkillsTraining.length).toEqual(4);
    /*
      Self-determination skills
      Independent living skills
      Travel skills
      Social skills
    */
  });

  rapidTest('Summary report gender', async rapid => {
    const { gender } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(gender)).toBeTruthy();
    expect(gender.length).toEqual(enums.genders.length);
    expect(gender.map(row => row.label)).toEqual(enums.genders.map(g => g[0].toUpperCase() + g.slice(1)))
  });

  rapidTest('Summary report should include counts for students that have started career dev / grad plan', async rapid => {
    const { cdgp } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(cdgp)).toBeTruthy();
    expect(cdgp.length).toEqual(3);
    expect(cdgp.map(c => c.label).sort()).toEqual(['No', 'No Data', 'Yes']);
    for(let { value } of cdgp) {
      expect(typeof value).toEqual('number');
      expect(value >= 0).toBeTruthy();
    }
  });

  rapidTest('Summary report attendedIEPMeeting', async rapid => {
    const { attendedIEPMeeting } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(attendedIEPMeeting)).toBeTruthy();
    expect(
      attendedIEPMeeting.find(a => a.label === 'Yes').value
    ).toEqual(
      (
        await rapid.models.StudentTermInfo
          .query()
          .where('attendedIepMeeting', '=', 'true')
          .andWhere('gradeLevel', '!=', 'Post-school')
          .andWhere('termId', 1)
      ).length
    );

    expect(
      attendedIEPMeeting.find(a => a.label === 'No').value
    ).toEqual(
      (
        await rapid.models.StudentTermInfo
          .query()
          .where('attendedIepMeeting', '=', false)
          .andWhere('gradeLevel', '!=', 'Post-school')
          .andWhere('termId', 1)
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should be an array', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(Array.isArray(studentNeeds)).toBeTruthy();
  });

  rapidTest('Summary report studentNeeds should total the students with behavior marks', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who have 1 or more behavior marks').value).toEqual(
      (await rapid.models.StudentTermInfo.query()
        .where('termId', 1)
        .andWhere('behaviorMarks', '>=', 1)
        .andWhere('gradeLevel', '!=', 'Post-school')
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students with suspensions', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who have 1 or more suspensions this term').value).toEqual(
      (await rapid.models.StudentTermInfo.query()
        .where('termId', 1)
        .andWhere('suspended', '=', true)
        .andWhere('gradeLevel', '!=', 'Post-school')
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students with less than 2.0 gpa', async rapid => {
    const { schoolSettings, studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    const gpas = await rapid.models.StudentTermInfo
      .query()
      .where('termId', 1)
      .andWhere('gradeLevel', '!=', 'Post-school')
      .map(StudentTermInfo => {
        return rapid.controllers.riskDataController.calcGpa(schoolSettings, StudentTermInfo);
      });

    const lowGpaCount = gpas.filter(gpa => gpa < 2).length;
    expect(studentNeeds.find(s => s.label === 'who have less than 2.0 GPA').value).toEqual(
      lowGpaCount
    );
  });

  rapidTest('Summary report studentNeeds should total the students failing english / ELA', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who are failing English / ELA class').value).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', 1)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .andWhere('failingEnglish', '=', true)
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students failing math', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who are failing Math class').value).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', 1)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .andWhere('failingMath', '=', true)
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students failing other coarses', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who are failing another course(s)').value).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', 1)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .andWhere('failingOther', '=', true)
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students that are on-track', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who are on-track for grade level').value).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', 1)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .andWhere('onTrack', '=', true)
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students that were retained', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who were retained one or more years').value).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', 1)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .andWhere('retained', '=', true)
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students that participated in extracurricular activities', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    expect(studentNeeds.find(s => s.label === 'who participate in extracurricular activities').value).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', 1)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .andWhere('hasExtracurricular', '=', true)
      ).length
    );
  });

  rapidTest('Summary report studentNeeds should total the students that need help with attendance', async rapid => {
    const { studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    const count = (await rapid.models.StudentTermInfo
      .query()
      .where('termId', 1)
      .andWhere('absentPercent', '>=', 6)
      .andWhere('gradeLevel', '!=', 'Post-school')
    ).length
    expect(studentNeeds.find(s => s.label === 'Attendance').value).toEqual(count);
  });

  rapidTest('Summary report studentNeeds should total the students that need help with behavior', async rapid => {
    const { schoolSettings, studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    const interventions = await rapid.models.StudentTermInfo
      .query()
      .where('termId', 1)
      .andWhere('gradeLevel', '!=', 'Post-school')
      .map(StudentTermInfo => {
        return rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, StudentTermInfo).interventions;
      });

    const count = interventions.filter(i => i.behavior).length;
    expect(studentNeeds.find(s => s.label === 'Behavior').value).toEqual(count);
  });

  rapidTest('Summary report studentNeeds should total the students that need help with engagement', async rapid => {
    const { schoolSettings, studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    const interventions = await rapid.models.StudentTermInfo
      .query()
      .where('termId', 1)
      .andWhere('gradeLevel', '!=', 'Post-school')
      .map(StudentTermInfo => {
        return rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, StudentTermInfo).interventions;
      });

    const count = interventions.filter(i => i.engagement).length;
    expect(studentNeeds.find(s => s.label === 'Engagement').value).toEqual(count);
  });


  rapidTest('Summary report studentNeeds should total the students that need help with english', async rapid => {
    const { schoolSettings, studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    const interventions = await rapid.models.StudentTermInfo
      .query()
      .where('termId', 1)
      .andWhere('gradeLevel', '!=', 'Post-school')
      .map(StudentTermInfo => {
        return rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, StudentTermInfo).interventions;
      });

    const count = interventions.filter(i => i.english).length;
    expect(studentNeeds.find(s => s.label === 'English').value).toEqual(count);
  });

  rapidTest('Summary report studentNeeds should total the students that need help with math', async rapid => {
    const { schoolSettings, studentNeeds } = await rapid.controllers.reportController.runReport('summary', {startYearId: 1, startTermId: 1});
    const interventions = await rapid.models.StudentTermInfo
      .query()
      .where('termId', 1)
      .andWhere('gradeLevel', '!=', 'Post-school')
      .map(StudentTermInfo => {
        return rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, StudentTermInfo).interventions;
      });

    const count = interventions.filter(i => i.math).length;
    expect(studentNeeds.find(s => s.label === 'Math').value).toEqual(count);
  });

  rapidTest('Risk roster report should run successfully', async rapid => {
    await rapid.controllers.reportController.runReport('riskRoster', {startYearId: 1, startTermId: 1});
  });

  rapidTest('Risk roster report should include all students in the selected term', async rapid => {
    const data = await rapid.controllers.reportController.runReport('riskRoster', {startYearId: 1, startTermId: 1});
    expect(data.students.length).toEqual(
      (await rapid.models.StudentTermInfo.query().where('termId', 1)).length
    )
  });

  rapidTest('Risk summary report should run successfully', async rapid => {
    await rapid.controllers.reportController.runReport('riskSummary', await getLongitudinalReportOptions(rapid));
  });

  rapidTest('Risk summary report should return an object', async rapid => {
    expect(
      typeof await rapid.controllers.reportController.runReport('riskSummary', await getLongitudinalReportOptions(rapid))
    ).toEqual('object');
  });

  rapidTest('Risk summary report should return school settings', async rapid => {
    const { schoolSettings } = await rapid.controllers.reportController.runReport('riskSummary', await getLongitudinalReportOptions(rapid));
    expect(typeof schoolSettings).toEqual('object');
    expect(schoolSettings.name).toBeTruthy();
  });

  rapidTest('Risk summary report should include a row for each risk level', async rapid => {
    const { riskFactors } = await rapid.controllers.reportController.runReport('riskSummary', await getLongitudinalReportOptions(rapid));
    expect(riskFactors.rows.map(r => r.risk)).toEqual(['No Data', 'low', 'medium', 'high', 'ultra']);
  });

  rapidTest('Risk summary report should correctly count student risk levels by term', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();
    const { riskFactors } = await rapid.controllers.reportController.runReport('riskSummary', options);


    const termRiskInfos = await Promise.all(options.expectedTerms.map(async term => {
      const riskInfos = await rapid.models.StudentTermInfo.query()
        .where('termId', term.id)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .map(studentTermInfo => {
          return rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, studentTermInfo);
        });
      
        return riskInfos;
    }));

    expect(riskFactors.rows).toEqual([
      {
        risk: 'No Data',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.risk === 'No Data').length)
      },
      {
        risk: 'low',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.risk === 'low').length)
      },
      {
        risk: 'medium',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.risk === 'medium').length)
      },
      {
        risk: 'high',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.risk === 'high').length)
      },
      {
        risk: 'ultra',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.risk === 'ultra').length)
      },
    ]);
  });

  rapidTest('Risk summary report should correctly count required student interventions by term', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { studentNeeds } = await rapid.controllers.reportController.runReport('riskSummary', options);
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();

    const termRiskInfos = await Promise.all(options.expectedTerms.map(async term => {
      const riskInfos = await rapid.models.StudentTermInfo.query()
        .where('termId', term.id)
        .andWhere('gradeLevel', '!=', 'Post-school')
        .map(studentTermInfo => {
          return rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, studentTermInfo);
        });
      
        return riskInfos;
    }));

    expect(studentNeeds.rows).toEqual([
      {
        label: 'Attendance',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.interventions.attendance).length)
      },
      {
        label: 'Behavior',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.interventions.behavior).length)
      },
      {
        label: 'Engagement',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.interventions.engagement).length)
      },
      {
        label: 'English / ELA',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.interventions.english).length)
      },
      {
        label: 'Mathematics',
        values: termRiskInfos.map(riskInfos => riskInfos.filter(r => r.interventions.math).length)
      },
    ]);
  });

  rapidTest('Number of students standard report should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);
  });

  rapidTest('Number of students standard report should count students by disability if byDisability is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byDisability: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);
    const disabilities = await rapid.models.Disability.query();
    const disabilityNames = disabilities.map(d => d.name);

    expect(result.disabilities.length).toEqual(disabilities.length + 1); // plus 1 for NONE
    for(let { label, value } of result.disabilities) {
      expect(label === 'NONE' || disabilityNames.includes(label)).toBeTruthy();
      expect(typeof value).toEqual('number');
      expect(value >= 0).toBeTruthy();
      expect(value).toEqual(
        options.startTerm.studentTermInfos.filter(termInfo => {
          if(termInfo.gradeLevel === 'Post-school') return false;
          if(label === 'NONE') return termInfo.student.disabilities.length === 0;
          return termInfo.student.disabilities.some(d => d.name === label);
        }).length
      );
    }
  });

  rapidTest('Number of students standard report should count students by risk level if byRiskLevel is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byRiskLevel: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();

    expect(result.risks.length).toEqual(5); // No Data, low, medium, high, ultra
    expect(['No Data', 'low', 'medium', 'high', 'ultra'])
      .toEqual(result.risks.map(r => {
        if(r.label === 'No Data Risk') return 'No Data';
        return r.label.split(' ')[0].toLowerCase();
      }));

    for(let { label, value } of result.risks) {
      const risk = label.split(' ')[0].toLowerCase();
      const riskCountInTerm = options.startTerm.studentTermInfos
        .filter(t => t.gradeLevel !== 'Post-school')
        .map(t => rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, t))
        .filter(t => t.risk === risk)
        .length;

      expect(value).toEqual(riskCountInTerm);
    }
  });

  rapidTest('Number of students standard report should count students by IEP role if byIEPRole is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byIEPRole: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);

    expect(result.roleInIEPMeeting).toBeTruthy();
    expect(result.roleInIEPMeeting.length).toEqual(enums.iepRoles.length);

    for(let { label, value } of result.roleInIEPMeeting) {
      expect(
        value
      ).toEqual(
        options.startTerm.studentTermInfos
          .filter(t => t.gradeLevel !== 'Post-school')
          .filter(t => t.iepRole === label)
          .length
      );
    }
  });

  rapidTest('Number of students standard report should count students by support needed if bySupportNeed is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      bySupportNeed: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();

    expect(result.supportNeeded).toBeTruthy();
    expect(result.supportNeeded.length).toEqual(5); // attendance, behavior, engagement, english, math

    for(let { label, value } of result.supportNeeded) {
      const expectedValue = options.startTerm.studentTermInfos
        .filter(t => t.gradeLevel !== 'Post-school')
        .map(t => rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, t))
        .filter(({ interventions }) => {
          return interventions[label.toLowerCase()];
        })
        .length;

      expect(value).toEqual(expectedValue);
    }
  });

  rapidTest('Number of students standard report should count students by skills training if bySkillTraining is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      bySkillTraining: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);

    expect(result.skills).toBeTruthy();
    expect(result.skills.length).toEqual(4); // self-determination, independent-living, travel, social

    for(let { label, value } of result.skills) {
      const expectedValue = options.startTerm.studentTermInfos
        .filter(t => t.gradeLevel !== 'Post-school')
        .filter(t => {
          switch(label) {
            case 'Self-Determination Skills': return t.hasSelfDeterminationSkills;
            case 'Independent-Living Skills': return t.hasIndependentLivingSkills;
            case 'Travel Skills': return t.hasTravelSkills;
            case 'Social Skills': return t.hasSocialSkills;
          }
        })
        .length;

      expect(value).toEqual(expectedValue);
    }
  });

  rapidTest('Number of students standard report should count students by post-school outcomes if byPostSchoolOutcome is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byPostSchoolOutcome: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);

    expect(result.postSchool).toBeTruthy();
    expect(result.postSchool.length).toEqual(enums.postSchoolOutcomes.length);

    for(let { label, value } of result.postSchool) {
      const expectedValue = options.startTerm.studentTermInfos
        .filter(t => t.postSchoolOutcome === label)
        .length;

      expect(expectedValue).toEqual(value);
    }
  });

  rapidTest('Number of students standard report should count students by activity group types if byActivityGroupTypes is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byActivityGroupTypes: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsStandard', options);
    const activityTypeGroups = await rapid.models.ActivityTypeGroup.query();

    expect(result.activities).toBeTruthy();
    expect(result.activities.length).toEqual(activityTypeGroups.length);
  });

  rapidTest('Number of students longitudinal report should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
  });

  rapidTest('Number of students longitudinal report should count students by disability by term if byDisability is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byDisability: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
    const disabilities = await rapid.models.Disability.query();

    expect(result.disabilities.values.length).toEqual(options.expectedTerms.length);
    for(let row of result.disabilities.values) {
      let expectedCounts = {};
      const { termId } = row;
      const term = options.expectedTerms.find(t => t.id === termId);
      const studentIds = term.studentTermInfos
        .filter(t => t.gradeLevel !== 'Post-school')
        .map(t => t.student.id);

      for(let disability of disabilities) {
        expect(typeof row[disability.name]).toEqual('number');

        const expectedCount = (await rapid.models.StudentDisability
          .query()
          .whereIn('studentId', studentIds)
          .andWhere('disabilityId', disability.id)
        ).length;

        expectedCounts[disability.name] = expectedCount;
      }

      expectedCounts['NONE'] = (
        await rapid.models.StudentTermInfo
          .query()
          .whereIn('studentId', studentIds)
          .andWhere('termId', termId)
          .andWhere('gradeLevel', '!=', 'Post-school')
          .eager('student.disabilities')
      ).filter(t => t.student.disabilities.length === 0).length;

      const { label:_1, termId:_2, ...rest } = row;
      expect(rest).toEqual(expectedCounts);
    }
  });

  rapidTest('Number of students longitudinal report should count students by risk levels by term if byRiskLevel is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byRiskLevel: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();
    expect(result.risks.values.length).toEqual(options.expectedTerms.length);
    for(let row of result.risks.values) {
      const { termId } = row;
      const term = await rapid.models.Term.query().where('id', termId).eager('studentTermInfos.student').first();
      const riskDatas = term.studentTermInfos
        .filter(t => t.gradeLevel !== 'Post-school')
        .map(studentTermInfo => {
          return rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, studentTermInfo);
        });
      
      expect(row.low).toEqual(riskDatas.filter(d => d.risk === 'low').length);
      expect(row.medium).toEqual(riskDatas.filter(d => d.risk === 'medium').length);
      expect(row.high).toEqual(riskDatas.filter(d => d.risk === 'high').length);
      expect(row.ultra).toEqual(riskDatas.filter(d => d.risk === 'ultra').length);
    }
  });

  rapidTest('Number of students longitudinal report should count students by IEP role by term if byIEPRole is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byIEPRole: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
    expect(Array.isArray(result.roleInIEPMeeting.values)).toBeTruthy();
    for(let row of result.roleInIEPMeeting.values) {
      const { termId } = row;
      const term = await rapid.models.Term.query().where('id', termId).eager('studentTermInfos.student').first();
      const inSchoolStudents = term.studentTermInfos.filter(t => t.gradeLevel !== 'Post-school');

      expect(row.attended).toEqual(
        inSchoolStudents.filter(t => t.iepRole === 'Attended').length
      );

      expect(row.introduced).toEqual(
        inSchoolStudents.filter(t => t.iepRole === 'Introduced').length
      );

      expect(row.reviewedProgress).toEqual(
        inSchoolStudents.filter(t => t.iepRole === 'Reviewed progress').length
      );

      expect(row.madeSuggestions).toEqual(
        inSchoolStudents.filter(t => t.iepRole === 'Made suggestions').length
      );

      expect(row.ledMostOfMeeting).toEqual(
        inSchoolStudents.filter(t => t.iepRole === 'Led most of the meeting').length
      );
    }
  });

  rapidTest('Number of students longitudinal report should count students by support needed by term if bySupportNeed is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      bySupportNeed: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();
    const { supportNeeded } = result;
    expect(Array.isArray(supportNeeded.values)).toBeTruthy();

    for(let row of supportNeeded.values) {
      const { termId } = row;
      const term = await rapid.models.Term.query().where('id', termId).eager('studentTermInfos.student').first();
      const interventions = term.studentTermInfos
        .filter(t => t.gradeLevel !== 'Post-school')
        .map(t => rapid.controllers.riskDataController.calcTermInfoRiskData(schoolSettings, t).interventions);


      expect(row.attendance).toEqual(interventions.filter(i => i.attendance).length);
      expect(row.behavior).toEqual(interventions.filter(i => i.behavior).length);
      expect(row.engagement).toEqual(interventions.filter(i => i.engagement).length);
      expect(row.english).toEqual(interventions.filter(i => i.english).length);
      expect(row.math).toEqual(interventions.filter(i => i.math).length);
    }
  });

  rapidTest('Number of students longitudinal report should count students by skills by term if bySkillTraining is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      bySkillTraining: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
    const { skills } = result;
    expect(Array.isArray(skills.values)).toBeTruthy();

    for(let row of skills.values) {
      const { termId } = row;
      const term = await rapid.models.Term.query().where('id', termId).eager('studentTermInfos.student').first();
      const students = term.studentTermInfos.filter(t => t.gradeLevel !== 'Post-school');

      expect(row.hasSelfDeterminationSkills).toEqual(students.filter(s => s.hasSelfDeterminationSkills).length);
      expect(row.hasIndependentLivingSkills).toEqual(students.filter(s => s.hasIndependentLivingSkills).length);
      expect(row.hasTravelSkills).toEqual(students.filter(s => s.hasTravelSkills).length);
      expect(row.hasSocialSkills).toEqual(students.filter(s => s.hasSocialSkills).length);
    }
  });

  rapidTest('Number of students longitudinal report should count students by post school outcome by term if byPostSchoolOutcome is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byPostSchoolOutcome: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
    const { postSchool } = result;
    expect(Array.isArray(postSchool.values)).toBeTruthy();

    for(let row of postSchool.values) {
      const { termId } = row;
      const term = await rapid.models.Term.query().where('id', termId).eager('studentTermInfos.student').first();
      const students = term.studentTermInfos.filter(t => t.gradeLevel === 'Post-school');

      expect(row.postSecondaryEducation).toEqual(students.filter(s => s.postSchoolOutcome === 'Postsecondary Education').length);
      expect(row.postSchoolEmployment).toEqual(students.filter(s => s.postSchoolOutcome === 'Post-School Employment').length);
      expect(row.both).toEqual(students.filter(s => s.postSchoolOutcome === 'Both').length);
    }
  });

  rapidTest('Number of students longitudinal report should count students by activity group type by term if byActivityGroupTypes is true', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byActivityGroupTypes: true,
    });
    const result = await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
    const { activities } = result;
    expect(Array.isArray(activities.values)).toBeTruthy();
  });

  rapidTest('Number of students longitudinal report should be runnable with all sub-reports enabled', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      byPostSchoolOutcome: true,
      byRiskLevel: true,
      bySkillTraining: true,
      bySupportNeed: true,
      byIEPRole: true,
      byDisability: true,
      byActivityGroupTypes: true,
    });
    await rapid.controllers.reportController.runReport('numberOfStudentsLongitudinal', options);
  });

  rapidTest('Student report (single) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      studentId: 1
    });
    await rapid.controllers.reportController.runReport('student', options);
  });

  rapidTest('Student report (all) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    await rapid.controllers.reportController.runReport('student', options);
  });

  rapidTest('Student report (single) should only return a single student', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    options.studentIds = [options.startTerm.studentTermInfos.find(t => t.gradeLevel !== 'Post-school').studentId];
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    expect(students.length).toEqual(1);
  });

  rapidTest('Student report (all) should only return all in-school students in the selected term', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    expect(students.length).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', options.startTermId)
        .andWhere('gradeLevel', '!=', 'Post-school')
      ).length
    );
  });

  rapidTest('Student report should include rows for careerAwareness activities', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    for(let student of students) {
      const expectedActivities = (await rapid.models.Activity
        .query()
        .where('schoolYearId', options.startYearId)
        .andWhere('studentId', student.id)
        .eager('activityType.activityTypeGroup'))
        .filter(activity => activity.activityType.activityTypeGroup.name === 'Career Awareness');
      expect(Array.isArray(student.careerAwareness)).toBeTruthy();
      expect(student.careerAwareness.length).toEqual(expectedActivities.length);
    }
  });

  rapidTest('Student report should include rows for paidWork activities', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    for(let student of students) {
      const expectedActivities = (await rapid.models.Activity
        .query()
        .where('schoolYearId', options.startYearId)
        .andWhere('studentId', student.id)
        .eager('activityType.activityTypeGroup'))
        .filter(activity => activity.activityType.activityTypeGroup.name === 'Work Experience');
      expect(Array.isArray(student.paidWork)).toBeTruthy();
      expect(student.paidWork.length).toEqual(expectedActivities.length);
    }
  });

  rapidTest('Student report should include rows for inclusion activities', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    for(let student of students) {
      const expectedActivities = (await rapid.models.Activity
        .query()
        .where('schoolYearId', options.startYearId)
        .andWhere('studentId', student.id)
        .eager('activityType.activityTypeGroup'))
        .filter(activity => activity.activityType.activityTypeGroup.name === 'Inclusion');
      expect(Array.isArray(student.inclusion)).toBeTruthy();
      expect(student.inclusion.length).toEqual(expectedActivities.length);
    }
  });

  rapidTest('Student report should include rows for support activities', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    for(let student of students) {
      const expectedActivities = (await rapid.models.Activity
        .query()
        .where('schoolYearId', options.startYearId)
        .andWhere('studentId', student.id)
        .eager('activityType.activityTypeGroup'))
        .filter(activity => activity.activityType.activityTypeGroup.name === 'Student Supports');
      expect(Array.isArray(student.support)).toBeTruthy();
      expect(student.support.length).toEqual(expectedActivities.length);
    }
  });

  rapidTest('Student report should include rows for collaboration activities', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    for(let student of students) {
      const expectedActivities = (await rapid.models.Activity
        .query()
        .where('schoolYearId', options.startYearId)
        .andWhere('studentId', student.id)
        .eager('activityType.activityTypeGroup'))
        .filter(activity => activity.activityType.activityTypeGroup.name === 'Collaboration');
      expect(Array.isArray(student.collaboration)).toBeTruthy();
      expect(student.collaboration.length).toEqual(expectedActivities.length);
    }
  });

  rapidTest('Student report should include rows for risk factors', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    for(let student of students) {
      expect(student.riskFactors.length).toBeGreaterThan(0);
    }
  });

  rapidTest('Student report should include rows for skills', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('student', options);
    for(let student of students) {
      expect(student.skills.length).toEqual(4); // self-determination, independent-living, travel, social
    }
  });

  rapidTest('Student risk standard report (single) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid, {
      studentId: 1
    });
    await rapid.controllers.reportController.runReport('studentRiskStandard', options);
  });

  rapidTest('Student risk standard report (all) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    await rapid.controllers.reportController.runReport('studentRiskStandard', options);
  });

  rapidTest('Student risk standard report (single) should only return a single student', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    options.studentIds = [options.startTerm.studentTermInfos.find(t => t.gradeLevel !== 'Post-school').studentId];
    const { students } = await rapid.controllers.reportController.runReport('studentRiskStandard', options);
    expect(students.length).toEqual(1);
  });

  rapidTest('Student risk standard report (all) should only return all in-school students in the selected term', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('studentRiskStandard', options);
    expect(students.length).toEqual(
      (await rapid.models.StudentTermInfo
        .query()
        .where('termId', options.startTermId)
        .andWhere('gradeLevel', '!=', 'Post-school')
      ).length
    );
  });

  rapidTest('Student risk longitudinal report (single) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    options.studentIds = [options.startTerm.studentTermInfos.find(t => t.gradeLevel !== 'Post-school').id];
    await rapid.controllers.reportController.runReport('studentRiskLongitudinal', options);
  });

  rapidTest('Student risk longitudinal report (all) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    await rapid.controllers.reportController.runReport('studentRiskLongitudinal', options);
  });

  rapidTest('Student risk longitudinal report (single) should only include the selected student', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    options.studentIds = [options.startTerm.studentTermInfos.find(t => t.gradeLevel !== 'Post-school').studentId];
    const { students } = await rapid.controllers.reportController.runReport('studentRiskLongitudinal', options);
    expect(students.length).toEqual(1);
  });

  rapidTest('Student risk longitudinal report (all) should only include students in the selected terms', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('studentRiskLongitudinal', options);

    for(let student of students) {
      const isInTerms = options.expectedTerms.some(term => !!term.studentTermInfos.some(t => t.studentId === student.id));
      expect(isInTerms).toBeTruthy();
    }
  });

  rapidTest('Post school student report (single) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    options.studentIds = [options.startTerm.studentTermInfos.find(t => t.gradeLevel === 'Post-school').id];
    await rapid.controllers.reportController.runReport('postSchoolStudent', options);
  });

  rapidTest('Post school student report (multi) should run successfully', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    await rapid.controllers.reportController.runReport('postSchoolStudent', options);
  });

  rapidTest('Post school student report should only contain post-school students', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('postSchoolStudent', options);
    const { startTermId } = options;
    for(let student of students) {
      const termInfo = await rapid.models.StudentTermInfo.query()
        .where('termId', startTermId)
        .andWhere('studentId', student.id)
        .first();
      expect(termInfo.gradeLevel).toEqual('Post-school');
    }
  });

  rapidTest('Post school student report should include correct exitCategories', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('postSchoolStudent', options);
    const { startTermId } = options;
    for(let student of students) {
      const exitCategories = [...student.exitCategory1, ...student.exitCategory2, ...student.exitCategory3];
      const termInfo = await rapid.models.StudentTermInfo.query()
        .where('termId', startTermId)
        .andWhere('studentId', student.id)
        .first();

      for(let { label, value } of exitCategories) {
        if(termInfo.exitCategory === label || (termInfo.exitCategory && label === 'Other' && !enums.exitCategories.includes(termInfo.exitCategory))) {
          expect(value).toBeTruthy();
        } else {
          expect(value).toBeFalsy();
        }
      }
    }
  });

  rapidTest('Post school student report should include correct post-school outcomes', async rapid => {
    const options = await getLongitudinalReportOptions(rapid);
    const { students } = await rapid.controllers.reportController.runReport('postSchoolStudent', options);
    const { startTermId } = options;
    for(let student of students) {
      const { postSchoolOutcomes } = student;
      const termInfo = await rapid.models.StudentTermInfo.query()
        .where('termId', startTermId)
        .andWhere('studentId', student.id)
        .first();

      for(let { label, value } of postSchoolOutcomes) {
        if(termInfo.postSchoolOutcome === label || (termInfo.postSchoolOutcome && label === 'Other' && !enums.postSchoolOutcomes.includes(termInfo.postSchoolOutcome))) {
          expect(value).toBeTruthy();
        } else {
          expect(value).toBeFalsy();
        }
      }
    }
  });

  rapidTest('Should be able to generate a summary report PDF by sending a GET request to /api/reports/summary', async rapid => {
    await shouldSucceed(
      rapid.axios.get('/api/reports/summary?startYearId=1&startTermId=1', await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a risk roster report PDF by sending a GET request to /api/reports/riskRoster', async rapid => {
    await shouldSucceed(
      rapid.axios.get('/api/reports/riskRoster?startYearId=1&startTermId=1', await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a risk summary report PDF by sending a GET request to /api/reports/riskSummary', async rapid => {
    await shouldSucceed(
      rapid.axios.get('/api/reports/riskSummary?startYearId=1&startTermId=1', await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a number of students standard report PDF by sending a GET request to /api/reports/numberOfStudents/standard', async rapid => {
    const optionParams = 'byDisability=true&byRiskLevel=true&byIEPRole=true&bySupportNeed=true&bySkillTraining=true&byPostSchoolOutcome=true&byActivityGroupTypes=true';
    await shouldSucceed(
      rapid.axios.get(`/api/reports/numberOfStudents/standard?startYearId=1&startTermId=1&${optionParams}`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a number of students longitudinal report PDF by sending a GET request to /api/reports/numberOfStudents/longitudinal', async rapid => {
    const {
      startYearId,
      endYearId,
      startTermId,
      endTermId,
    } = await getLongitudinalReportOptions(rapid);
    const optionParams = 'byDisability=true&byRiskLevel=true&byIEPRole=true&bySupportNeed=true&bySkillTraining=true&byPostSchoolOutcome=true&byActivityGroupTypes=true';
    await shouldSucceed(
      rapid.axios.get(`/api/reports/numberOfStudents/standard?startYearId=${startYearId}&startTermId=${startTermId}&endYearId=${endYearId}&endTermId=${endTermId}&${optionParams}`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate single student report PDF by sending a GET request to /api/reports/student with a studentId', async rapid => {
    await shouldSucceed(
      rapid.axios.get(`/api/reports/student?startYearId=1&startTermId=1&studentId=1`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate multi-student report PDF by sending a GET request to /api/reports/student without a studentId', async rapid => {
    await shouldSucceed(
      rapid.axios.get(`/api/reports/student?startYearId=1&startTermId=1`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a standard (single) student risk report PDF by sending a GET request to /api/reports/studentRisk/standard with a studentId', async rapid => {
    await shouldSucceed(
      rapid.axios.get(`/api/reports/studentRisk/standard?startYearId=1&startTermId=1&studentId=1`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a standard (multi) student risk report PDF by sending a GET request to /api/reports/studentRisk/standard without a studentId', async rapid => {
    await shouldSucceed(
      rapid.axios.get(`/api/reports/studentRisk/standard?startYearId=1&startTermId=1`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a longitudinal (single) student risk report PDF by sending a GET request to /api/reports/studentRisk/longitudinal with a studentId', async rapid => {
    const {
      startYearId,
      endYearId,
      startTermId,
      endTermId,
      startTerm,
    } = await getLongitudinalReportOptions(rapid);
    const studentId = startTerm.studentTermInfos.find(t => t.gradeLevel !== 'Post-school').id;
    await shouldSucceed(
      rapid.axios.get(`/api/reports/studentRisk/longitudinal?startYearId=${startYearId}&startTermId=${startTermId}&endYearId=${endYearId}&endTermId=${endTermId}&studentId=${studentId}`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a longitudinal (multi) student risk report PDF by sending a GET request to /api/reports/studentRisk/longitudinal without a studentId', async rapid => {
    const {
      startYearId,
      endYearId,
      startTermId,
      endTermId,
    } = await getLongitudinalReportOptions(rapid);

    await shouldSucceed(
      rapid.axios.get(`/api/reports/studentRisk/longitudinal?startYearId=${startYearId}&startTermId=${startTermId}&endYearId=${endYearId}&endTermId=${endTermId}`, await rapid.auth())
    );
  });

  rapidTest('Should be able to generate a post-school student report PDF by sending a GET request to /api/reports/postStudent', async rapid => {
    const {
      startYearId,
      startTermId,
    } = await getLongitudinalReportOptions(rapid);

    await shouldSucceed(
      rapid.axios.get(`/api/reports/postSchoolStudent?startYearId=${startYearId}&startTermId=${startTermId}`, await rapid.auth())
    );
  });

  test('Number of students cross report should correctly group by postSchoolOutcome', () => {
    const { groupStudentsByCriteria } = require('../controllers/reports/numberOfStudentsCross').forTesting;

    const criteria = 'postSchoolOutcome';
    const reportData = {};
    const students = [
      { postSchoolOutcome: 'Post-Secondary Education' },
      { postSchoolOutcome: 'Post-Secondary Education' },
      { postSchoolOutcome: 'Post-School Employment' },
      { postSchoolOutcome: 'Post-School Employment' },
      { postSchoolOutcome: 'Both' },
      { postSchoolOutcome: 'some other thing' },
      { postSchoolOutcome: 'Other' },
    ];
    const result = groupStudentsByCriteria(students, criteria, reportData);

    expect(result).toEqual({
      'Post-Secondary Education': [students[0], students[1]],
      'Post-School Employment': [students[2], students[3]],
      'Both': [students[4]],
      'Other': [students[5], students[6]],
    });
  });

  test('Number of students cross report should correctly group by riskLevel', () => {
    const { groupStudentsByCriteria } = require('../controllers/reports/numberOfStudentsCross').forTesting;

    const criteria = 'riskLevel';
    const reportData = {};
    const students = [
      { risk: 'low' },
      { risk: 'medium' },
      { risk: 'high' },
      { risk: 'low' },
      { risk: 'medium' },
      { risk: null },
      { risk: 'ultra' },
    ];
    const result = groupStudentsByCriteria(students, criteria, reportData);

    expect(result).toEqual({
      'No Data': [students[5]],
      'low': [students[0], students[3]],
      'medium': [students[1], students[4]],
      'high': [students[2]],
      'ultra': [students[6]],
    });
  });

  test('Number of students cross report should correctly group by skillTraining', () => {
    const { groupStudentsByCriteria } = require('../controllers/reports/numberOfStudentsCross').forTesting;

    const criteria = 'skillTraining';
    const reportData = {};
    const students = [
      { hasSelfDeterminationSkills: true },
      { hasIndependentLivingSkills: true },
      { hasTravelSkills: true },
      { hasSelfDeterminationSkills: true, hasSocialSkills: true },
      { hasSocialSkills: true },
      { hasSelfDeterminationSkills: true, hasIndependentLivingSkills: true },
      { hasSocialSkills: true },
    ];
    const result = groupStudentsByCriteria(students, criteria, reportData);
    expect(result).toEqual({
      'hasSelfDeterminationSkills': [students[0], students[3], students[5]],
      'hasIndependentLivingSkills': [students[1], students[5]],
      'hasTravelSkills': [students[2]],
      'hasSocialSkills': [students[3], students[4], students[6]],
    });
  });

  test('Number of students cross report should correctly group by supportNeed', () => {
    const { groupStudentsByCriteria } = require('../controllers/reports/numberOfStudentsCross').forTesting;

    const criteria = 'supportNeed';
    const reportData = {};
    const students = [
      { attendance: true, math: true },
      { english: true, behavior: true },
      { english: true, attendance: true},
      { engagement: true, math: true },
      { english: true, math: true, attendance: true },
      { },
      { math: true, behavior: true },
    ].map(interventions => ({ interventions }));

    const result = groupStudentsByCriteria(students, criteria, reportData);

    expect(result).toEqual({
      attendance: students.filter(s => s.interventions.attendance),
      behavior: students.filter(s => s.interventions.behavior),
      engagement: students.filter(s => s.interventions.engagement),
      english: students.filter(s => s.interventions.english),
      math: students.filter(s => s.interventions.math),
    });
  });

  test('Number of students cross report should correctly group by iepRole', () => {
    const { groupStudentsByCriteria } = require('../controllers/reports/numberOfStudentsCross').forTesting;

    const criteria = 'iepRole';
    const reportData = {};
    
    const students = [
      { iepRole: sample(enums.iepRoles) },
      { iepRole: sample(enums.iepRoles) },
      { iepRole: sample(enums.iepRoles) },
      { iepRole: sample(enums.iepRoles) },
      { iepRole: sample(enums.iepRoles) },
      { iepRole: sample(enums.iepRoles) },
      { iepRole: sample(enums.iepRoles) },
    ];

    const result = groupStudentsByCriteria(students, criteria, reportData);

    for(let role of enums.iepRoles) {
      expect(result[role]).toEqual(students.filter(s => s.iepRole === role));
    }
  });

  rapidTest('Number of students cross report should correctly group by disability', async rapid => {
    const disabilities = await rapid.models.Disability.query();

    const { groupStudentsByCriteria } = require('../controllers/reports/numberOfStudentsCross').forTesting;

    const criteria = 'disability';
    const reportData = { disabilities };
    const getCount = () => Math.floor(Math.random() * 10);
    const students = [
      { disabilities: sampleSize(disabilities, getCount()) },
      { disabilities: sampleSize(disabilities, getCount()) },
      { disabilities: sampleSize(disabilities, getCount()) },
      { disabilities: sampleSize(disabilities, getCount()) },
      { disabilities: sampleSize(disabilities, getCount()) },
      { disabilities: sampleSize(disabilities, getCount()) },
      { disabilities: sampleSize(disabilities, getCount()) },
    ];

    const result = groupStudentsByCriteria(students, criteria, reportData);

    for(let disability of disabilities) {
      expect(result[disability.name]).toEqual(students.filter(s => s.disabilities.includes(disability)));
    }
  });

  rapidTest('Number of students cross report should correctly group by activityGroupTypes', async rapid => {
    const { groupStudentsByCriteria } = require('../controllers/reports/numberOfStudentsCross').forTesting;
    const activityTypeGroups = await rapid.models.ActivityTypeGroup.query();
    const createStudent = () => ({
      activities: [
        { activityType: { activityTypeGroup: sample(activityTypeGroups) } },
        { activityType: { activityTypeGroup: sample(activityTypeGroups) } },
        { activityType: { activityTypeGroup: sample(activityTypeGroups) } },
      ],
    });
    
    const criteria = 'activityGroupTypes';
    const reportData = { activityTypeGroups };
    const students = [
      createStudent(),
      createStudent(),
      createStudent(),
      createStudent(),
      createStudent(),
      createStudent(),
      createStudent(),
    ];
    const result = groupStudentsByCriteria(students, criteria, reportData);

    for(let activityTypeGroup of activityTypeGroups) {
      expect(result[activityTypeGroup.name].length).toEqual(
        students.filter(student =>
          student.activities.some(a => a.activityType.activityTypeGroup.name === activityTypeGroup.name)
        ).length
      );
    }
  });

  test('Number of students cross report should correctly count students by two categories', () => {
    const { countStudentsByTwoCategories } = require('../controllers/reports/numberOfStudentsCross').forTesting;
    const criteria1 = 'riskLevel';
    const criteria2 = 'iepRole';
    const students = [
      { iepRole: sample(enums.iepRoles), risk: sample(enums.riskLevels) },
      { iepRole: sample(enums.iepRoles), risk: sample(enums.riskLevels) },
      { iepRole: sample(enums.iepRoles), risk: sample(enums.riskLevels) },
      { iepRole: sample(enums.iepRoles), risk: sample(enums.riskLevels) },
      { iepRole: sample(enums.iepRoles), risk: sample(enums.riskLevels) },
      { iepRole: sample(enums.iepRoles), risk: sample(enums.riskLevels) },
    ];
    const result = countStudentsByTwoCategories(students, criteria1, criteria2, {});
    expect(Object.keys(result)).toEqual(enums.riskLevels);
    for(let [risk, value] of Object.entries(result)) {
      expect(Object.keys(value)).toEqual(enums.iepRoles);
      for(let [iepRole, count] of Object.entries(value)) {
        expect(count).toEqual(students.filter(s => s.iepRole === iepRole && s.risk === risk).length);
      }
    }
  });
});

