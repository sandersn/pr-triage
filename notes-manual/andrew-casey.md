== Fixes ==
* https://github.com/microsoft/TypeScript/pull/32543 - improve message for using value as type

  Notes:
  - This evolved over time so I think it's down to checking that the code matches what the previous reviewers agreed on.

== Features ==

* https://github.com/microsoft/TypeScript/pull/26434 - code fix for functions lacking return expressions
* https://github.com/microsoft/TypeScript/pull/35885 - code fix for Maps: convert incorrect use of [] to get/set

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
