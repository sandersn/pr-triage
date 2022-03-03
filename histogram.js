const fs = require('fs')
const { team, fromAssignee } = require('./core')
// TODO: Maybe should move output.json somewhere else, per README
/** @type {Record<string, Pull>} */
const prs = JSON.parse(fs.readFileSync('output.json', 'utf8'))
const reviewers = new Map()
const authors = new Map()
const opens = new Map()
for (const pr of Object.values(prs)) {
  const tsMember = fromAssignee(pr.author, /*assert*/ false)
  if (tsMember && pr.reviewers.some(r => r === tsMember)) {
    opens.set(tsMember, (opens.get(tsMember) ?? 0) + 1)
  }
  if (pr.state === "review")
    for (const r of pr.reviewers)
      if (r !== tsMember)
        reviewers.set(r, (reviewers.get(r) ?? 0) + 1)
  if (!tsMember)
    authors.set(pr.author.name, (authors.get(pr.author.name) ?? 0) + 1)
}
function sortt(m) {
  return Array.from(m.entries()).sort(([k1,v1], [k2,v2]) => v1 > v2 ? -1 : 1)
}
console.log("Name | Need to review | Need to be reviewed")
console.log("-----|-------------|---")
for (const [name,count] of reviewers) {
  console.log(name, "|", count, "|", opens.get(name) ?? 0)
}
console.log("Name | Need to get review")
console.log("-----|----")
for (const [name, count] of sortt(authors).slice(0,10)) {
  console.log(name, "|", count, "|")
}
