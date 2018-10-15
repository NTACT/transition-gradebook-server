module.exports = context => {
  const { models } = context;
  const { Disability } = models;

  class DisabilityController {
    getDisabilities() {
      return Disability.query().select('*');
    }
  }

  return DisabilityController;
};
