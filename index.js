const fs = require('fs')
const { assert } = require('console')
const { graphql } = require('@octokit/graphql')

/**
 * convert graphql output to denormalised output
 * @param {Board} board
 */
function updateFromGraphql(board) {
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync('pulls.json', 'utf8'))
  const wrongAssigneeCount = []
  const seen = new Set()

  for (const column of board.repository.project.columns.nodes) {
    for (const cardp of column.cards.nodes) {
      const card = cardp.content
      seen.add(card.number+"")
      const reviewers = card.assignees.nodes.map(fromAssignee)
      if (card.assignees.nodes.length !== 1 && reviewers.filter(r => r !== fromAssignee(card.author)).length !== 1) {
        // TODO: Exempt self-assignees before this check (or just check and continue with the self-assignee, then categorise it later)
        console.log("Should only have 1 assignee", card.number, 'but has', reviewers.length, ":", reviewers.join(", "), "::", JSON.stringify(card.assignees.nodes))
        wrongAssigneeCount.push(card)
      }

      const existing = pulls[card.number]
      if (existing) {
        // These might have changed, and it's a good idea for sanity checking to diff the output
        // Don't override the description, though; assume that it might be manually updated
        existing.reviewers = reviewers
        existing.state = fromColumn(column.name)
        existing.label = fromLabels(card.labels.nodes)
        if (!existing.author)
          existing.author = card.author
      }
      else {
        pulls[card.number] = {
          description: card.title,
          author: card.author,
          reviewers,
          notes: [],
          flags: "FIXME",
          state: fromColumn(column.name),
          label: fromLabels(card.labels.nodes)
        }
      }
    }
  }
  for (const number in pulls) {
    if (!seen.has(number)) {
      delete pulls[number]
    }
  }
  return /** @type {[Pulls, Card[]]} */([pulls, wrongAssigneeCount])
}

/**
 * @param {Pulls} pulls
 * @param {Reviewer} name
 */
function emitPulls(pulls, name) {
  let emit = ""
  const flags = {
    fix: [],
    feature: [],
    bonus: [],
    merge: [],
    yours: [],
    waiting: [],
    FIXME: [],
  }
  const flagNames = {
    fix: "Fixes",
    feature: "Features",
    bonus: "Uncommitted",
    merge: "Ready to Merge",
    waiting: "Waiting on Author",
    yours: "Your PRs",
    FIXME: "UNTRIAGED",
  }
  // 1. filter by name
  for (const key in pulls) {
    if (pulls[key].reviewers.indexOf(name) > -1) {
      const pull = emitPull(pulls[key], key);
      if (name === fromAssignee(pulls[key].author, /*assertMissing*/ false)) {
        flags.yours.push(pull)
      }
      else if (pulls[key].state === 'merge') {
        flags.merge.push(pull)
      }
      else if (pulls[key].state === 'waiting') {
        flags.waiting.push(pull)
      }
      else {
        assert(pulls[key].flags in flags, "bad flag:", pulls[key].flags, key)
        flags[pulls[key].flags].push(pull)
      }
    }
  }
  for (const flagName in flags) {
    if (flags[flagName].length)
      emit += `== ${flagNames[flagName]} ==\n\n` + flags[flagName].join('') + "\n"
  }
  return emit
}

/**
 * @param {Pull} pull
 * @param {string} number
 */
function emitPull(pull, number) {
  // TODO: Mark self-review specially (and/or put in a different list)
  let line = `* https://github.com/microsoft/TypeScript/pull/${number} - ${pull.description}\n`
  if (pull.notes.length) {
    line += "\n  Notes:\n" + pull.notes.join('\n') + "\n"
  }
  return line
}

async function main() {
  // Use the REPL at https://developer.github.com/v4/explorer/ to update this query
  /** @type {Board} */
  const board = await graphql(`
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
  const [pulls, noAssignees] = updateFromGraphql(board)
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
  for (const name of Object.values(team)) {
    fs.writeFileSync(`notes/${name}.md`, emitPulls(pulls, /** @type {Reviewer} */(name)))
  }
}


const team = {
  "Anders Hejlsberg": "anders",
  "Andrew Branch": "andrew-branch",
  "Andrew Casey": "andrew-casey",
  "Eli Barzilay": "eli",
  "Mine Starks": "mine",
  "Orta": "orta",
  "Orta Therox": "orta",
  "Ron Buckton": "ron",
  "Ryan Cavanaugh": "ryan",
  "Sheetal Nandi": "sheetal",
  "Wesley Wigham": "wesley",
  "Nathan Shively-Sanders": "nathan",
  "Daniel Rosenwasser": "daniel",
  "Jesse Trinity": "jesse"
}
const columns = {
  "Not started": "not-started",
  "Needs review": "review",
  "Waiting on author": "waiting",
  "Needs merge": "merge",
  "Done": "done"
}
const labels = {
  "For Milestone Bug": "milestone",
  "For Backlog Bug": "backlog",
  "For Uncommitted Bug": "bonus",
  "Housekeeping": "housekeeping",
  "Experiment": "experiment",
  "Author: Team": "OTHER"
}
/**
 * @param {{ name: string }} assignee
 * @return {Pull["reviewers"][number]}
 */
function fromAssignee(assignee, assertMissing = true) {
  const r = team[assignee.name]
  if (assertMissing)
    assert(r, "Reviewer not found for assignee named:", assignee.name)
  return r
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
    if (l) break
  }
  assert(l, "Label not found for labels:", names.map(ns => ns.name).join(';'))
  return l
}

main().catch(e => { console.log(e); process.exit(1) })
