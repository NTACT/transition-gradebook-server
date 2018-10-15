const React = require('react');
const { first, capitalize } = require('lodash');
const reportTitleStyle = require('../styles/reportTitle');
const LogoImage = require('./LogoImage');

const Separator = () => React.createElement(
    'div',
    { className: 'separator' },
    '|'
);

module.exports = props => {
    const { reportName, schoolSettings, timeLabel } = props;
    const { name } = schoolSettings;

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'div',
            { className: 'logo' },
            React.createElement(LogoImage, null)
        ),
        React.createElement(
            'div',
            { className: 'titling' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'b',
                    null,
                    reportName
                )
            ),
            React.createElement(Separator, null),
            React.createElement(
                'div',
                null,
                name
            ),
            timeLabel && React.createElement(Separator, null),
            timeLabel && React.createElement(
                'div',
                null,
                timeLabel
            )
        ),
        React.createElement(
            'style',
            null,
            reportTitleStyle
        )
    );
};