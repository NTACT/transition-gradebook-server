const React = require('react');
const studentActivitiesStyle = require('../styles/studentActivities');
const TitledList = require('./TitledList');

module.exports = ({ data }) => {
    const {
        careerAwareness,
        workExperience,
        inclusion,
        studentSupports,
        collaboration
    } = data;
    return React.createElement(
        'div',
        { className: 'activities-container' },
        React.createElement(
            'div',
            { className: 'activities-lists' },
            React.createElement(
                'div',
                { className: 'activities-lists-column' },
                React.createElement(
                    'div',
                    { className: 'activities-titling' },
                    React.createElement(
                        'div',
                        { className: 'activities-title' },
                        'Student Activities'
                    ),
                    React.createElement(
                        'div',
                        { className: 'activities-subtitle' },
                        'Mean per Child'
                    )
                ),
                React.createElement(TitledList, { data: careerAwareness }),
                React.createElement(TitledList, { data: workExperience })
            ),
            React.createElement(
                'div',
                { className: 'activities-lists-column' },
                React.createElement(TitledList, { data: inclusion }),
                React.createElement(TitledList, { data: studentSupports }),
                React.createElement(TitledList, { data: collaboration })
            )
        ),
        React.createElement(
            'style',
            null,
            studentActivitiesStyle
        )
    );
};