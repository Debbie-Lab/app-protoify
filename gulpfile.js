const del = require('del')
const path = require('path')
const gulp = require('gulp')
const nodemon = require('nodemon')
const webpack = require('webpack')

const config = require('./lib/config')
const statsOpts = require('./config/stats-opts')
const nodemonConfig = require('./config/nodemon.js')
const watchConfig = require('./config/watch.js')

const browserWebpackConfig = require('./webpack/browser.webpack.config')
const serverWebpackConfig = require('./webpack/server.webpack.config')

const logger = console.log

const buildLogger = done => (err, stats) => {
  if (err) { logger('Error', err) }
  else {
    logger(stats.toString(statsOpts))
    done()
  }
}

const webpackTask = (taskName, webpackConfig) => gulp.task(taskName, done => webpack(webpackConfig).run(buildLogger(done)))
webpackTask('webpack@browser', browserWebpackConfig)
webpackTask('webpack@server', serverWebpackConfig)
gulp.task('webpack', ['webpack@browser', 'webpack@server'])

const browserBuild = Object.keys(browserWebpackConfig.entry).length !== 0 ? webpack(browserWebpackConfig) : null
const serverBuild = Object.keys(serverWebpackConfig.entry).length !== 0 ? webpack(serverWebpackConfig) : null


gulp.task('run', [ 'clean' ], () => {
  const buildStatus = {
    browserBuildDone: !browserBuild,
    serverBuildDone: !serverBuild,
    nodemonInited: false,
    nodeApp: null,
  }

  // 检查浏览器、服务两端是否均完成构建
  const checkAllDone = () => {
    if (buildStatus.browserBuildDone && buildStatus.serverBuildDone) {
      buildStatus.nodemonInited = true
      buildStatus.nodeApp = nodemon(nodemonConfig)
        .on('start', () => null)
        .on('crash', () => logger('crash'))
        .on('quit', () => process.exit())
        .on('restart', () => logger('wait restart ...'))
        .on('config:update', cfg => {
          cfg = cfg || {}
          const opts = cfg.options || {}
          logger('Nodemon configured.')
          logger('输入`' + (opts.restartable || 'rs') + '\'回车以手动重启进程')
        })
    }
  }
  serverBuild && serverBuild.watch(watchConfig, buildLogger(() => {
    logger('serverBuild watch.')
    if (buildStatus.nodemonInited) {
      buildStatus.nodeApp.restart()
      return
    }
    buildStatus.serverBuildDone = true
    checkAllDone()
  }))
  browserBuild && browserBuild.watch(watchConfig, buildLogger(() => {
    logger('browserBuild watch.')
    if (buildStatus.nodemonInited) {
      buildStatus.nodeApp.restart()
      return
    }
    buildStatus.browserBuildDone = true
    checkAllDone()
  }))
})

gulp.task('clean', () => del([ serverWebpackConfig.output.path + '/**', browserWebpackConfig.output.path + '/**' ], {force: true}))

