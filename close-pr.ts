import type { Pull, RawPull } from "./types.d.ts"
import axios from "axios"
import * as fs from "fs"
import path from "path"
const reasons = ["keep", "too complex", "we didn't review it", "not needed", "too risky", "needs design", "quagmire"] as const
type Reason = typeof reasons[number]

const repo = process.argv[2] || "TypeScript-go"
const suffix = repo === "TypeScript-go" ? "-go" : ""

const pulls: Pull[] = JSON.parse(fs.readFileSync("prs" + suffix + ".json", "utf-8"))
// notes: we didn't review/keep are fairly ambiguous, more so as PRs get newer
// too complex should maybe apply to team PRs too, with a higher bar
const prompt = `You are reviewing pull requests from the TypeScript repository.
Classify each pull request using the following Typescript type:
{ reason: ${reasons.map(r => JSON.stringify(r)).join(" | ")}; explanation: string }

- "not needed": The PR fixes a backlog bug or uncommitted bug or unlabelled bug, and a team member has said that the bug is not needed or that the PR is not needed.
- "too complex": The PR fixes a milestone or backlog bug, but the fix is too complex to be worth it. The PR should be closed and the bug should be fixed in a different way if possible.
- "quagmire": This is a special case of "too complex" where the fix changes excess property detection, jsdoc parsing, or type parameter inference. All fixes in these areas are too complex for non-team members to make.
- "needs design": There is a lot of discussion about semantics or other design questions, not about the code itself. Especially common for backlog and uncommitted bugs.
- "too breaky": The PR fixes a milestone or backlog bug, but the fix breaks too much. The proposed design of the bug should be revisited.
- "we didn't review it": The PR fixes a milestone or backlog bug, but no members of the team reviewed it since 2023-05-01, or they stopped reviewing before 2023-05-01. This applies even if the PR was initially reviewed, but has changes at the end of the history that are not reviewed.
- "keep": A good PR that changes less than five files in src/, and changes less than 100 lines of code per file, even if no team member has reviewed it since 2023-05-01. PRs from team members are more likely to be kept.

Give reasons for closing based on the previous reasons, with added explanations for these extra reasons:
- If the PR is older than 2024, mention that it is likely to be stale.

Team members:
- weswigham, rbuckton, navya9singh, iisaduan, sandersn, gabritto, jakebailey, andrewbranch, RyanCavanaugh

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
  let i = 0
  const judgements: { reason: Reason; explanation: string; pull: number }[] = []
  console.log(`Classifying ${pulls.length} PRs...`)
  console.log("--------------------------------------------------")
  for (const pull of pulls.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())) {
    i++
    if (i > 120) {
      console.log("Done.")
      break
    }
    console.log("\n\n--------------------------------------------------")
    console.log(`${i}. #${pull.number}: ${pull.title} (${pull.createdAt})`)
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
          content: JSON.stringify(pull),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "PRCloseResponse",
          strict: true,
          schema: {
            type: "object",
            properties: {
              reason: {
                type: "string",
                enum: reasons,
                description: "Reason why the PR should be closed (or 'keep' if it should not be closed).",
              },
              explanation: {
                type: "string",
                description: "Customised explanation for the decision.",
              },
            },
            required: ["reason", "explanation"],
            additionalProperties: false,
          },
        },
      },
    }
    const response = await post(data, model, "chat/completions")
    if (response.kind === "error") {
      console.log(JSON.stringify(response.error))
      return
    } else {
      let content: { reason: Reason; explanation: string } = {
        reason: "ERROR" as Reason,
        explanation: "ERROR",
      }
      for (let retry = 0; retry < 5; retry++) {
        try {
          content = JSON.parse(response.result.choices[0].message.content) as {
            reason: Reason
            explanation: string
          }
          break
        } catch (e) {
          console.log(e)
          console.log("|" + response.result.choices[0].message.content + "|")
        }
      }
      judgements.push({ reason: content.reason, explanation: content.explanation, pull: pull.number })
      console.log(`Reason:`, content.reason)
      console.log(`Explanation:\n - `, content.explanation)
      console.log("--------------------------------------------------")
    }
    await new Promise(resolve => setTimeout(resolve, 1_000))
  }
  fs.writeFileSync("pr-judgements.json", JSON.stringify(judgements, null, 2))
}
main()
  .then(() => {
    process.exit(0)
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
