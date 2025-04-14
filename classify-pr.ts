import type { Pull, RawPull } from "./types.d.ts"
import axios from "axios"
import * as fs from "fs"
import path from "path"

const pulls: Pull[] = JSON.parse(fs.readFileSync("prs.json", "utf-8"))
const preprompt = `You are reviewing pull requests from the TypeScript repository. These are old ones that should probably be closed. Your task is to decide whether it should be closed and explain why.

Here are team members:
- weswigham, rbuckton, navya9singh, iisaduan, sandersn, gabritto, jakebaily, andrewbranch, RyanCavanaugh

All PRs should be in the backlog unless they were created by a team member. If a PR is not in the backlog, it should almost certainly be closed.
If a team member doesn't like the PR, that makes it more likely to be closed.


`
const postprompt = `

If you decide to close the PR, choose from the following reasons and customize the message:

### No, no speculative features
- We can't review or merge speculative features. If the pipeline operator makes it to stage 3 of the standards process, please port this PR to microsoft/typescript-go.

- I'm closing this PR because it is stale and the original issue hasn't been accepted. If the original issue is accepted, we can revisit the PR to see if any of the code is still usable.

- Unfortunately, we haven't had time to review this PR and there's no issue showing an intent to add it to Typescript. I think it makes most sense to close this PR and re-open it if something changes.

- Unfortunately, we haven't had time to work on the design of one-sided predicates and this PR is quite old now. I think it makes most sense to close this PR and re-open it if something changes.

### No, no unrequested fixes
- This PR fixes a bug that's not in the backlog, and we haven't had time to review it, so I'm going to close it.

- Big changes to the core lib are unlikely to be successful, mainly for compatibility and but also for performance reasons. It looks to me that both apply to this change.

### No, no outdated test branches
- I believe this test branch is unused so I'm closing it. Please re-open it if I'm wrong.

### Already asked to close
- Closing due to lack of activity.

### Maybe, minor fix
- @weswigham This has been open for a couple of years. If this isn't the right solution, should we close it? Is it possible to fix the error that @Andarist mentions some other way? Either way, this fix is probably minor enough to wait until Corsa has overtaken Strada.

### Maybe, new feature
- I'm going to close this PR for a few reasons:

- It's a prototype intended to explore a design.
- We don't have time to add/review new features until we switch to Corsa, at which point this will have to be rewritten in Go.
- The PR is extremely out of date now.

- The originating issue isn't accepted. We need to decide whether a flag is even needed.

#### Maybe, minor team fix
- do you think this is likely to apply to Corsa as well? Do you remember if it was worthwhile at the time that you opened it? If neither are true, I'd like to close this PR.

- is this draft worth keeping? It is pretty old now.

- did the results indicate that this is worth pursuing? It is worth keeping open?
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
const initialMessage: Message[] = [
  {
    role: "system",
    content: preprompt + postprompt,
  },
]
let messages = initialMessage.slice()

async function main() {
  for (const pull of pulls.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())) {
    console.log(formatPull(pull))
    console.log("--------------------------------------------------")
    messages.push({
      role: "user",
      content: formatPull(pull),
    })
    const data = {
      messages,
      max_completion_tokens: 1000,
    }
    const response = await post(data, model, "chat/completions")
    if (response.kind === "error") {
      console.log(JSON.stringify(response.error))
      return
    } else {
      const content = response.result.choices[0].message.content
      console.log(content)
    }
    break
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

function formatPull(pull: Pull): string {
  // TODO: Depending on the context window, I might want a less-obvious order.
  return `# ${pull.title} (${pull.number})
${pull.labels.map(label => `- ${label}`).join("\n")}
${pull.author} (${pull.createdAt.toString()}, last updated ${pull.updatedAt.toString()})
${pull.body}

## Comments
${pull.comments.map(comment => `- ${comment.author}: ${comment.body}`).join("\n")}
${pull.reviews.map(review => `- ${review.author}: ${review.body}`).join("\n")}

## Files
${pull.files.map(file => `- ${file.path} (${file.additions} additions, ${file.deletions} deletions)`).join("\n")}
`
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
      error:
        "Sorry, I could not process your request.\n" +
        JSON.stringify(error.response.data.error),
    }
  }
}
