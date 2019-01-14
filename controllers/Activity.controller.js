module.exports = context => {
  const removeNullValues = require('../utils/removeNullValues');
  const validationError = require('../utils/validationError');
  const { models } = context;
  const { Activity, ActivityTypeGroup, ActivityEvent } = models;

  class ActivityController {
    getTypeGroups() {
      return ActivityTypeGroup.query().eager('[activityTypes]');
    }

    getSchoolYearActivitiesForGroup(typeGroup, yearId) {
      return ActivityTypeGroup.query()
        .eager('[activityTypes.activities(inSchoolYear).events]', {
          inSchoolYear: query => query.where('schoolYearId', yearId)
        })
        .where('name', typeGroup)
        .first();
    }

    getStudentActivities(studentId, schoolYearId) {
      return Activity.query()
        .where('studentId', +studentId)
        .andWhere('schoolYearId', +schoolYearId)
        .eager('[activityType, events]');
    }

    async createActivity(fields) {
      const { events, ...rest } = fields;
      if(!events || !events.length) throw validationError('You must add at least one event.')
      const activity = await Activity.query().insert(rest).returning('*').eager('[activityType]');
      activity.events = await this.createActivityEvents(activity.id, events);
      return activity;
    }

    async editActivity(activityId, fields) {
      const { events, ...rest } = fields;
      
      if(!events || !events.length) throw validationError('You must add at least one event.');
      await this.deleteActivityEvents(activityId);
      await this.createActivityEvents(activityId, events);

      return Activity.query()
        .patchAndFetchById(activityId, removeNullValues(rest))
        .eager('[activityType, events]');
    }

    deleteActivity(activityId) {
      return Activity.query().delete().where('id', activityId);
    }

    deleteActivityEvents(activityId) {
      return ActivityEvent.query().where({activityId}).delete();
    }

    createActivityEvents(activityId, events) {
      if(!events || !events.length) return [];
      return ActivityEvent.query().insert(events.map(event => {
        return { eventTime: event.eventTime, activityId };
      }));
    }
  }

  return ActivityController;
};
