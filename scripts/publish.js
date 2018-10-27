const execa = require('execa')

function lerna(args, opts) {
  return execa.sync('lerna', args, opts).stdout
}

function git(args, opts) {
  return execa.sync('git', args, opts).stdout
}

function getWorkspaces() {
  const workspaces = lerna(['list', '--all', '--json'])
  return JSON.parse(workspaces)
}

async function publish({ stage }) {
  if (stage === 'feature') {
    lerna([
      'exec',
      '--stream',
      '--scope',
      '@christoferolaison/primitives',
      '--',
      'babel',
      'src',
      '-d',
      'dist',
      '--config-file',
      '../../babel.config.js',
    ])
    const { stdout: SHA1 } = this.execSync('git', [
      'rev-parse',
      'HEAD',
    ])
    const preId = `"next-${SHA1.substring(0, 6)}"`
    lerna([
      'version',
      'prerelease',
      '--conventional-commits',
      '--message',
      '"chore: prerelease',
      '--yes',
      '--preid',
      preId,
    ])
  }
}

async function run({ stage }) {
  await publish({
    stage,
  })
}

const { NODE_ENV, STAGE } = process.env

const activeEnv = STAGE || NODE_ENV

if (!Boolean(activeEnv)) {
  throw new Error('Provide "NODE_ENV" or "STAGE"')
}

run({
  stage: STAGE || NODE_ENV,
})
