module.exports = context => {
  const { success } = require('../utils/envelope');
  const { Router, middleware } = context;
  const { auth } = middleware;
  const version = process.env.npm_package_version;

  return new Router()
    .get('/application/version', auth(), async ctx => { 
      success(ctx, {version: version});
    });
};
