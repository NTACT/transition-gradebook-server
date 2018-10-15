module.exports = context => {
  const { Model } = context;

  class ResetPassword extends Model {
    static get tableName() { return 'reset_password_requests'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['userId', 'uid'],
        properties: {
          id: {type: 'integer'},
          userId: {type: 'integer'},
          uid: {type: 'string'},
        },
      };
    }
  }

  return ResetPassword;
};
