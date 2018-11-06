module.exports = async function createUsers({ models, helpers }) {
  return models.User.query().insert([
    {
      firstName: 'test',
      lastName: 'user',
      email: 'user@test.com',
      password: await helpers.hashPassword('password'),
      admin: false,
    },
    {
      firstName: 'test',
      lastName: 'admin',
      email: 'admin@test.com',
      password: await helpers.hashPassword('password'),
      admin: true,
    },
  ]);
};

module.exports.runOrder = 2;
