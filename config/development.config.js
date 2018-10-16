const { env } = process;

const port = 9090;
module.exports = {
  name: 'transition_gradebook',
  siteUrl: `http://localhost:${port}/`,

  webserver: {
    port: port,
    publicDir: './public',
  },

  database: {
    connection: {
      database: 'transition_gradebook',
      user: env['USER'] || 'root',
      host: 'localhost',
      password: '',
    },
  },

  emailService: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    fromEmail: '',
    auth: {
      user: '',
      pass: ''
    }
  },
};
