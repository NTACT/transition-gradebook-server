const riskIndicatorStyle = require('./riskIndicator');

module.exports = `
    .risk-table {
        display: -webkit-flex;
        width: 100%;
        background: #d3d3d3;
        font-size: 14px;
    }

    .risk-table-cell {
        position: relative;
        width: 25%;
        height: 40px;
        border-right: 4px solid white;
    }

    .risk-table-cell:last-child {
        border-right: none;
    }

    .risk-indicator {
        position: absolute;
        left: 0;
        top: 0;
        width: 0; 
        height: 0; 
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
        border-top: 16px solid black;
    }

    .risk-table-label-and-value {
        display: -webkit-flex;
        -webkit-align-items: center;
        -webkit-justify-content: center;
        margin-top: 7px;
        width: 100%;
        text-align: center;
    }

    .risk-table-label {
        font-weight: bold;
        margin-right: 10px;
        font-size: 12px;
    }

    .risk-table-value {
        font-size: 18px;
        margin-right: 15px;
    }

    ${riskIndicatorStyle}
`;
