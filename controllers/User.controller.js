module.exports = context => {
  const removeNullValues = require('../utils/removeNullValues');
  const { models, helpers } = context;
  const { User } = models;

  class UserController {
    getUsers() {
      return User.query().select('*');
    }

    async createUser(fields) {
      if(fields.password) {
        fields = {
          ...fields,
          password: await helpers.hashPassword(fields.password),
        };
      }
      return User.query().insert(fields).returning('*').first();
    }

    async updateUser(userId, {firstName, lastName, email, password, admin}) {
      const fields = removeNullValues({
        firstName, lastName, email, password, admin
      });

      if(fields.password) {
        fields.password = await helpers.hashPassword(fields.password);
      }

      return User.query().patchAndFetchById(userId, fields);
    }

    deleteUser(userId) {
      return User.query().delete().where('id', userId);
    }

    getUser(email) {
      return User.query().where('email', email).first();
    }

    updateLatestVersion(latestVersion){
      return User.query().patch({latestVersion: latestVersion}).where('admin', true);
    }

    async updatePassword(id, password) {
      return User.query()
        .patch({
          password: await helpers.hashPassword(password)
        })
        .where('id', id);
    }
  }

  return UserController;
};
