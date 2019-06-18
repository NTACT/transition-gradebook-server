const React = require('react');
const headerTextboxStyle = require('../styles/headerTextbox');

module.exports = ({ data, title}) => {
  return (
    <div className='header-text-container'>
      <div className='header-title'>
        {title}
      </div>
      <div className='text-item'>
        {data?data:'Not indicated'}
      </div>
      <style>{headerTextboxStyle}</style>
    </div>
  )
};
