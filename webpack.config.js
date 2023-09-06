const path = require('path');
const process = require('process');

module.exports = (env) => {
  return {
    entry: './main.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    }
  }
};