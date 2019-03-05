
module.exports = context => {
    return async function runRiskRosterReport(options) {
        const data = await context.reportUtils.getSingleTermReportData(options);
        const appliedFilters = context.reportUtils.getActiveFilters(options);

        return {
            ...data,
            appliedFilters
        }
    }

};
