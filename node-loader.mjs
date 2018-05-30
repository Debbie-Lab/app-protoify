import url from 'url'

export async function resolve(specifier, parentModuleURL, defaultResolver) {
  return defaultResolver(specifier, parentModuleURL)
}


