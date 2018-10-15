module.exports = context => {
  const { Model, models } = context;

  class ActivityTypeGroup extends Model {
    static get tableName() { return 'activity_type_groups'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['name'],
        properties: {
          id: {type: 'integer'},
          name: {type: 'name', minLength: 1}
        },
      };
    }

    static get relationMappings() {
      return {

        activityTypes: {
          relation: Model.HasManyRelation,
          modelClass: models.ActivityType,
          join: {
            from: 'activity_type_groups.id',
            to: 'activity_types.activityTypeGroupId',
          }
        },

      };
    }
  }

  return ActivityTypeGroup;
};
