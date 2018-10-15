const React = require('react');
const studentActivitiesStyle = require('../styles/studentActivities');
const TitledList = require('./TitledList');

module.exports = ({ data }) => {
    const {
        careerAwareness,
        workExperience,
        inclusion,
        studentSupports,
        collaboration,
    } = data;
    return (
        <div className='activities-container'>
            <div className='activities-lists'>
                <div className='activities-lists-column'>
                    <div className='activities-titling'>
                        <div className='activities-title'>Student Activities</div>
                        <div className='activities-subtitle'>Mean per Child</div>
                    </div>
                    <TitledList data={careerAwareness} />
                    <TitledList data={workExperience} />
                </div>
                <div className='activities-lists-column'>
                    <TitledList data={inclusion} />
                    <TitledList data={studentSupports} />
                    <TitledList data={collaboration} />
                </div>
            </div>
            <style>{studentActivitiesStyle}</style>
        </div>    
    )
}