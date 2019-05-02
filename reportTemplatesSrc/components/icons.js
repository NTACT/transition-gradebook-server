const React = require('react');
const AtRisk = require('./AtRisk');
const XCheckMark = require('./XCheckMark');

module.exports = {
    /**
     * A Red X mark
     */
    atRisk: <AtRisk />,
    /**
     * A Black X mark
     */
    xCheckMark: <XCheckMark />,
}