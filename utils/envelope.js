module.exports = {
  success(context, data) {
    context.response.body = data;
  },

  fail(context, error, status=500) {
    context.response.status = status;
    context.response.body = error;
  },
};
