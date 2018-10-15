module.exports = `
  .activities-table {
    font-size: 10px;
  }

  .activities-table-row {
    display: -webkit-flex;
    height: 25px;
  }

  .activities-table-row:nth-child(2n) {
    background: #F4F4F4;
  }

  .activities-table-row:last-child .activities-table-value, .activities-table-row:last-child .activities-table-label {
    border-bottom: 1px solid #F4F4F4;
  }

  .activities-table-header {
    font-size: 14px;
    margin-bottom: 15px;
    background: #D43425;
    color: white;
    height: 30px;
    font-weight: bold;
  }

  .activities-table-title {
    font-weight: bold;
    width: 250px;
    -webkit-justify-content: center;
    -webkit-align-self: center;
    font-size: 14px;
    font-family: Oswald;
    text-transform: uppercase;
  }

  .activities-table-total {
    padding-left: 5px;
    padding-right: 5px;
    font-size: 10px;
  }

  .activities-table-label {
    padding-left: 10px;
    height: 100%;
    width: 250px;
    border-right: 1px solid #D43425;
    display: -webkit-flex;
    -webkit-align-items: center;
    box-sizing: border-box;
    border-left: 1px solid #F4F4F4;
  }

  .activities-table-row .activities-table-value {
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-self: center;
    box-sizing: border-box;
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
    width: 70px;
  }

  .activities-table-time-period {
    width: 130px;
  }

  .activities-table-notes {
    padding-left: 20px;
    height: 100%;
    display: -webkit-flex;
    -webkit-align-self: center;
    -webkit-align-items: center;
    -webkit-flex-grow: 1;
    box-sizing: border-box;
  }

  .activities-table-header .activities-table-notes {
    -webkit-justify-content: center;
  }

  .activities-table-value {
    width: 70px;
    font-size: 9px;
    text-align: center;
  }

  .activities-table-total {
    width: 30px;
    font-size: 11px;
    background: white;
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    font-weight: bold;
  }

  .activities-table-header .activities-table-total {
    background: inherit;
  }

  .activities-table-left-border {
  }

  .page-count {
    margin-top: 10px;
    height: 10px;
  }
`;