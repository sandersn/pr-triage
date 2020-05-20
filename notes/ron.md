== Fixes ==

* https://github.com/microsoft/TypeScript/pull/28708 - fix block-scoped capturing by class expressions inside iteration
* https://github.com/microsoft/TypeScript/pull/33337 - Corrected ES5 for-in destructuring binding emit
* https://github.com/microsoft/TypeScript/pull/35494 - capture thisArg of optional chaining when parenthesized
* https://github.com/microsoft/TypeScript/pull/35877 - fix receiver on calls of imported/exported functions
* https://github.com/microsoft/TypeScript/pull/36723 - AsyncIterable[Iterator] adds type parameters for TReturn, TNext
* https://github.com/microsoft/TypeScript/pull/36844 - add SourceFile and PrivateIdentifier constructors
* https://github.com/microsoft/TypeScript/pull/37013 - __extends should use Object.prototype.hasOwnProperty.call
* https://github.com/microsoft/TypeScript/pull/38135 - fix(37791): Using object destructuring with ECMAScript's private field as computed property name leads to runtime error
* https://github.com/microsoft/TypeScript/pull/38518 - Fix top-level await parsing (#38483)

== Features ==

* https://github.com/microsoft/TypeScript/pull/29374 - allow non-this, non-super before super in constructors
* https://github.com/microsoft/TypeScript/pull/33055 - better typings for Promise.all
* https://github.com/microsoft/TypeScript/pull/33074 - better typings for Promise.resolve
* https://github.com/microsoft/TypeScript/pull/33103 - better typings for Promise.then
* https://github.com/microsoft/TypeScript/pull/33363 - cache repeated prototype sets in a variable
* https://github.com/microsoft/TypeScript/pull/33673 - emit fewer duplicate trivia on initialisers added by a transformer
* https://github.com/microsoft/TypeScript/pull/33707 - better typings for Promise

  Notes:
  - The following 3 PRs are all included in this one, I think.
* https://github.com/microsoft/TypeScript/pull/34518 - cache global tagged template objects
* https://github.com/microsoft/TypeScript/pull/35284 - defer generic awaited types

  Notes:
  - This initially sounds like an attempt to do `awaited`, except wrong.
  - Probably the hard part will be closing this PR in a polite way.
* https://github.com/microsoft/TypeScript/pull/36408 - remove Reflect.decorate since it's non-standard
* https://github.com/microsoft/TypeScript/pull/37283 - Added runtime TypeError for non-function, non-null __extends
* https://github.com/microsoft/TypeScript/pull/37376 - feat: add util {is,create,update}DynamicImport
* https://github.com/microsoft/TypeScript/pull/37424 - Support top level "for await of"
* https://github.com/microsoft/TypeScript/pull/38602 - Introduces new flag for optimization hints

== Ready to Merge ==

* https://github.com/microsoft/TypeScript/pull/33248 - Add use-before-def error for uninitialized property
* https://github.com/microsoft/TypeScript/pull/33497 - Change default for TNext in Iterator/AsyncIterator

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/33863 - add shim for ES promise

  Notes:
  - Sounds like this one is required by a feature that's currently on hold.
* https://github.com/microsoft/TypeScript/pull/38566 - fix wrapping classes when targeting ESNext

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
