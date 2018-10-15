const zipObject = require('lodash/zipObject');

module.exports = async function resolveObject(object) {
  const keys = Object.keys(object);
  const values = await Promise.all(Object.values(object));
  return zipObject(keys, values);
};
