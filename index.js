import * as fs from 'fs'
import { later } from './core.js'
import { assert } from 'console'
import { graphql } from '@octokit/graphql'

/**
 * convert graphql output to denormalised output
 * @param {IterableIterator<Column>} columns
 */
function updateFromGraphql(columns) {
  /** @type {Pulls} */
  const pulls = {}
  /** @type {Card[]} */
  const noAssignees = []
  for (const column of columns) {
    for (const cardp of column.cards.nodes) {
      updateCard(cardp, cardp.url, noAssignees, pulls, column.name)
    }
  }
  return /** @type {[Pulls, Card[]]} */([pulls, noAssignees])
}

/**
 * @param {Card} card
 * @param {string} url
 * @param {Card[]} noAssignees
 * @param {Pulls} pulls
 * @param {Pull["state"]} state
 */
function updateCard(card, url, noAssignees, pulls, state) {
  const lastComment = card.comments.nodes[0]?.publishedAt
  const lastCommenter = card.comments.nodes[0]?.author.login
  const lastReview = card.reviews.nodes[0]?.publishedAt
  const lastReviewer = card.reviews.nodes[0]?.author.login
  const lastCommit = card.commits.nodes[0].commit.committedDate
  const reviewers = card.assignees.nodes.map(x => x.login)
  assert(!reviewers.includes(/** @type {any} */(undefined)), "Reviewer not found for", card.number, card.assignees, reviewers)

  if (card.assignees.nodes.length !== 1 && reviewers.filter(r => r !== card.author.login).length < 1 && state !== 'not-started') {
    console.log("Should only have 1 assignee", card.number, 'but has', reviewers.length, ":", reviewers.join(", "), "::", JSON.stringify(card.assignees.nodes))
    noAssignees.push(card)
  }
  assert(card.labels.nodes.length, "No labels for", card.number)
  const existing = pulls[card.number]
  if (existing) {
    // These might have changed, and it's a good idea for sanity checking to diff the output
    // Don't override the description, though; assume that it might be manually updated
    existing.reviewers = reviewers
    existing.state = state
    existing.label = fromLabels(card.labels.nodes)
    if (!existing.author)
      existing.author = card.author.login
    existing.id = fromUrl(url)
    existing.lastComment = later(lastComment, existing.lastComment)
    existing.lastCommit = later(lastCommit, existing.lastCommit)
    existing.lastCommenter = lastCommenter
    existing.lastReview = lastReview
    existing.lastReviewer = lastReviewer
  }
  else {
    pulls[card.number] = {
      description: card.title,
      author: card.author.login,
      reviewers,
      notes: [],
      state,
      label: fromLabels(card.labels.nodes),
      id: fromUrl(url),
      lastCommit,
      lastComment,
      lastCommenter,
      lastReview,
      lastReviewer,
    }
  }
}

async function main() {
  // Use the REPL at https://developer.github.com/v4/explorer/ to update this query
  /** @type {Map<Pull["state"], Column>} */
  const columns = new Map()
  for (const name of Object.keys(columnNames)) {
    columns.set(fromColumn(name), {
      name: fromColumn(name),
      cards: { nodes: [] }
    })
  }
  let more = ""
  /** @type {Board} */
  let board
  do {
    board = await graphql(`
query
{
  repository(name: "TypeScript", owner: "microsoft") {
    projectV2(number: 1252) {
      items(first: 50${more}) {
        pageInfo {
          startCursor
          hasNextPage
          endCursor
        }
        nodes {
          fieldValueByName(name:"Status") {
            ... on ProjectV2ItemFieldSingleSelectValue { name }
          }
          content {
            ... on PullRequest {
              url
              number
              labels(first: 10) {
                nodes {
                  name
                }
              }
              title
              assignees(first: 5) {
                nodes {
                  login
                }
              }
              commits(last: 1) {
                nodes {
                  commit {
                    committedDate
                  }
                }
              }
              reviews(last: 1) {
                nodes {
                  publishedAt
                  author {
                    login
                  }
                }
              }
              comments(last: 1) {
                nodes {
                  publishedAt
                  author {
                    login
                  }
                }
              }
              author {
                login
              }
            }
          }
        }
      }
    }
  }
}
`, {
      headers: {
        authorization: "token " + process.env.GH_API_TOKEN
      }
    })
    board.repository.projectV2.items.nodes.forEach(card => {
      const name = fromColumn(card.fieldValueByName.name)
      const column = columns.get(name)
      if (!column) {
        throw new Error(`Column not found: ${name}`)
      } 
      assert(column.name, `Column name mismatch: ${name} !== ${column.name}`)
      column.cards.nodes.push(card.content)
    })
    more = board.repository.projectV2.items.pageInfo.hasNextPage 
      ? `, after:"${board.repository.projectV2.items.pageInfo.endCursor}"` 
      : ""
  } while (more)
  const [pulls, noAssignees] = updateFromGraphql(columns.values())
  if (noAssignees.length) {
    for (const e of noAssignees) {
      if (e.assignees.nodes.length === 1 && e.author.login === e.assignees.nodes[0].login)
        continue
      console.log('Should have at least 1 assignee:', "https://github.com/microsoft/TypeScript/pull/"+e.number, e.author.login, "|||", e.assignees.nodes.map(n => n.login).join(", "))
    }
    console.log('Errors found, not writing output.json')
    return
  }
  fs.writeFileSync('output.json', JSON.stringify(pulls, undefined, 2))
}


const columnNames = /** @type {const} */({
  "Not started": "not-started",
  "Waiting on reviewers": "review",
  "Waiting on author": "waiting",
  "Needs merge": "merge",
  "Done": "done"
})
const labelNames = /** @type {const} */({
  "For Milestone Bug": "milestone",
  "For Backlog Bug": "backlog",
  "For Uncommitted Bug": "uncommitted",
  "Housekeeping": "housekeeping",
  "Experiment": "experiment",
  "Author: Team": "OTHER"
})
/**
 * @param {string} name
 * @return {Pull["state"]}
 */
function fromColumn(name) {
  const c = columnNames[/** @type {keyof typeof columnNames} */(name)]
  assert(c, "State not found for column named:", name)
  return c
}
/**
 * @param {Array<{name: string}>} names
 * @return {Pull["label"]}
 */
function fromLabels(names) {
  let l
  for (const n of names.map(ns => ns.name)) {
    l = labelNames[/** @type {keyof typeof labelNames} */(n)]
    if (l && l !== "OTHER") break
  }
  if(l === undefined) {
    throw new Error(`Label not found for labels:'${names.map(ns => ns.name).join(';')}' (${names.length})`)
  }
  else if(l === 'uncommitted') {
    // label isn't currently used 
    return 'OTHER'
  }
  return l
}

/** @param {string} url */
function fromUrl(url) {
  return url.slice(url.indexOf('-') + 1)
}

main().catch(e => { console.log(e); process.exit(1) })
