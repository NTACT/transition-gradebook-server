module.exports = {
  async webserverWillListen(rapid) {
    const cron = require('node-cron')
    const axios = require('axios')
    require('dotenv').config()

    const { GITHUB_TOKEN, npm_package_version } = process.env
    const url = 'https://raw.githubusercontent.com/NTACT/transition-gradebook-server/master/package.json'
    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3.raw'
    }

    const getVersionFromRepo = async () => {
      const request = await axios({
        method: 'get',
        url,
        headers
      })

      return request.data.version
    }

    cron.schedule("* * * * *", async () => {
      rapid.log(`Current server version: ${npm_package_version}`)
    });
  }
}