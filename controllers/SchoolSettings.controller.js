module.exports = context => {
  const removeNullValues = require('../utils/removeNullValues');
  const { models } = context;
  const { SchoolSettings } = models;

  class SchoolSettingsController {
    getSchoolSettings() {
      return SchoolSettings.query().select('*').first();
    }

    updateSchoolSettings(fields) {
      return SchoolSettings.query().patch(removeNullValues(fields)).first().returning('*');
    }
  }

  return SchoolSettingsController;
};
