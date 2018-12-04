const postcssPresetEnv = require('postcss-preset-env')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = function (node=false) {
  const loaders = node ? [ 'null-loader' ] : [
    //'style-loader',
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader', options: {
      ident: 'postcss',
      plugins: () => [
        postcssPresetEnv(/* pluginOptions */)
      ]
    } },
  ]

  return {
    test: /\.css$/,
    use: loaders,
  }
}

