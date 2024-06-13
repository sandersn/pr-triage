/** @type {Record<string, string>} */
export const team = {
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
  navya9singh: "Navya Singh",
};
/**
 * @param {string} d1
 * @param {string} d2
 * @return {string}
 */
export function later(d1, d2) {
  return new Date(d1) > new Date(d2) ? d1 : d2;
}
/** @param {Map<any,any>} m */
export function sortv(m) {
  return Array.from(m.entries()).sort(([_k1, v1], [_k2, v2]) =>
    v1 > v2 ? -1 : 1
  );
}
/**
 * @template K, V
 * @param {Map<K, V>} m
 * @param {(v1: V, v2: V) => boolean} gt
 */
export function sortvf(m, gt) {
  return Array.from(m.entries()).sort(([_k1, v1], [_k2, v2]) =>
    gt(v1, v2) ? -1 : 1
  );
}
