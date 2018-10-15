const riskIndicatorStyle = require('./riskIndicator');

module.exports = `
  .risk-roster-table {
    page-break-inside: avoid;
  }

  .risk-roster-spacer {
    height: 30px;
  }

  .risk-roster-row,
  .risk-roster-placeholder {
    width: 100%;
    height: 40px;
    display: -webkit-flex;
    font-size: 10px;
  }

  .risk-roster-row:nth-child(2n) {
    background: #F4F4F4;
  }

  .risk-roster-row div {
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    -webkit-flex-shrink: 0;
    box-sizing: border-box;
  }

  .risk-roster-header {
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }

  .risk-roster-header-student {
    background: #D43425;
  }

  .risk-roster-header-risk {
    background: #4A4A4A;
  }

  .risk-roster-header-student,
  .risk-roster-student {
    width: 8%;
  }

  .risk-roster-header-risk,
  .risk-roster-risk {
    width: 10%;
  }

  .risk-roster-indicator .risk-indicator-container, .risk-roster-name div {
    display: block !important;
  }

  .risk-roster-indicator .risk-indicator-label {
    width: 100%;
    text-align: center;
  }

  .risk-roster-indicator .risk-indicator-container {
    margin-left: 12%;
    width: 60%;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
  }

  .risk-roster-indicator {
    display: block !important;
    text-align: center;
    width: 5%;
  }

  .risk-roster-name {
    width: 13%;
    -webkit-justify-content: flex-start !important;
  }

  .risk-roster-risk, .risk-roster-ell {
    border-right: 1px solid #D43425;
  }

  ${riskIndicatorStyle}
`;
