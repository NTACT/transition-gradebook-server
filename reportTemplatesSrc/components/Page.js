const React = require('react');

module.exports = function Page({ page, count, noBreak, style, children, ...rest }) {
  const last = page === count;

  return (
    <div {...rest} style={{
      pageBreakAfter: (last || noBreak) ? 'default' : 'always',
      ...style,
    }}>
      {children}
    </div>
  );
}
