module.exports = context => {
  const { success, fail } = require('../utils/envelope');
  const uuid = require('uuid/v1');
  const bcrypt = require('bcryptjs');
  const filter = require('array-promise-filter');
  const adminOnly = require('../utils/adminOnly');
  const { Router, middleware, controllers, models, helpers } = context;
  const { User, ResetPassword } = models;
  const { userController, resetPasswordController } = controllers;
  const { auth } = middleware;

  function hashAndInsertPasswordRequestIdentifier(user, uid) {
    const saltRounds = 10;
    let hash = null;
    return bcrypt.hash(uid, saltRounds)
      .then(result =>  {
        hash = result;
        return resetPasswordController.deleteUniqueIdentifier(user)
      })
      .then(() => hash && resetPasswordController.insertUniqueIdentifier(user, hash));
  };

  async function checkPasswordRequestIdentifier(uid, returnData=false) {
    const getPasswordRequests = await resetPasswordController.getUniqueIdentifiers();

    const requestExists = await filter(getPasswordRequests, (passwordRequest) => bcrypt.compare(uid, passwordRequest.uid)).then(res => res);
    if (requestExists.length === 0) return { valid: false, message: 'Invalid reset password link' };

    const { createdAt } = requestExists[0];
    const expirationLimit = new Date(createdAt);
    expirationLimit.setDate(expirationLimit.getDate() + 1);
    if (new Date () > expirationLimit) return { valid: false, message: 'This reset password link has expired' };

    if (returnData) return { valid: true, user: requestExists[0] };

    return { valid: true };
  }

  return new Router()
    .post('/login', 
      middleware.login(async ({ username, password }) => {
        const user = await User.query().where('email', username).first();
        if(!user) return null;
        if(!await helpers.verifyPassword(password, user.password)) return null;
        return user;
      }),
      ctx => {
        success(ctx, {
          user: ctx.state.user,
          authToken: ctx.state.authToken,
        });
      }
    )
    .get('/user', auth(), ctx => {
      success(ctx, { user: ctx.state.user });
    })
    .get('/users', auth(), async ctx => {
      success(ctx, {
        users: await userController.getUsers()
      });
    })
    .post('/users', auth(), adminOnly(), async ctx => {
      success(ctx, {
        user: await userController.createUser(ctx.request.body)
      });
    })
    .post('/users/:userId', auth(), async ctx => {
      const { user } = ctx.state;
      const userId = +ctx.params.userId;
      const fields = {...ctx.request.body};

      // Only admins can edit users other than themselves
      if(!user.admin) {
        if(user.id !== userId) {
          return fail(ctx, 'Only admins can edit other user\'s profiles', 401);
        } else {
          fields.admin = false; // make sure users can't make themselves admin when updating their profile
        }
      }

      success(ctx, {
        user: await userController.updateUser(userId, fields)
      });
    })
    .delete('/users/:userId', auth(), adminOnly(), async ctx => {
      const userId = +ctx.params.userId;
      await userController.deleteUser(userId);
      success(ctx);
    })
    .post('/forgotPassword', async ctx => {
      const { username } = ctx.request.body;
      
      if (!username) {
        return fail(ctx, 'Username is required', 400);
      }
      
      const user = await userController.getUser(username);

      if (!user) {
        return fail(ctx, 'This user does not exist.', 404);
      }

      const { siteUrl, emailService } = context.config;
      if (!context.sendMailEnabled) {
        console.error(`Error: Email service is not defined in your configuration file. Could not send reset password email to ${username}.`)
        console.error(context.config);
        return fail(ctx, 'Email configuration error. Please contact your system administrator.', 500);
      }

      if (!siteUrl) {
        console.error(`Error: Site URL is missing from the configuration file. This field is required. Reset password email was not sent to ${username}.`)
        return fail(ctx, 'Email configuration error. Please contact your system administrator.', 500);
      }

      const { fromEmail, ...transporterOptions } = emailService;

      const uid = uuid();
      await hashAndInsertPasswordRequestIdentifier(user, uid)
        .catch(error => {
          console.error(error);
          return fail(ctx, 'Email configuration error. Please contact your system administrator.', 500);
        });

      const resetLink = `${siteUrl}#ResetPassword/${uid}`;

      const mailOptions = {
        from: fromEmail,
        to: username,
        subject: 'Transition Gradebook - Reset password',
        html:
          `
            <p>You are receiving this email because you have requested to reset the password of your Transition Gradebook user account.</p>
            <p>Click or copy/paste the following link to reset your password: <a href="${resetLink}">${resetLink}</a>.</p>
            <p>This link will expire within 24 hours.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          `
      };

      try {
        await context.sendMail(mailOptions)
        success(ctx, { message: `An email was sent to ${username}.`, uid: uid});
      } catch(error) {
        console.error(error);
        fail(ctx, 'The email service was unable to send an email.', 500);
      }
    })

    .get('/checkResetPasswordRequest', async ctx => {
      const { uid } = ctx.request.query;
      if (!uid) {
        console.error('Invalid request. No unique identifier.');
        return fail(ctx, 'Invalid request. No unique identifier.', 401);
      }

      const checkPasswordRequestResult = await checkPasswordRequestIdentifier(uid);
      return success(ctx, checkPasswordRequestResult);
    })

    .post('/resetPassword', async ctx => {
      const {
        uid,
        password,
      } = ctx.request.body;

      if (!uid || !password) {
        console.error('Invalid request. No password or no unique identifier.');
        return fail(ctx, 'Invalid request. No password or no unique identifier.', 401);
      }

      const checkPasswordRequestResult = await checkPasswordRequestIdentifier(uid, true);

      if (!checkPasswordRequestResult.valid) {
        return fail(ctx, 'Invalid request.', 401);
      }

      const {user} = checkPasswordRequestResult;
      const {userId} = user;
      await userController.updatePassword(userId, password);
      await resetPasswordController.deleteUniqueIdentifier(user);
      return success(ctx, { valid: true, message: 'Password successfully reset. You may log in with your new password.' });
    });
};
