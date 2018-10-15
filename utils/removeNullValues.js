// Removes `null` and `undefined` key/value pairs from an object
// example: {foo: 'bar', a: null, b: undefined} -> {foo: 'bar'}
const { pickBy } = require('lodash');

const isDefined = v => v != null;
module.exports = object => pickBy(object, isDefined);