module.exports = context => {
    const removeNullValues = require('../utils/removeNullValues');
    const { models } = context;
    const { ResetPassword } = models;
  
    class ResetPasswordController {
      getUniqueIdentifiers() {
        return ResetPassword.query();
      }

      insertUniqueIdentifier(user, uid) {
        const {id} = user;
        return ResetPassword.query().insert({userId: id, uid});
      }

      deleteUniqueIdentifier(data) {
        const { userId, id } = data;
        let identifier = userId || id;
        return ResetPassword.query().delete().where('userId', identifier);
      }
    }
  
    return ResetPasswordController;
  };
  