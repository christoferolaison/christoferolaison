const execa = require('execa')
const fs = require('fs')

const {
  NODE_ENV,
  ACTIVE_ENV,
  CI,
  NOW_TOKEN,
  CIRCLE_BRANCH,
} = process.env

const activeEnv = ACTIVE_ENV || NODE_ENV

if (!Boolean(activeEnv)) {
  throw new Error('Provide "NODE_ENV" or "ACTIVE_ENV"')
} else if (!Boolean(NOW_TOKEN)) {
  throw new Error('Provide "NOW_TOKEN"')
}

const hasNowConfig = ({ location }) =>
  fs.existsSync(`${location}/.now`)

function now(args, opts) {
  return execa.sync('now', args, opts).stdout
}

function lerna(args, opts) {
  return execa.sync('lerna', args, opts).stdout
}

function getWorkspaces() {
  const workspaces = lerna(['list', '--all', '--json'])
  return JSON.parse(workspaces)
}

async function deploy(applications, { stage, nowToken }) {
  const tasks = applications.map(
    async ({ location, name }) => {
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
              name,
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
  const workspaces = await getWorkspaces()
  const applications = workspaces.filter(hasNowConfig)
  const deployedApplications = await deploy(applications, {
    stage,
    nowToken,
  })
  console.log('deployed', deployedApplications)
}

run({
  stage: ACTIVE_ENV || NODE_ENV,
  nowToken: NOW_TOKEN,
})
