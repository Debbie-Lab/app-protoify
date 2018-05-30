const moduleAlias = require('module-alias')

console.log(process.cwd())

moduleAlias.addAliases({
  '@root': process.cwd(),
})

module.exports = function initModuleAlias(alias) {
  moduleAlias.addAliases(alias || {})
}
