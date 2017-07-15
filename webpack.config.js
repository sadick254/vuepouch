const path = require('path')

module.exports = {
  //entry
  entry: './src/index.js',
  //output
  output: {
    filename: 'vuepouch.js',
    path: path.resolve(__dirname, 'dist')
  },
  //trasnformations
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  }
}