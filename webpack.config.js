const path = require('path');

module.exports = {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
  },
  entry: {
    main: path.resolve(__dirname, 'public_src', 'sketch.js')
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
    proxy: {
      '/socket.io' : 'http://localhost:3000',
      ws: true
    }
  }
};