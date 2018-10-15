module.exports = context => {
  const removeNullValues = require('../utils/removeNullValues');
  const Json2csvParser = require('json2csv').Parser;
  const { models } = context;
  const { Student, SchoolYear, StudentDisability, StudentTermInfo, Term } = models;

  class StudentController {
    getStudents() {
      return Student.query()
        .select('*')
        .eager('[disabilities]');
    }

    deleteStudentDisabilities(studentId) {
      return StudentDisability.query().delete().where('studentId', studentId);
    }

    async setStudentDisabilities(studentId, disabilityIds) {
      await this.deleteStudentDisabilities(studentId);

      if(disabilityIds && disabilityIds.length) {
        return await StudentDisability
          .query()
          .insert(
            disabilityIds.map(disabilityId => ({ studentId, disabilityId }))
          )
          .eager('disability')
          .returning('*')
          .map(row => row.disability);
      }

      return [];
    }

    async createStudent(schoolYearId, {
      studentId,
      firstName,
      lastName,
      birthday,
      gender,
      ell,
      disabilities,
      gradeLevel,
      postSchoolOutcome,
      exitCategory,
    }) {
      const existingStudent = await Student.query().where('studentId', studentId).first();
      if(existingStudent) {
        throw new Error(`A student already exists with the id "${studentId}"`);
      }
      const student = await Student.query().insert({
        studentId,
        firstName,
        lastName,
        birthday,
        gender,
        ell,
      });

      const insertedDisabilities = await this.setStudentDisabilities(student.id, disabilities);
      const terms = await Term.query().where('schoolYearId', schoolYearId);

      const termInfos = await StudentTermInfo
        .query()
        .insert(
          terms.map(term => ({
            termId: term.id,
            studentId: student.id,
            gradeLevel: gradeLevel,
            postSchoolOutcome: (gradeLevel === 'Post-school' && postSchoolOutcome) || null,
            exitCategory: (gradeLevel === 'Post-school' && exitCategory) || null,
          }))
        )
        .eager('student')
        .map(termInfo => {
          termInfo.student.disabilities = insertedDisabilities;
          return termInfo;
        });

      return termInfos;
    }

    async editStudent(id, schoolYearId, {
      studentId,
      firstName,
      lastName,
      birthday,
      gender,
      ell,
      disabilities,
      gradeLevel,
      postSchoolOutcome,
      exitCategory,
    }) {
      const existingStudent = studentId && await Student.query().where('studentId', studentId).first();
      if(existingStudent && existingStudent.id !== id) {
        throw new Error(`A student already exists with the id "${studentId}"`);
      }

      const fields = removeNullValues({
        studentId,
        firstName,
        lastName,
        birthday,
        ell,
        gender,
      });

      await Student.query().where('id', id).first().patch(fields);
      await StudentDisability.query().delete().where('studentId', id);
      await StudentDisability.query().insert(disabilities.map(disabilityId => ({
        disabilityId,
        studentId: id
      })));

      const termIds = await Term.query().where('schoolYearId', schoolYearId).map(term => term.id);
      const studentTermInfos = await StudentTermInfo
        .query()
        .whereIn('termId', termIds)
        .andWhere({studentId: id})
        .patch({
          gradeLevel: gradeLevel,
          postSchoolOutcome: (gradeLevel === 'Post-school' && postSchoolOutcome) || null,
          exitCategory: (gradeLevel === 'Post-school' && exitCategory) || null,
        })
        .eager('student.disabilities')
        .returning('*');

      return studentTermInfos;
    }

    deleteStudent(id) {
      return Student.query().delete().where('id', id);
    }

    async removeStudentFromYear(studentId, schoolYearId) {
      // Get all term ids to remove the student from
      const termIds = await models.Term.query()
        .where('schoolYearId', schoolYearId)
        .map(term => term.id);

      // Delete the student's activities for the selected year
      await models.Activity.query().delete()
        .where('schoolYearId', schoolYearId)
        .andWhere('studentId', studentId);

      // Remove student term info for each term
      return StudentTermInfo.query().delete()
        .whereIn('termId', termIds)
        .andWhere('studentId', studentId);
    }

    // Gets students in a school year
    async getStudentsBySchoolYear(schoolYearId) {
      const schoolYear = await SchoolYear
        .query()
        .eager('terms(first).studentTermInfos.student', {
          first: query => query.first()
        })
        .where('id', schoolYearId)
        .first();

      return schoolYear.terms[0].studentTermInfos.map(t => t.student);
    }

    getStudentTermInfo(studentId, termId) {
      return StudentTermInfo.query().where({studentId, termId}).first();
    }

    updateStudentTermInfo(studentTermInfoId, fields) {
      return StudentTermInfo.query().patchAndFetchById(studentTermInfoId, removeNullValues(fields)).eager('student.disabilities');
    }

    async getExportData(schoolYearId, studentIds) {
      const schoolYear = await models.SchoolYear.query()
        .where('id', schoolYearId)
        .eager('terms.studentTermInfos(inStudentIds).student.disabilities', {
          inStudentIds(query) {
            return studentIds && studentIds.length
              ? query.whereIn('studentId', studentIds)
              : query;
          }
        })
        .first();

      const studentTermInfos = schoolYear.terms[0].studentTermInfos;

      return new Json2csvParser({
        fields: [
          {label: 'First Name',   value: 'student.firstName'},
          {label: 'Last Name',    value: 'student.lastName'},
          {label: 'Student Id',   value: 'student.studentId'},
          {label: 'Gender',       value: 'student.gender'},
          {label: 'Grade Level',  value: 'gradeLevel'},
          {label: 'Disabilities', value: s => s.student.disabilities.map(d => d.name).join(' ')},
        ]
      })
      .parse(studentTermInfos);
    }
  }

  return StudentController;
};
