== Fixes ==

* https://github.com/microsoft/TypeScript/pull/34941 - fix String.prototype.replace.call overload selection

  Notes:
  - bug filed by ljharb so :eyeroll:
* https://github.com/microsoft/TypeScript/pull/35878 - No error on indirect calls
* https://github.com/microsoft/TypeScript/pull/37546 - fix broken regex on "src/services/completions.ts#getCompletionData"

== Features ==

* https://github.com/microsoft/TypeScript/pull/29539 - 
* https://github.com/microsoft/TypeScript/pull/33544 - add `this` type for Reflect.defineProperty
* https://github.com/microsoft/TypeScript/pull/33645 - better typings for Array.concat() etc

  Notes:
  - This is hanging out here until TS 4.0, but needs an error message added before then.
* https://github.com/microsoft/TypeScript/pull/33767 - Add an overload to Object.freeze that preserves literal types
* https://github.com/microsoft/TypeScript/pull/34868 - sort union emit
* https://github.com/microsoft/TypeScript/pull/35594 - fix(lib/es2015): Fix definition of `ProxyHandler`
* https://github.com/microsoft/TypeScript/pull/35608 - feat(lib/es2015): Add typed overloads to `Reflect`
* https://github.com/microsoft/TypeScript/pull/36015 - Prefer a likely literal over anonymous type in --noImplicitAny codefixes
* https://github.com/microsoft/TypeScript/pull/37392 - Enable excess property checking on spread assignment

== Ready to Merge ==

* https://github.com/microsoft/TypeScript/pull/37451 - Add support of contextual quick info

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
