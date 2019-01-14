module.exports = context => {
  context.reportUtils = require('../utils/reportUtils')(context);
  const validationError = require('../utils/validationError');
  const reports = require('./reports')(context);
  const reportNames = Object.keys(reports);

  class ReportController {
    runReport(name, options) {
      console.log(`Running report ${name}`);
      if(!reportNames.includes(name)) throw validationError(`Invalid report name "${name}"`);
      return reports[name](options);
    }
  }

  return ReportController;
};
