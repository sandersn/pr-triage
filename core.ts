export const team: Record<string, string> = {
  ahejlsberg: "Anders Hejlsberg",
  andrewbranch: "Andrew Branch",
  amcasey: "Andrew Casey",
  minestarks: "Mine Starks",
  orta: "Orta Therox",
  rbuckton: "Ron Buckton",
  RyanCavanaugh: "Ryan Cavanaugh",
  sheetalkamat: "Sheetal Nandi",
  weswigham: "Wesley Wigham",
  sandersn: "Nathan Shively-Sanders",
  DanielRosenwasser: "Daniel Rosenwasser",
  sokra: "Tobias Koppers",
  gabritto: "Gabriela Araujo Britto",
  jakebailey: "Jake Bailey",
  armanio123: "Armando Aguirre",
  "typescript-bot": "Typescript Bot",
  "dependabot": "Dependabot",
  "EricCornelson": "Eric Cornelson",
  navya9singh: "Navya Singh",
}
export function later(d1: string, d2: string): string {
  return new Date(d1) > new Date(d2) ? d1 : d2
}
export function sortv(m: Map<any, any>) {
  return Array.from(m.entries()).sort(([_k1, v1], [_k2, v2]) => (v1 > v2 ? -1 : 1))
}
export function sortvf<K, V>(m: Map<K, V>, gt: (v1: V, v2: V) => boolean) {
  return Array.from(m.entries()).sort(([_k1, v1], [_k2, v2]) => (gt(v1, v2) ? -1 : 1))
}

/**
 * Remove HTML comments from a string
 */
export function removeComments(s: string) {
  let start = s.indexOf("<!--")
  let end = s.indexOf("-->", start)
  while (start !== -1) {
    s = s.slice(0, start) + s.slice(end + 3)
    start = s.indexOf("<!--")
    end = s.indexOf("-->", start)
  }
  return s
}
