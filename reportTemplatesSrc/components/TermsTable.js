const React = require('react');
const termsTableStyle = require('../styles/termsTable');
const { riskIndicatorKeys } = require('../styles/riskIndicatorColors');
const AtRisk = require('./AtRisk');

function displayValueWithIcon(value) {
  return value === true ? <AtRisk/> : value;
}

function displayValue(value) {
  if(value == null) return 'No Data';
  if(value === true) return 'Yes';
  if(value === false) return 'No'
  return value;
}

const TermsHeader = ({ title, header }) => (
  <div className='terms-table-row terms-table-header'>
    <div className='terms-table-title'>{title}</div>
    <React.Fragment>
      {header && header.map((column, i) =>
        <div className='terms-table-header-label' key={i}>
          <div>{column.label}</div>
          <div>{column.risk}</div>
        </div>
      )}
    </React.Fragment>
  </div>
);

const TermsRow = ({ entry, useIcons, height }) => {
  const {
    risk,
    label,
    values,
  } = entry;
  let riskMetric = {};
  if (risk) {
    riskMetric = riskIndicatorKeys[risk];
  }
  return (
    <div className='terms-table-row terms-table-body' style={{ height }}>
      <div className={`terms-table-label-container ${(risk && 'terms-table-risk-label-container') || ''}`}>
        <div className='terms-table-label'>
          {label || riskMetric.label2}
        </div>
        {risk && <div className='risk-indicator' style={{borderTopColor: riskMetric.value}}></div>}
      </div>
      {values.map((value, i) => 
        <div className='terms-table-value' key={i}>
          {useIcons ? displayValueWithIcon(value) : displayValue(value)}
        </div>
      )}
    </div>
  );
};

module.exports = function TermsTable({ data, title, rowHeight, useIcons }) {
  const { header, rows } = data;

  return (
    <React.Fragment>
      <div className='terms-table'>
        <TermsHeader title={title} header={header} />
        {rows.map((entry, i) =>
          <TermsRow key={i} entry={entry} useIcons={useIcons} height={rowHeight} />
        )}
      </div>
      <style>{termsTableStyle}</style>
    </React.Fragment>
  );
};
