const precss = require('precss')
const atImport = require('postcss-import')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const resolver = require('../lib/resolve-alias').resolver

module.exports = function (node=false) {
  const loaders = node ? [ 'null-loader' ] : [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader', options: {
      ident: 'postcss',
      plugins: () => [
        atImport({
          resolve (id, basedir) {
            return resolver.resolveSync({}, basedir, id)
          },
        }),
        precss(),
      ]
    } },
  ]

  return {
    test: /\.css$/,
    use: loaders,
  }
}

