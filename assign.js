import { removeComments } from "./core.js";
import ollama from "ollama";
import * as fs from "fs";
const stateIds = /** @type {const} */ ({
  "not-started": "023c70fc",
  review: "e1f27d13",
  waiting: "76bc18e5",
  merge: "c891b3a4",
  done: "48ccf529",
});
const team = {
  "Andrew Branch": "Modules, Auto-imports, Language Service, web standards",
  "Sheetal Nandi": "Build system, File watching, Language Service",
  "Navya Singh": "Refactors, Move to File",
  "Isabel Duan": "Quick fixes, Refactors",
  "Jake Bailey": "Parsing, Command line tool, Packaging, Performance",
  "Ron Buckton":
    "Emitter, Code generation, New Ecmascript features, Standard features, web standards, Performance",
  "Gabriela Araujo Britto": "Type system, Checker, narrowing",
  "Nathan Shively-Sanders": "Parsing, binding, JSDoc, web standards",
  "Wesley Wigham":
    "Declaration emit, Type system, inference, module resolution, checker, binder",
};
// To update these constants:
// modify the graphql query with
//    projectV2(number: 1252) { /**/id
// and
//    ... on ProjectV2ItemFieldSingleSelectValue { id, name, /**/ field { ... on ProjectV2SingleSelectField { id } } }
// and
// (something similar for status *values*)
const projectId = "PVT_kwDOAF3p4s4Ai5bi";
const fieldId = "PVTSSF_lADOAF3p4s4Ai5bizgbWAs4";

async function main() {
  /** @type {Pulls} */
  const pulls = JSON.parse(fs.readFileSync("./output.json", "utf8"));
  for (const number in pulls) {
    const pull = pulls[number];
    if (pull.status !== "not-started") continue;
    // cleanup
    pull.body = removeComments(pull.body);
    pull.bugbodies = pull.bugbodies.map(removeComments);
    console.log('\n\n\n\n\n', pull.title)
    await classify(pull, team);
  }
}
/**
 * @param {Pull} pull
 * @param {Record<string, string>} expertise
 */
async function classify(pull, expertise) {
  const f = Object.entries(expertise)
    .map(([name, ex]) => `- ${name}: ${ex}`)
    .join("\n");
  const prompt = `Please assign PRs to a team member. 
  Format the assignment as a Javascript quoted array of strings, like this: 
  \`\`\`javascript
  ["Person Name"]
  \`\`\`
  Then explain the reason.
  The team members and their areas are:
  ${f}. 
  PR description:
${pull.body}
  PR title:
${pull.title}
  Which team member should work on this bug?`;
  // console.log(prompt)
  console.log(
    (
      await ollama.chat({
        model: "llama3",
        messages: [{ role: "user", content: prompt }],
      })
    ).message.content
  );
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});