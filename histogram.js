const fs = require('fs')
const { team } = require('./core')
/** @type {Record<string, Pull>} */
const prs = JSON.parse(fs.readFileSync('output.json', 'utf8'))
const reviewers = new Map()
const authors = new Map()
const opens = new Map()
for (const pr of Object.values(prs)) {
  if (pr.state === 'done') continue
  const tsMember =  pr.author in team ? pr.author : undefined
  if (tsMember && pr.reviewers.some(r => r === tsMember)) {
    opens.set(tsMember, (opens.get(tsMember) ?? 0) + 1)
  }
  if (pr.state === "review")
    for (const r of pr.reviewers)
      if (r !== tsMember)
        reviewers.set(r, (reviewers.get(r) ?? 0) + 1)
  if (!tsMember)
    authors.set(pr.author, (authors.get(pr.author) ?? 0) + 1)
}
function sortt(m) {
  return Array.from(m.entries()).sort(([k1,v1], [k2,v2]) => v1 > v2 ? -1 : 1)
}
console.log("Name | Need to review | Need to be reviewed")
console.log("-----|-------------|---")
for (const [alias,count] of reviewers) {
  // TODO: print real name of reviewer here
  console.log(team[alias], "|", count, "|", opens.get(alias) ?? 0)
}
console.log("Name | Need to get review")
console.log("-----|----")
for (const [name, count] of sortt(authors).slice(0,10)) {
  console.log(name, "|", count, "|")
}
