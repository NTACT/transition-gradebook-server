module.exports = `
    .grade-table {
        display: -webkit-flex;
        width: 100%;
        color: #A20B0E;
        background: #E7E7E7;
        font-size: 14px;
        margin-bottom: 3px;
        -webkit-justify-content: center;
    }

    .grade-table-cell {
        width: 73px;
        height: 40px;
        display: -webkit-flex;
        -webkit-flex-direction: column;
        -webkit-justify-content: center;
        -webkit-align-items: center;
    }

    .grade-table-cell:nth-child(2n) {
        background: #F4F4F4;
    }

    .grade-table-label {
        font-weight: bold;
    }

    .total {
        background: #4A4A4A !important;
        color: white;
    }
`;