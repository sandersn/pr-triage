== Fixes ==

* https://github.com/microsoft/TypeScript/pull/28708 - fix block-scoped capturing by class expressions inside iteration
* https://github.com/microsoft/TypeScript/pull/35494 - capture thisArg of optional chaining when parenthesized
* https://github.com/microsoft/TypeScript/pull/35877 - fix receiver on calls of imported/exported functions
* https://github.com/microsoft/TypeScript/pull/37013 - __extends should use Object.prototype.hasOwnProperty.call
* https://github.com/microsoft/TypeScript/pull/36723 - AsyncIterable[Iterator] adds type parameters for TReturn, TNext

  Notes:
  - Re-adds recursion depth to inference -- but in a way that's more like assignability?
* https://github.com/microsoft/TypeScript/pull/33337 - correct ES5 destructured binding emit in `for`

== Features ==

* https://github.com/microsoft/TypeScript/pull/36844 - add SourceFile and PrivateIdentifier constructors
* https://github.com/microsoft/TypeScript/pull/29374 - allow non-this, non-super before super in constructors
* https://github.com/microsoft/TypeScript/pull/33707 - better typings for Promise

  Notes:
  - The following 3 PRs are all included in this one, I think.
* https://github.com/microsoft/TypeScript/pull/33055 - better typings for Promise.all
* https://github.com/microsoft/TypeScript/pull/33103 - better typings for Promise.then
* https://github.com/microsoft/TypeScript/pull/33074 - better typings for Promise.resolve

* https://github.com/microsoft/TypeScript/pull/33363 - cache repeated prototype sets in a variable
* https://github.com/microsoft/TypeScript/pull/33673 - emit fewer duplicate trivia on initialisers added by a transformer
* https://github.com/microsoft/TypeScript/pull/34518 - cache global tagged template objects
* https://github.com/microsoft/TypeScript/pull/35284 - defer generic awaited types

  Notes:
  - This initially sounds like an attempt to do `awaited`, except wrong.
  - Probably the hard part will be closing this PR in a polite way.

* https://github.com/microsoft/TypeScript/pull/36408 - remove Reflect.decorate since it's non-standard

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/33863 - add shim for ES promise

  Notes:
  - Sounds like this one is required by a feature that's currently on hold.

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
