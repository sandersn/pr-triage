== Fixes ==

* https://github.com/microsoft/TypeScript/pull/37881 - Make `Symbol#valueDeclaration` optional in public API
* https://github.com/microsoft/TypeScript/pull/37910 - Cache complex union and intersection relations
* https://github.com/microsoft/TypeScript/pull/38088 - Fix missing narrow with assignment
* https://github.com/microsoft/TypeScript/pull/38099 - Don't narrow against unions of constructor functions with instanceof

== Features ==

* https://github.com/microsoft/TypeScript/pull/30639 - another type relation for conditional types
* https://github.com/microsoft/TypeScript/pull/35741 - a type relation for conditional types

  Notes:
  - I assume jablko's idea is similar to yours?
* https://github.com/microsoft/TypeScript/pull/37887 - fix(35779): Comments at the end of an array, when the last item ends with a comma, are not compiled
* https://github.com/microsoft/TypeScript/pull/38515 - Remove resolveUntypedCall from checkJsxSelfClosingElementDeferred

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/31277 - don't measure variance for conditional type extendsType

  Notes:
  - This is Jack William's PR, and is kind of blocked by 30639.
* https://github.com/microsoft/TypeScript/pull/33570 - disallow assignment of {} to unconstrained type parameters

  Notes:
  - This is hanging out here until TS 4.0, but needs an error message added before then.
* https://github.com/microsoft/TypeScript/pull/37608 - New definition for omit that should ensure the name Omit is preserved…
* https://github.com/microsoft/TypeScript/pull/37903 - Add index signature for anonymous object literal type
* https://github.com/microsoft/TypeScript/pull/37964 - Dont look for properties of Object and Function type when looking to resolve named import from module with `export=`
* https://github.com/microsoft/TypeScript/pull/38610 - Fix #38608

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
