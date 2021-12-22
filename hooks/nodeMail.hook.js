module.exports = {
  webserverWillListen(rapid) {
    const { emailService } = rapid.config;

    rapid.sendMail = noOpSend;
    rapid.sendMailEnabled = process.env.NODE_ENV === 'test';
    
    if (process.env.NODE_ENV === 'test') return;
    if (!emailService) return rapid.log('emailService config is missing.');

    const nodemailer = require('nodemailer');

    const transport = nodemailer.createTransport(emailService);

    function noOpSend() {
      return Promise.resolve();
    }

    function sendMail(options = {}) {
      return new Promise((resolve, reject) => {
        options = {
          ...options,
          from: `"Transition Gradebook" <${emailService.fromEmail}>`,
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
