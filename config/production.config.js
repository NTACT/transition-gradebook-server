const { env } = process;

const port = env['PORT'];
const siteUrl = env['SITE_URL'];
const databaseUrl = env['DATABASE_URL'];

const emailAddress = env['EMAIL_ADDRESS'];
const emailPassword = env['EMAIL_PASSWORD'];
const emailHost = env['EMAIL_HOST'] || 'smtp.gmail.com'
const emailPort = env['EMAIL_PORT'] ? parseInt(env['EMAIL_PORT']) : 465;
const emailFrom = env['EMAIL_FROM'] || emailAddress;

const mailgunApiKey = env.MAILGUN_API_KEY;
const mailgunDomain = env.MAILGUN_DOMAIN;
const mailgunEnabled = !!(mailgunApiKey && mailgunDomain);

if(!databaseUrl) throw new Error(
  'You must provide the DATABASE_URL config variable.\n' +
  'You probably forgot to enable the Heroku Postgres add-on.' +
  'Enable it here: https://dashboard.heroku.com/apps/YOUR_APP_NAME/resources'
);

// Only warn if these aren't provided since the app can still function
if(!siteUrl) console.warn(
  'You must provide the SITE_URL config variable.' +
  'This value should be the full URL of your Heroku app: https://YOUR_APP_NAME.herokuapp.com/' +
  'You can add it in Heroku here: https://dashboard.heroku.com/apps/YOUR_APP_NAME/settings'
);

let emailService = null;
if(mailgunEnabled) {
  const createMailgunTransport = require('nodemailer-mailgun-transport');
  emailService = createMailgunTransport({
    auth: {
      api_key: mailgunApiKey,
      domain: mailgunDomain
    }
  });
} else  {
  if(!emailAddress) console.warn(
    'You must provide the EMAIL_ADDRESS config variable.' +
    'This value should be the email address that will send password reset emails.' +
    'You can add it in Heroku here: https://dashboard.heroku.com/apps/YOUR_APP_NAME/settings'
  );
  if(!emailPassword) console.warn(
    'You must provide the EMAIL_PASSWORD config variable.' +
    'This value should be the email password for the account that will send password reset emails.' +
    'You can add it in Heroku here: https://dashboard.heroku.com/apps/YOUR_APP_NAME/settings'
  );

  emailService = {
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    fromEmail: emailFrom,
    auth: {
      user: emailAddress,
      pass: emailPassword,
    },
  };
}

module.exports = {
  name: 'transition_gradebook',
  siteUrl: siteUrl,

  webserver: {
    port: port,
    publicDir: './public',
  },

  database: {
    ssl: true,
    connection: {
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
      }
    },
  },

  emailService,
};
