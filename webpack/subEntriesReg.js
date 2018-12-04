module.exports = function (map, app, type) {
  const entryReg = /^[a-zA-Z0-9]/

  if (typeof app === 'undefined') return entryReg

  if (map[app] && map[app][type]) return map[app][type]

  return new RegExp(app)
}

