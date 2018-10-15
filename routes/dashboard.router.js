module.exports = context => {
  const { success, fail } = require('../utils/envelope');
  const { Router, middleware, controllers } = context;
  const { auth } = middleware;

  return new Router()
    .get('/dashboard/:termId', auth(), async ctx => {
      const termId = +ctx.params.termId;
      success(ctx, 
        await controllers.dashboardController.getDashboardDataForTerm(termId)
      );
    });
};
