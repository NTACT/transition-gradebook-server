
module.exports = function validationError(message, status=400) {
  const error = new Error(message);
  error.status = status;
  return error;
};
