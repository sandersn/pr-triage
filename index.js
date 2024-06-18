import * as fs from "fs";
import { later } from "./core.js";
import { assert } from "console";
import { graphql } from "@octokit/graphql";

/**
 * convert graphql output to denormalised output
 * @param {IterableIterator<Column>} columns
 */
function updateFromGraphql(columns) {
  /** @type {Pulls} */
  const pulls = {};
  /** @type {Card[]} */
  const noAssignees = [];
  for (const column of columns) {
    for (const cardp of column.cards) {
      updateCard(cardp, cardp.id, noAssignees, pulls, column.name);
    }
  }
  return /** @type {[Pulls, Card[]]} */ ([pulls, noAssignees]);
}

/**
 * @param {Card} card
 * @param {string} id
 * @param {Card[]} noAssignees
 * @param {Pulls} pulls
 * @param {Pull["status"]} state
 */
function updateCard(card, id, noAssignees, pulls, state) {
  const lastComment = card.comments.nodes[0]?.publishedAt;
  const lastCommenter = card.comments.nodes[0]?.author.login;
  const lastReview = card.reviews.nodes[0]?.publishedAt;
  const lastReviewer = card.reviews.nodes[0]?.author.login;
  const lastCommit = card.commits.nodes[0].commit.committedDate;
  const reviewers = card.assignees.nodes.map((x) => x.login);
  assert(
    !reviewers.includes(/** @type {any} */ (undefined)),
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
  // Use the REPL at https://developer.github.com/v4/explorer/ to update this query
  /** @type {Map<Pull["status"], Column>} */
  const columns = new Map();
  for (const name of Object.keys(columnNames)) {
    columns.set(fromColumn(name), {
      name: fromColumn(name),
      cards: [],
    });
  }
  let more = "";
  /** @type {Board} */
  let board;
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

const columnNames = /** @type {const} */ ({
  "Not started": "not-started",
  "Waiting on reviewers": "review",
  "Waiting on author": "waiting",
  "Needs merge": "merge",
  Done: "done",
});
const labelNames = /** @type {const} */ ({
  "For Milestone Bug": "milestone",
  "For Backlog Bug": "backlog",
  "For Uncommitted Bug": "uncommitted",
  Housekeeping: "housekeeping",
  Experiment: "experiment",
  "Author: Team": "OTHER",
});
/**
 * @param {string} name
 * @return {Pull["status"]}
 */
function fromColumn(name) {
  const c = columnNames[/** @type {keyof typeof columnNames} */ (name)];
  assert(c, "State not found for column named:", name);
  return c;
}
/**
 * @param {Array<{name: string}>} names
 * @return {Pull["label"]}
 */
function fromLabels(names) {
  let l;
  for (const n of names.map((ns) => ns.name)) {
    l = labelNames[/** @type {keyof typeof labelNames} */ (n)];
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
