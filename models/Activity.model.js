module.exports = context => {
  const enums = require('../enums');
  const { Model, models } = context;

  class Activity extends Model {
    static get tableName() { return 'activities'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['studentId', 'schoolYearId', 'activityTypeId', 'notes'],
        properties: {
          id: {type: 'integer'},
          studentId: {type: 'integer'},
          schoolYearId: {type: 'integer'},
          activityTypeId: {type: 'integer'},
          frequency: {type: 'string', enum: enums.activityFrequencies},
          notes: {type: 'string'},
        },
      };
    }

    static get relationMappings() {
      return {

        student: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.Student,
          join: {
            from: 'activities.studentId',
            to: 'students.id',
          }
        },

        term: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.SchoolYear,
          join: {
            from: 'activities.schoolYearId',
            to: 'school_years.id',
          }
        },

        activityType: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.ActivityType,
          join: {
            from: 'activities.activityTypeId',
            to: 'activity_types.id',
          }
        },

        events: {
          relation: Model.HasManyRelation,
          modelClass: models.ActivityEvent,
          join: {
            from: 'activity_events.activityId',
            to: 'activities.id',
          }
        },
        
      };
    }
  }

  return Activity;
};
