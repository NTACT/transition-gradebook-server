const riskIndicatorStyle = require('./riskIndicator');

module.exports = `
  .terms-table-row {
    display: -webkit-flex;
    font-size: 11px;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
  }

  .terms-table-row:nth-child(2n) {
    background: #F4F4F4;
  }

  .terms-table-header {
    min-height: 34px;
    background: #D43425;
    color: white;
    font-size: 16px;
    font-family: Oswald;
  }

  .terms-table-body {
    height: 34px;
  }

  .terms-table-header-label {
    -webkit-flex: 1;
    text-align: center;
  }

  .terms-table-title {
    text-transform: uppercase;
  }

  .terms-table-title {
    padding-left: 7px;
    min-width: 130px;
    box-sizing: border-box;
  }

  .terms-table-label-container {
    width: 130px;
  }

  .terms-table-label-container {
    display: -webkit-flex;
    font-size: 8px;
    font-weight: bold;
    padding-left: 7px;
    padding-right: 7px;
    box-sizing: border-box;
  }

  .terms-table-risk-label-container .terms-table-label {
    min-width: 70%;
  }

  .terms-table-risk-label-container {
    height: 100%;
    -webkit-align-items: center;
  }

  .terms-table-value {
    -webkit-flex: 1;
    border-left: 1px solid #D43425;
    height: 100%;
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    font-size: 8px;
  }

  ${riskIndicatorStyle}
`;