const fs = require("fs");
const { assert } = require("console");

// state
/** @type {Pulls} */
const pulls = {};
/** @type {Pull} */
let pull = {};
/** @type {string[]} */
let notes = [];

function reset() {
  pull.notes = notes;
  pull = /** @type {Pull} */ ({});
  notes = [];
}
/** @param {string} line */
function parseTitle(line) {
  const start = line.indexOf("/pull/");
  const end = line.indexOf(" - ");
  assert(start > -1, "didn't find /pull/");
  assert(end > -1, "didn't find ' - '");
  pull.description = line.slice(end + 3);
  return line.slice(start + 6, end);
}
/** @param {string} line */
function parseNotes(line) {
  notes.push(line);
}
/** @type {Pull['reviewers']} */
const team = [
  "anders",
  "andrew-branch",
  "andrew-casey",
  "eli",
  "mine",
  "orta",
  "ron",
  "ryan",
  "sheetal",
  "wesley",
];
for (const reviewer of team) {
  for (let line of fs
    .readFileSync(`notes-manual/${reviewer}.md`, "utf8")
    .split("\n")) {
    line = line.trimRight();
    if (!line.trim()) continue;
    if (line.startsWith("== Instructions ==")) break;
    if (line.startsWith("==")) continue;
    if (line.startsWith("  Notes")) continue;
    if (line.startsWith("*")) {
      reset();
      const number = parseTitle(line);
      pull.reviewers = [reviewer];
      pulls[number] = pull;
    } else {
      parseNotes(line);
    }
  }
  pull.notes = notes;
}

console.log(pulls);
