== Fixes ==

* https://github.com/microsoft/TypeScript/pull/36543 - a refactor retains a modifier it was deleting by mistake.

== Features ==

* https://github.com/microsoft/TypeScript/pull/28250 - convert function to arrow expr and back.

  Notes:
  - Written by a couple of students for their bachelor's thesis.
  - Justification for the issue is "Jetbrains has it".
  - Andy already reviewed it, so the code should be basically OK.
  - The main task is to decide whether "Jetbrains has it" is good enough reason for us to have it.

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
