== Fixes ==

* https://github.com/microsoft/TypeScript/pull/36673 - Do not parse template arguments in JavaScript files.
* https://github.com/microsoft/TypeScript/pull/37891 - Fix indentation preservation in JSDoc (#37717)
* https://github.com/microsoft/TypeScript/pull/38541 - fix(32341): Renaming class name switches up order in object literal shorthand

== Features ==

* https://github.com/microsoft/TypeScript/pull/37421 - Support xml namespace prefix for JSX elements and attributes

== Waiting on Author ==

* https://github.com/microsoft/TypeScript/pull/37497 - Token hints for missing closing braces: classes, enums, jsx, modules, types
* https://github.com/microsoft/TypeScript/pull/37894 - Always error on property override accessor
* https://github.com/microsoft/TypeScript/pull/37917 - Improve error range for ts2657 (jsx expr must have parent element), add code fix for it

== Instructions ==

* Review PRs from team members the way you normally would.
* For community contributions, you may need to teach the contributor about the compiler codebase. This will probably be more work than writing the code yourself. Decide whether it's worthwhile on a case-by-case basis, but BE POLITE either way.
* For community contributions you will have to invoke typescript-bot yourself since it only responds to team members.
* For PRs with the label "For Backlog Bug", ask contributors to analyse typescript-bot runs and merge from master.
* For PRs with the label "For Milestone Bug", you should analyse typescript-bot runs and merge from master yourself if the contributor doesn't do it.
* For PRs with the label "For Uncommitted Bug", you should check whether the PR is a good idea. Usually you should have the author create an issue for discussion.
