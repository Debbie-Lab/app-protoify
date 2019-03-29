const path = require('path')
const glob = require('glob')

const getSubEntriesReg = require('./subEntriesReg')

const getVueRules = require('./vueRules')
const getScriptRules = require('./scriptRules')
const getStyleRules = require('./styleRules')
const alias = require('../lib/resolve-alias').alias

const app = process.env.APP || ''
const mode = process.env.NODE_ENV ||'production' || 'development'
const prod = mode === 'production'

class WebpackConfigProvider {

  constructor (appConfig, target='Browser') {

    this.appConfig = appConfig
    this.node = target.toLowerCase() === 'node'

    this.entry = {}
    this.output =  {}
    this.module = { rules: [] }
    this.plugins = []
    this.mode = mode
    this.externals = []
    this.target = this.node ? 'node' : 'web'
    this.resolve = { alias }

    this.defaultConfig()
  }

  defaultConfig () {
    this.collectCommonEntries()
      .setOutput()
      .setVueRules()
      .setScriptRules()
      .setStyleRules()
      .setImageRules()
      .setSvgSpriteRules()

    return this
  }

  collectCommonEntries () {
    const webpack = this.appConfig.webpack || {}
    if (webpack['common-chunk'] && webpack['common-chunk']['commonEntry']) {
      for(let key in config.webpack['common-chunk']['commonEntry']) {
        this.entry[key] = config.webpack['common-chunk']['commonEntry'][key]
      }
    }
    return this
  }

  collectEntries (pattern, options) {
    const appEntryMap = this.appConfig.webpack['entries-sub'] || {}
    const subEntriesReg = getSubEntriesReg(appEntryMap, app, 'client')

    glob.sync(pattern, options)
      .filter(file => subEntriesReg.test(file) && /\.jsx?$/.test(file))
      .forEach(file => this.entry[file.replace(/\.page\.\w+$/, '')] = path.resolve(options.cwd, file))

    return this
  }

  setOutput () {
    const webAssetsDir = this.appConfig.webpack['web-assets-dir'] || ''
    const services = this.appConfig.services

    if (!this.node) {
      this.output = {
        filename: prod ? '[name]-[chunkhash:8].js' : '[name].js?[chunkhash:8]',
        path: path.join(this.appConfig.appRootDir, '_webroot', webAssetsDir),
        publicPath: (prod ? services.cdn : path.resolve('/', webAssetsDir)) + '/',
      }
    } else {
      this.output = {
        filename: '[name].js',
        path: path.join(this.appConfig.appRootDir, '_bundles'),
        publicPath: path.resolve('/', webAssetsDir) + '/',
        libraryTarget: 'commonjs2',
      }
    }
    return this
  }

  // Vue
  setVueRules () {
    this.module.rules.push(getVueRules(this.node))
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    this.addPlugins(new VueLoaderPlugin())
    return this
  }

  // JavaScript
  setScriptRules () {
    this.module.rules.push(getScriptRules(this.node, this.appConfig.browserslist))
    return this
  }

  // CSS/SCSS/POSTCSS
  setStyleRules () {
    this.module.rules.push(getStyleRules(this.node))
    return this
  }

  // PNG|JPG|WEBP
  setImageRules () {
    this.module.rules.push({
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: { fallback: 'file-loader', limit: 2048, name: '[name]-[hash:8].[ext]' },
      }],
    })
    return this
  }

  // SVG Sprite
  setSvgSpriteRules () {
    this.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: 'svg-inline-loader',
        options: {
          idPrefix: true,
          removeTags: true,
          removingTags: [ 'title', 'desc', 'defs', 'style', 'metadata' ],
          removingTagAttrs: [ 'xmlns', 'xmlns:xlink', 'xml:space', 'version', 'id' ],
        },
      }],
    })
    return this
  }

  // new plugins
  addPlugins (...plugins) {
    this.plugins.push(...plugins)
    return this
  }

  // push Externals
  addExternals (...externals) {
    this.externals.push(...externals)
    return this
  }

  toWebpackConfig () {
    const { entry, output, module, plugins, mode, target, externals, resolve } = this
    return { entry, output, module, plugins, mode, target, externals, resolve }
  }
}

module.exports = WebpackConfigProvider

