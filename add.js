const { Octokit } = require('@octokit/rest')
const fs = require('fs')

// after running this, call `node move.js NNNNN assignee reviewer1`
//    manual for now, could be automated to move accepted cards, but I'm not sure how to assign them automatically

async function main() {
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync('./output.json', 'utf8'))
  const known = new Set(Object.keys(pulls))
  var gh = new Octokit({
    auth: "token " + process.env.GH_API_TOKEN,
    userAgent: "typescript",
  })
  const lastWeek = new Date(Date.now() - (1000 * 86400 * 7)).toISOString().slice(0, 10)
  const q = `repo:microsoft/typescript is:open is:pr -author:"typescript-bot" -is:draft created:<${lastWeek} -label:experiment`
  const l = await gh.search.issuesAndPullRequests({ q })
  const newPrs = l.data.items.filter(it => !known.has(''+it.number)).map(it => it.id)
  const newNumbers = l.data.items.filter(it => !known.has(''+it.number)).map(it => it.number)
  const notStarted = 7855130
  console.log(newNumbers)
  for (const pr of newPrs) {
    gh.projects.createCard({
      repo: 'microsoft/typescript',
      column_id: notStarted,
      content_id: pr,
      content_type: 'Issue'
    })
  }
}

main().catch(e => { console.log(e); process.exit(1) })
