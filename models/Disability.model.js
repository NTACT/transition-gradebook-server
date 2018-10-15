module.exports = context => {
  const { Model, models } = context;

  class Disability extends Model {
    static get tableName() { return 'disabilities'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['name', 'fullName'],
        properties: {
          id: {type: 'integer'},
          name: {type: 'name', minLength: 1},
          fullName: {type: 'name', minLength: 1},
        },
      };
    }
  }

  return Disability;
};
