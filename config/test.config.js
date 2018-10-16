const uuid = require('uuid/v4');
const { env } = process;

module.exports = {
  name: 'transition_gradebook',
  siteUrl: 'http://localhost:8000/',

  webserver: {
    port: 'auto',
    publicDir: './public',
  },

  database: {
    dropWhenFinished: true,
    connection: {
      database: 'transition_gradebook_test_'  + uuid().replace(/-/g, '_'),
      user: env['USER'] || 'root',
      host: 'localhost',
      password: '',
    },
  },

  emailService: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    fromEmail: 'transitiongradebook@gmail.com',
    auth: {
      user: 'transitiongradebook@gmail.com',
      pass: 'Y9vBAwS45YEt'
    }
  },
};
