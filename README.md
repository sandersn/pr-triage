# pr-triage
Notes and tools for PR triage

- Ron: 15,3,3,0 -> 18,1,3,3
* Nathan: 18,4,3,0 -> 17,0,4,9
- Anders: 10,0,1,0 -> 10,0,1,2
- Wesley: 8,5,2,0 -> 10,4,0,12
- Orta: 4,2,0,0 -> 5,2,0,6
- Andrew (Branch): 4,1,0,0 -> 5,2,2,1
- Eli: 3,0,0,0 -> 5,1,2,1
- Sheetal: 4,0,0,0 -> 5,0,0,5
- Ryan: 1,4,0,0 -> 2,2,0,2
- Andrew (Casey): 1,0,0,0 -> 5,1,0,1

* Daniel:

- Mine's team: 3,0,0 -> 3,0,0

# Workflow

1. Run graphql query at https://developer.github.com/v4/explorer/

``` graphql
{
  repository(name: "TypeScript", owner: "microsoft") {
    project(number: 13) {
      columns(first: 4) {
        nodes {
          cards(first: 100) {
            nodes {
              content {
                ... on PullRequest {
                  number
                  labels(first: 10) {
                    nodes {
                      name
                    }
                  }
                  title
                  assignees(first: 5) {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          }
          name
        }
      }
    }
  }
}
```

2. Paste results into project-board.json.
3. Run index.js.
   - Fix any assertions on github, then re-run graphql query + paste into project-board.json.
4. Compare pulls.json (old) to output.json (new).
5. Copy output.json over pulls.json.
6. Edit FIXME entries to read either 'feature' or 'fix'.
7. Re-run index.js.
8. Check in all changed files, delete output.json.

Doesn't include notes or flags

1. survey JS usage of @link @see to see how people might 'intuitively' expect it to work
2. talk with Andrew about how to (1) parse as expression (2) surface to the language service
3. write up our conclusions as a proposal and try to get upvoters to comment



These two are for Anders but I think I could review them myself:

* https://github.com/microsoft/TypeScript/pull/33139 - higher order inference: `this` parameters similar to functions and constructors
* https://github.com/microsoft/TypeScript/pull/35863 - non-null assertion applied to control-flow type `never` now errors


# Goals #

1. Less than 100 (50?) open PRs.
1a. Less than 100 (50?) open, labelled PRs.
2. All community PRs older than a week triaged.
3. All team PRs older than two weeks triaged.
4. All triaged PRs assigned to a team members.
5. All team members get an update once a week or more on their individual progress.
6. All PRs that have been in the Waiting state for more than 14 days are closed.

Triaged means:

1. On project board in Needs Review state or later.
2. Labelled with "For Milestone Bug", "For Backlog Bug", "For Uncommitted bug", "Experiment" or "Housekeeping".

# Progress #

In 7 weeks:

- 110 PRs closed so far
- Tracked categories decreased from 167 to 102
- all goals except (1) and (6) are true
