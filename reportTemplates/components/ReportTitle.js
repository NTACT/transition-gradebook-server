const React = require('react');
const reportTitleStyle = require('../styles/reportTitle');
const LogoImage = require('./LogoImage');

const Separator = () => React.createElement(
    'div',
    { className: 'separator' },
    '|'
);

const AppliedFilters = props => {
    const { appliedFilters } = props;
    if (!appliedFilters || !appliedFilters.length) {
        return null;
    }
    return React.createElement(
        'div',
        { className: 'applied-filters' },
        React.createElement(
            'div',
            { className: 'filter-label' },
            'filters:'
        ),
        React.createElement(
            'div',
            { className: 'filter-items' },
            appliedFilters.join(', ')
        )
    );
};

module.exports = props => {
    const { reportName, schoolSettings, timeLabel, appliedFilters } = props;
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
            ),
            appliedFilters && appliedFilters.length && React.createElement(Separator, null),
            React.createElement(AppliedFilters, { appliedFilters: appliedFilters })
        ),
        React.createElement(
            'style',
            null,
            reportTitleStyle
        )
    );
};