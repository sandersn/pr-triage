const fs = require('fs')
const { fromAssignee } = require('./core')
const { assert } = require('console')
const { graphql } = require('@octokit/graphql')

/**
 * convert graphql output to denormalised output
 * @param {Board} board
 * @param {Board} [back] - the bottom half of the board
                           only needed if Waiting on Reviewers has >100 PRs
 */
function updateFromGraphql(board, back) {
  /** @type {Pulls} */
  const pulls = {}
  const noAssignees = []
  for (const column of board.repository.project.columns.nodes) {
    for (const cardp of column.cards.nodes) {
      updateCard(cardp.content, cardp.url, noAssignees, pulls, column.name)
    }
  }
  if (back) {
    const col2 = back.repository.project.columns.nodes[0]
    for (const cardp of col2.cards.nodes) {
      updateCard(cardp.content, cardp.url, noAssignees, pulls, "Waiting on reviewers")
    }
  }
  return /** @type {[Pulls, Card[]]} */([pulls, noAssignees])
}

/**
 * @param {Card} card
 * @param {string} url
 * @param {Card[]} noAssignees
 * @param {Pulls} pulls
 * @param {string} name
 */
function updateCard(card, url, noAssignees, pulls, name) {
  const reviewers = card.assignees.nodes.map(x => fromAssignee(x, /*assertMissing*/ fromColumn(name) !== 'done'))
  assert(!reviewers.includes(undefined), "Reviewer not found for", card.number, card.assignees, reviewers)

  if (card.assignees.nodes.length !== 1 && reviewers.filter(r => r !== fromAssignee(card.author, /*assertMissing*/ false, /*debug*/ card.number)).length < 1 && fromColumn(name) !== 'not-started') {
    console.log("Should only have 1 assignee", card.number, 'but has', reviewers.length, ":", reviewers.join(", "), "::", JSON.stringify(card.assignees.nodes))
    noAssignees.push(card)
  }
  assert(card.labels.nodes.length, "No labels for", card.number)
  const existing = pulls[card.number]
  if (existing) {
    // These might have changed, and it's a good idea for sanity checking to diff the output
    // Don't override the description, though; assume that it might be manually updated
    existing.reviewers = reviewers
    existing.state = fromColumn(name)
    existing.label = fromLabels(card.labels.nodes)
    if (!existing.author)
      existing.author = card.author
    existing.id = fromUrl(url)
  }
  else {
    pulls[card.number] = {
      description: card.title,
      author: card.author,
      reviewers,
      notes: [],
      state: fromColumn(name),
      label: fromLabels(card.labels.nodes),
      id: fromUrl(url)
    }
  }
}

async function main() {
  // Use the REPL at https://developer.github.com/v4/explorer/ to update this query
  // TODO: issue a last: 100 and a first: 100 query, then de-dupe (and only for second column)
  /** @type {Board} */
  const board = await graphql(`
query
{
  repository(name: "TypeScript", owner: "microsoft") {
    project(number: 13) {
      columns(first: 4) {
        nodes {
          cards(first: 100) {
            nodes {
              content {
                ... on PullRequest {
                  number
                  labels(first: 10) {
                    nodes {
                      name
                    }
                  }
                  title
                  assignees(first: 5) {
                    nodes {
                      name
                    }
                  }
                  author {
                    ... on User {
                      name
                    }
                  }
                }
              }
              url
            }
          }
          name
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
  /** @type {Board} */
  const boardback = await graphql(`
query
{
  repository(name: "TypeScript", owner: "microsoft") {
    project(number: 13) {
      columns(first: 4) {
        nodes {
          cards(last: 100) {
            nodes {
              content {
                ... on PullRequest {
                  number
                  labels(first: 10) {
                    nodes {
                      name
                    }
                  }
                  title
                  assignees(first: 5) {
                    nodes {
                      name
                    }
                  }
                  author {
                    ... on User {
                      name
                    }
                  }
                }
              }
              url
            }
          }
          name
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
  const [pulls, noAssignees] = updateFromGraphql(board, boardback)
  if (noAssignees.length) {
    for (const e of noAssignees) {
      if (e.assignees.nodes.length === 1 && e.author.name === e.assignees.nodes[0].name)
        continue
      console.log('Should have at least 1 assignee:', "https://github.com/microsoft/TypeScript/pull/"+e.number, e.author.name, "|||", e.assignees.nodes.map(n => n.name).join(", "))
    }
    console.log('Errors found, not writing output.json')
    return
  }
  fs.writeFileSync('output.json', JSON.stringify(pulls, undefined, 2))
}


const columns = {
  "Not started": "not-started",
  "Waiting on reviewers": "review",
  "Waiting on author": "waiting",
  "Needs merge": "merge",
  "Done": "done"
}
const labels = {
  "For Milestone Bug": "milestone",
  "For Backlog Bug": "backlog",
  "For Uncommitted Bug": "uncommitted",
  "Housekeeping": "housekeeping",
  "Experiment": "experiment",
  "Author: Team": "OTHER"
}
/**
 * @param {string} name
 * @return {Pull["state"]}
 */
function fromColumn(name) {
  const c = columns[name]
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
    l = labels[n]
    if (l && l !== "OTHER") break
  }
  assert(l, `Label not found for labels:'${names.map(ns => ns.name).join(';')}' (${names.length})`)
  return l
}

/** @param {string} url */
function fromUrl(url) {
  return url.slice(url.indexOf('-') + 1)
}

main().catch(e => { console.log(e); process.exit(1) })
