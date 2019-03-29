const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = require('../lib/config')
const WebpackConfigProvider = require('./WebpackConfigProvider')
const prod = process.env.NODE_ENV === 'production'

const webpackConfigProvider = new WebpackConfigProvider(config, 'Browser')

webpackConfigProvider
  .collectEntries('**/*\.page\.js', { cwd: path.join(config.appRootDir, 'resources', 'pages') })
  .addPlugins(new AssetsPlugin({ filename: '__deps__.json', path: config.appRootDir, fullPath: true}))
  .addPlugins(new MiniCssExtractPlugin({
    filename: prod ? '[name]-[hash:8].css' : '[name].css?[hash:8]',
    chunkFilename: '[id].css',
  }))

const analyzer = process.env.analyzer || false
if (analyzer) { webpackConfigProvider.addPlugins(new BundleAnalyzerPlugin()) }

module.exports = webpackConfigProvider.toWebpackConfig()

