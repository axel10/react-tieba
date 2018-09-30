const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const merge = require("webpack-merge");
const commonConfig = require("./webpack.base.js");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function() {
  return merge(commonConfig, {
    cache: false,
    output: {
      path: path.join(__dirname, "/../dist/"),
      filename: "js/[name].js",
    },
    optimization: {
      minimize: true
    },
    plugins: [
      new CleanWebpackPlugin(["dist"],{
        root:path.resolve(__dirname,'..'),
      }),
      new CopyWebpackPlugin([{from:path.resolve(__dirname,'../public'),to:path.resolve(__dirname,'../dist')}],{ignore:['index.html']})
    ],
    mode:'production'
  });
};
