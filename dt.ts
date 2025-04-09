import * as fs from "fs"
import { assert } from "console"
import { graphql } from "@octokit/graphql"

type RawPull = {
  number: number
  title: string
  author: {
    login: string
  }
  createdAt: string
  labels: {
    nodes: {
      name: string
    }[]
  }
  comments: {
    nodes: {
      body: string
      author: {
        login: string
      }
    }[]
  }
  files: {
    nodes: {
      path: string
      additions: number
      deletions: number
      changeType: string
    }[]
  }
}
type Pull = {
  number: number
  title: string
  author: string
  createdAt: string
  labels: string[]
  comments: Array<{ body: string; author: string }>
  files: Array<{ path: string; additions: number; deletions: number; changeType: string }>
}

function cookPull(raw: RawPull): Pull {
  return {
    number: raw.number,
    title: raw.title,
    author: raw.author.login,
    createdAt: raw.createdAt,
    labels: raw.labels.nodes.map(label => label.name),
    comments: raw.comments.nodes.map(comment => ({ body: comment.body, author: comment.author.login })).filter(comment => comment.author !== "typescript-bot"),
    files: raw.files.nodes.map(file => ({ path: file.path, additions: file.additions, deletions: file.deletions, changeType: file.changeType })),
  }
}

async function main() {
  let result: RawPull[] = []
  let hasNextPage = true
  let after = null

  while (hasNextPage) {
    const queryResult: any = await graphql(
      `
        query ($after: String) {
          repository(name: "DefinitelyTyped", owner: "DefinitelyTyped") {
            pullRequests(
              first: 10
              after: $after
              states: OPEN
              labels: [
                "Critical Package"
                "Unreviewed"
                "Edits Infrastructure"
                "Too Many Owners"
                "Edits multiple packages"
                "New Definition"
                "No Other Owners"
                "Untested Change"
              ]
            ) {
              nodes {
                number
                title
                author {
                  login
                }
                createdAt
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
                comments(first: 10) {
                  nodes {
                    body
                    author {
                      login
                    }
                    createdAt
                  }
                }
                files(first: 100) {
                  nodes {
                    path
                    additions
                    deletions
                    changeType
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
      {
        headers: {
          authorization: "token " + process.env.GH_API_TOKEN,
        },
        after,
      }
    )

    result.push(...queryResult.repository.pullRequests.nodes)
    hasNextPage = queryResult.repository.pullRequests.pageInfo.hasNextPage
    after = queryResult.repository.pullRequests.pageInfo.endCursor
  }
  fs.writeFileSync("raw-dt-prs.json", JSON.stringify(result, undefined, 2))
  fs.writeFileSync("dt-prs.json", JSON.stringify(result.map(cookPull), undefined, 2))
  // hasNextPage = true
  // while (hasNextPage) {
  //   const queryResult: any = await graphql(
  //     `
  //     query ($after: String) {
  //     repository(name: "DefinitelyTyped", owner: "DefinitelyTyped") {
  //   }
  //   }`)

  // }
}
const columnNames = {
  "Not started": "not-started",
  "Waiting on reviewers": "review",
  "Waiting on author": "waiting",
  "Needs merge": "merge",
  Done: "done",
} as const
const labelNames = {
  "For Milestone Bug": "milestone",
  "For Backlog Bug": "backlog",
  "For Uncommitted Bug": "uncommitted",
  Housekeeping: "housekeeping",
  Experiment: "experiment",
  "Author: Team": "OTHER",
} as const
function fromColumn(name: string): Pull["status"] {
  const c = columnNames[name as keyof typeof columnNames]
  assert(c, "State not found for column named:", name)
  return c
}
function fromLabels(names: Array<{ name: string }>): Pull["label"] {
  let l
  for (const n of names.map(ns => ns.name)) {
    l = labelNames[n as keyof typeof labelNames]
    if (l && l !== "OTHER") break
  }
  if (l === undefined) {
    throw new Error(`Label not found for labels:'${names.map(ns => ns.name).join(";")}' (${names.length})`)
  } else if (l === "uncommitted") {
    // label isn't currently used
    return "OTHER"
  }
  return l
}

main().catch(e => {
  console.log(e)
  process.exit(1)
})
