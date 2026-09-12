const path = require('path');
const { DotenvPlugin } = require('webpack');

module.exports = {
  entry: './root.jsx',
  plugins: [
    new DotenvPlugin()
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js', 
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