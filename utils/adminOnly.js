const { fail } = require('./envelope');

module.exports = () => (ctx, next) => {
  const { user } = ctx.state;
  if(!user || !user.admin) {
    return fail(ctx, new Error('Admin only.'), 401);
  } else {
    return next();
  }
};