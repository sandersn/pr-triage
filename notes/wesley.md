== Fixes ==

* https://github.com/microsoft/TypeScript/pull/36143 - Fix handling of templates in preProcessFile

== Features ==

* https://github.com/microsoft/TypeScript/pull/35741 - a type relation for conditional types

  Notes:
  - I assume jablko's idea is similar to yours?

== Ready to Merge ==

* https://github.com/microsoft/TypeScript/pull/30639 - another type relation for conditional types
* https://github.com/microsoft/TypeScript/pull/33089 - only apply indexed access write simplifications to types that arise from mutations
* https://github.com/microsoft/TypeScript/pull/33434 - unify if/switch logic in typeof narrowing
* https://github.com/microsoft/TypeScript/pull/37788 - Updating dependencies

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/31277 - don't measure variance for conditional type extendsType

  Notes:
  - This is Jack William's PR, and is kind of blocked by 30639.
* https://github.com/microsoft/TypeScript/pull/33570 - disallow assignment of {} to unconstrained type parameters

  Notes:
  - This is hanging out here until TS 4.0, but needs an error message added before then.
* https://github.com/microsoft/TypeScript/pull/37608 - New definition for omit that should ensure the name Omit is preserved…

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
