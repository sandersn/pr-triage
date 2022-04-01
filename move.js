const { Octokit } = require('@octokit/rest')
const fs = require('fs')

/** @typedef {{ date: string, number: number, sha: string, parentSha: string }} Pr */

async function main() {
  const pull = process.argv[2]
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync('./output.json', 'utf8'))
  console.log(pulls[process.argv[2]].id)
  var gh = new Octokit({
    auth: "token " + process.env.GH_API_TOKEN,
    userAgent: "typescript",
  })
  const waitingOnReviewers = 7880785
  gh.projects.moveCard({
    card_id: +pulls[pull].id,
    position: "bottom",
    column_id: waitingOnReviewers })
}

main().catch(e => { console.log(e); process.exit(1) })
