const fs = require('fs')
const path = require('path')
const isDirectory = require('../lib/utils').isDirectory

const cwd = process.cwd()
const root = path.join(cwd, 'resources')

module.exports = function (node=false, targets) {
  const options = node ? {
    modules: false,
    useBuiltIns: "usage",
    corejs: 3,
    targets: { node: "10.13.0" },
  } : { targets: targets || '> 0.25%, not dead' }

  const presets = [ '@babel/react', ['@babel/env', options] ]

  return {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets,
        plugins: [
          ['@babel/plugin-proposal-class-properties', { 'loose': true }],
        ],
      }
    },
  }
}

