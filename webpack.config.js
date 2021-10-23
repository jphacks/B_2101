const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntries = require("webpack-fix-style-only-entries");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'top': './src/entry/js/pages/top.js',
    'top.css': './src/entry/style/pages/top.scss',
  },
  output: {
    path: path.resolve(__dirname, 'src/static/webpack/'),
    filename: '[name].js'
  },
  module: {
    rules: [
      // TypeScript
      {
        test: /.(ts|tsx)?$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src/entry')],
        exclude: [/node_modules/]
      },
      // Sass
      {
        test: /\.scss$/, // 対象となるファイルの拡張子
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
              sourceMap: true
              //sourceMap: false
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
              //sourceMap: false
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ["node_modules"]
  },
  plugins: [
    // 出力先のフォルダを一旦空に
    new CleanWebpackPlugin({
      // 対象ファイル指定
      cleanOnceBeforeBuildPatterns: [ // 複数ある場合は配列で指定
        'src/static/webpack/**/*', // 出力フォルダ（output: で指定したパス）内のすべてのファイル
      ],
    }),
    new MiniCssExtractPlugin({
      // 出力ファイル名
      filename: "[name]",
    }),
    new FixStyleOnlyEntries(),
  ]
}
