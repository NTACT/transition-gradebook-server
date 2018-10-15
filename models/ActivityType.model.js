module.exports = context => {
  const { Model, models } = context;

  class ActivityType extends Model {
    static get tableName() { return 'activity_types'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['name', 'activityTypeGroupId'],
        properties: {
          id: {type: 'integer'},
          name: {type: 'name', minLength: 1},
          activityTypeGroupId: {type: 'integer'},
        },
      };
    }

    static get relationMappings() {
      return {

        activityTypeGroup: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.ActivityTypeGroup,
          join: {
            from: 'activity_types.activityTypeGroupId',
            to: 'activity_type_groups.id',
          }
        },

        activities: {
          relation: Model.HasManyRelation,
          modelClass: models.Activity,
          join: {
            from: 'activity_types.id',
            to: 'activities.activityTypeId',
          }
        },

      };
    }
  }

  return ActivityType;
};
