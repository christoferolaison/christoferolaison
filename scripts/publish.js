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
  switch (stage) {
    case 'production':
      console.log('prod')
      break
    case 'feature':
      lerna(
        [
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
        ],
        {
          stdio: 'inherit',
        },
      )
      const SHA1 = git(['rev-parse', 'HEAD'])
      const preId = `next-${SHA1.substring(0, 6)}`
      lerna(
        [
          'version',
          'prerelease',
          '--exact',
          '--message',
          'chore: prerelease [skip ci]',
          '--yes',
          '--preid',
          preId,
        ],
        {
          stdio: 'inherit',
        },
      )
      lerna(
        [
          'publish',
          'from-git',
          '--npm-tag',
          'next',
          '--yes',
        ],
        {
          stdio: 'inherit',
        },
      )
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
