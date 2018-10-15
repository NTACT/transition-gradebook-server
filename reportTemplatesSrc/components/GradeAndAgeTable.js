const React = require('react');
const gradeAndAgeTableStyle = require('../styles/gradeAndAgeTable');

module.exports = (props) => {
    const {data} = props;
    const values = data.map(entry => entry.value);
    const total = values.reduce((sum, value) => sum + value, 0);
    return (
        <React.Fragment>
            <div className='grade-table'>
                {
                    data.map(entry =>
                        <div key={entry.label} className='grade-table-cell'>
                            <div className='grade-table-label'>{entry.label}</div>
                            <div>{entry.value}</div>
                        </div>
                    )
                }
                <div className='grade-table-cell total'>
                    <div className='grade-table-label'>TOTAL</div>
                    <div>{total}</div>          
                </div>
            </div>
            <style>{gradeAndAgeTableStyle}</style>
        </React.Fragment>
    )
};
