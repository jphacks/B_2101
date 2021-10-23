const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'top':'./src/entry/js/pages/top.js'
  },
  output: {
    path: path.resolve(__dirname, 'src/static/webpack/'),
    filename: 'build_[name].js'
  }
}
