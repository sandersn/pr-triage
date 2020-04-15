== Fixes ==

* https://github.com/microsoft/TypeScript/pull/29468 - instantiate `this` in non-super access expressions
* https://github.com/microsoft/TypeScript/pull/30593 - narrow non-declared unions by discriminant
* https://github.com/microsoft/TypeScript/pull/31023 - Allow identical type parameter lists to merge in union signatures
* https://github.com/microsoft/TypeScript/pull/31345 - inference: break down target unions before source unions
* https://github.com/microsoft/TypeScript/pull/31455 - fix type parameter leak in conditional types
* https://github.com/microsoft/TypeScript/pull/31633 - allow inference to explore multiple instances of the same symbol

  Notes:
  - Re-adds recursion depth to inference -- but in a way that's more like assignability?
* https://github.com/microsoft/TypeScript/pull/35863 - non-null assertion applied to control-flow type `never` now errors
* https://github.com/microsoft/TypeScript/pull/37615 - Add 'T | PromiseLike<T>' inference from awaited types
* https://github.com/microsoft/TypeScript/pull/37815 - Remove redundant intersections from unions

== Features ==

* https://github.com/microsoft/TypeScript/pull/29228 - give more mapped type properties a syntheticOrigin link

  Notes:
  - The idea is that it works for properties of non-homomorphic mapped types, but this doesn't make sense.
* https://github.com/microsoft/TypeScript/pull/30161 - instanceof narrowing of generics: copy type parameter from original

  Notes:
  - The idea is that it works for properties of non-homomorphic mapped types, but this doesn't make sense.
* https://github.com/microsoft/TypeScript/pull/33139 - higher order inference: `this` parameters similar to functions and constructors
* https://github.com/microsoft/TypeScript/pull/37423 - Defer simplification of conditionals on deferred type references

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/31029 - fix relations for instantations of same generic signature

  Notes:
  - waiting to decide whether this should be under strictFunctionTypes or other strict flag.

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
