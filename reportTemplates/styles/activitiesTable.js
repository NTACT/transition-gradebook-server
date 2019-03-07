module.exports = `
  .activities-title {
    text-transform: uppercase;
    background: #D43425;
    color: white;
    height: 30px;
    font-family: Oswald;
    display: -webkit-flex;
    -webkit-align-items: center;
    padding-left: 10px;
  } 

  .activities-table {
    page-break-inside: avoid;
    font-size: 10px;
  }

  .activities-table-frequency {
    width: 30mm;
  }

  .activities-table-header {
    font-size: 12px;
    margin-bottom: 2px;
  }

  .activities-table-row {
    display: -webkit-flex;
    height: 28px;
  }

  .activities-table-row:nth-child(2n) {
    background: #F4F4F4;
  }

  .activities-table-row:last-child {
    border-bottom: 1px solid #F4F4F4;
  }

  .activities-table-title {
    font-weight: bold;
    width: 230px;
    -webkit-justify-content: center;
    -webkit-align-self: center;
    margin-top: 7px;
  }

  .activities-table-total {
    margin-right: 5px;
  }

  .activities-table-label {
    padding-left: 10px;
    height: 100%;
    width: 230px;
    border-right: 1px solid #D43425;
    display: -webkit-flex;
    -webkit-align-items: center;
    box-sizing: border-box;
  }

  .activities-table-row .activities-table-value {
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-self: center;
  }

  .activities-table-row:not(.activities-table-header) .activities-table-value {
    height: 100%;
    border-right: 1px solid #D43425;
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-self: center;
    -webkit-align-items: center;
  }

  .activities-table-events {
    width: 14mm;
  }

  .activities-table-notes {
    padding-left: 5mm;
    height: 100%;
    max-height: 100%;
    display: -webkit-flex;
    -webkit-align-self: center;
    -webkit-align-items: center;
    -webkit-flex-grow: 1;
    box-sizing: border-box;
    overflow: hidden;
  }

  .activities-table-header .activities-table-notes {
    -webkit-justify-content: center;
  }
`;