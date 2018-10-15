
// Client can't require files outside node_modules or client/src (issue with create-react-app)
// so enums are stored in client/src
module.exports = require('../client/src/enums');