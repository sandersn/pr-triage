import { graphql } from "@octokit/graphql";
import * as fs from "fs";
const stateIds = /** @type {const} */ ({
  "not-started": "023c70fc",
  review: "e1f27d13",
  waiting: "76bc18e5",
  merge: "c891b3a4",
  done: "48ccf529",
});
// To update these constants:
// modify the graphql query with 
//    projectV2(number: 1252) { /**/id
// and
//    ... on ProjectV2ItemFieldSingleSelectValue { id, name, /**/ field { ... on ProjectV2SingleSelectField { id } } }
// and
// (something similar for status *values*)
const projectId = "PVT_kwDOAF3p4s4Ai5bi"
const fieldId = "PVTSSF_lADOAF3p4s4Ai5bizgbWAs4"

async function main() {
  if (process.argv.length < 3) {
    console.log("usage: node move.js pr# column");
    // console.log("usage: node move.js pr# [assignee] [reviewers...]");
    return;
  }
  const number = process.argv[2];
  const status = /** @type {keyof typeof stateIds} */(process.argv[3]);
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync("./output.json", "utf8"));
  const pull = pulls[number];
  if (status === pull.status) {
    throw new Error(`Card is already at ${pull.status}`);
  } else if (!(status in stateIds)) {
    throw new Error(`Unknown status: ${status}`);
  }
  try {
    console.log("id", number);
    await graphql(
      `mutation {
          updateProjectV2ItemFieldValue(input: { 
            projectId: "${projectId}", 
            itemId: "${pull.id}",
            fieldId: "${fieldId}", 
            value: { singleSelectOptionId: "${stateIds[status]}" } }) {
            clientMutationId
          }
        }
      `, {
        headers: {
          authorization: "token " + process.env.GH_API_TOKEN,
        },
      }
    );
  } catch (/** @type {any} */ e) {
    if ("message" in e && typeof e.message === "string") {
      console.log(number, ":", e.message);
      // console.log(pr, ":", JSON.parse(e.message.slice("Validation Failed: ".length)).message)
    } else {
      throw e;
    }
  }
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
