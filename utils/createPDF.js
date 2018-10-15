const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const pdf = require('html-pdf');
const markupWrapper = require('./markupWrapper');
const getMonthName = require('../utils/getMonthName');
const padLeft = require('../utils/padLeft');

function getDateString() {
  const now = new Date();
  const hour = now.getHours();
  const pm = hour >= 12;

  return `${getMonthName(now)} ${now.getDate()}, ${now.getFullYear()} ${(hour % 12) || 12}:${padLeft(now.getMinutes(), 2, '0')}${pm ? 'PM' : 'AM'}`
}

module.exports = function (siteUrl, data) {
  return new Promise((resolve, reject) => {
    const html = markupWrapper(data);
    const options = {
      orientation: 'landscape',
      base: siteUrl,
      timeout: 60000 * 5, // 5 minutes
      border: '8px',
      footer: {
        height: '3mm',
        contents: {
          default: `<span style="font-family: arial; font-size:10px">Page {{page}}/{{pages}} ${getDateString()}</span>`, // fallback value
        }
      }
    };
    pdf.create(html, options).toStream((error, stream) => {
      if(error) return reject(error);
      else resolve(stream);
    });
  });
}
