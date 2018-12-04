const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = require('../lib/config')
const WebpackConfigProvider = require('./WebpackConfigProvider')

const webpackConfigProvider = new WebpackConfigProvider(config, 'Node')

webpackConfigProvider
  .collectEntries('**/*\.page\.js', { cwd: path.join(config.appRootDir, 'resources', 'pages') })
  .addExternals(nodeExternals())

module.exports = webpackConfigProvider.toWebpackConfig()

