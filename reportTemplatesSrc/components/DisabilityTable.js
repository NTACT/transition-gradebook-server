const React = require('react');
const disabilityTableStyle = require('../styles/disabilityTable');

module.exports = (props) => {
    const { data } = props;
    return (
        <React.Fragment>
            <div className='disability-table'>
                {
                    data.map(entry =>
                        <div key={entry.label} className='disability-table-cell'>
                            <div className='disability-table-label'>{entry.label}</div>
                            <div>{entry.value}</div>
                        </div>
                    )
                }
            </div>
            <style>{disabilityTableStyle}</style>
        </React.Fragment>
    )
};
