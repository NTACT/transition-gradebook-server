jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('School years', () => {
  rapidTest('GET /api/schoolYears should respond with an array of school years', async rapid => {
    const response = await rapid.axios.get('/api/schoolYears', await rapid.auth());
    expect(response.status).toEqual(200);
    const result = response.data;
    expect(result.schoolYears).toBeTruthy();
    expect(result.schoolYears.length).toBeGreaterThan(0);
  });

  rapidTest('School year responses should contain terms', async rapid => {
    const response = await rapid.axios.get('/api/schoolYears', await rapid.auth());
    const result = response.data;
    const { schoolYears } = result;
    for(let schoolYear of schoolYears) {
      expect(schoolYear.terms).toBeTruthy();
      expect(schoolYear.terms.length).toBeGreaterThan(0);
    }
  });

  rapidTest('POST /api/schoolYears should create a new school year', async rapid => {
    const response = await rapid.axios.post('/api/schoolYears', {
      year: 1950,
      termType: 'trimester',
      terms: [
        {startDate: '1949-09-15T01:00:00.000Z'},
        {startDate: '1949-12-15T01:00:00.000Z'},
        {startDate: '1950-03-15T01:00:00.000Z'},
      ],
      students: []
    }, await rapid.auth(testUtils.credentials.admin));
    expect(response.status).toEqual(200);
    const { schoolYear } = response.data;
    expect(schoolYear).toBeTruthy();
  });

  rapidTest('School year terms should be created automatically when the school year is created', async rapid => {
    const response = await testUtils.shouldSucceed(rapid.axios.post('/api/schoolYears', {
      year: 1949,
      termType: 'trimester',
      terms: [
        {startDate: '1949-09-15T01:00:00.000Z'},
        {startDate: '1949-12-15T01:00:00.000Z'},
        {startDate: '1950-03-15T01:00:00.000Z'},
      ],
      students: [],
    }, await rapid.auth(testUtils.credentials.admin)));

    const { schoolYear } = response.data;
    const terms = await rapid.models.Term.query().where({schoolYearId: schoolYear.id});
    expect(terms.length).toEqual(3);
  });

  rapidTest('DELETE /api/schoolYears/:schoolYearId/students/:studentId should remove the student from the school year', async rapid => {
    const schoolYear = await testUtils.createSchoolYear(rapid);
    const createdStudent = await testUtils.createStudent(rapid, {
      schoolYearId: schoolYear.id
    });
    const response = await rapid.axios.delete(`/api/schoolYears/${schoolYear.id}/students/${createdStudent.id}`, await rapid.auth());
    await shouldSucceed(response);
  });

  rapidTest('DELETE /api/schoolYears/:schoolYearId should delete school year and term info', async rapid => {
    const schoolYear = await testUtils.createSchoolYear(rapid);
    const response = await rapid.axios.delete(`/api/schoolYears/${schoolYear.id}`, await rapid.auth(testUtils.credentials.admin));
    await shouldSucceed(response);
  });

  rapidTest('DELETE /api/schoolYears/${schoolYear.id}/students should delete student data associated with year', async rapid => {
    const schoolYear = await testUtils.createSchoolYear(rapid);
    const createdStudent = await testUtils.createStudent(rapid, {
      schoolYearId: schoolYear.id
    });

    const response = await rapid.axios.delete(`api/schoolYears/${schoolYear.id}/students`, await rapid.auth(testUtils.credentials.admin));
    await shouldSucceed(response);
  })
  rapidTest('Only admins should be able to create school years', async rapid => {
    const response = await rapid.axios.post('/api/schoolYears', {
      termType: 'annual',
      year: 3123,
      terms: [
        {startDate: `3123-05-21T20:48:23.485Z`}
      ],
      students: [],
    }, await rapid.auth(testUtils.credentials.user));

    expect(response.ok).toBeFalsy();
    expect(response.status).toEqual(401);
  });

});