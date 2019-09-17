module.exports = context => {
  const validationError = require('../utils/validationError');
  const { Model, models, decorators } = context;

  class User extends Model {
    static get tableName() { return 'users'; }
    static get usernameField() { return 'email'; }
    static get passwordField() { return 'password'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
        properties: {
          id: {type: 'integer'},
          firstName: {type: 'string', minLength: 2},
          lastName: {type: 'string', minLength: 2},
          email: {type: 'string', minLength: 6},
          password: {type: 'string', minLength: 8},
          admin: {type: 'boolean'},
          latestVersion: {type: 'string'}, 
        },
      };
    }

    async isEmailInUse(email) {
      return !!(await User.query().first().where('email', email));
    }

    async validateEmail(email) {
      if(email && (await this.isEmailInUse(email))) {
        throw validationError('A user with that email already exists.');
      }
    }

    async $beforeUpdate(opts) {
      await this.validateEmail(this.email);
    }

    async $beforeInsert(opts) {
      await this.validateEmail(this.email);
    }
  }

  return User;
};
