const path = require('path')
const cwd = process.cwd()

module.exports = {
  script: path.resolve(cwd, 'index.js'),
  ext: 'js json njk',
  verbose: true,
  watch: [
    path.resolve(cwd, 'server'),
    path.resolve(cwd, 'resources'),
  ],
}

