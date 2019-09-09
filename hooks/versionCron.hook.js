/**
 * This hook will run once a day (at midnight), check the current deployed version of the app, compare with the currently
 * running version of the app, and send superadmins an email notifying them of the latest version with release notes, which will
 * also reside in the github repo.
 */
const axios = require('axios')
const cron = require('node-cron')
const semver = require('semver')

module.exports = {
  getFileFromGithub(url) {
    return axios({
      method: 'get',
      url,
      headers: { Accept: 'application/vnd.github.v3.raw' }
    })
  },

  serverRepoURL(file) {
    return `https://raw.githubusercontent.com/NTACT/transition-gradebook-server/master/${file}`
  },

  versionEmailTemplate(notes) {
    return `
      <p> There is a new version of Transition Gradebook that is available for installation. Please update your app to the latest version. </p>
      <p> Changes from the latest version: </p>
      <ul>
        ${notes.reduce((acc, note) => `${acc}<li>${note}</li>`, "")}
      </ul>
    `
  },

  async webserverWillListen(rapid) {
    const { npm_package_version } = process.env

    cron.schedule('0 0 * * *', async () => {
      if (!rapid.sendMailEnabled) return rapid.log("Cannot send version update email: mail service is not available.")

      const packageData = (await this.getFileFromGithub(this.serverRepoURL('package.json'))).data
    
      const latestVersion = await rapid.models.User.query().select('latestVersion').where('admin', true).first();
      if (semver.lt(npm_package_version, packageData.version) && latestVersion !== npm_package_version) {
        rapid.log('Newer version is available, sending email to admins.')

        const releaseNotes = await this.getFileFromGithub(this.serverRepoURL('release-notes.json')).data
        const [release] = releaseNotes.filter(note => note.version === packageData.version)

        const admins = (await rapid.models.User.query()).filter(user => user.admin)
        await Promise.all(admins.map(async (admin) => {
          const { email } = admin
          try {
            await rapid.sendMail({
              subject: 'Transition Gradebook - New Version Available',
              to: email,
              html: this.versionEmailTemplate(release.notes)
            })
          } catch (e) {
            rapid.log(`Error sending version update email: ${e}`)
          }
        }))
        await rapid.controllers.userController.updateLatestVersion(npm_package_version);
        rapid.log(`Sent version update email to ${admins.length} admins.`)
      }
    });
  }
}