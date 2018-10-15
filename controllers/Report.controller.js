module.exports = context => {
  context.reportUtils = require('../utils/reportUtils')(context);
  const reports = require('./reports')(context);
  const reportNames = Object.keys(reports);

  class ReportController {
    runReport(name, options) {
      if(!reportNames.includes(name)) throw new Error(`Invalid report name "${name}"`);
      return reports[name](options);
    }
  }

  return ReportController;
};
