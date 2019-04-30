const React = require('react');

const AtRisk = require('./AtRisk');

const XCheckMark = require('./XCheckMark');

module.exports = {
  /**
   * A Red X mark
   */
  atRisk: React.createElement(AtRisk, null),

  /**
   * A Black X mark
   */
  xCheckMark: React.createElement(XCheckMark, null)
};