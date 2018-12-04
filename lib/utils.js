const fs = require('fs')
const path = require('path')
const glob = require('glob')

const join = path.join

exports.getDataType = function (obj) {
  if(obj instanceof Array) return 'Array'
  if(obj instanceof Object ) return 'Object'

  return null
}

const dirExists = function (directory) {
  try {
    return fs.statSync(path.resolve(directory)).isDirectory()
  } catch (err) {
    return false
  }
}

exports.dirExists = dirExists
exports.isDirectory = dirExists

exports.accessible = function () {
  try {
    fs.accessSync.apply(fs, arguments)
    return true
  } catch(e) {
    return false
  }
}

exports.getDirObjs = function (dir, whitelist=[]) {
  if (!dirExists(dir)) {
    throw new Error(`Wrong path: ${dir}`)
  }

  const whiteset = new Set(whitelist)
  const objs = {}
  glob(join('**/*.js'), { cwd: dir, dot: false, sync: true })
    .filter(file => !whiteset.has(file))
    .forEach(file => objs[file .replace(/\.\w+$/, '')] = require(join(dir, file)).default)

  return objs
}

