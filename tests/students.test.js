jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('students', () => {
  rapidTest('POST /api/schoolYears/:schoolYearId/students/:studentId should patch a student', async rapid => {
    const schoolYear = await testUtils.createSchoolYear(rapid);
    const createdStudent = await testUtils.createStudent(rapid, {
      studentId: 'patch-test',
      schoolYearId: schoolYear.id,
    });

    await shouldSucceed(rapid.axios.post(`/api/schoolYears/${schoolYear.id}/students/${createdStudent.id}`, {
      disabilities: [2, 5, 6],
      lastName: 'mcpatchedface',
    }, await rapid.auth()));
  });

  rapidTest('Disabilities should be stored correctly when creating students', async rapid => {
    const student = await testUtils.createStudent(rapid, {
      disabilities: [1, 3, 5]
    });
    const studentDisabilities = await rapid.models.StudentDisability.query().where('studentId', student.id);
    const StudentDisabilityIds = studentDisabilities.map(d => d.disabilityId);
    expect(StudentDisabilityIds).toEqual([1, 3, 5]);
  });

  rapidTest(`Users should be able to update student's term info`, async rapid => {
    const patchResponse = await rapid.axios.post('/api/studentTermInfo/1', {
      grade: '55.7',
      gradeType: 'percent',
      failingOther: true,
    }, await rapid.auth());
    await shouldSucceed(patchResponse);

    const studentTermInfo = await rapid.models.StudentTermInfo.query().where('id', 1).first();
    expect(studentTermInfo.grade).toEqual('55.7');
  });

  rapidTest(`Non-users should not be able to update student's term info`, async rapid => {
    const patchResponse = await rapid.axios.post('/api/studentTermInfo/1', {
      grade: '55.7',
      gradeType: 'percent',
      failingOther: true,
    });

    expect(patchResponse.status).toEqual(401);
  });

  rapidTest('Should be able to export student data for a whole year', async rapid => {
    await rapid.controllers.studentController.getExportData(1);
  });

  rapidTest('Should be able to export student data for a whole year for individual students', async rapid => {
    const schoolYear = await rapid.models.SchoolYear.query().where('id', 1).eager('terms.studentTermInfos').first();
    const studentId = schoolYear.terms[0].studentTermInfos[0].studentId;
    await rapid.controllers.studentController.getExportData(1, [studentId]);
  });

});
