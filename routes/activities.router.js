
module.exports = context => {
  const { success, fail } = require('../utils/envelope');
  const { Router, middleware, controllers } = context;
  const { activityController } = controllers;
  const { auth } = middleware;

  return new Router()

    .get('/activities/groups', auth(), async ctx => {
      success(ctx, {
        activityTypeGroups: await activityController.getTypeGroups()
      });
    })

    .get('/activities/:studentId/:schoolYearId', auth(), async ctx => {
      const studentId = +ctx.params.studentId;
      const schoolYearId = +ctx.params.schoolYearId;

      success(ctx, {
        activities: await activityController.getStudentActivities(studentId, schoolYearId)
      });
    })

    .post('/activities/:studentId/:schoolYearId', auth(), async ctx => {
      const studentId = +ctx.params.studentId;
      const schoolYearId = +ctx.params.schoolYearId;
      const fields = {
        ...ctx.request.body,
        studentId,
        schoolYearId,
      };

      success(ctx, {
        activity: await activityController.createActivity(fields),
      });
    })

    .post('/activities/:studentId/:schoolYearId/:activityId', auth(), async ctx => {
      const activityId = +ctx.params.activityId;
      const studentId = +ctx.params.studentId;
      const schoolYearId = +ctx.params.schoolYearId;
      const fields = {
        ...ctx.request.body,
        studentId,
        schoolYearId
      };

      success(ctx, {
        activity: await activityController.editActivity(activityId, fields),
      });
    })

    .delete('/activities/:activityId', auth(), async ctx => {
      const activityId = +ctx.params.activityId;
      await activityController.deleteActivity(activityId);
      success(ctx);
    })

};
