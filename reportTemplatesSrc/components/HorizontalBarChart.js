const React = require('react');
const horizontalBarChartStyle = require('../styles/horizontalBarChart');
const { horizontalBarColors } = require('../styles/chartColors');

module.exports = (props) => {
    const { data } = props;
    const values = data.map(entry => entry.value);
    const maxValue = Math.max.apply(null, values);
    const {
        title,
        barMaxWidth=210,
        captionWidth=120,
    } = props;
    return (
            <React.Fragment>
                <div className='barchart-container'>
                    <div className='barchart-title' style={{marginLeft: captionWidth + 10}}>{title}</div>
                    {data.map((entry, index) =>
                        <div key={index} className='barchart-bar-and-caption'>
                            <div className='barchart-caption' style={{width: captionWidth}}>{entry.label}</div>
                            <div className='barchart-bar' style={{width: barMaxWidth}}>
                                <div className='barchart-bar-fill' style={{width: maxValue <= 0 ? null : entry.value / maxValue * barMaxWidth, background: maxValue <= 0 ? null : index % 2 === 0 ? horizontalBarColors[0] : horizontalBarColors[1] }}></div>
                            </div>
                            <div className='barchart-value'>{entry.value}</div>
                        </div>
                    )}
                </div>
            <style>{horizontalBarChartStyle}</style>
        </React.Fragment>
    );
};
