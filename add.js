import * as fs from 'fs'
import { Octokit } from '@octokit/core'
import { graphql } from '@octokit/graphql'

// after running this, call `node move.js NNNNN assignee reviewer1`
//    manual for now, could be automated to move accepted cards, but I'm not sure how to assign them automatically

async function main() {
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync('./output.json', 'utf8'))
  const known = new Set(Object.keys(pulls))
  const octokit = new Octokit({
    auth: "token " + process.env.GH_API_TOKEN,
    userAgent: "typescript",
    request: {
      hook: graphql
    }
  })
  const lastWeek = new Date(Date.now() - (1000 * 86400 * 7)).toISOString().slice(0, 10)
  const q = `repo:microsoft/typescript is:open is:pr -author:"typescript-bot" -is:draft created:<${lastWeek} -label:experiment`
  const { search } = await octokit.graphql(`
    query ($q: String!) {
      search(query: $q, type: ISSUE, first: 100) {
        nodes {
          ... on PullRequest {
            id
            number
          }
        }
      }
    }
  `, { q })
  const newPrs = search.nodes.filter(it => !known.has('' + it.number)).map(it => it.id)
  const newNumbers = search.nodes.filter(it => !known.has('' + it.number)).map(it => it.number)
//   const notStartedQuery = await octokit.graphql(`
// query {
//   repository(name:"TypeScript", owner:"microsoft") {
//     project(number:13) {
//       columns(first:4) {
//         nodes {id, name }
//       }
//     }
//   }
// }`)
  const notStarted = 'MDEzOlByb2plY3RDb2x1bW43ODU1MTMw' // notStartedQuery.repository.project.columns.nodes[3].id
  console.log(newNumbers)
  for (const pr of newPrs) {
    try {
      console.log('id', pr)
      await octokit.graphql(`
        mutation ($columnId: ID!, $contentId: ID!) {
          addProjectCard(input: { projectColumnId: $columnId, contentId: $contentId }) {
            clientMutationId
          }
        }
      `, {
        // repo: 'microsoft/typescript',
        columnId: notStarted,
        contentId: pr,
        // contentType: 'PullRequest'
      })
    } catch (e) {
      if ('message' in e && typeof e.message === 'string') {
        console.log(pr, ':', e.message)
        // console.log(pr, ":", JSON.parse(e.message.slice("Validation Failed: ".length)).message)
      } else {
        throw e
      }
    }
  }
}

main().catch(e => { console.log(e); process.exit(1) })
