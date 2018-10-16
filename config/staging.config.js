
module.exports = {
  name: 'transition_gradebook',
  siteUrl: 'http://tgb.emberex.com/',

  webserver: {
    port: 8001,
    publicDir: './public',
  },

  database: {
    connection: {
      database: '',
      user: '',
      host: '',
      password: '',
    },
  },

  emailService: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    fromEmail: '',
    auth: {
      user: '',
      pass: ''
    }
  },
};
