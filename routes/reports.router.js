module.exports = context => {
  const { Router, middleware, controllers } = context;
  const createPDF = require('../utils/createPDF');
  const { siteUrl } = context.config;
  const timeout = 1000 * 60 * 10; // ten minutes

  return new Router()
    .get('/reports/summary', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const reportName = 'summary';
      const template = require('../reportTemplates/summaryReport');
      const { startYearId, startTermId } = ctx.request.query;
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/riskRoster', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const reportName = 'riskRoster';
      const template = require('../reportTemplates/riskRosterReport');
      const { startYearId, startTermId } = ctx.request.query;
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/riskSummary', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const reportName = 'riskSummary';
      const template = require('../reportTemplates/riskSummaryReport');
      const { startYearId, startTermId, endYearId, endTermId } = ctx.request.query;
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        endYearId: +endYearId,
        endTermId: +endTermId,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/numberOfStudents/standard', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const reportName = 'numberOfStudentsStandard';
      const template = require('../reportTemplates/numberOfStudentsStandard');
      const {
        startYearId,
        startTermId,
        byPostSchoolOutcome,
        byRiskLevel,
        bySkillTraining,
        bySupportNeed,
        byIEPRole,
        byDisability,
        byActivityGroupTypes,
      } = ctx.request.query;
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        byPostSchoolOutcome: byPostSchoolOutcome === 'true',
        byRiskLevel: byRiskLevel === 'true',
        bySkillTraining: bySkillTraining === 'true',
        bySupportNeed: bySupportNeed === 'true',
        byIEPRole: byIEPRole === 'true',
        byDisability: byDisability === 'true',
        byActivityGroupTypes: byActivityGroupTypes === 'true',
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/numberOfStudents/longitudinal', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const reportName = 'numberOfStudentsLongitudinal';
      const template = require('../reportTemplates/numberOfStudentsLongitudinal');
      const {
        startYearId,
        startTermId,
        endYearId,
        endTermId,
        byPostSchoolOutcome,
        byRiskLevel,
        bySkillTraining,
        bySupportNeed,
        byIEPRole,
        byDisability,
        byActivityGroupTypes,
      } = ctx.request.query;
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        endYearId: +endYearId,
        endTermId: +endTermId,
        byPostSchoolOutcome: byPostSchoolOutcome === 'true',
        byRiskLevel: byRiskLevel === 'true',
        bySkillTraining: bySkillTraining === 'true',
        bySupportNeed: bySupportNeed === 'true',
        byIEPRole: byIEPRole === 'true',
        byDisability: byDisability === 'true',
        byActivityGroupTypes: byActivityGroupTypes === 'true',
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/numberOfStudentsCross', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const reportName = 'numberOfStudentsCross';
      const template = require('../reportTemplates/numberOfStudentsCross');
      const {
        startYearId,
        startTermId,
        byPostSchoolOutcome,
        byRiskLevel,
        bySkillTraining,
        bySupportNeed,
        byIEPRole,
        byDisability,
        byActivityGroupTypes,
      } = ctx.request.query;
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        byPostSchoolOutcome: byPostSchoolOutcome === 'true',
        byRiskLevel: byRiskLevel === 'true',
        bySkillTraining: bySkillTraining === 'true',
        bySupportNeed: bySupportNeed === 'true',
        byIEPRole: byIEPRole === 'true',
        byDisability: byDisability === 'true',
        byActivityGroupTypes: byActivityGroupTypes === 'true',
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/student', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const {
        startYearId,
        startTermId,
        studentId,
      } = ctx.request.query;

      const template = require('../reportTemplates/studentReport');
      const reportName = 'student';
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        studentIds: studentId ? [+studentId] : null,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/studentRisk/standard', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const {
        startYearId,
        startTermId,
        studentId,
      } = ctx.request.query;

      const template = require('../reportTemplates/studentRiskStandardReport');
      const reportName = 'studentRiskStandard';
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        studentIds: studentId ? [+studentId] : null,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/studentRisk/longitudinal', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const {
        startYearId,
        startTermId,
        endYearId,
        endTermId,
        studentId,
      } = ctx.request.query;

      const template = require('../reportTemplates/studentRiskLongitudinalReport');
      const reportName = 'studentRiskLongitudinal';
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        endYearId: +endYearId,
        endTermId: +endTermId,
        studentIds: studentId ? [+studentId] : null,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/postSchoolStudent', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const {
        startYearId,
        startTermId,
        studentId,
      } = ctx.request.query;

      const template = require('../reportTemplates/postSchoolStudentReport');
      const reportName = 'postSchoolStudent';
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        studentIds: studentId ? [+studentId] : null,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    })

    .get('/reports/studentActivities', middleware.auth(), async ctx => {
      ctx.request.socket.setTimeout(timeout);
      const {
        startYearId,
        startTermId,
        endYearId,
        endTermId,
        studentId,
      } = ctx.request.query;

      const template = require('../reportTemplates/studentActivitiesReport');
      const reportName = 'studentActivities';
      const options = {
        startYearId: +startYearId,
        startTermId: +startTermId,
        endYearId: +endYearId,
        endTermId: +endTermId,
        studentIds: studentId ? [+studentId] : null,
      };
      const data = await controllers.reportController.runReport(reportName, options);
      const html = template(data);
      const stream = await createPDF(siteUrl, html);
      ctx.response.body = stream;
    });

};
