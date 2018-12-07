const fs = require('fs')
const path = require('path')
const isDirectory = require('./utils').isDirectory

const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory')
const NodeJsInputFileSystem = require('enhanced-resolve/lib/NodeJsInputFileSystem')
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem')

const cwd = process.cwd()
const root = path.join(cwd, 'resources')

const alias = { '@root': root }

fs.readdirSync(root)
  .filter(f => isDirectory(path.resolve(root, f)))
  .forEach(f => alias[`@${f}`] = path.resolve(root, f))

// @see https://github.com/postcss/postcss-import/issues/190
const CACHED_DURATION = 60000
const fileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), CACHED_DURATION)

const resolver = ResolverFactory.createResolver({
  alias,
  extensions: ['.css'],
  modules: ['src', 'node_modules'],
  useSyncFileSystemCalls: true,
  fileSystem,
})

module.exports = { alias, resolver }

