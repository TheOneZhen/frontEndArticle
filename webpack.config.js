const path = require('path');
const process = require('process');

module.exports = (env) => {
  return {
    entry: './main.js',
    output: {
      path: path.resolve(__dirname, 'static')
    },
    module: {
      rules: [
        {
          test: "/\.(png|svg|jpg|jpeg)/i",
          type: 'asset',
          generator: {
            publicPath: 'static/',
          }
        }
      ]
    }
  }
};