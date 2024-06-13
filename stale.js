import * as fs from "fs";
import { team, sortvf, later } from "./core.js";
/** @type {Record<string, Pull>} */
const prs = JSON.parse(fs.readFileSync("output.json", "utf8"));
/** @type {Map<number, Pull>} */
const staleWaiting = new Map(); // two weeks of inactivity, maybe a month
const staleReview = new Map(); // one year of inactivity
const yearAgo = new Date(Date.now() - 365 * 86400 * 1000);
const fortnightAgo = new Date(Date.now() - 14 * 86400 * 1000);
for (const [number, pr] of Object.entries(prs)) {
  if (
    pr.status === "waiting" &&
    pr.lastCommit &&
    (pr.author in team
      ? new Date(pr.lastCommit) < yearAgo
      : new Date(pr.lastCommit) < fortnightAgo)
  ) {
    staleWaiting.set(+number, pr);
  } else if (
    pr.status === "review" &&
    pr.lastComment &&
    new Date(pr.lastComment) < yearAgo
  ) {
    staleReview.set(number, pr);
  }
}
// TODO: mark or segregate staleWaiting entries that are likely actually
// waiting on reviewer: things with a team member comment that is OLDER than the last commit
// (or maybe *any* comment)
console.log(`### Stale Waiting on Author (${staleWaiting.size}) ###`);
for (const [n, w] of sortvf(
  staleWaiting,
  (w1, w2) => new Date(w2.lastCommit) > new Date(w1.lastCommit)
))
  log(n, w);
console.log(`### Stale Waiting on Reviewer (${staleReview.size}) ###`);
for (const [n, w] of staleReview) log(n, w);

/**
 * @param {number} number
 * @param {Pull} pull
 */
function log(number, pull) {
  console.log(number, "by", pull.author, ":", pull.title);
  const lastActivity = later(pull.lastComment, pull.lastReview);
  console.log(
    `Last commit: ${ago(pull.lastCommit)}(${ago(
      lastActivity
    )}) | Last comment(${pull.lastCommenter}):`,
    ago(pull.lastComment),
    `| Last review(${pull.lastReviewer}):`,
    ago(pull.lastReview)
  );
  console.log();
}
/** @param {string} d */
function ago(d) {
  return Math.floor((Date.now() - +new Date(d)) / 86400 / 1000);
}
