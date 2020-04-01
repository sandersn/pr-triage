const fs = require('fs')
const { assert } = require('console')

/** convert graphql output to denormalised output */
function updateFromGraphql() {
  /** @type {Board} */
  const boards = JSON.parse(fs.readFileSync('project-board.json', 'utf8'))
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync('pulls.json', 'utf8'))
  const seen = new Set()

  for (const column of boards.data.repository.project.columns.nodes) {
    for (const cardp of column.cards.nodes) {
      const card = cardp.content
      seen.add(card.number+"")
      assert(card.assignees.nodes.length === 1, "Should only have 1 assignee", card.number)

      const existing = pulls[card.number]
      if (existing) {
        // These might have changed, and it's a good idea for sanity checking to diff the output
        // Don't override the description, though; assume that it might be manually updated
        existing.reviewer = fromAssignee(card.assignees.nodes[0].name)
        existing.state = fromColumn(column.name)
        existing.label = fromLabels(card.labels.nodes)
      }
      else {
        pulls[card.number] = {
          description: card.title,
          reviewer: fromAssignee(card.assignees.nodes[0].name),
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
  return pulls
}

/**
 * @param {Pulls} pulls
 * @param {string} name
 */
function emitPulls(pulls, name) {
  let emit = ""
  const flags = {
    fix: [],
    feature: [],
    bonus: [],
    merge: [],
    waiting: [],
    FIXME: [],
  }
  const flagNames = {
    fix: "Fixes",
    feature: "Features",
    bonus: "Uncommitted",
    merge: "Ready to Merge",
    waiting: "Waiting on Author",
    FIXME: "UNTRIAGED",
  }
  // 1. filter by name
  for (const key in pulls) {
    if (pulls[key].reviewer === name) {
      const pull = emitPull(pulls[key], key);
      if (pulls[key].state === 'merge') {
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
  return emit + `== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
`
}

/**
 * @param {Pull} pull
 * @param {string} number
 */
function emitPull(pull, number) {
  let line = `* https://github.com/microsoft/TypeScript/pull/${number} - ${pull.description}\n`
  if (pull.notes.length) {
    line += "\n  Notes:\n" + pull.notes.join('\n') + "\n"
  }
  return line
}

function main() {
  const pulls = updateFromGraphql()
  fs.writeFileSync('output.json', JSON.stringify(pulls, undefined, 2))
  for (const name of Object.values(team)) {
    fs.writeFileSync(`notes/${name}.md`, emitPulls(pulls, name))
  }
}


const team = {
  "Anders Hejlsberg": "anders",
  "Andrew Branch": "andrew-branch",
  "Andrew Casey": "andrew-casey",
  "Eli Barzilay": "eli",
  "Mine Starks": "mine",
  "Orta": "orta",
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
  "Experiment": "experiment"
}
/**
 * @param {string} assignee
 * @return {Pull["reviewer"]}
 */
function fromAssignee(assignee) {
  const r = team[assignee]
  assert(r, "Reviewer not found for assignee named:", assignee)
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

main()
