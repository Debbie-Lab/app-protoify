const fs = require('fs')
const path = require('path')
const isDirectory = require('../lib/utils').isDirectory

const cwd = process.cwd()
const root = path.join(cwd, 'resources')

const alias = { '@root': root }

fs.readdirSync(root)
  .filter(f => isDirectory(path.resolve(root, f)))
  .forEach(f => alias[`@${f}`] = path.resolve(root, f))

module.exports = function (node=false) {
  const options = node ? {
    modules: false,
    useBuiltIns: "usage",
    targets: { node: "10.13.0" },
  } : { targets: '> 0.25%, not dead' }

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
          ['module-resolver', {
            root,
            alias,
          }]
        ],
      }
    },
  }
}

