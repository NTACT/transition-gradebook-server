const React = require('react');
const chartContainerStyle = require('../styles/chartContainer');

module.exports = (props) => 
    <div {...props}>
        <div className='chart-container'>{props.children}</div>
        <style>{chartContainerStyle}</style>
    </div>
