import * as fs from "fs"
import { graphql } from "@octokit/graphql"
import type { RawPull } from "./types.d.ts"

async function main() {
  const startTime = Date.now();
  let result: RawPull[] = []
  let hasNextPage = true
  let after = null

  while (hasNextPage) {
    const queryResult: any = await graphql(
      `
        query ($after: String) {
          repository(name: "TypeScript", owner: "microsoft") {
            pullRequests(states: OPEN, first: 10, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                id
                number
                title
                author {
                  login
                }
                createdAt
                updatedAt
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
                body
                reviews(first: 100) {
                  nodes {
                    publishedAt
                    state
                    author {
                      login
                    }
                    body
                    comments(first: 100) {
                      nodes {
                        body
                        publishedAt
                      }
                    }
                  }
                }
                files(first: 100) {
                  nodes {
                    path
                    additions
                    deletions
                    changeType
                  }
                }
                comments(first: 100) {
                  nodes {
                    publishedAt
                    body
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        headers: {
          authorization: "token " + process.env.GH_API_TOKEN,
        },
        after,
      }
    )

    process.stdout.write(".")
    result.push(...queryResult.repository.pullRequests.nodes)
    hasNextPage = queryResult.repository.pullRequests.pageInfo.hasNextPage
    after = queryResult.repository.pullRequests.pageInfo.endCursor
  }
  const endTime = Date.now();
  console.log(`done in ${(endTime - startTime) / 1000} seconds`);
  fs.writeFileSync("raw-prs.json", JSON.stringify(result, undefined, 2))
}

main().catch(e => {
  console.log(e)
  process.exit(1)
})
