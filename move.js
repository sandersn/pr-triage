const { Octokit } = require('@octokit/rest')
const fs = require('fs')
const { fromAssignee } = require('./core')

async function main() {
  if (process.argv.length < 3) {
    console.log('usage: node move.js pr# [assignee] [reviewers...]')
    return
  }
  const pull = process.argv[2]
  const targets = process.argv.slice(3)
  console.log(targets)
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync('./output.json', 'utf8'))
  var gh = new Octokit({
    auth: "token " + process.env.GH_API_TOKEN,
    userAgent: "typescript",
  })
  const waitingOnReviewers = 7880785
  gh.projects.moveCard({
    card_id: +pulls[pull].id,
    position: "bottom",
    column_id: waitingOnReviewers
  })
  if (targets.length) {
    gh.issues.addAssignees({
      owner: "microsoft",
      repo: "typescript",
      issue_number: +process.argv[2],
      assignees: [targets[0]],
    })
  }
  const reviewers = targets.filter(r => r !== fromAssignee(pulls[pull].author, /*assertMissing*/ false))
  if (reviewers.length) {
    gh.pulls.requestReviewers({
      owner: "microsoft",
      repo: "typescript",
      pull_number: +process.argv[2],
      reviewers,
    })
  }
}

main().catch(e => { console.log(e); process.exit(1) })
