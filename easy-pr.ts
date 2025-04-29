import type { Pull, RawPull } from "./types.d.ts"
import axios from "axios"
import * as fs from "fs"
import path from "path"

const pulls: Pull[] = JSON.parse(fs.readFileSync("prs.json", "utf-8"))
const prompt = `You are reviewing pull requests from the TypeScript repository. Today you're looking for ones where sandersn has already asked in the comments whether they can be closed. If sandersn has asked already and it was in the last few comments and if there's no answer, say "yes". If there's an answer, but it's over 2 years old, say "yes". Otherwise say "no". Also give a couple of reasons.

Team members:
- weswigham, rbuckton, navya9singh, iisaduan, sandersn, gabritto, jakebaily, andrewbranch, RyanCavanaugh

Team opinions on whether to close should be more heavily weighted than other opinions.

`
const configPath = path.resolve(process.env.HOME || process.env.USERPROFILE || ".", ".cleonrc.json")
const localConfigPath = path.resolve(".", ".cleonrc.json")

let config
if (fs.existsSync(localConfigPath)) {
  config = JSON.parse(fs.readFileSync(localConfigPath, "utf-8"))
} else if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"))
} else {
  throw new Error("Configuration file not found")
}

const apiKey = config.apiKey
let model = config.deployment
const resource = config.resource
type Message = {
  role: "system" | "user" | "assistant"
  content: string
}

async function main() {
  console.log(`Classifying ${pulls.length} PRs...`)
  console.log("--------------------------------------------------")
  for (const pull of pulls.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())) {
    console.log("\n\n--------------------------------------------------")
    console.log(`# ${pull.number}: ${pull.title} (${pull.createdAt})`)
    console.log(
      `Commenters: ${pull.comments.map(comment => comment.author).join(", ")}; Reviews: ${pull.reviews
        .map(review => review.author)
        .join(", ")}\n`
    )
    const data = {
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: "Should this PR be closed?\n" + formatPull(pull),
        },
      ],
      max_completion_tokens: 1000,
    }
    const response = await post(data, model, "chat/completions")
    if (response.kind === "error") {
      console.log(JSON.stringify(response.error))
      return
    } else {
      const content = response.result.choices[0].message.content
      console.log(content)
      console.log("--------------------------------------------------")
    }
    await new Promise(resolve => setTimeout(resolve, 1_000))
  }
}
main()
  .then(() => {
    process.exit(1)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

// TODO: Try making a smaller summary: A list of commenters and dates, plus all the comments by sandersn and an *explicit* marker if there are none.
function formatPull(pull: Pull): string {
  // TODO: Depending on the context window, I might want a less-obvious order.
  return `# ${pull.title} (${pull.number}) by ${pull.author}
${pull.labels.map(label => `- ${label}`).join("\n")}
(${pull.createdAt.toString()}, last updated ${pull.updatedAt.toString()})
${pull.body}

## Comments
${allAuthors(pull).has("sandersn") ? "" : "sandersn has never commented on this PR."}
${pull.reviews.map(review => `- ${review.author} (${review.state}): ${review.body}`).join("\n")}
${pull.comments.map(comment => `- ${comment.author} (${comment.publishedAt.toString()}): ${comment.body}`).join("\n")}

`
}

function allAuthors(pull: Pull): Set<string> {
  const authors = new Set<string>()
  authors.add(pull.author)
  for (const comment of pull.comments) {
    authors.add(comment.author)
  }
  for (const review of pull.reviews) {
    authors.add(review.author)
  }
  return authors
}

async function post(
  data: unknown,
  model: string,
  api: string
): Promise<{ kind: "ok"; result: any } | { kind: "error"; error: string }> {
  try {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    }
    const url = `https://${resource}.openai.azure.com/openai/deployments/${model}/${api}?api-version=2025-03-01-preview`
    const response = await axios.post(url, data, headers)
    return { kind: "ok", result: response.data }
  } catch (error: any) {
    console.error("Error fetching response from OpenAI:", error)
    return {
      kind: "error",
      error: "Sorry, I could not process your request.\n" + JSON.stringify(error.response.data.error),
    }
  }
}
