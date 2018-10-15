const { maxBy } = require('lodash');

module.exports = function findMaxRisk(risks) {
  return maxBy(risks, risk => {
    if(risk === 'ultra') return 3;
    if(risk === 'high') return 2;
    if(risk === 'medium') return 1;
    if(risk === 'low') return 0;
  });
};
