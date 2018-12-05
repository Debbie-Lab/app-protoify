const precss = require('precss')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = function (node=false) {
  const loaders = node ? [ 'null-loader' ] : [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader', options: {
      ident: 'postcss',
      plugins: () => [
        precss(),
      ]
    } },
  ]

  return {
    test: /\.css$/,
    use: loaders,
  }
}

