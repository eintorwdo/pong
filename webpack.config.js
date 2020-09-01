const path = require('path');

module.exports = {
  entry: './public_src/sketch.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  }
};