module.exports = {
  webserverWillListen(rapid) {
    const { emailService } = rapid.config;

    rapid.sendMail = noOpSend;
    rapid.sendMailEnabled = process.env.NODE_ENV === 'test';
    if (process.env.NODE_ENV === 'test') return;

    if (!emailService) return rapid.log('emailService config is missing.');
    if (!emailService.host) return rapid.log('emailService.host is missing.');
    if (!emailService.fromEmail)
      return rapid.log('emailService.fromEmail is missing');
    if (!emailService.auth) return rapid.log('emailService.auth is missing');
    if (!emailService.auth.pass)
      return rapid.log('emailService.auth.pass is missing');
    if (!emailService.auth.user)
      return rapid.log('emailService.auth.user is missing');

    const nodemailer = require('nodemailer');

    const transport = nodemailer.createTransport({
      host: emailService.host,
      port: emailService.port,
      secure: emailService.secure || emailService.port === 465,
      auth: {
        user: emailService.auth.user,
        pass: emailService.auth.pass,
      },
    });

    function noOpSend() {
      return Promise.resolve();
    }

    function sendMail(options = {}) {
      return new Promise((resolve, reject) => {
        options = {
          ...options,
          from: `"Transition Gradebook " <${emailService.fromEmail}>`,
        };

        transport.sendMail(options, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    }

    rapid.sendMail = sendMail;
    rapid.sendMailEnabled = true;
  },
};
