module.exports = context => {
  const { success, fail } = require('../utils/envelope');
  const adminOnly = require('../utils/adminOnly');
  const { Router, middleware, models, controllers } = context;
  const { schoolYearController, studentController } = controllers;
  const { auth } = middleware;

  return new Router()
    .get('/schoolYears', auth(), async ctx => {
      success(ctx, {
        schoolYears: await schoolYearController.getSchoolYears()
      });
    })
    .post('/schoolYears', auth(), adminOnly(), async ctx => {
      success(ctx, {
        schoolYear: await schoolYearController.createSchoolYear(ctx.request.body)
      });
    })
    .get('/schoolYears/:schoolYearId', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      success(ctx, {
        schoolYear: await schoolYearController.getSchoolYear(schoolYearId)
      });
    })
    .get('/schoolYears/:schoolYearId/students', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      success(ctx, {
        students: await studentController.getStudentsBySchoolYear(schoolYearId)
      });
    })
    .post('/schoolYears/:schoolYearId/students', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      success(ctx, {
        studentTermInfos: await studentController.createStudent(schoolYearId, ctx.request.body)
      });
    })
    .delete('/schoolYears/:schoolYearId/students/:studentId', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      const studentId = +ctx.params.studentId;
      await studentController.removeStudentFromYear(studentId, schoolYearId, ctx.request.body);
      success(ctx);
    })
    .post('/schoolYears/:schoolYearId/students/:studentId', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      const studentId = +ctx.params.studentId;
      success(ctx, {
        studentTermInfos: await studentController.editStudent(studentId, schoolYearId, ctx.request.body)
      });
    })
    .post('/schoolYears/:schoolYearId/export', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      const studentIds = ctx.request.body.studentIds;
      success(ctx, await studentController.getExportData(schoolYearId, studentIds));
    })
    .get('/term/:termId/students', auth(), async ctx => {
      const termId = +ctx.params.termId;
      success(ctx, {
        students: await schoolYearController.getStudentsByTerm(termId)
      });
    });
};
