// 1. run index.ts, cook-pr.ts to generate prs.json
// 2. run close-pr.ts to generate pr-judgements.json
// 3. run rate-close.ts to compare pr-judgements.json with close-gold.json
// To expand close-gold.json, look at pr-judgements.json (and Github for full details) and add entries to close-gold.json.
import fs from "fs"
const gold = JSON.parse(fs.readFileSync("close-gold.json", "utf-8")) as Array<{ pull: number; reason: string }>
const js = JSON.parse(fs.readFileSync("pr-judgements.json", "utf-8")) as Array<{ pull: number; reason: string }>
const judgements = new Map(js.map(j => [j.pull, j]))

let pass = 0
let total = 0
let histogram = new Map<string, number>()
for (const { pull, reason } of gold.slice(0, 46)) { //46, 66)) {
  if (total >= 46) break
  histogram.set(reason, (histogram.get(reason) ?? 0) + 1)
  if (reason === "UNKNOWN") continue
  // if (reason !== "keep" && reason !== "close" && reason !== "unreviewed" && reason !== "dropped") {
  //   continue
  // }
  const judgement = judgements.get(pull)
  if (judgement) {
    total++
    if (judgement.reason !== reason) {
      console.log(`${pull}: ${judgement.reason} ===> ${reason}`)
    } else {
      pass++
    }
  }
}

console.log(`Pass rate: ${Math.round((pass / total) * 100)}%`)
console.log(`Total: ${total}`)
console.log(`Histogram:`)
for (const [key, value] of histogram.entries()) {
  console.log(` - ${key}: ${value}`)
}
