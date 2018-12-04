const path = require('path')
const cwd = process.cwd()

const config = require(path.join(cwd, 'config'))

module.exports = config

