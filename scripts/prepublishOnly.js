const execa = require('execa')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')

function lerna(args, opts) {
  return execa.sync('lerna', args, opts).stdout
}

function getWorkspaces() {
  const workspaces = lerna(['list', '--all', '--json'])
  return JSON.parse(workspaces)
}

function rewriteMain(pkg, to) {
  const packageJSON = readPkg.sync({
    cwd: pkg.location,
    normalize: false,
  })
  if (packageJSON.main) {
    const [, ...path] = packageJSON.main.split('/')
    delete packageJSON.module
    writePkg.sync(pkg.location, {
      ...packageJSON,
      main: [to, ...path].join('/'),
    })
  }
}

async function run() {
  const workspaces = await getWorkspaces()
  workspaces.forEach(pkg => rewriteMain(pkg, 'dist'))
}

run()
