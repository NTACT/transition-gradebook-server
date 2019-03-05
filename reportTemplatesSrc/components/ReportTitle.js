const React = require('react');
const reportTitleStyle = require('../styles/reportTitle');
const LogoImage = require('./LogoImage');

const Separator = () => <div className='separator'>|</div>;

const AppliedFilters = props => {
    const { appliedFilters } = props;
    if(!appliedFilters || !appliedFilters.length) {
        return null;
    }
    return (
        <div className="applied-filters">
            <div className="filter-label">filters:</div>
            <div className="filter-items">{appliedFilters.join(', ')}</div>
        </div>
    );
}

module.exports = (props) => {
    const { reportName, schoolSettings, timeLabel, appliedFilters } = props;
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
                {appliedFilters && appliedFilters.length && <Separator />}
                <AppliedFilters appliedFilters={appliedFilters}/>
            </div>
            <style>{reportTitleStyle}</style>
        </React.Fragment>
    )
};
