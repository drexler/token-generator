var path = require('path');
var fs = require('fs');
const slsw = require('serverless-webpack');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  target: 'node',
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      },
      {
        test:  /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
};
