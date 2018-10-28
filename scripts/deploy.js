const { getWorkspaces, now } = require('./utils')

const { NODE_ENV, STAGE, NOW_TOKEN } = process.env

const activeEnv = STAGE || NODE_ENV

if (!Boolean(activeEnv)) {
  throw new Error('Provide "NODE_ENV" or "STAGE"')
} else if (!Boolean(NOW_TOKEN)) {
  throw new Error('Provide "NOW_TOKEN"')
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
            '--regions',
            'bru',
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
            '--regions',
            'bru',
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
