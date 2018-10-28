const {
  getWorkspaces,
  git,
  lerna,
  createScopeArgs,
} = require('./utils')

const compile = packages =>
  lerna(
    [
      'exec',
      '--stream',
      ...createScopeArgs(packages),
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

async function publish(packages, { stage }) {
  switch (stage) {
    case 'production':
      compile(packages)
      lerna(
        [
          'version',
          '--conventional-commits',
          '--exact',
          '--message',
          'chore: release [skip ci]  🚀',
          '--yes',
        ],
        {
          stdio: 'inherit',
        },
      )
      lerna(['publish', 'from-git', '--yes'], {
        stdio: 'inherit',
      })
      break
    case 'feature':
      compile(packages)
      const SHA1 = git(['rev-parse', 'HEAD'])
      const preId = `next-${SHA1.substring(0, 6)}`
      lerna(
        [
          'version',
          'prerelease',
          '--exact',
          '--message',
          'chore: prerelease  ✈️',
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
  const workspaces = await getWorkspaces({ stage })
  const packages = workspaces.filter(
    ({ isPackage, shouldSkipCompile }) =>
      isPackage && !shouldSkipCompile,
  )
  await publish(packages, {
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
