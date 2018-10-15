const React = require('react');
const titledListStyle = require('../styles/titledList');

const Item = ({index, label, value}) => 
    <div className='list-item'>
        <div className='list-item-value' style={(index % 2 === 0 && {background: '#F4F4F4'}) || null}>
            <div>{value}</div>
        </div>
        <div className='list-item-label'>
            {label}
        </div>
    </div>

module.exports = ({data}) => {
    const {
        title={},
        items=[],
    } = data;
    const {
        label,
        value,
    } = title;
    return (
        <div>
            <div className='list-title'>
                <div className='list-title-value'>{value}</div>
                <div className='list-title-label'>{label}</div>
            </div>
            {
                items.map((entry, index) => 
                    <Item key={entry.label} index={index} label={entry.label} value={entry.value} />
                )
            }
            <style>{titledListStyle}</style>
        </div>
    )
}
