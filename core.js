const { assert } = require('console')
const team = {
  "Anders Hejlsberg": "ahejlsberg",
  "Andrew Branch": "andrewbranch",
  "Andrew Casey": "amcasey",
  "Mine Starks": "minestarks",
  "Orta Therox": "orta", // TODO: github thinks 47401 is assigned to orta even though it isn't
  "Ron Buckton": "rbuckton",
  "Ryan Cavanaugh": "RyanCavanaugh",
  "Sheetal Nandi": "sheetalkamat",
  "Wesley Wigham": "weswigham",
  "Nathan Shively-Sanders": "sandersn",
  "Daniel Rosenwasser": "DanielRosenwasser",
  "Tobias Koppers": "sokra", // TODO: Figure out why github thinks 42960 is assigned to tobias
  "Gabriela Araujo Britto": "gabritto",
  "Jake Bailey": "jakebailey",
  "Armando Aguirre": "armanio123",
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
