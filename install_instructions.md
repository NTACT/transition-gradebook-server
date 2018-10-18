# Transition Gradebook Server Installation Instructions

## Requirements

The Transition Gradebook server should be installed on a Unix/Linux computer. Windows is not supported.
Make sure your `NODE_ENV` environmental variable is set to `"production"`. To do this, add `export NODE_ENV=production` to your `.bashrc` or `.bashprofile` file. You can check the value of `NODE_ENV` by running `echo "$NODE_ENV"`.

## Instructions

1. Ensure the following global dependencies are installed:

* [Node/NPM](https://nodejs.org/en/) - Version 9+. We recommend using [NVM](https://github.com/creationix/nvm) to install Node/NPM.
* [PostgreSQL](https://www.postgresql.org/)

2. Install local dependencies

```
npm install
```

3. Configure the server

Create `transition-gradebook-server/config/local.config.js` and add any custom configuration options you may need (such as webserver port, database name/user/password, etc.). Reference `transition-gradebook-server/config/development.config.js` for all options. You can also configure most options via environemnt variables, which you can referrence at the top of `transition-gradebook-server/config/production.config.js`.

At a minimum you will need to configure a database connection, set the site URL, and configure the email provider (for password reset functionality).

4. Create, migrate and seed the database

Create a PostgreSQL database and make sure `local.config.js` or the `DATABASE_URL` environment variable has the correct connection info set in it. Then migrate and seed the database to populate the tables and create the base user and admin accounts.

```
cd transition-gradebook-server
npm run migrate
npm run seed
```

5. Start the server

```
cd transition-gradebook-server
npm run start
```

We recommend using something like [Forever](https://github.com/foreverjs/forever#readme) to run the server in a production environment. 


Once you've completed all these steps you should be able to access the server through a supported web browser (Chrome, Firefox, Safari, or Edge).

The initial seeded accounts will be:

Admin: admin@test.com / password

User: user@test.com / password
