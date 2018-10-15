module.exports = context => {
  const { Model, models } = context;

  class ActivityEvent extends Model {
    static get tableName() { return 'activity_events'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['activityId', 'eventTime'],
        properties: {
          id: {type: 'integer'},
          activityId: {type: 'integer'},
        },
      };
    }

    static get relationMappings() {
      return {

        activity: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.Activity,
          join: {
            from: 'activity_events.activityId',
            to: 'activities.id',
          }
        },

      };
    }
  }

  return ActivityEvent;
};
