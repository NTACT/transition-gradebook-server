const React = require('react');
const { first, capitalize } = require('lodash');
const reportTitleStyle = require('../styles/reportTitle');
const LogoImage = require('./LogoImage');

const Separator = () => <div className='separator'>|</div>;

module.exports = (props) => {
    const { reportName, schoolSettings, timeLabel } = props;
    const { name } = schoolSettings;

    return (
        <React.Fragment>
            <div className='logo'>
                <LogoImage/>
            </div>
            <div className='titling'>
                <div><b>{reportName}</b></div>
                <Separator />
                <div>{name}</div>
                {timeLabel && <Separator />}
                {timeLabel && <div>{timeLabel}</div>}
            </div>
            <style>{reportTitleStyle}</style>
        </React.Fragment>
    )
};
