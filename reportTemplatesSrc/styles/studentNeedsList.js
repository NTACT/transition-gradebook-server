module.exports = `
    .needs-list-root {
        position: relative;
    }

    .needs-list-title {
        color: #D43425;
        text-transform: uppercase;
        font-family: Oswald;
        margin-bottom: 15px;
    }

    .needs-list-risk-title {
        position: absolute;
        right: 65px;
        top: 12px;
        color: #D43425;
        font-family: Oswald;
    }

    .needs-list {
        margin-bottom: 10px;
        display: -webkit-flex;
        font-size: 11px;
        width: 100%;
        -webkit-justify-content: space-between;
        -webkit-flex-wrap: wrap;
        -webkit-flex-direction: column;
        height: 175px;
    }

    .needs-list-item {
        min-height: 33px;
        display: -webkit-flex;
        width: 271px;
    }

    .needs-list-value {
        min-width: 45px;
        color: #D43425;
        font-size: 16px;
        display: -webkit-flex;
        -webkit-flex-direction: column;
        -webkit-justify-content: center;
        text-align: center;
    }

    .needs-list-label {
        display: -webkit-flex;
        -webkit-flex-direction: column;
        -webkit-justify-content: center;
        margin-left: 10px;
    }
`;
