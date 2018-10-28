const path = require('path')
const execa = require('execa')
const loadJsonFile = require('load-json-file')
const readPkg = require('read-pkg')
const fs = require('fs')

const {
  NODE_ENV,
  STAGE,
  CI,
  NOW_TOKEN,
  CIRCLE_BRANCH,
} = process.env

const activeEnv = STAGE || NODE_ENV

if (!Boolean(activeEnv)) {
  throw new Error('Provide "NODE_ENV" or "STAGE"')
} else if (!Boolean(NOW_TOKEN)) {
  throw new Error('Provide "NOW_TOKEN"')
}

const hasNowConfig = ({ location }) =>
  fs.existsSync(`${location}/.now`)

const getNowConfig = ({ location, stage }) => {
  console.log({ has: hasNowConfig({ location }), location })
  if (hasNowConfig({ location })) {
    return loadJsonFile.sync(
      `${location}/.now/now.${stage}.json`,
    )
  }
  return null
}

function now(args, opts) {
  return execa.sync('now', args, opts).stdout
}

function lerna(args, opts) {
  return execa.sync('lerna', args, opts).stdout
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
    console.log({ nowConfig })
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

async function deploy(applications, { stage, nowToken }) {
  const tasks = applications.map(
    async ({ location, name, nowConfig }) => {
      return new Promise(resolve => {
        now(
          [
            '--token',
            nowToken,
            '--local-config',
            `.now/now.${stage}.json`,
            '--public',
            'deploy',
          ],
          {
            stdio: 'inherit',
            cwd: location,
          },
        )
        now(
          [
            '--token',
            nowToken,
            '--local-config',
            `.now/now.${stage}.json`,
            'alias',
          ],
          {
            stdio: 'inherit',
            cwd: location,
          },
        )
        try {
          now(
            [
              '--token',
              nowToken,
              'remove',
              nowConfig.name,
              '--safe',
              '--yes',
            ],
            {
              stdio: 'inherit',
              cwd: location,
            },
          )
        } catch (e) {}

        resolve(name)
      })
    },
  )
  return await Promise.all(tasks)
}

async function run({ stage, nowToken }) {
  const workspaces = await getWorkspaces({ stage })
  const applications = workspaces.filter(
    ({ nowConfig }) => nowConfig !== null,
  )
  const deployedApplications = await deploy(applications, {
    stage,
    nowToken,
  })
  console.log('deployed', deployedApplications)
}

run({
  stage: STAGE || NODE_ENV,
  nowToken: NOW_TOKEN,
})
