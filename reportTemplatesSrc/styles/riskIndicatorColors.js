module.exports = [
  '#A5DA68',
  '#FAE745',
  '#FCB32F',
  '#D43425',
];

module.exports.riskIndicatorKeys = {
  'No Data': {
    key: 'No Data',
    value: '#AAA',
    label: 'No Data',
    label2: 'No Data',
  },
  low: {
    value: '#A5DA68',
    label: 'low',
    label2: 'Low',
  },
  medium: {
    value: '#FAE745',
    label: 'med',
    label2: 'Medium',
  },
  high: {
    value: '#FCB32F',
    label: 'high',
    label2: 'High',
  },
  ultra: {
    value: '#D43425',
    label: 'ultra',
    label2: 'Ultra',
  },
};

module.exports.riskIndicatorArray = Object.values(module.exports.riskIndicatorKeys).map(v => {
  return {
    key: v.key || v.label1,
    label: v.label2,
    color: v.value,
  };
});
