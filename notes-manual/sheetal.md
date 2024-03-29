== Fixes ==

* https://github.com/microsoft/TypeScript/pull/28168 - don't count `require()` as making a TS file a module

  Notes:
  - This is a breaking change because `@types/node` will be included by mistake less often, which may be expected by now.

* https://github.com/microsoft/TypeScript/pull/34686 - add link to documentation in tsconfig generated by tsc --init

  Notes:
  - This links to a closed bug, and does way more than asked for.
  - The main task is probably talking to the contributor and convincing them to close or scale back the PR.

== Features ==

* https://github.com/microsoft/TypeScript/pull/34713 - simplify extension handling wrt .d.ts and .js

  Notes:
  - Ryan has also reviewed this.
  - Remember to request changes to transition this to Waiting on Author.
* https://github.com/microsoft/TypeScript/pull/29010 - add getSupportedCodeFixes to language service interface

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/37228 - fix crash during module resolution

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
