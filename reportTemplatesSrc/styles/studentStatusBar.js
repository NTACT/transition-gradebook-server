const riskIndicatorStyle = require('./riskIndicator');

module.exports = `
  .student-status-bar {
    display: -webkit-flex;
    -webkit-flex-direction: column;
    background: #F4F4F4;
    font-size: 12px;
  }

  .student-status-bar-row {
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
  }

  .student-status-bar-info {
    display: -webkit-flex;
  }

  .student-status-bar-label {
    font-weight: bold;
    margin-left: 10px;
    margin-right: 5px;
    text-transform: uppercase;
  }

  .student-status-bar-disability {
    margin-right: 5px;
  }

  ${riskIndicatorStyle}
`;
