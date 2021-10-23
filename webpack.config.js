const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'top':'./src/entry/js/pages/top.js'
  },
  output: {
    path: path.resolve(__dirname, 'src/static/webpack/'),
    filename: 'build_[name].js'
  },
  module: {
    rules: [
      // TypeScript
      {
        test: /.(ts|tsx)?$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src/entry')],
        exclude: [/node_modules/]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ["node_modules"]
  },
}
