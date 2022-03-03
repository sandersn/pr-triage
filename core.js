const { assert } = require('console')
const team = {
  "Anders Hejlsberg": "anders",
  "Andrew Branch": "andrew-branch",
  "Andrew Casey": "andrew-casey",
  "Mine Starks": "mine",
  "Orta Therox": "orta", // TODO: github thinks 47401 is assigned to orta even though it isn't
  "Ron Buckton": "ron",
  "Ryan Cavanaugh": "ryan",
  "Sheetal Nandi": "sheetal",
  "Wesley Wigham": "wesley",
  "Nathan Shively-Sanders": "nathan",
  "Daniel Rosenwasser": "daniel",
  "Tobias Koppers": "sokra", // TODO: Figure out why github thinks 42960 is assigned to tobias
  "Gabriela Araujo Britto": "gabriela",
  "Jake Bailey": "jake",
  "Armando Aguirre": "armando",
}
/**
 * @param {{ name: string }} assignee
 * @return {Pull["reviewers"][number]}
 */
function fromAssignee(assignee, assertMissing = true, debug = undefined) {
  const r = team[assignee.name]
  if (assertMissing)
    assert(r, "Reviewer not found for assignee named:", assignee.name, debug)
  return r
}
module.exports = { team, fromAssignee }
