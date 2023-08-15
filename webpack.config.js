const path = require('path');
const process = require('process');

console.log('Using env-arg by process: ', process.argv)

module.exports = (env) => {
  console.log('Using env-arg by webpack in functional: ', env)
  return {
    entry: './main.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    }
  }
};