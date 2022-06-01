# pr-triage

## Workflow

1. Set the environment variable GH_API_TOKEN to a token with public_repo access.
2. Run index.js
   - Fix any assertions on github, then re-run.
3. Run histogram.js, move.js or stale.js


### OLD

3. Run index.js.
   - Fix any assertions on github, then re-run.
4. Compare pulls.json (old) to output.json (new).
5. Copy output.json over pulls.json.
8. Check in all changed files, delete output.json.


Doesn't include notes or flags

1. survey JS usage of @link @see to see how people might 'intuitively' expect it to work
2. talk with Andrew about how to (1) parse as expression (2) surface to the language service
3. write up our conclusions as a proposal and try to get upvoters to comment



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
