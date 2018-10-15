module.exports = context => {
  const enums = require('../enums');
  const { Model, models } = context;

  class SchoolYear extends Model {
    static get tableName() { return 'school_years'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['year', 'termType'],
        properties: {
          id: {type: 'integer'},
          year: {type: 'integer'},
          termType: {type: 'string', enum: enums.termTypes},
        },
      };
    }

    static get relationMappings() {
      return {

        terms: {
          relation: Model.HasManyRelation,
          modelClass: models.Term,
          join: {
            from: 'school_years.id',
            to: 'terms.schoolYearId',
          }
        },

        activities: {
          relation: Model.HasManyRelation,
          modelClass: models.Activity,
          join: {
            from: 'school_years.id',
            to: 'activities.schoolYearId'
          }
        },

      };
    }
  }

  return SchoolYear;
};
