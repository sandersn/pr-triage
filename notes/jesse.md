== Ready to Merge ==

* https://github.com/microsoft/TypeScript/pull/35937 - a refactor retains comments it was deleting by mistake.

  Notes:
  - Comments are quite tricky to get right.
  - Some good lines from the review:
  ```ts
  // Check if it is semi-colon
  // I feel like there has to be a way using SyntaxKind.SemicolonToken
  return lastChar === ";";
  ```
  - This is almost certainly wrong, because this is tricky to get right.
  - The main task is to politely say "Your PR is wrong, and this is really hard."

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
