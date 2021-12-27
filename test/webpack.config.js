const path = require('path');

module.exports = {
  entry: './test/test.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      handlebars: "handlebars/dist/handlebars.min.js"
    }
  },
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, '../dist'),
  },
};