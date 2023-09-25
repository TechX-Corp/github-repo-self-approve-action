import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { GitHub } from '@actions/github/lib/utils'
import { createAppAuth } from '@octokit/auth-app'
const eventPayload = require(process.env.GITHUB_EVENT_PATH)
const { owner, repo } = context.repo

const appId = getInput('appid', { required: true })
const privateKey = getInput('privatekey', { required: true })
const installationId = getInput('installationid', { required: true })

const installationOctokit = new GitHub({
  authStrategy: createAppAuth,
  auth: {
    appId,
    privateKey,
    installationId
  }
})

;(async () => {
  try {
    await installationOctokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number: eventPayload.issue.number,
      event: 'APPROVE'
    })
  } catch (error) {
    setFailed(error.message)
  }
})()
