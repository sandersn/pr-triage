/** @type {Record<Reviewer, string>} */
export const team = {
  "ahejlsberg": "Anders Hejlsberg",
  "andrewbranch": "Andrew Branch",
  "amcasey": "Andrew Casey",
  "minestarks": "Mine Starks",
  "orta": "Orta Therox",
  "rbuckton": "Ron Buckton",
  "RyanCavanaugh": "Ryan Cavanaugh",
  "sheetalkamat": "Sheetal Nandi",
  "weswigham": "Wesley Wigham",
  "sandersn": "Nathan Shively-Sanders",
  "DanielRosenwasser": "Daniel Rosenwasser",
  "sokra": "Tobias Koppers",
  "gabritto": "Gabriela Araujo Britto",
  "jakebailey": "Jake Bailey",
  "armanio123": "Armando Aguirre",
  "typescript-bot": "Typescript Bot",
}
/**
 * @param {string | undefined} d1
 * @param {string | undefined} d2
 * @return {string | undefined}
 */
export function later(d1, d2) {
  return d1 === undefined ? d2
    : d2 === undefined ? d1
    : new Date(d1) > new Date(d2) ? d1
    : d2
}
