const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const reportStyle = require('../reportTemplates/styles/report');

module.exports = (jsx) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { overflow: auto !important; }
      </style>
      <style>
        ${reportStyle}
      </style>
    </head>
    <body>
      ${renderToStaticMarkup(jsx)}
    </body>
  </html>
`;
