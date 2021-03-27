const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  //devtool: 'cheap-module-eval-source-map',

  entry: path.join(__dirname, 'src/another.js'),

  output: {
    filename: 'another.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/another.html'),
      filename: 'another.html',
    }),
  ],
};
