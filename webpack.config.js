var path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: path.join(__dirname, '.webpack')
  },
  target: 'node',
  externals: [ 'aws-sdk' ],
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
