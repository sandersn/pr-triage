import type { Pull, RawPull } from "./types.d.ts"
import * as fs from "fs"
import * as path from "path"

function convertRawPullsToPulls(rawPulls: RawPull[]): Pull[] {
  return rawPulls.map(rawPull => ({
    id: rawPull.id,
    number: rawPull.number,
    title: rawPull.title,
    author: rawPull.author.login,
    createdAt: new Date(rawPull.createdAt),
    updatedAt: new Date(rawPull.updatedAt),
    labels: rawPull.labels.nodes.map(label => label.name),
    files: rawPull.files.nodes.map(file => file.path),
    body: rawPull.body,
    lastComment: rawPull.comments.nodes[0]
      ? {
          publishedAt: new Date(rawPull.comments.nodes[0].publishedAt),
          body: rawPull.comments.nodes[0].body,

          author: rawPull.comments.nodes[0].author.login,
        }
      : undefined,
    reviews: rawPull.reviews.nodes.map(review => ({
      publishedAt: new Date(review.publishedAt),
      state: review.state as "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED",
      author: review.author.login,
    })),
  }))
}

const raw: RawPull[] = JSON.parse(fs.readFileSync("raw-prs.json", "utf-8"))
const pulls: Pull[] = convertRawPullsToPulls(raw)
const YEARS_IN_MS = 365 * 24 * 60 * 60 * 1000

const toInspect = pulls.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
console.log(toInspect.length)
for (const pull of toInspect) {
  console.log(pull.number, "--", pull.author, ":", pull.title)
}
//
// const configPath = path.resolve(process.env.HOME || process.env.USERPROFILE || ".", ".cleonrc.json")
// const localConfigPath = path.resolve(".", ".cleonrc.json")

// let config
// if (fs.existsSync(localConfigPath)) {
//   config = JSON.parse(fs.readFileSync(localConfigPath, "utf-8"))
// } else if (fs.existsSync(configPath)) {
//   config = JSON.parse(fs.readFileSync(configPath, "utf-8"))
// } else {
//   throw new Error("Configuration file not found")
// }

// const apiKey = config.apiKey
// let model = config.deployment
// const resource = config.resource
// type Message = {
//   role: "system" | "user" | "assistant"
//   content: string
// }
// const initialMessage: Message[] = [
//   {
//     role: "system",
//     content: `Summarise a pull request to the Typescript team.

// Afterward, give your opinion on whether the pull request should be merged or not. If not, explain why.`,
//   },
// ]
// let messages = initialMessage.slice()
// messages.push({
//   role: "user",
//   content: `Here is the pull request:
// ` + JSON.stringify(toInspect[0], undefined, 2)
// })

// fs.writeFileSync("pulls.json", JSON.stringify(pulls, undefined, 2));
