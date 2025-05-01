import fs from "fs"
import { team } from "./core.ts"
import type { Pull } from "./types.d.ts"
// const repo = process.argv[2] || "TypeScript-go"
// const suffix = repo === "TypeScript-go" ? "-go" : ""
const data = JSON.parse(fs.readFileSync("prs.json", "utf-8")) as Pull[]
const judgements = JSON.parse(fs.readFileSync("pr-judgements-o4.json", "utf-8")) as Array<{
  shouldClose: "yes" | "no"
  pull: number
  reasons: string[]
}>
for (const judgement of judgements) {
  if (judgement.shouldClose === "yes") {
    console.log(`${judgement.pull}`)
  }
}
let total = 0
for (const pull of data) {
  const mine = pull.comments.filter(comment => comment.author === "sandersn" && new Date(comment.publishedAt) > new Date("2025-02-26"))
  if (mine.length > 0) {
    console.log(`\n\n--------------------------------------------------`)
    console.log(`${pull.number}: ${pull.title} (${pull.createdAt})`)
    console.log(mine.map(comment => comment.body).join("\n"))
    console.log(judgements.find(j => j.pull === pull.number)?.shouldClose)
    total++
  }
}
console.log(`Total: ${total}`)
