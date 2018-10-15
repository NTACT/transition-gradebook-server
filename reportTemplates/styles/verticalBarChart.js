const riskIndicatorStyle = require('./riskIndicator');

module.exports = `
  .vertical-bar-chart-container {
    margin-top: 10px;
    margin-bottom: 50px;
    overflow: visible;
  }

  .vertical-bar-chart-content {
    display: -webkit-flex;
    text-transform: uppercase;
  }

  .vertical-bar-chart-title {
    -webkit-transform: rotate(-180deg);
    -webkit-writing-mode: vertical-rl;
    height: 100%;
    text-align: center;
    color: #D43425;
    font-family: Oswald;
  }

  .vertical-bar-chart-caption-container {
    display: -webkit-flex;
    -webkit-justify-content: center;
    margin-bottom: -35px;
  }

  .vertical-bar-chart-caption-container-risk {
    margin-bottom: -45px;
  }

  .vertical-bar-chart-caption-content {
    background: #F4F4F4;
    display: -webkit-flex;
    padding: 6px;
  }

  .vertical-bar-chart-caption-item {
    margin-right: 15px;
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-flex-direction: column;
    text-align: center;
  }

  .vertical-bar-chart-caption-risk {
    margin-right: 40px;
  }

  .vertical-bar-chart-caption-item:last-child {
    margin-right: 0;
  }

  .vertical-bar-chart-caption-color {
    width: 45px;
    height: 5px;
    -webkit-align-self: center;
  }

  .vertical-bar-chart-caption-label {
    margin-top: 3px;
    font-size: 9px;
  }
  .recharts-bar-rectangle {
    z-index: -1;
    position: absolute;
  }

  ${riskIndicatorStyle}
`;