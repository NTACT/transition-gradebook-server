module.exports = context => {
  return async function runPreEtsReport(options) {
    const data = await context.reportUtils.getSingleTermReportData(options);
    const appliedFilters = context.reportUtils.getActiveFilters(options);

    return {
      ...data,
      appliedFilters
    };
  };
};
