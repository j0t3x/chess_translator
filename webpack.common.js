const path = require('path');
const webpack = require('webpack');
const envFile = '.env';
const envPath = path.resolve(__dirname, envFile);
const envVars = require('dotenv').config({ path: envPath }).parsed || {};

module.exports = {
  entry: {
    app: './js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/app.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envVars),
    }),
  ]
};
