module.exports = context => {
  return async function runTrackToGraduateReport(options) {
      const data = await context.reportUtils.getSingleTermReportData(options);
      const appliedFilters = context.reportUtils.getActiveFilters(options);

      return {
          ...data,
          appliedFilters
      }
  }

};
