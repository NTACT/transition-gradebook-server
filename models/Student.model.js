module.exports = context => {
  const enums = require('../enums');
  const { Model, models } = context;

  class Student extends Model {
    static get tableName() { return 'students'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['studentId', 'firstName', 'lastName', 'birthday', 'gender', 'ell', 'race'],
        properties: {
          id: {type: 'integer'},
          studentId: {type: 'string', minLength: 1, maxLength: 255},
          firstName: {type: 'string', minLength: 1, maxLength: 255},
          lastName: {type: 'string', minLength: 1, maxLength: 255},
          ell: {type: 'boolean'},
          gender: {type: 'string', enum: enums.genders},
          race: {type: 'string', enum: enums.races},
          birthday: {type: 'string', format: 'date-time'},
        },
      };
    }

    static get relationMappings() {
      return {

        termInfo: {
          relation: Model.HasManyRelation,
          modelClass: models.StudentTermInfo,
          join: {
            from: 'students.id',
            to: 'student_term_info.studentId',
          }
        },

        activities: {
          relation: Model.HasManyRelation,
          modelClass: models.Activity,
          join: {
            from: 'students.id',
            to: 'activities.studentId',
          }
        },

        disabilities: {
          relation: Model.ManyToManyRelation,
          modelClass: models.Disability,
          join: {
            from: 'students.id',
            through: {
              from: 'student_disabilities.studentId',
              to: 'student_disabilities.disabilityId',
            },
            to: 'disabilities.id',
          }
        },

        schoolYears: {
          relation: Model.ManyToManyRelation,
          modelClass: models.SchoolYear,
          join: {
            from: 'students.id',
            through: {
              from: 'school_year_students.studentId',
              to: 'school_year_students.schoolYearId',
            },
            to: 'school_years.id',
          }
        },

      };
    }
  }

  return Student;
};
