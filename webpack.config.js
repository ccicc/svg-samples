const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: path.resolve(__dirname, './src/assets/ts/index.ts'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },

  devtool: 'source-map',

  devServer: {
    port: 8000,
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    hot: true
  },

  plugins: [
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'svg-samples',
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.html'),
      minify: true,
      hash: true
    })
  ],

  resolve: {
    extensions: ['.js', '.ts', '.css', '.scss']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 20140}
          }
        ]
      }
    ]
  }
};
