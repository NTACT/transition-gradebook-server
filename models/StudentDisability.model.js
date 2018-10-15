module.exports = context => {
  const { Model, models } = context;

  class StudentDisability extends Model {
    static get tableName() { return 'student_disabilities'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['studentId', 'disabilityId'],
        properties: {
          id: {type: 'integer'},
          studentId: {type: 'integer'},
          disabilityId: {type: 'integer'},
        },
      };
    }

    static get relationMappings() {
      return {

        student: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.Student,
          join: {
            from: 'student_disabilities.studentId',
            to: 'students.id',
          }
        },

        disability: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.Disability,
          join: {
            from: 'student_disabilities.disabilityId',
            to: 'disabilities.id',
          }
        },

      };
    }
  }

  return StudentDisability;
};
