jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { csvDataHelper } = require('tgb-shared');
const uuid = require('uuid/v4');
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

  rapidTest('Should be able to import a new student with CSV', async rapid => {
    const { studentController} = rapid.controllers;
    const { Student, SchoolYear, StudentTermInfo } = rapid.models;
    const studentId = uuid();
    const students = [generateCSVUploadModel(studentId)];
    const schoolYear = await SchoolYear.query().where('id', 1).eager('terms').first();
    const term = schoolYear.terms[0].id;
    await studentController.importFromCSV(schoolYear.id, term, students);
    const imported = await Student.query().where('studentId', studentId).first();
    expect(imported).toBeDefined();
    const { id } = imported;
    const studentTermInfos = await StudentTermInfo.query().where('studentId', id);
    // Backfilled the year
    expect(studentTermInfos.length).toEqual(schoolYear.terms.length);
  });

  rapidTest('Should be able to import multiple new students with CSV', async rapid => {
    const { studentController} = rapid.controllers;
    const { Student, SchoolYear, StudentTermInfo } = rapid.models;
    const students = generateCSVUploadModels(20);
    const schoolYear = await SchoolYear.query().where('id', 1).eager('terms').first();
    const studentsBefore = await Student.query();
    await studentController.importFromCSV(schoolYear.id, schoolYear.terms[0].id, students);
    const studentsAfter = await Student.query();
    expect(studentsAfter.length - studentsBefore.length).toEqual(20);
  });

  rapidTest('Should be able to edit an existing student with CSV', async rapid => {
    const { studentController} = rapid.controllers;
    const { Student, SchoolYear, StudentTermInfo } = rapid.models;
    const schoolYear = await SchoolYear.query().where('id', 1).eager('terms.studentTermInfos').first();
    const oldTermInfos = schoolYear.terms[0].studentTermInfos[0];
    const studentToEdit = await Student.query().findById(oldTermInfos.studentId);
    const editedId = studentToEdit.studentId
    const students = [generateCSVUploadModel(editedId)];
    const term = schoolYear.terms[0].id;
    await studentController.importFromCSV(schoolYear.id, term, students);
    const imported = await Student.query().where('studentId', editedId).first();
    expect(imported).toBeDefined();
    // Simple check
    expect(imported.firstName).not.toEqual(studentToEdit.firstName);
    const studentTermInfos = await StudentTermInfo.query().where('studentId', studentToEdit.id).first();
    // simple check
    expect(oldTermInfos.grade).not.toEqual(studentTermInfos.grade);
  });

  rapidTest('Should be able to edit an existing students with CSV', async rapid => {
    const { studentController} = rapid.controllers;
    const { Student, SchoolYear } = rapid.models;
    const schoolYear = await SchoolYear.query().where('id', 1).eager('terms.studentTermInfos').first();
    const oldTermInfos = schoolYear.terms[0].studentTermInfos;
    const studentsToEditId = oldTermInfos.map(info => info.studentId);
    const students = await Student.query().whereIn('id', studentsToEditId);
    const csv = students.map(student => generateCSVUploadModel(student.studentId));
    const term = schoolYear.terms[0].id;
    await studentController.importFromCSV(schoolYear.id, term, csv);
    const imported = await Student.query().whereIn('id', studentsToEditId);
    for(const changedStudent of imported) {
      // poc check
      expect(changedStudent.firstName).not.toEqual(students.find(stu => stu.id === changedStudent.id).firstName);
    }
  });

  rapidTest('CSV import -> csvDataToObjects tests', async rapid => {
    const { studentController} = rapid.controllers;
    const { Student, SchoolYear, Disability } = rapid.models;
    const disabilities = await Disability.query();

    // Special case: grades
    const testModel = generateCSVUploadModel();
    testModel.grade.value = 'B+';
    testModel.gradeType.value = 'percent';
    const invalidGradeTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(invalidGradeTest.grade).toEqual(null);
    testModel.grade.value = '75';
    const validPercentTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validPercentTest.grade).toEqual('75');
    testModel.gradeType.value = 'letter';
    testModel.grade.value = 'B+';
    const validGradeTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validGradeTest.grade).toEqual('B+');

    // Special case: disabilities
    const firstDisability = disabilities[0];
    const secondDisability =  disabilities[1];
    testModel.disabilities.value = `${firstDisability.name} ${secondDisability.name}`;
    const validDisabilitiesTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validDisabilitiesTest.disabilities).toEqual([firstDisability.id, secondDisability.id]);
    testModel.disabilities.value = `${firstDisability.name} ${secondDisability.name} not a valid disability`;
    const invalidDisabilitiesTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(invalidDisabilitiesTest.disabilities).toEqual([firstDisability.id, secondDisability.id]);

    // Special case: number data
    testModel.absentPercent.value = 'not a number';
    const invalidNumberTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(invalidNumberTest.absentPercent).toEqual(null);
    testModel.absentPercent.value = '9001';
    const validNumberTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validNumberTest.absentPercent).toEqual(9001);

    // Custom deserialize
    testModel.race.value = 'White or Caucasian';
    const validFullRaceNameTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validFullRaceNameTest.race).toEqual('WH7');
    testModel.race.value = 'WH7';
    const validRaceLabelTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validRaceLabelTest.race).toEqual('WH7');
    testModel.race.value = '404';
    const invalidRaceLabelTest = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(invalidRaceLabelTest.race).toEqual(null);

    // boolloney
    testModel.ell.value = 'Yes';
    const validYesOne = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validYesOne.ell).toEqual(true);
    testModel.ell.value = 'y';
    const validYesTwo = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validYesTwo.ell).toEqual(true);  
    testModel.ell.value = '1';
    const validYesThree = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validYesThree.ell).toEqual(true);  
    testModel.ell.value.booleanValue = true;
    const validYesFour = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validYesFour.ell).toEqual(true);  
    testModel.ell.value = '0';
    const validYesFive = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validYesFive.ell).toEqual(false);  
    testModel.ell.value = null;
    const validYesSix = studentController.csvDataToObjects([testModel], disabilities)[0];
    expect(validYesSix.ell).toEqual(null);  
  });
});

function generateCSVUploadModel(studentId = uuid()) {
  const csvUpload = {};
  for(const column of csvDataHelper.columns) {
    let value = '';
    switch(column.type) {
      case csvDataHelper.types.array:
        // will need to fix if other array fields are included. Currently only disabilities supported
        value = 'AU ID';
        break;
      case csvDataHelper.types.boolean: 
        value = csvDataHelper.Yes;
        break;
      case csvDataHelper.types.date: 
        value = '08/12/2019';
        break;
      case csvDataHelper.types.enum:
        value = column.enumValues ? column.enumValues[0] : column.validValues[0];
        break;
      case csvDataHelper.types.float:
      case csvDataHelper.types.integer:
        value = 42;
        break;
      default: 
        value = 'String value';
    }
    csvUpload[column.field] = {value};
  }
  csvUpload.studentId.value = studentId || csvUpload.studentId.value;
  return csvUpload;
}

function generateCSVUploadModels(count = 1) {
  const csvUpload = [];
  for(let i = 0; i < count; i += 1) {
    csvUpload.push(generateCSVUploadModel());
  }
  return csvUpload;
}
