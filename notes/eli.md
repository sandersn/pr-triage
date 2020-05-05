== Fixes ==

* https://github.com/microsoft/TypeScript/pull/27227 - improve error message for `==` of two different types

  Notes:
  - This is so old that it may be obsolete. First thing is to check what errors we currently give.
* https://github.com/microsoft/TypeScript/pull/37297 - Fix handling of string enums on LHS of `+=`

== Features ==

* https://github.com/microsoft/TypeScript/pull/37727 - Add logical assignment operator

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/33069 - improve error checking with multiple spread arguments

  Notes:
  - This is a fix for the bug I asked you to look at recently.
* https://github.com/microsoft/TypeScript/pull/37797 - Add static index signature

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
