
const fs = require('fs')
const path = require('path')



// Generic utilities
const removeDuplicates = arr => [...new Set(arr)]
const filterOutParentAndEmpty = part => part && part !== '..'
const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key], key)
  return result
}, {})

// File utilities
const getPathFromProjectRoot = (...all) => {
  return path.join.apply(null, [__dirname, '..', '..'].concat(all))
}
const pathToPackageConfigFile = packageName => getPathFromProjectRoot('node_modules', packageName, 'govuk-prototype-kit.config.json')

const readJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}
const getPackageConfig = packageName => {
  if (fs.existsSync(pathToPackageConfigFile(packageName))) {
    return readJsonFile(pathToPackageConfigFile(packageName))
  } else {
    return {}
  }
}

// Handle errors to do with extension paths
// Example of `subject`: { packageName: 'govuk-frontend', item: '/all.js' }
const throwIfBadFilepath = subject => {
  if (('' + subject.item).indexOf('\\') > -1) {
    throw new Error(`Can't use backslashes in extension paths - "${subject.packageName}" used "${subject.item}".`)
  }
  if (!('' + subject.item).startsWith('/')) {
    throw new Error(`All extension paths must start with a forward slash - "${subject.packageName}" used "${subject.item}".`)
  }
}

// Check for `baseExtensions` in config.js. If it's not there, default to `govuk-frontend`
const getBaseExtensions = () => appConfig.baseExtensions || ['govuk-frontend']

// Get all npm dependencies
// Get baseExtensions in the order defined in `baseExtensions` in config.js
// Then place baseExtensions before npm dependencies (and remove duplicates)
const getPackageNamesInOrder = () => {
  const dependencies = readJsonFile(getPathFromProjectRoot('package.json')).dependencies || {}
  const allNpmDependenciesInAlphabeticalOrder = Object.keys(dependencies).sort()
  const installedBaseExtensions = getBaseExtensions()
    .filter(packageName => allNpmDependenciesInAlphabeticalOrder.includes(packageName))

  return removeDuplicates(installedBaseExtensions.concat(allNpmDependenciesInAlphabeticalOrder))
}

// Extensions provide items such as sass scripts, asset paths etc.
// This function groups them by type in a format which can used by getList
// Example of return
//    {
//     nunjucksPaths: [
//      { packageName: 'govuk-frontend', item: '/' },
//      { packageName: 'govuk-frontend', item: '/components'}
//    ],
//    scripts: [
//      { packageName: 'govuk-frontend', item: '/all.js' }
//    ]
//    assets: [
//      { packageName: 'govuk-frontend', item: '/assets' }
//    ],
//    sass: [
//      { packageName: 'govuk-frontend', item: '/all.scss' }
//    ]}
const getExtensionsByType = () => {
  return getPackageNamesInOrder()
    .reduce((accum, packageName) => Object.assign({}, accum, objectMap(
      getPackageConfig(packageName),
      (listOfItemsForType, type) => (accum[type] || [])
        .concat([].concat(listOfItemsForType).map(item => ({
          packageName,
          item
        })))
    )), {})
}

let extensionsByType

const setExtensionsByType = () => {
  extensionsByType = getExtensionsByType()
}

setExtensionsByType()

// The hard-coded reference to govuk-frontend allows us to soft launch without a breaking change.  After a hard launch
// govuk-frontend assets will be served on /extension-assets/govuk-frontend
const getPublicUrl = config => {
  if (config.item.endsWith('assets') && config.packageName === 'govuk-frontend') {
    return '/govuk/assets'
  } else {
    return ['', 'extension-assets', config.packageName]
      .concat(config.item.split('/').filter(filterOutParentAndEmpty))
      .map(encodeURIComponent)
      .join('/')
  }
}

const getFileSystemPath = config => {
  throwIfBadFilepath(config)
  return getPathFromProjectRoot('node_modules',
    config.packageName,
    config.item.split('/').filter(filterOutParentAndEmpty).join(path.sep))
}

const getPublicUrlAndFileSystemPath = config => ({
  fileSystemPath: getFileSystemPath(config),
  publicUrl: getPublicUrl(config)
})

const getList = type => extensionsByType[type] || []

// Exports
const self = module.exports = {
  getPublicUrls: type => getList(type).map(getPublicUrl),
  getFileSystemPaths: type => getList(type).map(getFileSystemPath),
  getPublicUrlAndFileSystemPaths: type => getList(type).map(getPublicUrlAndFileSystemPath),
  getAppConfig: _ => ({
    scripts: self.getPublicUrls('scripts'),
    stylesheets: self.getPublicUrls('stylesheets')
  }),
  getAppViews: additionalViews => self
    .getFileSystemPaths('nunjucksPaths')
    .reverse()
    .concat(additionalViews || []),

  setExtensionsByType // exposed only for testing purposes
}