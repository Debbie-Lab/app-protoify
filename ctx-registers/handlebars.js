const fs = require('fs')
const glob = require('glob')
const hbs = require('handlebars')
const { join, resolve } = require('path')

console.log('hbs', hbs)

const root = process.cwd()
const cwd = join(root, 'server/templates/handlebars')

console.log('cwd', cwd)
class Handlebars {
  constructor () {
    console.log('constructor', glob.sync('**/*.hbs', { cwd, dot: false }))
    glob.sync('**/*.hbs', { cwd, dot: false })
      .forEach(file => {
        const tpl = fs.readFileSync(resolve(cwd, file), 'utf-8')
        console.log(file, tpl)
      })
  }
}


module.exports = Handlebars

