var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const React = require('react');

module.exports = function Page(_ref) {
  let { page, count, noBreak, style, children } = _ref,
      rest = _objectWithoutProperties(_ref, ['page', 'count', 'noBreak', 'style', 'children']);

  const last = page === count;

  return React.createElement(
    'div',
    _extends({}, rest, { style: _extends({
        pageBreakAfter: last || noBreak ? 'default' : 'always'
      }, style) }),
    children
  );
};