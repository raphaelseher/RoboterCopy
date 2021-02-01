const nodeExternals = require('webpack-node-externals');
const webpack = require("webpack");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [
    nodeExternals(),
    new webpack.ExternalsPlugin('commonjs', [
      'electron'
    ])
  ], // in order to ignore all modules in node_modules folder
};