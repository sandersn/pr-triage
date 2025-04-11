import type { Pull, RawPull } from "./types.d.ts"
import * as fs from "fs"
import * as path from "path"

const pulls: Pull[] = JSON.parse(fs.readFileSync("prs.json", "utf-8"))
// const toInspect = pulls.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
// console.log(toInspect.length)
for (const pull of pulls) {
  console.log(formatPull(pull))
  break
}

function formatPull(pull: Pull): string {
  // TODO: Depending on the context window, I might want a less-obvious order.
  return `# ${pull.title} (${pull.number})
${pull.author} (${pull.createdAt.toString()}, last updated ${pull.updatedAt.toString()})
${pull.labels.join(", ")}
${pull.body}
${pull.comments.map(comment => `- ${comment.author}: ${comment.body}`).join("\n")}
${pull.reviews.map(review => `- ${review.author}: ${review.body}`).join("\n")}
${pull.files.map(file => `- ${file.path} (${file.additions} additions, ${file.deletions} deletions)`).join("\n")}
`
}

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
