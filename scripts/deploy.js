const loadJsonFile = require('load-json-file')
const execa = require('execa')
const writeJsonFile = require('write-json-file')
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

async function deploy(
  applications,
  { stage, nowToken, branchName },
) {
  const tasks = applications.map(
    async ({ location, name }) => {
      // if (stage === 'test') {
      //   const cleanBranchName = branchName.replace('/', '-')
      //   await writeJsonFile(
      //     `${location}/.now/now.test.json`,
      //     {
      //       name: `${name}-${cleanBranchName}`,
      //       type: 'static',
      //       alias: [`${name}-${cleanBranchName}.now.sh`],
      //     },
      //   )
      // }
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

async function run({ stage, nowToken, branchName }) {
  const workspaces = await getWorkspaces()
  const applications = workspaces.filter(hasNowConfig)
  const deployedApplications = await deploy(applications, {
    stage,
    nowToken,
    branchName,
  })
  console.log('deployed', deployedApplications)
}

run({
  stage: ACTIVE_ENV || NODE_ENV,
  nowToken: NOW_TOKEN,
  branchName: CIRCLE_BRANCH,
})
