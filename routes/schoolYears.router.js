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
    .delete('/schoolYears/:schoolYearId', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      await schoolYearController.deleteSchoolYear(schoolYearId);
      success(ctx);
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
    .delete('/schoolYears/:schoolYearId/students', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId; 
      await studentController.removeAllStudentsFromYear(schoolYearId); 
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
    }).post('/schoolYears/:schoolYearId/:termId/import', auth(), async ctx => {
      const schoolYearId = +ctx.params.schoolYearId;
      const termId = +ctx.params.termId;
      const csvData = ctx.request.body;
      await studentController.importFromCSV(schoolYearId, termId, csvData);
      // Client should reload the list
      success(ctx, {success: true});
    });
};
