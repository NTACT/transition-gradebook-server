module.exports = context => {
  const { termTypes } = require('../enums');
  const { Model, models } = context;

  class Term extends Model {
    static get tableName() { return 'terms'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['schoolYearId', 'startDate', 'index'],
        properties: {
          id: {type: 'integer'},
          schoolYearId: {type: 'integer'},
          index: {type: 'integer'},
          startDate: {type: 'string', format: 'date-time'},
        },
      };
    }

    static get relationMappings() {
      return {

        schoolYear: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.SchoolYear,
          join: {
            from: 'terms.schoolYearId',
            to: 'school_years.id',
          }
        },

        studentTermInfos: {
          relation: Model.HasManyRelation,
          modelClass: models.StudentTermInfo,
          join: {
            from: 'terms.id',
            to: 'student_term_info.termId'
          }
        },

      };
    }
  }

  return Term;
};
