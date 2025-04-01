import * as fs from "fs"
import { later } from "./core.ts"
import { assert } from "console"
import { graphql } from "@octokit/graphql"
import type { RawPull, Pull, OldPull, Pulls, Card, Column } from "./types.d.ts"

/**
 * convert graphql output to denormalised output
 */
function updateFromGraphql(columns: IterableIterator<Column>) {
  const pulls: Pulls = {}
  const noAssignees: Card[] = []
  for (const column of columns) {
    for (const cardp of column.cards) {
      updateCard(cardp, cardp.id, noAssignees, pulls, column.name)
    }
  }
  return [pulls, noAssignees] as [Pulls, Card[]]
}

function updateCard(card: Card, id: string, noAssignees: Card[], pulls: Pulls, state: OldPull["status"]) {
  const lastComment = card.comments.nodes[0]?.publishedAt
  const lastCommenter = card.comments.nodes[0]?.author.login
  const lastReview = card.reviews.nodes[0]?.publishedAt
  const lastReviewer = card.reviews.nodes[0]?.author.login
  const lastCommit = card.commits.nodes[0].commit.committedDate
  const reviewers = card.assignees.nodes.map(x => x.login)
  assert(!reviewers.includes(undefined as any), "Reviewer not found for", card.number, card.assignees, reviewers)

  if (
    card.assignees.nodes.length !== 1
    && reviewers.filter(r => r !== card.author.login).length < 1
    && state !== "not-started"
    && state !== "done"
  ) {
    console.log(
      "Should only have 1 assignee",
      card.number,
      "but has",
      reviewers.length,
      ":",
      reviewers.join(", "),
      "::",
      JSON.stringify(card.assignees.nodes),
    )
    noAssignees.push(card)
  }
  assert(card.labels.nodes.length, "No labels for", card.number)
  const existing = pulls[card.number]
  if (existing) {
    // These might have changed, and it's a good idea for sanity checking to diff the output
    // Don't override the title, though; assume that it might be manually updated
    existing.body = card.body
    existing.bugbodies = card.closingIssuesReferences.nodes.map(n => n.body)
    existing.reviewers = reviewers
    existing.suggested = card.suggestedReviewers.map(r => r.reviewer.login)
    existing.files = card.files.nodes.map(f => f.path)
    existing.status = state
    existing.label = fromLabels(card.labels.nodes)
    if (!existing.author) existing.author = card.author.login
    existing.id = id
    existing.lastComment = later(lastComment, existing.lastComment)
    existing.lastCommit = later(lastCommit, existing.lastCommit)
    existing.lastCommenter = lastCommenter
    existing.lastReview = lastReview
    existing.lastReviewer = lastReviewer
  } else {
    pulls[card.number] = {
      title: card.title,
      body: card.body,
      bugbodies: card.closingIssuesReferences.nodes.map(n => n.body),
      author: card.author.login,
      reviewers,
      suggested: card.suggestedReviewers.map(r => r.reviewer.login),
      files: card.files.nodes.map(f => f.path),
      notes: [],
      status: state,
      label: fromLabels(card.labels.nodes),
      id,
      lastCommit,
      lastComment,
      lastCommenter,
      lastReview,
      lastReviewer,
    }
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
          repository(name: "TypeScript", owner: "microsoft") {
            pullRequests(states: OPEN, first: 10, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                id
                number
                title
                body
                reviews(first: 100) {
                  nodes {
                    publishedAt
                    state
                    author {
                      login
                    }
                  }
                }
                files(first: 100) {
                  nodes {
                    path
                  }
                }
                author {
                  login
                }
                createdAt
                updatedAt
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
                comments(first: 1, orderBy: { field: UPDATED_AT, direction: DESC }) {
                  nodes {
                    publishedAt
                    body
                    author {
                      login
                    }
                  }
                }
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
      },
    )

    result.push(...queryResult.repository.pullRequests.nodes)
    hasNextPage = queryResult.repository.pullRequests.pageInfo.hasNextPage
    after = queryResult.repository.pullRequests.pageInfo.endCursor
  }
  fs.writeFileSync("raw-prs.json", JSON.stringify(result, undefined, 2))
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
