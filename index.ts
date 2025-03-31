import * as fs from "fs";
import { later } from "./core.ts";
import { assert } from "console";
import { graphql } from "@octokit/graphql";
import { GraphQlResponse } from "@octokit/graphql/dist-types/types.js";

/**
 * convert graphql output to denormalised output
 */
function updateFromGraphql(columns: IterableIterator<Column>) {
  const pulls: Pulls = {};
  const noAssignees: Card[] = [];
  for (const column of columns) {
    for (const cardp of column.cards) {
      updateCard(cardp, cardp.id, noAssignees, pulls, column.name);
    }
  }
  return [pulls, noAssignees] as [Pulls, Card[]];
}

function updateCard(card: Card, id: string, noAssignees: Card[], pulls: Pulls, state: Pull["status"]) {
  const lastComment = card.comments.nodes[0]?.publishedAt;
  const lastCommenter = card.comments.nodes[0]?.author.login;
  const lastReview = card.reviews.nodes[0]?.publishedAt;
  const lastReviewer = card.reviews.nodes[0]?.author.login;
  const lastCommit = card.commits.nodes[0].commit.committedDate;
  const reviewers = card.assignees.nodes.map((x) => x.login);
  assert(
    !reviewers.includes(undefined as any),
    "Reviewer not found for",
    card.number,
    card.assignees,
    reviewers
  );

  if (
    card.assignees.nodes.length !== 1 &&
    reviewers.filter((r) => r !== card.author.login).length < 1 &&
    state !== "not-started" &&
    state !== "done"
  ) {
    console.log(
      "Should only have 1 assignee",
      card.number,
      "but has",
      reviewers.length,
      ":",
      reviewers.join(", "),
      "::",
      JSON.stringify(card.assignees.nodes)
    );
    noAssignees.push(card);
  }
  assert(card.labels.nodes.length, "No labels for", card.number);
  const existing = pulls[card.number];
  if (existing) {
    // These might have changed, and it's a good idea for sanity checking to diff the output
    // Don't override the title, though; assume that it might be manually updated
    existing.body = card.body;
    existing.bugbodies = card.closingIssuesReferences.nodes.map((n) => n.body);
    existing.reviewers = reviewers;
    existing.suggested = card.suggestedReviewers.map((r) => r.reviewer.login);
    existing.files = card.files.nodes.map((f) => f.path);
    existing.status = state;
    existing.label = fromLabels(card.labels.nodes);
    if (!existing.author) existing.author = card.author.login;
    existing.id = id;
    existing.lastComment = later(lastComment, existing.lastComment);
    existing.lastCommit = later(lastCommit, existing.lastCommit);
    existing.lastCommenter = lastCommenter;
    existing.lastReview = lastReview;
    existing.lastReviewer = lastReviewer;
  } else {
    pulls[card.number] = {
      title: card.title,
      body: card.body,
      bugbodies: card.closingIssuesReferences.nodes.map((n) => n.body),
      author: card.author.login,
      reviewers,
      suggested: card.suggestedReviewers.map((r) => r.reviewer.login),
      files: card.files.nodes.map((f) => f.path),
      notes: [],
      status: state,
      label: fromLabels(card.labels.nodes),
      id,
      lastCommit,
      lastComment,
      lastCommenter,
      lastReview,
      lastReviewer,
    };
  }
}

async function main() {
  let result = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const queryResult: any = await graphql(
      `query ($after: String) {
        repository(name: "TypeScript", owner: "microsoft") {
          pullRequests(states: OPEN, first: 10, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
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
            }
          }
        }
      }`,
      {
        headers: {
          authorization: "token " + process.env.GH_API_TOKEN,
        },
        after,
      }
    );

    result.push(...queryResult.repository.pullRequests.nodes);
    hasNextPage = queryResult.repository.pullRequests.pageInfo.hasNextPage;
    after = queryResult.repository.pullRequests.pageInfo.endCursor;
  }
  console.log(JSON.stringify(result, undefined, 2));
}

