module.exports = context => {
  const { success, fail } = require('../utils/envelope');
  const { Router, middleware, controllers } = context;
  const { auth } = middleware;

  return new Router()
    .get('/schoolSettings', auth(), async ctx => {
      success(ctx, {
        schoolSettings: await controllers.schoolSettingsController.getSchoolSettings()
      });
    })
    .post('/schoolSettings', auth(), async ctx => {
      success(ctx, {
        schoolSettings: await controllers.schoolSettingsController.updateSchoolSettings(ctx.request.body)
      });
    });

};
