== Fixes ==

* https://github.com/microsoft/TypeScript/pull/34932 - fix Number.is* to accept unknown again

== Features ==

* https://github.com/microsoft/TypeScript/pull/33441 - improve class/function merge error
* https://github.com/microsoft/TypeScript/pull/33876 - make get[Non]OptionalType part of the public API

  Notes:
  - Seems fine, we just need to decide whether it would be useful long-term.

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
