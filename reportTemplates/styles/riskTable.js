const riskIndicatorStyle = require('./riskIndicator');

module.exports = `
    .risk-table {
        display: -webkit-flex;
        width: 100%;
        background: #d3d3d3;
        font-size: 14px;
        -webkit-justify-content: space-between;
    }

    .risk-table-cell {
        width: 25%;
        height: 40px;
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        border-right: 4px solid white;
    }

    .risk-table-cell:last-child {
        -webkit-align-self: none;
        border-right: none;
    }

    .risk-indicator {
        -webkit-align-self: flex-start;
        width: 0; 
        height: 0; 
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
        border-top: 16px solid black;
    }

    .risk-table-label-and-value {
        display: -webkit-flex;
        -webkit-align-items: flex-end;
        margin-top: 7px;
    }

    .risk-table-label {
        font-weight: bold;
        margin-right: 10px;
        margin-bottom: 2px;
        font-size: 12px;
    }

    .risk-table-value {
        font-size: 18px;
        margin-right: 15px;
    }

    ${riskIndicatorStyle}
`;