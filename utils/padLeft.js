module.exports = function padLeft(string, length, padString=' ') {
  string = ''+string;
  while(string.length < length) string = padString + string;
  return string;
};
