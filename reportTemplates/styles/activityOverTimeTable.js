module.exports = `
 .activity-over-time-table-row {
    display: -webkit-flex;
    font-size: 11px;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
  }

  .activity-over-time-table-row:nth-child(2n) {
    background: #F4F4F4;
  }

  .activity-over-time-table-header {
    min-height: 34px;
    background: #D43425;
    color: white;
    font-size: 16px;
    font-family: Oswald;
  }

  .activity-over-time-table-body {
    height: 34px;
  }

  .activity-over-time-table-header-label {
    -webkit-flex: 1;
    text-align: center;
    font-size: 8px;
  }

  .activity-over-time-table-title {
    text-transform: uppercase;
  }

  .activity-over-time-table-title {
    padding-left: 7px;
    min-width: 510px;
    box-sizing: border-box;
  }

  .activity-over-time-table-label-container {
    width: 510px;
  }

  .activity-over-time-table-label-container {
    display: -webkit-flex;
    font-size: 8px;
    font-weight: bold;
    padding-left: 7px;
    padding-right: 7px;
    box-sizing: border-box;
  }

  .activity-over-time-table-value {
    -webkit-flex: 1;
    border-left: 1px solid #D43425;
    height: 100%;
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-items: center;
  }
`;