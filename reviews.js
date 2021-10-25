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
    const author = degithub(pr.author.url)
    const reviewerset = new Set(pr.reviews.edges.map(e => degithub(e.node.author.url)).filter(r => r !== author))
    authors.set(author, (authors.get(author) ?? 0) + 1)
    for (const r of reviewerset) {
        reviewers.set(r, (reviewers.get(r) ?? 0) + 1)
    }
    // console.log(pr.number, author, reviewerset)
}
console.log("Authors:", authors)
console.log("Reviewers:", reviewers)
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