async function oldProjectBoard() {
  // Use the REPL at https://developer.github.com/v4/explorer/ to update this query
  const columns: Map<Pull["status"], Column> = new Map();
  for (const name of Object.keys(columnNames)) {
    columns.set(fromColumn(name), {
      name: fromColumn(name),
      cards: [],
    });
  }
  let more = "";
  let board: Board;
  do {
    console.log(".");
    // maybe PR labels would be useful too
    board = await graphql(
      `
query
{
  repository(name: "TypeScript", owner: "microsoft") {
    projectV2(number: 1252) {
      items(first: 5${more}) {
        pageInfo {
          startCursor
          hasNextPage
          endCursor
        }
        nodes {
          id
          fieldValueByName(name:"Status") {
            ... on ProjectV2ItemFieldSingleSelectValue { id, name }
          }
          content {
            ... on PullRequest {
              number
              labels(first: 10) {
                nodes {
                  name
                }
              }
              title
              body
              suggestedReviewers {
                reviewer {
                  login
                }
              }
              closingIssuesReferences(first: 5) {
                nodes {
                  body
                }
              }
              files(first:50) {
                nodes {
                  path
                }
              }
              assignees(first: 5) {
                nodes {
                  login
                }
              }
              commits(last: 1) {
                nodes {
                  commit {
                    committedDate
                  }
                }
              }
              reviews(last: 1) {
                nodes {
                  publishedAt
                  author {
                    login
                  }
                }
              }
              comments(last: 1) {
                nodes {
                  publishedAt
                  author {
                    login
                  }
                }
              }
              author {
                login
              }
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
      }
    );
    board.repository.projectV2.items.nodes.forEach((card) => {
      const name = fromColumn(card.fieldValueByName.name);
      const column = columns.get(name);
      if (!column) {
        throw new Error(`Column not found: ${name}`);
      }
      assert(column.name, `Column name mismatch: ${name} !== ${column.name}`);
      column.cards.push({ id: card.id, ...card.content });
    });
    more = board.repository.projectV2.items.pageInfo.hasNextPage
      ? `, after:"${board.repository.projectV2.items.pageInfo.endCursor}"`
      : "";
  } while (more);
  const [pulls, noAssignees] = updateFromGraphql(columns.values());
  if (noAssignees.length) {
    for (const e of noAssignees) {
      if (
        e.assignees.nodes.length === 1 &&
        e.author.login === e.assignees.nodes[0].login
      )
        continue;
      console.log(
        "Should have at least 1 assignee:",
        "https://github.com/microsoft/TypeScript/pull/" + e.number,
        e.author.login,
        "|||",
        e.assignees.nodes.map((n) => n.login).join(", ")
      );
    }
    console.log("Errors found, not writing output.json");
    return;
  }
  fs.writeFileSync("output.json", JSON.stringify(pulls, undefined, 2));
}

const columnNames = {
  "Not started": "not-started",
  "Waiting on reviewers": "review",
  "Waiting on author": "waiting",
  "Needs merge": "merge",
  Done: "done",
} as const;
const labelNames = {
  "For Milestone Bug": "milestone",
  "For Backlog Bug": "backlog",
  "For Uncommitted Bug": "uncommitted",
  Housekeeping: "housekeeping",
  Experiment: "experiment",
  "Author: Team": "OTHER",
} as const;
function fromColumn(name: string): Pull["status"] {
  const c = columnNames[name as keyof typeof columnNames];
  assert(c, "State not found for column named:", name);
  return c;
}
function fromLabels(names: Array<{ name: string; }>): Pull["label"] {
  let l;
  for (const n of names.map((ns) => ns.name)) {
    l = labelNames[n as keyof typeof labelNames];
    if (l && l !== "OTHER") break;
  }
  if (l === undefined) {
    throw new Error(
      `Label not found for labels:'${names.map((ns) => ns.name).join(";")}' (${
        names.length
      })`
    );
  } else if (l === "uncommitted") {
    // label isn't currently used
    return "OTHER";
  }
  return l;
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
