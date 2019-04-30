const React = require('react');

const termsTableStyle = require('../styles/termsTable');

const {
  riskIndicatorKeys
} = require('../styles/riskIndicatorColors');

const Icons = require('./icons');

function displayValueWithIcon(value, icon) {
  return value === true ? icon : value;
}

function displayValue(value) {
  if (value == null) return 'No Data';
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value;
}

const TermsHeader = ({
  title,
  header
}) => React.createElement("div", {
  className: "terms-table-row terms-table-header"
}, React.createElement("div", {
  className: "terms-table-title"
}, title), React.createElement(React.Fragment, null, header && header.map((column, i) => React.createElement("div", {
  className: "terms-table-header-label",
  key: i
}, React.createElement("div", null, column.label), React.createElement("div", null, column.risk)))));

const TermsRow = ({
  entry,
  useIcons,
  height,
  icon
}) => {
  const {
    risk,
    label,
    values
  } = entry;
  let riskMetric = {};

  if (risk) {
    riskMetric = riskIndicatorKeys[risk];
  }

  return React.createElement("div", {
    className: "terms-table-row terms-table-body",
    style: {
      height
    }
  }, React.createElement("div", {
    className: `terms-table-label-container ${risk && 'terms-table-risk-label-container' || ''}`
  }, React.createElement("div", {
    className: "terms-table-label"
  }, label || riskMetric.label2), risk && React.createElement("div", {
    className: "risk-indicator",
    style: {
      borderTopColor: riskMetric.value
    }
  })), values.map((value, i) => React.createElement("div", {
    className: "terms-table-value",
    key: i
  }, useIcons ? displayValueWithIcon(value, icon) : displayValue(value))));
};

module.exports = function TermsTable({
  data,
  title,
  rowHeight,
  useIcons,
  icon = Icons.atRisk
}) {
  const {
    header,
    rows
  } = data;
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "terms-table"
  }, React.createElement(TermsHeader, {
    title: title,
    header: header
  }), rows.map((entry, i) => React.createElement(TermsRow, {
    key: i,
    entry: entry,
    useIcons: useIcons,
    height: rowHeight,
    icon: icon
  }))), React.createElement("style", null, termsTableStyle));
};