module.exports = context => {
  const { success, fail } = require('../utils/envelope');
  const { Router, middleware, controllers } = context;
  const { auth } = middleware;

  return new Router()
    .get('/disabilities', auth(), async ctx => {
      success(ctx, {
        disabilities: await controllers.disabilityController.getDisabilities()
      });
    });
};
