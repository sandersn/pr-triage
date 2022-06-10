import * as fs from 'fs'
import { team, sortv } from './core.js'
/** @type {Record<string, Pull>} */
const prs = JSON.parse(fs.readFileSync('output.json', 'utf8'))
const reviewers = new Map()
const authors = new Map()
const opens = new Map()
for (const pr of Object.values(prs)) {
  if (pr.state === 'done') continue
  if (pr.author in team && pr.reviewers.some(r => r === pr.author)) {
    opens.set(pr.author, (opens.get(pr.author) ?? 0) + 1)
  }
  if (pr.state === "review")
    for (const r of pr.reviewers)
      if (r !== pr.author)
        reviewers.set(r, (reviewers.get(r) ?? 0) + 1)
  if (!(pr.author in team))
    authors.set(pr.author, (authors.get(pr.author) ?? 0) + 1)
}
console.log("Name | Need to review | Need to be reviewed")
console.log("-----|-------------|---")
for (const [alias,count] of reviewers) {
  console.log(team[alias], "|", count, "|", opens.get(alias) ?? 0)
}
console.log("Name | Need to get review")
console.log("-----|----")
for (const [name, count] of sortv(authors).slice(0,10)) {
  console.log(name, "|", count, "|")
}
