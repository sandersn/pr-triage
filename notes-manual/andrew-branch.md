== Fixes ==

* https://github.com/microsoft/TypeScript/pull/33320 - unused type parameter in JSDoc gives the correct error

  Notes:
  - This change looks suspiciously simple. It should at least use getEffectiveTypeParameters, right?

* https://github.com/microsoft/TypeScript/pull/36152 - fixUnusedIdentifier updates JSDoc in TS

== Features ==

* https://github.com/microsoft/TypeScript/pull/35219 - convert function to ES6 class understands `x.prototype = {}`
* https://github.com/microsoft/TypeScript/pull/33652 - goto implementation suggests all subtypes

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/36688 - preserve newlines from original when printing nodes from TextChanges
  Notes:
  - This looks like it's just waiting on analysis of perf numbers, but I can't tell easily.

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
