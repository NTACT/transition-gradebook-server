module.exports =`
  .risk-list {
    margin-top: 15px;
    display: -webkit-flex;
    -webkit-flex-direction: column;
    -webkit-flex-wrap: wrap;
    height: 180px;
    page-break-inside: avoid;
  }

  .risk-list-title, .risk-list-item {
    box-sizing: border-box;
    display: -webkit-flex;
    min-height: 38px;
    margin-top: 3px;
    width: calc(33.33% - 10px);
  }

  .risk-list-item:nth-child(n + 5) {
    margin-left: 10px;
  }

  .risk-list-title {
    background-color: #D43425;
    color: white;
    padding-left: 10px;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
    box-sizing: border-box;
  }

  .risk-list-title-label {
    text-transform: uppercase;
    font-family: Oswald;
  }

  .risk-list-title-risk {
    font-size: 10px;
    font-weight: bold;
    padding-right: 10px;
  }

  .risk-list-item {
    border-top: 1px solid #D43425;
    border-bottom: 1px solid #D43425;
    border-right: 1px solid #D43425;
  }

  .risk-list-item-value {
    font-size: 12px;
    min-width: 55px;
    -webkit-flex-shrink: 0;
    background: #D43425;
    color: white;
    text-align: center;
    font-weight: bold;
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-items: center;
  }

  .risk-list-item-label {
    font-size: 10px;
    -webkit-align-self: center;
    margin-left: 8px;
  }

`;
