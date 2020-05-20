== Fixes ==

* https://github.com/microsoft/TypeScript/pull/38045 - fix(23871): convertFunctionToEs6Class: Avoid insertNodeAfter
* https://github.com/microsoft/TypeScript/pull/38449 - Updates Uint8ArrayConstructor to match MDN documentation.

== Features ==

* https://github.com/microsoft/TypeScript/pull/33441 - improve class/function merge error
* https://github.com/microsoft/TypeScript/pull/33876 - make get[Non]OptionalType part of the public API

  Notes:
  - Seems fine, we just need to decide whether it would be useful long-term.

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/37907 - feat: add a codefix to fix class to className in react
* https://github.com/microsoft/TypeScript/pull/38105 - Issue35876: Give better error message when Classic Module Resolution with incorrect path
* https://github.com/microsoft/TypeScript/pull/38232 - Add definitions for WeakRef and FinalizationRegistry

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
