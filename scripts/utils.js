const path = require('path')
const execa = require('execa')
const loadJsonFile = require('load-json-file')
const readPkg = require('read-pkg')
const fs = require('fs')

const hasNowConfig = ({ location }) =>
  fs.existsSync(`${location}/.now`)

function getNowConfig({ location, stage }) {
  if (hasNowConfig({ location })) {
    return loadJsonFile.sync(
      `${location}/.now/now.${stage}.json`,
    )
  }
  return null
}

const createScopeArgs = pkgs =>
  pkgs.reduce(
    (args, { name }) => [...args, '--scope', name],
    [],
  )

function now(args, opts) {
  return execa.sync('now', args, opts).stdout
}

function lerna(args, opts) {
  return execa.sync('lerna', args, opts).stdout
}

function git(args, opts) {
  return execa.sync('git', args, opts).stdout
}

function getWorkspaces({ stage }) {
  const workspaces = JSON.parse(
    lerna(['list', '--all', '--json']),
  )
  return workspaces.map(({ location }) => {
    const pkg = readPkg.sync({ cwd: location })

    const parentDir = path.basename(path.dirname(location))
    const isApp = parentDir === 'applications'
    const isPackage = parentDir === 'packages'
    const nowConfig = getNowConfig({ location, stage })
    return {
      location,
      name: pkg.name,
      isPrivate: Boolean(pkg.private),
      shouldSkipCompile: Boolean(pkg.skipCompile),
      isApp,
      isPackage,
      nowConfig,
    }
  })
}

module.exports = {
  now,
  lerna,
  git,
  createScopeArgs,
  getWorkspaces,
}
