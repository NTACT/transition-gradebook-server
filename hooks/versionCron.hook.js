/**
 * This hook will run once a day (at midnight), check the current deployed version of the app, compare with the currently
 * running version of the app, and send superadmins an email notifying them of the latest version with release notes, which will
 * also reside in the github repo.
 */
const axios = require('axios')
const cron = require('node-cron')
const semver = require('semver')
require('dotenv').config()

module.exports = {
  getFileFromGithub(url) {
    const { GITHUB_TOKEN } = process.env
    return axios({
      method: 'get',
      url,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw'
      }
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
    const { npm_package_version, NODE_ENV, GITHUB_TOKEN } = process.env

    if (!GITHUB_TOKEN) return rapid.log("Github credentials have not been properly set.")
    const schedule = NODE_ENV === 'production' ? '0 0 * * *' : "* * * * *"

    cron.schedule(schedule, async () => {
      if (!rapid.sendMailEnabled) return rapid.log("Mail service is not available.")

      const packageData = (await this.getFileFromGithub(this.serverRepoURL('package.json'))).data
      if (semver.lt(npm_package_version, packageData.version)) {
        rapid.log('Newer version is available, sending email to admins.')

        const releaseNotes =
          NODE_ENV === 'production' ? (await this.getFileFromGithub(this.serverRepoURL('release-notes.json'))).data : require('../release-notes.json')
        const [release] = releaseNotes.filter(note => note.version === packageData.version)

        const admins = (await rapid.models.User.query()).filter(user => user.admin)
        admins.forEach(async (admin) => {
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
        })
      }
    });
  }
}