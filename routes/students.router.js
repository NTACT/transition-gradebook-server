module.exports = context => {
  const { success, fail } = require('../utils/envelope');
  const { Router, middleware, models, controllers } = context;
  const { studentController } = controllers;
  const { auth } = middleware;  

  return new Router()
    .delete('/students/:studentId', auth(), async ctx => {
      const studentId = +ctx.params.studentId;
      await studentController.deleteStudent(studentId);
      success(ctx);
    })
    .get('/students/:studentId/termInfo/:termId', auth(), async ctx => {
      const studentId = +ctx.params.studentId;
      const termId = +ctx.params.termId;
      success(ctx, {
        studentTermInfo: await studentController.getStudentTermInfo(studentId, termId)
      });
    })
    .post('/studentTermInfo/:studentTermInfoId', auth(), async ctx => {
      const studentTermInfoId = +ctx.params.studentTermInfoId;
      success(ctx, {
        studentTermInfo: await studentController.updateStudentTermInfo(studentTermInfoId, ctx.request.body)
      });
    });
};
