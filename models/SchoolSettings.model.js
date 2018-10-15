module.exports = context => {
  const { Model, models } = context;

  class SchoolSettings extends Model {
    static get tableName() { return 'school_settings'; }

    static get jsonSchema() {
      return {

        type: 'object',
        required: ['name', 'gradeConversions'],
        properties: {
          id: {type: 'integer'},
          name: {type: 'name', minLength: 1},
          gradeConversions: {
            type: 'array',
            items: { 
              type: 'object',
              properties: {
                letter: {type: 'string', minLength: 1},
                gpa: {type: 'number', minimum: 0},
                percent: {type: 'number', minimum: 0, maximum: 100},
              }
            }
          },
        },

      };
    }
  }

  return SchoolSettings;
};
