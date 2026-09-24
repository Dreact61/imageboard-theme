const webpack = require('webpack');

const path = require('path');
const dotenv = require('dotenv');

const env = dotenv.config().parsed || {}

module.exports = {
  entry: './root.jsx',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/wp-content/themes/imageboard-theme/build',
    clean: true
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {

            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ],
          },
        },
      },
    ],
  },
};