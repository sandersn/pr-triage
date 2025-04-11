import type { Pull, RawPull } from "./types.d.ts"
import * as fs from "fs"

function convertRawPullsToPulls(rawPulls: RawPull[]): Pull[] {
  return rawPulls.map(rawPull => ({
    id: rawPull.id,
    number: rawPull.number,
    title: rawPull.title,
    author: rawPull.author.login,
    createdAt: new Date(rawPull.createdAt),
    updatedAt: new Date(rawPull.updatedAt),
    labels: rawPull.labels.nodes.map(label => label.name),
    body: rawPull.body,
    reviews: rawPull.reviews.nodes.map(review => ({
      publishedAt: new Date(review.publishedAt),
      state: review.state as "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED",
      author: review.author.login,
      body: review.body,
      comments: review.comments.nodes.map(comment => ({
        publishedAt: new Date(comment.publishedAt),
        body: comment.body,
      })),
    })),
    files: rawPull.files.nodes.map(file => ({
      path: file.path,
      additions: file.additions,
      deletions: file.deletions,
      changeType: file.changeType,
    })),
    // do not need null-author comments--they're from the CLA bot
    comments: rawPull.comments.nodes.filter(comment => comment.author != null && comment.author.login !== "typescript-bot").map(comment => ({
      publishedAt: new Date(comment.publishedAt),
      body: comment.body,
      author: comment.author.login,
    })),
    opinion: undefined,
  }))
}

const raw: RawPull[] = JSON.parse(fs.readFileSync("raw-prs.json", "utf-8"))
const pulls: Pull[] = convertRawPullsToPulls(raw)

async function main(pulls: Pull[]): Promise<void> {
  const toInspect = pulls.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
  console.log(toInspect.length)
  fs.writeFileSync("prs.json", JSON.stringify(pulls, null, 2))
}
main(pulls).then(() => {
  console.log("done")
}).catch(err => {
  console.error(err)
  process.exit(1)
})
