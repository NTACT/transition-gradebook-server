module.exports = context => {
  const removeNullValues = require('../utils/removeNullValues');
  const validationError = require('../utils/validationError');
  const Json2csvParser = require('json2csv').Parser;
  const { csvDataHelper, enums } = require('tgb-shared');
  const { models, } = context;
  const { Student, SchoolYear, StudentDisability, StudentTermInfo, Term, Disability} = models;

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
      race,
      ell,
      disabilities,
      gradeLevel,
      postSchoolOutcome,
      exitCategory,
      plan504,
    }) {
      const existingStudent = await Student.query().where('studentId', studentId).first();
      if(existingStudent) {
        throw validationError(`A student already exists with the id "${studentId}"`);
      }
      const student = await Student.query().insert({
        studentId,
        firstName,
        lastName,
        birthday,
        gender,
        race,
        ell,
        plan504,
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
      race,
      ell,
      disabilities,
      gradeLevel,
      postSchoolOutcome,
      exitCategory,
      plan504,
    }) {
      const existingStudent = studentId && await Student.query().where('studentId', studentId).first();
      if(existingStudent && existingStudent.id !== id) {
        throw validationError(`A student already exists with the id "${studentId}"`);
      }

      const fields = removeNullValues({
        studentId,
        firstName,
        lastName,
        birthday,
        ell,
        plan504,
        gender,
        race,
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

    async removeAllStudentsFromYear(schoolYearId){
      // Get all term ids to remove the student from 
      const termIds = await models.Term.query()
        .where('schoolYearId', schoolYearId)
        .map(term => term.id);

      // Delete student's activitities
      await models.Activity.query().delete()
        .where('schoolYearId', schoolYearId);

      // Remove student term info for each term
      return StudentTermInfo.query().delete()
      .whereIn('termId', termIds)    ;  
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
          {label: 'ELL',          value: 'student.ell'},
          {label: 'Date of Birth', value: 'student.birthday'},
          {label: 'Grade Level',  value: 'gradeLevel'},
          {label: 'Race',         value: s => s.student.race || 'N/A'},
          {label: 'Exit Category', value: 'exitCategory'},
          {label: 'Post-school outcomes', value: 'postSchoolOutcome'},
          {label: 'Disabilities', value: s => s.student.disabilities.map(d => d.name).join(' ')},
        ]
      })
      .parse(studentTermInfos);
    }

    csvDataToObjects(csvData, disabilities) {
      return csvData.map(row => {
        const realObject = {}; 
        for(const [columnName, valueObject] of Object.entries(row)) {
          const columnBeingMapped = csvDataHelper.columns.find(col => col.field === columnName);
          // metadata, like row uuid from the client
          if(!columnBeingMapped) {
            continue;
          }
          let columnValue = valueObject.value;
          // try to convert to its real value
          switch(columnBeingMapped.type) {
            case csvDataHelper.types.boolean: 
              // This will be a YesNoBoolean (used to have null/undefined treated differently than false)
              const yesNoValue = csvDataHelper.yesNoBooleanFromString(columnValue);
              columnValue = yesNoValue ? yesNoValue.booleanValue : null;
              break;
            case csvDataHelper.types.enum: 
            case csvDataHelper.types.array:
              // some of these have custom ways to remap to their values
              columnValue = typeof columnBeingMapped.deserialize === 'function' ? columnBeingMapped.deserialize(columnValue) : columnValue;
              break; 
            case csvDataHelper.types.date:
              columnValue = columnValue ? new Date(columnValue).toISOString() : null;
              break;
            case csvDataHelper.types.integer:
            case csvDataHelper.types.float:
              // convert to number, treat NaN as blank
              const numberValue = +columnValue;
              columnValue = isNaN(numberValue) ? '' : numberValue;
          }

          // If the column is disabilities, remap the string value to the id of the disability
          if(columnBeingMapped.field === 'disabilities' && columnValue) {
            columnValue = columnValue.map(provided => {
              const mappedValue = disabilities.find(dis => dis.name === provided.toUpperCase() || dis.fullName === provided);
              if(mappedValue) {
                return mappedValue.id;
              }
              return null;
            }).filter(value => !!value);
          }

          // Null out blank values
          if(columnValue === '' && !columnBeingMapped.required) {
            columnValue = null;
          }

          realObject[columnName] = columnValue;
        }

        const gradeValue = realObject.grade;
        // If a grade is specified, make sure its a number for percent or gpa, or valid letter grade for letter
        if(gradeValue) {
          const gradeType = realObject.gradeType;
          if(gradeType === 'percent' || gradeType === 'gpa' && isNaN(+gradeValue)) {
            realObject.grade = null;
          } else if(gradeType === 'letter') {
            realObject.grade = enums.gradeLetters.find(letter => letter === gradeValue.toUpperCase()) || null;
          }

        }
        return realObject;
      });
    }

    async importNewStudent(schoolYearId, {
      studentId,
      firstName,
      lastName,
      birthday,
      gender,
      race,
      ell,
      disabilities,
      gradeLevel,
      postSchoolOutcome,
      exitCategory,
      gradeType,
      grade,
      absentPercent,
      behaviorMarks,
      suspended,
      failingEnglish,
      failingMath,
      failingOther,
      onTrack,
      retained,
      schoolsAttended,
      hasExtracurricular,
      hasSelfDeterminationSkills,
      hasIndependentLivingSkills,
      hasTravelSkills,
      hasSocialSkills,
      attendedIepMeeting,
      iepRole,
      postSchoolGoals,
      hasGraduationPlan,
    }) {
      const existingStudent = await Student.query().where('studentId', studentId).first();
      if(existingStudent) {
        throw validationError(`A student already exists with the id "${studentId}"`);
      }
      const terms = await Term.query().where('schoolYearId', schoolYearId);


      const student = await Student.query().insert({
        studentId,
        firstName,
        lastName,
        birthday,
        gender,
        race,
        ell,
      });

      await this.setStudentDisabilities(student.id, disabilities);

      let checkedPostSchoolOutcome = null;
      let checkedExitCategory = null;
      if(gradeLevel === 'Post-school') {
        checkedPostSchoolOutcome = postSchoolOutcome;
        checkedExitCategory = exitCategory;
      }

      const otherFields = removeNullValues({
          gradeLevel,
          postSchoolOutcome: checkedPostSchoolOutcome,
          exitCategory: checkedExitCategory,
          gradeType,
          grade,
          absentPercent,
          behaviorMarks,
          suspended,
          failingEnglish,
          failingMath,
          failingOther,
          onTrack,
          retained,
          schoolsAttended,
          hasExtracurricular,
          hasSelfDeterminationSkills,
          hasIndependentLivingSkills,
          hasTravelSkills,
          hasSocialSkills,
          attendedIepMeeting,
          iepRole,
          postSchoolGoals,
          hasGraduationPlan,
      });

      const studentTermInfo = await StudentTermInfo
        .query()
        .insert(terms.map(term => {
            return {
              termId: term.id,
              studentId: student.id,
              ...otherFields,
            }
          })
        );

        return studentTermInfo;
    }

    async importExistingStudent(id, schoolYearId, termId, {
      studentId,
      firstName,
      lastName,
      birthday,
      gender,
      race,
      ell,
      disabilities,
      gradeLevel,
      postSchoolOutcome,
      exitCategory,
      gradeType,
      grade,
      absentPercent,
      behaviorMarks,
      suspended,
      failingEnglish,
      failingMath,
      failingOther,
      onTrack,
      retained,
      schoolsAttended,
      hasExtracurricular,
      hasSelfDeterminationSkills,
      hasIndependentLivingSkills,
      hasTravelSkills,
      hasSocialSkills,
      attendedIepMeeting,
      iepRole,
      postSchoolGoals,
      hasGraduationPlan,
    })  {

      const existingStudent = studentId && await Student.query().where('studentId', studentId).first(); 
      if(existingStudent && existingStudent.id !== id) {
        throw validationError(`A student already exists with the id "${studentId}"`);
      }
      const term = await Term.query().where('schoolYearId', schoolYearId).andWhere('id', termId).first();

      if(!term) {
        throw validationError('Term does not exist', 404);
      }

      const fields = removeNullValues({
        studentId,
        firstName,
        lastName,
        birthday,
        ell,
        gender,
        race,
      });

      await Student.query().where('id', id).first().patch(fields);
      await StudentDisability.query().delete().where('studentId', id);
      await StudentDisability.query().insert(disabilities.map(disabilityId => ({
        disabilityId,
        studentId: id
      })));

      let checkedPostSchoolOutcome = null;
      let checkedExitCategory = null;
      if(gradeLevel === 'Post-school') {
        checkedPostSchoolOutcome = postSchoolOutcome;
        checkedExitCategory = exitCategory;
      }
      
      const otherFields = removeNullValues({
        gradeType,
        postSchoolOutcome: checkedPostSchoolOutcome,
        exitCategory: checkedExitCategory,
        grade,
        absentPercent,
        behaviorMarks,
        suspended,
        failingEnglish,
        failingMath,
        failingOther,
        onTrack,
        retained,
        schoolsAttended,
        hasExtracurricular,
        hasSelfDeterminationSkills,
        hasIndependentLivingSkills,
        hasTravelSkills,
        hasSocialSkills,
        attendedIepMeeting,
        iepRole,
        postSchoolGoals,
        hasGraduationPlan,
    });
    
      // insert student record into term table
      const terms = await Term.query().where('schoolYearId', schoolYearId);
      const termIds = terms.map(term => term.id);  
      const studentTermInfos = await StudentTermInfo
        .query()
        .whereIn('termId', termIds)
        .andWhere({studentId: id})
        .patch({
          ...otherFields
        })
        .eager('student.disabilities')
        .returning('*');

      return studentTermInfos;
    }

    async importFromCSV(schoolYearId, termId, csvData) {
      const disabilities = await Disability.query();
      const rows = this.csvDataToObjects(csvData, disabilities);
      await Promise.all(rows.map(async row => {
        const existingStudent = await models.Student.query().where('studentId', row.studentId).first();
        // Exists
        if(existingStudent) {
          await this.importExistingStudent(existingStudent.id, schoolYearId, termId, {...row});
        } else {
          // When they are a new student, populate all the terms of the year
          await this.importNewStudent(schoolYearId, {...row});
        }
      }));
    }
  }

  return StudentController;
};
