// @ts-check
// Note the real graphql query needs after:"" on the first line
// cursor { start, stop }
// copy the previous stop to 'after' after running the first 100

/** @typedef {{
 *   closed: boolean
 *   number: number
 *   mergedAt: string
 *   closedAt: string
 *   author: {
 *     url: string
 *   }
 *   reviews: {
 *     edges: Array<{
 *       node: {
 *         id: string,
 *         author: {
 *           url: string
 *         }
 *       }
 *     }>
 *   }
 * }} Pr */
const fs = require('fs')
const data = JSON.parse(fs.readFileSync("reviews.json", 'utf8')).data
/** @type{Map<string,number>} */
const authors = new Map()
/** @type{Map<string,number>} */
const reviewers = new Map()
for (const pullrequest of data.repository.pullRequests.nodes) {
    /** @type {Pr} */
    const pr = pullrequest
    if (!pr.closed) continue
    if (!pr.author) continue
    const author = degithub(pr.author.url)
    const reviewerset = new Set(pr.reviews.edges.map(e => degithub(e.node.author.url)).filter(r => r !== author))
    authors.set(author, (authors.get(author) ?? 0) + 1)
    for (const r of reviewerset) {
        reviewers.set(r, (reviewers.get(r) ?? 0) + 1)
    }
    // console.log(pr.number, author, reviewerset)
}
console.log("Authors:", Array.from(authors.entries()).sort(([_,x], [__,y]) => y - x))
console.log("Reviewers:", Array.from(reviewers.entries()).sort(([_,x], [__,y]) => y - x))
/** @param {string} url */
function degithub(url) {
    const match = url.match(/^https:\/\/github.com\/(.+)$/)
    if (match) {
        return match[1]
    }
    else {
        throw new Error("Unexpected non-github url:" + url)
    }
}
/**

Reviewers:
  [ 'andrewbranch', 162 ],
  [ 'sandersn', 136 ],
  [ 'DanielRosenwasser', 120 ],
  [ 'weswigham', 75 ],
  [ 'RyanCavanaugh', 56 ],
  [ 'amcasey', 49 ],
  [ 'sheetalkamat', 40 ],
  [ 'rbuckton', 27 ],
  [ 'orta', 19 ],
  [ 'ahejlsberg', 14 ],

Authors:
  [ 'csigs', 122 ],
  [ 'a-tarasyuk', 82 ],
  [ 'andrewbranch', 58 ],
  [ 'weswigham', 53 ],
  [ 'sandersn', 50 ],
  [ 'ahejlsberg', 45 ],
  [ 'orta', 33 ],
  [ 'sheetalkamat', 29 ],
  [ 'DanielRosenwasser', 28 ],
  [ 'rbuckton', 24 ],
  [ 'elibarzilay', 22 ],
  [ 'typescript-bot', 21 ],
  [ 'amcasey', 20 ],
  [ 'Kingwl', 18 ],
  [ 'armanio123', 13 ],
  [ 'JoshuaKGoldberg', 9 ],
  [ 'Zzzen', 8 ],
**/
