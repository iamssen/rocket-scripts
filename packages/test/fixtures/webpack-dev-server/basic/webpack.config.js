const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  //devtool: 'cheap-module-eval-source-map',

  entry: path.join(__dirname, 'src/index.js'),

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
  ],

  devServer: {
    hot: true,
    compress: true,
    contentBase: path.join(__dirname, 'public'),
    stats: {
      colors: false,
    },
  },
};
